import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

import { EmployeeService } from '../../../../core/services/employee.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { ReportService } from '../../../../core/services/report.service';
import { SearchableSelectComponent, SelectOption } from '../../../../shared/components/searchable-select/searchable-select.component';
import { EMPLOYEE_TYPES } from '../../../../core/models/employee.model';
import { GENDERS } from '../../../../core/models/common.model';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    SearchableSelectComponent
  ],
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css']
})
export class EmployeeListComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['index', 'fullName', 'nationalId', 'employeeType', 'gender', 'hireDate', 'departments', 'status', 'actions'];
  dataSource = new MatTableDataSource<any>([]);
  allEmployees: any[] = [];
  isLoading = false;

  // Filters
  filters = {
    quickSearch: '',
    employeeTypeId: null as number | null,
    genderId: null as number | null,
    isActive: null as boolean | null,
    hireDateFrom: null as string | null,
    hireDateTo: null as string | null
  };

  // Options for searchable selects
  employeeTypeOptions: SelectOption[] = [];
  genderOptions: SelectOption[] = [];
  statusOptions: SelectOption[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  get trainerCount(): number {
    return this.allEmployees.filter(e => e.employeeType?.id === 1).length;
  }

  get managerCount(): number {
    return this.allEmployees.filter(e => e.employeeType?.id === 2).length;
  }

  get activeCount(): number {
    return this.allEmployees.filter(e => e.isActive === true).length;
  }

  constructor(
    private employeeService: EmployeeService,
    private notification: NotificationService,
    private reportService: ReportService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadSelectOptions();
    this.loadEmployees();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadSelectOptions(): void {
    this.employeeTypeOptions = [
      { value: null, label: 'الكل' },
      ...EMPLOYEE_TYPES.map(t => ({ value: t.id, label: t.title }))
    ];

    this.genderOptions = [
      { value: null, label: 'الكل' },
      ...GENDERS.map(g => ({ value: g.id, label: g.title }))
    ];

    this.statusOptions = [
      { value: null, label: 'الكل' },
      { value: true, label: 'نشط' },
      { value: false, label: 'غير نشط' }
    ];
  }

  loadEmployees(): void {
    this.isLoading = true;
    
    const params: any = {};
    if (this.filters.quickSearch) params.quickSearch = this.filters.quickSearch;
    if (this.filters.employeeTypeId) params.employeeType = this.filters.employeeTypeId;
    if (this.filters.genderId) params.genderId = this.filters.genderId;
    if (this.filters.isActive !== null) params.isActive = this.filters.isActive;
    if (this.filters.hireDateFrom) params.hireDateFrom = this.filters.hireDateFrom;
    if (this.filters.hireDateTo) params.hireDateTo = this.filters.hireDateTo;

    this.employeeService.getAllEmployees(params).subscribe({
      next: (res: any) => {
        this.allEmployees = res.items || [];
        this.dataSource.data = this.allEmployees;
        this.isLoading = false;
      },
      error: () => {
        this.notification.showError('حدث خطأ في تحميل الموظفين');
        this.isLoading = false;
      }
    });
  }

  resetFilters(): void {
    this.filters = {
      quickSearch: '',
      employeeTypeId: null,
      genderId: null,
      isActive: null,
      hireDateFrom: null,
      hireDateTo: null
    };
    this.loadEmployees();
    this.notification.showSuccess('تم مسح جميع الفلاتر');
  }

  viewEmployee(id: number): void {
    this.router.navigate(['/employees', id]);
  }

  deleteEmployee(employee: any): void {
    if (confirm(`هل أنت متأكد من حذف الموظف "${employee.fullName}"؟`)) {
      this.employeeService.deleteEmployee(employee.id).subscribe({
        next: () => {
          this.notification.showSuccess('تم حذف الموظف بنجاح');
          this.loadEmployees();
        },
        error: () => this.notification.showError('حدث خطأ في حذف الموظف')
      });
    }
  }

  exportToExcel(): void {
    if (this.dataSource.data.length === 0) {
      this.notification.showWarning('لا توجد بيانات لتصديرها');
      return;
    }

    const exportData = this.dataSource.data.map((employee: any, index: number) => ({
      '#': index + 1,
      'الاسم': employee.fullName,
      'رقم الهوية': employee.nationalId,
      'النوع': employee.employeeType?.title || '-',
      'الجنس': employee.gender?.title || '-',
      'تاريخ التوظيف': employee.hireDate || '-',
      'الأقسام': employee.departments?.map((d: any) => d.title).join(', ') || '-',
      'الحالة': employee.isActive ? 'نشط' : 'غير نشط'
    }));

    this.reportService.exportToExcel(exportData, 'employees-list', 'الموظفين');
    this.notification.showSuccess('تم تصدير التقرير بنجاح');
  }

  exportToPDF(): void {
    if (this.dataSource.data.length === 0) {
      this.notification.showWarning('لا توجد بيانات لتصديرها');
      return;
    }

    const doc = new jsPDF('l', 'mm', 'a4');
    
    doc.setFontSize(18);
    doc.text('قائمة الموظفين', doc.internal.pageSize.getWidth() / 2, 20, { align: 'center' });
    
    autoTable(doc, {
      head: [['#', 'الاسم', 'رقم الهوية', 'النوع', 'الجنس', 'تاريخ التوظيف', 'الأقسام', 'الحالة']],
      body: this.dataSource.data.map((employee: any, index: number) => [
        (index + 1).toString(),
        employee.fullName || '-',
        employee.nationalId || '-',
        employee.employeeType?.title || '-',
        employee.gender?.title || '-',
        employee.hireDate || '-',
        employee.departments?.map((d: any) => d.title).join(', ') || '-',
        employee.isActive ? 'نشط' : 'غير نشط'
      ]),
      startY: 35,
      styles: { halign: 'right', fontSize: 9, cellPadding: 2 },
      headStyles: { fillColor: [37, 99, 235], textColor: [255, 255, 255], halign: 'right' },
      alternateRowStyles: { fillColor: [243, 244, 246] }
    });

    doc.save('employees-list.pdf');
    this.notification.showSuccess('تم تصدير التقرير بنجاح');
  }
}