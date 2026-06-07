import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

// Material Imports
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { FinancialService } from '../../../../../../core/services/financial.service';
import { EmployeeService } from '../../../../../../core/services/employee.service';
import { NotificationService } from '../../../../../../core/services/notification.service';
import { ReportService } from '../../../../../../core/services/report.service';
import { SALARY_TYPES } from '../../../../../../core/models/common.model';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-salary-deduction-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './salary-deduction-list.component.html',
  styleUrls: ['./salary-deduction-list.component.css']
})
export class SalaryDeductionListComponent implements OnInit {
  displayedColumns = ['id', 'employee', 'amountDeducted', 'deductionDate', 'reason', 'salaryType', 'actions'];
  dataSource = new MatTableDataSource<any>([]);
  isLoading = false;
  salaryTypes = SALARY_TYPES;
  employees: any[] = [];
  
  filters = {
    employeeId: null as number | null,
    salaryTypeId: null as number | null,
    deductionDateFrom: null as string | null,
    deductionDateTo: null as string | null
  };
  
  quickSearch: string = '';
  fromPicker: any;
  toPicker: any;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private financialService: FinancialService,
    private employeeService: EmployeeService,
    private notification: NotificationService,
    private reportService: ReportService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadEmployees();
    this.loadData();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadEmployees() {
    this.employeeService.getAllEmployeesLookup().subscribe({
      next: (res: any) => {
        this.employees = res.list;
      },
      error: () => { this.notification.showError('حدث خطأ في تحميل الموظفين'); }
    });
  }

  loadData() {
    this.isLoading = true;
    const params: any = {};
    if (this.filters.employeeId) params.employeeId = this.filters.employeeId;
    if (this.filters.salaryTypeId) params.salaryType = this.filters.salaryTypeId;
    if (this.filters.deductionDateFrom) params.deductionDateFrom = this.filters.deductionDateFrom;
    if (this.filters.deductionDateTo) params.deductionDateTo = this.filters.deductionDateTo;
    if (this.quickSearch) params.quickSearch = this.quickSearch;

    this.financialService.getAllSalaryDeductionsByFilter(params).subscribe({
      next: (res: any) => {
        this.dataSource.data = res.items;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.isLoading = false;
      },
      error: () => {
        this.notification.showError('حدث خطأ في تحميل البيانات');
        this.isLoading = false;
      }
    });
  }

  applyQuickSearch(event: Event) {
    this.quickSearch = (event.target as HTMLInputElement).value;
    this.loadData();
  }

  resetFilters() {
    this.filters = {
      employeeId: null,
      salaryTypeId: null,
      deductionDateFrom: null,
      deductionDateTo: null
    };
    this.quickSearch = '';
    this.loadData();
    this.notification.showSuccess('تم مسح جميع الفلاتر');
  }

  exportToExcel() {
    if (this.dataSource.data.length === 0) {
      this.notification.showWarning('لا توجد بيانات لتصديرها');
      return;
    }
    const exportData = this.dataSource.data.map((item, index) => ({
      '#': index + 1,
      'الموظف': item.employee?.title,
      'المبلغ': item.amountDeducted,
      'تاريخ الخصم': item.deductionDate,
      'السبب': item.reason || '-',
      'نوع الراتب': item.salaryType?.title || '-'
    }));
    this.reportService.exportToExcel(exportData, 'salary-deductions-list', 'خصومات الموظفين');
    this.notification.showSuccess('تم تصدير البيانات بنجاح');
  }

  exportToPDF() {
    if (this.dataSource.data.length === 0) {
      this.notification.showWarning('لا توجد بيانات لتصديرها');
      return;
    }
    const doc = new jsPDF('l', 'mm', 'a4');
    doc.setFontSize(18);
    doc.text('تقرير خصومات الموظفين', doc.internal.pageSize.getWidth() / 2, 15, { align: 'center' });
    doc.text(`تاريخ التقرير: ${new Date().toLocaleDateString('ar-EG')}`, 14, 25);
    doc.text(`عدد السجلات: ${this.dataSource.data.length}`, 14, 32);
    autoTable(doc, {
      head: [['#', 'الموظف', 'المبلغ', 'تاريخ الخصم', 'السبب', 'نوع الراتب']],
      body: this.dataSource.data.map((item, index) => [
        (index + 1).toString(),
        item.employee?.title || '-',
        `${item.amountDeducted} ريال`,
        item.deductionDate,
        item.reason || '-',
        item.salaryType?.title || '-'
      ]),
      startY: 42,
      styles: { halign: 'right', fontSize: 9 },
      headStyles: { fillColor: [37, 99, 235], textColor: [255, 255, 255] }
    });
    doc.save('salary-deductions-report.pdf');
    this.notification.showSuccess('تم تصدير التقرير بنجاح');
  }

  editDeduction(id: number) {
    this.router.navigate(['/financial/salary-deductions', id, 'edit']);
  }

  deleteDeduction(item: any) {
    if (confirm(`هل أنت متأكد من حذف خصم الموظف "${item.employee?.title}"؟`)) {
      this.financialService.deleteSalaryDeduction(item.id).subscribe({
        next: () => {
          this.notification.showSuccess('تم الحذف بنجاح');
          this.loadData();
        },
        error: () => this.notification.showError('حدث خطأ في الحذف')
      });
    }
  }
}