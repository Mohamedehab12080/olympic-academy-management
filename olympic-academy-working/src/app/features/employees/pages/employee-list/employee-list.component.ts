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
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { EmployeeService } from '../../../../core/services/employee.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { ReportService } from '../../../../core/services/report.service';
import { SearchableSelectComponent, SelectOption } from '../../../../shared/components/searchable-select/searchable-select.component';
import { EMPLOYEE_TYPES } from '../../../../core/models/employee.model';
import { GENDERS } from '../../../../core/models/common.model';
import { EmployeeDetailsModalComponent } from './../employee-details/employee-details-modal.component';
import { EmployeeWizardModalComponent } from './../employee-form/employee-wizard-modal.component';

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
    MatDialogModule,
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
    private router: Router,
    private dialog: MatDialog
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
  this.employeeService.getEmployeeById(id).subscribe({
    next: (employee) => {
      this.dialog.open(EmployeeDetailsModalComponent, {
        data: employee,
        width: '850px',
        maxWidth: '90vw'
      });
    },
    error: () => {
      this.notification.showError('حدث خطأ في تحميل بيانات الموظف');
    }
  });
}

editEmployee(id: number): void {
  const dialogRef = this.dialog.open(EmployeeWizardModalComponent, {
    data: { employeeId: id },
    width: '900px',
    maxWidth: '90vw'
  });
  
  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      this.loadEmployees();
    }
  });
}

openNewEmployeeModal(): void {
  const dialogRef = this.dialog.open(EmployeeWizardModalComponent, {
    data: {},
    width: '900px',
    maxWidth: '90vw'
  });
  
  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      this.loadEmployees();
    }
  });
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

    this.isLoading = true;

    // Build filter text
    const filterTexts: string[] = [];
    if (this.filters.employeeTypeId) {
      const type = EMPLOYEE_TYPES.find(t => t.id === this.filters.employeeTypeId);
      if (type) filterTexts.push(`نوع الموظف: ${type.title}`);
    }
    if (this.filters.genderId) {
      const gender = GENDERS.find(g => g.id === this.filters.genderId);
      if (gender) filterTexts.push(`الجنس: ${gender.title}`);
    }
    if (this.filters.isActive !== null) {
      filterTexts.push(`الحالة: ${this.filters.isActive ? 'نشط' : 'غير نشط'}`);
    }
    if (this.filters.hireDateFrom) filterTexts.push(`من تاريخ التوظيف: ${this.filters.hireDateFrom}`);
    if (this.filters.hireDateTo) filterTexts.push(`إلى تاريخ التوظيف: ${this.filters.hireDateTo}`);
    if (this.filters.quickSearch) filterTexts.push(`بحث: ${this.filters.quickSearch}`);

    // Build table rows
    let tableRows = '';
    this.dataSource.data.forEach((employee: any, index: number) => {
      const statusClass = employee.isActive ? 'active' : 'inactive';
      const statusStyle = employee.isActive 
        ? 'background-color: #d1fae5; color: #065f46;' 
        : 'background-color: #fee2e2; color: #991b1b;';
      
      const typeClass = employee.employeeType?.id === 1 ? 'trainer' : 'manager';
      const typeStyle = employee.employeeType?.id === 1
        ? 'background-color: #dbeafe; color: #1e40af;'
        : 'background-color: #fef3c7; color: #92400e;';
      
      const departmentsText = employee.departments?.map((d: any) => d.title).join(', ') || '-';
      
      tableRows += `
        <tr>
          <td style="text-align: center; padding: 8px; border: 1px solid #ddd;">${index + 1}</td>
          <td style="text-align: right; padding: 8px; border: 1px solid #ddd; font-weight: bold;">${employee.fullName || '-'}</td>
          <td style="text-align: center; padding: 8px; border: 1px solid #ddd;">${employee.nationalId || '-'}</td>
          <td style="text-align: center; padding: 8px; border: 1px solid #ddd; ${typeStyle}">${employee.employeeType?.title || '-'}</td>
          <td style="text-align: center; padding: 8px; border: 1px solid #ddd;">${employee.gender?.title || '-'}</td>
          <td style="text-align: center; padding: 8px; border: 1px solid #ddd;">${employee.hireDate || '-'}</td>
          <td style="text-align: right; padding: 8px; border: 1px solid #ddd;">${departmentsText}</td>
          <td style="text-align: center; padding: 8px; border: 1px solid #ddd; ${statusStyle}">${employee.isActive ? 'نشط' : 'غير نشط'}</td>
        </tr>
      `;
    });

    // Create print container
    const printContainer = document.createElement('div');
    printContainer.style.direction = 'rtl';
    printContainer.style.fontFamily = 'Cairo, "Segoe UI", Tahoma, sans-serif';
    printContainer.style.padding = '20px';
    printContainer.style.backgroundColor = 'white';
    
    printContainer.innerHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>قائمة الموظفين</title>
        <style>
          * { font-family: 'Cairo', 'Segoe UI', Tahoma, sans-serif; }
          @media print {
            body { margin: 0; padding: 20px; }
            .no-print { display: none; }
          }
          .header {
            text-align: center;
            margin-bottom: 20px;
            padding: 20px;
            background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
            color: white;
            border-radius: 8px;
          }
          .header h1 { margin: 0; font-size: 24px; }
          .header p { margin: 10px 0 0 0; font-size: 12px; }
          .filters {
            margin-bottom: 20px;
            padding: 10px;
            background-color: #f3f4f6;
            border-radius: 8px;
            font-size: 12px;
          }
          .stats {
            display: flex;
            gap: 16px;
            margin-bottom: 20px;
            padding: 16px;
            background: #f9fafb;
            border-radius: 8px;
          }
          .stat-item {
            flex: 1;
            text-align: center;
          }
          .stat-label { font-size: 12px; color: #6b7280; }
          .stat-value { font-size: 20px; font-weight: bold; color: #f59e0b; }
          table {
            width: 100%;
            border-collapse: collapse;
            direction: rtl;
          }
          th {
            background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
            color: white;
            padding: 10px;
            border: 1px solid #ddd;
            text-align: center;
            font-weight: bold;
          }
          td { padding: 8px; border: 1px solid #ddd; }
          .footer {
            text-align: center;
            margin-top: 20px;
            padding: 10px;
            font-size: 10px;
            color: #666;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>قائمة الموظفين</h1>
          <p>تاريخ التقرير: ${new Date().toLocaleDateString('ar-EG')}</p>
          <p>عدد السجلات: ${this.dataSource.data.length} موظف</p>
        </div>
        ${filterTexts.length > 0 ? `<div class="filters"><strong>الفلاتر المطبقة:</strong> ${filterTexts.join(' | ')}</div>` : ''}
        <div class="stats">
          <div class="stat-item">
            <div class="stat-value">${this.allEmployees.length}</div>
            <div class="stat-label">إجمالي الموظفين</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">${this.trainerCount}</div>
            <div class="stat-label">مدربين</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">${this.managerCount}</div>
            <div class="stat-label">مديرين</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">${this.activeCount}</div>
            <div class="stat-label">نشطاء</div>
          </div>
        </div>
        </table>
          <thead>
            <tr>
              <th>#</th>
              <th>الاسم</th>
              <th>رقم الهوية</th>
              <th>النوع</th>
              <th>الجنس</th>
              <th>تاريخ التوظيف</th>
              <th>الأقسام</th>
              <th>الحالة</th>
            </tr>
          </thead>
          <tbody>
            ${tableRows}
          </tbody>
        </table>
        <div class="footer">
          تم التصدير من نظام إدارة الأكاديمية الأولمبية
        </div>
        <div class="no-print" style="text-align: center; margin-top: 20px; padding: 10px;">
          <button onclick="window.print();" style="padding: 10px 20px; background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; border: none; border-radius: 5px; cursor: pointer;">
            🖨️ طباعة / حفظ كـ PDF
          </button>
        </div>
      </body>
      </html>
    `;

    // Open in new window for printing
    const printWindow = window.open('', '_blank', 'width=1200,height=800,scrollbars=yes');
    if (printWindow) {
      printWindow.document.write(printContainer.innerHTML);
      printWindow.document.close();
      this.isLoading = false;
      this.notification.showSuccess('تم فتح التقرير - يمكنك طباعته أو حفظه كـ PDF');
    } else {
      document.body.appendChild(printContainer);
      window.print();
      setTimeout(() => {
        document.body.removeChild(printContainer);
      }, 500);
      this.isLoading = false;
      this.notification.showSuccess('تم فتح التقرير - يمكنك حفظه كـ PDF من نافذة الطباعة');
    }
  }
}