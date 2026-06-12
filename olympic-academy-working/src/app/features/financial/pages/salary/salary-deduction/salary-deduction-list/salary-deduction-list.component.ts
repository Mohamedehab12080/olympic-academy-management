import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
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
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { FinancialService } from '../../../../../../core/services/financial.service';
import { EmployeeService } from '../../../../../../core/services/employee.service';
import { NotificationService } from '../../../../../../core/services/notification.service';
import { ReportService } from '../../../../../../core/services/report.service';
import { SearchableSelectComponent, SelectOption } from '../../../../../../shared/components/searchable-select/searchable-select.component';
import { SALARY_TYPES } from '../../../../../../core/models/common.model';
import { SalaryDeductionWizardModalComponent } from '../salary-deduction-wizard/salary-deduction-wizard-modal.component';

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
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatChipsModule,
    MatDialogModule,
    SearchableSelectComponent
  ],
  templateUrl: './salary-deduction-list.component.html',
  styleUrls: ['./salary-deduction-list.component.css']
})
export class SalaryDeductionListComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['index', 'employee', 'basicSalary', 'remainedSalary', 'amountDeducted', 'deductionDate', 'reason', 'salaryType', 'actions'];
  dataSource = new MatTableDataSource<any>([]);
  isLoading = false;
  salaryTypes = SALARY_TYPES;
  employees: any[] = [];
  paymentMethods: any[] = [];
  
  filters = {
    employeeId: null as number | null,
    salaryTypeId: null as number | null,
    deductionDateFrom: null as string | null,
    deductionDateTo: null as string | null
  };
  
  quickSearch: string = '';
  
  // Options for searchable selects
  employeeOptions: SelectOption[] = [];
  salaryTypeOptions: SelectOption[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  // Statistics
  get totalDeductions(): number {
    return this.dataSource.data.reduce((sum, item) => sum + (item.amountDeducted || 0), 0);
  }

  get averageDeduction(): number {
    return this.dataSource.data.length > 0 ? this.totalDeductions / this.dataSource.data.length : 0;
  }

  get totalDeductionsCount(): number {
    return this.dataSource.data.length;
  }

  constructor(
    private financialService: FinancialService,
    private employeeService: EmployeeService,
    private notification: NotificationService,
    private reportService: ReportService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.loadSelectOptions();
    this.loadEmployees();
    this.loadData();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadSelectOptions(): void {
    this.salaryTypeOptions = [
      { value: null, label: 'الكل' },
      ...this.salaryTypes.map(s => ({ value: s.id, label: s.title }))
    ];
  }

  loadEmployees() {
    this.employeeService.getAllEmployeesLookup().subscribe({
      next: (res: any) => {
        this.employees = res.list || [];
        this.employeeOptions = [
          { value: null, label: 'الكل' },
          ...this.employees.map(e => ({ value: e.id, label: e.title }))
        ];
      },
      error: () => { 
        this.notification.showError('حدث خطأ في تحميل الموظفين'); 
      }
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
        this.dataSource.data = res.items || [];
        if (this.dataSource.paginator) {
          this.dataSource.paginator = this.paginator;
        }
        if (this.dataSource.sort) {
          this.dataSource.sort = this.sort;
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading data:', err);
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

  openNewDeductionModal() {
    const dialogRef = this.dialog.open(SalaryDeductionWizardModalComponent, {
      data: {},
      width: '800px',
      maxWidth: '90vw'
    });
    
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadData();
      }
    });
  }

  viewDeduction(id: number) {
    this.financialService.getSalaryDeductionById(id).subscribe({
      next: (deduction) => {
        this.openDetailsModal(deduction);
      },
      error: () => {
        this.notification.showError('حدث خطأ في تحميل بيانات الخصم');
      }
    });
  }

  openDetailsModal(deduction: any): void {
    const modalContainer = document.createElement('div');
    modalContainer.style.position = 'fixed';
    modalContainer.style.top = '0';
    modalContainer.style.left = '0';
    modalContainer.style.width = '100%';
    modalContainer.style.height = '100%';
    modalContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    modalContainer.style.display = 'flex';
    modalContainer.style.justifyContent = 'center';
    modalContainer.style.alignItems = 'center';
    modalContainer.style.zIndex = '10000';
    modalContainer.style.direction = 'rtl';
    
    const modalContent = document.createElement('div');
    modalContent.style.backgroundColor = 'white';
    modalContent.style.borderRadius = '16px';
    modalContent.style.maxWidth = '700px';
    modalContent.style.width = '90%';
    modalContent.style.maxHeight = '85vh';
    modalContent.style.overflow = 'auto';
    modalContent.style.position = 'relative';
    modalContent.style.padding = '0';
    
    const today = new Date().toLocaleDateString('ar-EG');
    const deductionNumber = `DED-${deduction.id}`;
    
    modalContent.innerHTML = `
      <div style="padding: 20px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; padding-bottom: 15px; border-bottom: 2px solid #e5e7eb;">
          <h2 style="margin: 0; color: #dc2626; font-size: 20px;">تفاصيل الخصم</h2>
          <button id="closeModalBtn" style="background: none; border: none; font-size: 24px; cursor: pointer; color: #6b7280;">&times;</button>
        </div>
        
        <div style="max-width: 100%;">
          <div style="text-align: center; margin-bottom: 20px; padding: 15px; background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); color: white; border-radius: 10px;">
            <h1 style="margin: 0; font-size: 18px;">إيصال خصم</h1>
            <p style="margin: 5px 0 0 0; font-size: 11px; opacity: 0.9;">نظام إدارة الأكاديمية الأولمبية</p>
          </div>
          
          <div style="display: flex; justify-content: space-between; margin-bottom: 15px; padding: 8px 12px; background: #f9fafb; border-radius: 8px; font-size: 12px;">
            <div><strong>رقم الإيصال:</strong> ${deductionNumber}</div>
            <div><strong>تاريخ الإصدار:</strong> ${today}</div>
          </div>
          
          <h3 style="color: #dc2626; border-bottom: 2px solid #dc2626; padding-bottom: 5px; margin-top: 15px; margin-bottom: 10px; font-size: 16px;">👤 معلومات الموظف</h3>
          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin-bottom: 10px;">
            <div style="border-bottom: 1px solid #e5e7eb; padding: 5px 0;"><div style="font-weight: 600; color: #374151; font-size: 11px;">الموظف</div><div style="color: #1f2937; font-size: 12px;">${deduction.employee?.fullName || deduction.employee?.title || '-'}</div></div>
            <div style="border-bottom: 1px solid #e5e7eb; padding: 5px 0;"><div style="font-weight: 600; color: #374151; font-size: 11px;">الراتب الأساسي</div><div style="color: #1f2937; font-size: 12px;">${(deduction.employee?.salary || 0).toLocaleString('ar-EG')} جم</div></div>
            <div style="border-bottom: 1px solid #e5e7eb; padding: 5px 0;"><div style="font-weight: 600; color: #374151; font-size: 11px;">الراتب المتبقي</div><div style="color: #1f2937; font-size: 12px;">${(deduction.employee?.remainedSalary || 0).toLocaleString('ar-EG')} جم</div></div>
          </div>
          
          <h3 style="color: #dc2626; border-bottom: 2px solid #dc2626; padding-bottom: 5px; margin-top: 15px; margin-bottom: 10px; font-size: 16px;">💰 تفاصيل الخصم</h3>
          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin-bottom: 10px;">
            <div style="border-bottom: 1px solid #e5e7eb; padding: 5px 0;"><div style="font-weight: 600; color: #374151; font-size: 11px;">المبلغ</div><div style="color: #dc2626; font-size: 16px; font-weight: 700;">${deduction.amountDeducted.toLocaleString('ar-EG')} جم</div></div>
            <div style="border-bottom: 1px solid #e5e7eb; padding: 5px 0;"><div style="font-weight: 600; color: #374151; font-size: 11px;">تاريخ الخصم</div><div style="color: #1f2937; font-size: 12px;">${new Date(deduction.deductionDate).toLocaleDateString('ar-EG')}</div></div>
            <div style="border-bottom: 1px solid #e5e7eb; padding: 5px 0;"><div style="font-weight: 600; color: #374151; font-size: 11px;">سبب الخصم</div><div style="color: #1f2937; font-size: 12px;">${deduction.reason || '-'}</div></div>
            <div style="border-bottom: 1px solid #e5e7eb; padding: 5px 0;"><div style="font-weight: 600; color: #374151; font-size: 11px;">نوع الراتب</div><div style="color: #1f2937; font-size: 12px;">${deduction.salaryType?.title || '-'}</div></div>
          </div>
          
          ${deduction.note ? `
          <h3 style="color: #dc2626; border-bottom: 2px solid #dc2626; padding-bottom: 5px; margin-top: 15px; margin-bottom: 10px; font-size: 16px;">📝 ملاحظات</h3>
          <div style="padding: 10px; background: #f9fafb; border-radius: 8px; margin-bottom: 15px;"><div style="color: #1f2937; font-size: 12px;">${deduction.note}</div></div>
          ` : ''}
          
          <div style="margin-top: 25px; display: flex; justify-content: space-between; align-items: flex-end; gap: 15px; padding-top: 15px; border-top: 1px solid #e5e7eb;">
            <div style="text-align: center; flex: 1;"><div style="width: 100%; border-top: 1px solid #000; margin-top: 30px; padding-top: 5px;"></div><div style="font-size: 11px;">توقيع الموظف</div><div style="font-size: 9px; color: #6b7280; margin-top: 5px;">التاريخ: ___ / ___ / _____</div></div>
            <div style="text-align: center; flex: 1;"><div style="width: 100%; border-top: 1px solid #000; margin-top: 30px; padding-top: 5px;"></div><div style="font-size: 11px;">توقيع المحاسب</div><div style="font-size: 9px; color: #6b7280; margin-top: 5px;">التاريخ: ___ / ___ / _____</div></div>
            <div style="text-align: center; flex: 1;"><div style="width: 100%; border-top: 1px solid #000; margin-top: 30px; padding-top: 5px;"></div><div style="font-size: 11px;">ختم الأكاديمية</div><div style="font-size: 9px; color: #6b7280; margin-top: 5px;">التاريخ: ___ / ___ / _____</div></div>
          </div>
          
          <div style="text-align: center; margin-top: 20px; padding: 10px; font-size: 9px; color: #9ca3af; border-top: 1px solid #e5e7eb;">
            تم التصدير من نظام إدارة الأكاديمية الأولمبية<br>
            هذا المستند معتمد ويحتوي على جميع بيانات الخصم
          </div>
        </div>
        
        <div style="display: flex; justify-content: center; gap: 15px; margin-top: 20px; padding-top: 15px; border-top: 1px solid #e5e7eb;">
          <button id="printDeductionBtn" style="padding: 10px 24px; background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 14px; font-weight: 500;">
            🖨️ طباعة الإيصال
          </button>
          <button id="closeModalBtn2" style="padding: 10px 24px; background: #f3f4f6; color: #374151; border: none; border-radius: 8px; cursor: pointer; font-size: 14px; font-weight: 500;">
            إغلاق
          </button>
        </div>
      </div>
    `;
    
    modalContainer.appendChild(modalContent);
    document.body.appendChild(modalContainer);
    
    const closeModal = () => {
      document.body.removeChild(modalContainer);
    };
    
    const printDeduction = () => {
      this.printDeductionDetails(deduction);
      closeModal();
    };
    
    modalContent.querySelector('#closeModalBtn')?.addEventListener('click', closeModal);
    modalContent.querySelector('#closeModalBtn2')?.addEventListener('click', closeModal);
    modalContent.querySelector('#printDeductionBtn')?.addEventListener('click', printDeduction);
    
    modalContainer.addEventListener('click', (e) => {
      if (e.target === modalContainer) {
        closeModal();
      }
    });
  }

  printDeductionDetails(deduction: any): void {
    const printContainer = document.createElement('div');
    printContainer.style.direction = 'rtl';
    printContainer.style.fontFamily = 'Cairo, "Segoe UI", Tahoma, sans-serif';
    printContainer.style.padding = '0';
    printContainer.style.backgroundColor = 'white';
    printContainer.style.maxWidth = '100%';
    printContainer.style.margin = '0';
    
    const today = new Date().toLocaleDateString('ar-EG');
    const deductionNumber = `DED-${deduction.id}`;
    
    printContainer.innerHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>إيصال خصم - ${deductionNumber}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; font-family: 'Cairo', 'Segoe UI', Tahoma, sans-serif; }
          @page { size: A4 portrait; margin: 10mm; }
          @media print { body { margin: 0; padding: 0; } .no-print { display: none; } }
          body { background: white; display: flex; justify-content: center; align-items: center; min-height: 100vh; padding: 20px; }
          .container { max-width: 700px; width: 100%; margin: 0 auto; background: white; border-radius: 12px; padding: 20px; }
          .header { text-align: center; margin-bottom: 20px; padding: 15px; background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); color: white; border-radius: 10px; }
          .header h1 { margin: 0; font-size: 20px; }
          .header p { margin: 5px 0 0 0; font-size: 11px; opacity: 0.9; }
          .deduction-details { display: flex; justify-content: space-between; margin-bottom: 15px; padding: 8px 12px; background: #f9fafb; border-radius: 8px; font-size: 12px; }
          h2 { color: #dc2626; border-bottom: 2px solid #dc2626; padding-bottom: 5px; margin-top: 15px; margin-bottom: 10px; font-size: 16px; }
          .info-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin-bottom: 10px; }
          .info-item { border-bottom: 1px solid #e5e7eb; padding: 5px 0; }
          .info-label { font-weight: 600; color: #374151; font-size: 11px; margin-bottom: 2px; }
          .info-value { color: #1f2937; font-size: 12px; font-weight: 500; }
          .info-value.amount { font-weight: 700; color: #dc2626; font-size: 16px; }
          .full-width { grid-column: span 2; }
          .signature-section { margin-top: 25px; display: flex; justify-content: space-between; align-items: flex-end; gap: 15px; padding-top: 15px; border-top: 1px solid #e5e7eb; }
          .signature-box { text-align: center; flex: 1; }
          .signature-line { width: 100%; border-top: 1px solid #000; margin-top: 30px; padding-top: 5px; }
          .signature-date { font-size: 9px; color: #6b7280; margin-top: 5px; }
          .footer { text-align: center; margin-top: 20px; padding: 10px; font-size: 9px; color: #9ca3af; border-top: 1px solid #e5e7eb; }
          @media (max-width: 600px) { .container { padding: 15px; } .info-grid { grid-template-columns: 1fr; gap: 8px; } .signature-section { flex-direction: column; align-items: center; gap: 20px; } .signature-box { width: 100%; } }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header"><h1>إيصال خصم</h1><p>نظام إدارة الأكاديمية الأولمبية</p></div>
          <div class="deduction-details"><div><strong>رقم الإيصال:</strong> ${deductionNumber}</div><div><strong>تاريخ الإصدار:</strong> ${today}</div></div>
          <h2>👤 معلومات الموظف</h2>
          <div class="info-grid">
            <div class="info-item"><div class="info-label">الموظف</div><div class="info-value">${deduction.employee?.fullName || deduction.employee?.title || '-'}</div></div>
            <div class="info-item"><div class="info-label">الراتب الأساسي</div><div class="info-value">${(deduction.employee?.salary || 0).toLocaleString('ar-EG')} جم</div></div>
            <div class="info-item"><div class="info-label">الراتب المتبقي</div><div class="info-value">${(deduction.employee?.remainedSalary || 0).toLocaleString('ar-EG')} جم</div></div>
          </div>
          <h2>💰 تفاصيل الخصم</h2>
          <div class="info-grid">
            <div class="info-item"><div class="info-label">المبلغ</div><div class="info-value amount">${deduction.amountDeducted.toLocaleString('ar-EG')} جم</div></div>
            <div class="info-item"><div class="info-label">تاريخ الخصم</div><div class="info-value">${new Date(deduction.deductionDate).toLocaleDateString('ar-EG')}</div></div>
            <div class="info-item"><div class="info-label">سبب الخصم</div><div class="info-value">${deduction.reason || '-'}</div></div>
            <div class="info-item"><div class="info-label">نوع الراتب</div><div class="info-value">${deduction.salaryType?.title || '-'}</div></div>
          </div>
          ${deduction.note ? `<h2>📝 ملاحظات</h2><div class="info-item full-width"><div class="info-value">${deduction.note}</div></div>` : ''}
          <div class="signature-section">
            <div class="signature-box"><div class="signature-line"></div><div style="font-size: 11px;">توقيع الموظف</div><div class="signature-date">التاريخ: ___ / ___ / _____</div></div>
            <div class="signature-box"><div class="signature-line"></div><div style="font-size: 11px;">توقيع المحاسب</div><div class="signature-date">التاريخ: ___ / ___ / _____</div></div>
            <div class="signature-box"><div class="signature-line"></div><div style="font-size: 11px;">ختم الأكاديمية</div><div class="signature-date">التاريخ: ___ / ___ / _____</div></div>
          </div>
          <div class="footer">تم التصدير من نظام إدارة الأكاديمية الأولمبية<br>هذا المستند معتمد ويحتوي على جميع بيانات الخصم</div>
        </div>
        <div class="no-print" style="text-align: center; margin-top: 15px; padding: 10px;">
          <button onclick="window.print();" style="padding: 8px 20px; background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 12px;">🖨️ طباعة / حفظ كـ PDF</button>
        </div>
        <script>window.onload = function() { setTimeout(function() { window.print(); }, 300); };</script>
      </body>
      </html>
    `;
    
    const printWindow = window.open('', '_blank', 'width=800,height=800,scrollbars=yes');
    if (printWindow) {
      printWindow.document.write(printContainer.innerHTML);
      printWindow.document.close();
      this.notification.showSuccess('تم فتح إيصال الخصم - جاري تحضير الطباعة...');
    } else {
      document.body.appendChild(printContainer);
      window.print();
      setTimeout(() => { 
        if (document.body.contains(printContainer)) {
          document.body.removeChild(printContainer);
        }
      }, 500);
    }
  }

  editDeduction(id: number) {
    const dialogRef = this.dialog.open(SalaryDeductionWizardModalComponent, {
      data: { deductionId: id },
      width: '800px',
      maxWidth: '90vw'
    });
    
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadData();
      }
    });
  }

  deleteDeduction(item: any) {
    if (confirm(`هل أنت متأكد من حذف خصم الموظف "${item.employee?.fullName || item.employee?.title}"؟`)) {
      this.financialService.deleteSalaryDeduction(item.id).subscribe({
        next: () => {
          this.notification.showSuccess('تم الحذف بنجاح');
          this.loadData();
        },
        error: () => this.notification.showError('حدث خطأ في الحذف')
      });
    }
  }

  exportToExcel() {
    if (this.dataSource.data.length === 0) {
      this.notification.showWarning('لا توجد بيانات لتصديرها');
      return;
    }

    const exportData = this.dataSource.data.map((item, index) => ({
      '#': index + 1,
      'الموظف': item.employee?.fullName || item.employee?.title || '-',
      'الراتب الأساسي': item.employee?.salary || 0,
      'الراتب المتبقي': item.employee?.remainedSalary || 0,
      'المبلغ': item.amountDeducted,
      'تاريخ الخصم': item.deductionDate,
      'السبب': item.reason || '-',
      'نوع الراتب': item.salaryType?.title || '-',
      'ملاحظات': item.note || '-'
    }));

    this.reportService.exportToExcel(exportData, 'salary-deductions-list', 'خصومات الموظفين');
    this.notification.showSuccess('تم تصدير البيانات بنجاح');
  }

  exportToPDF() {
    if (this.dataSource.data.length === 0) {
      this.notification.showWarning('لا توجد بيانات لتصديرها');
      return;
    }

    this.isLoading = true;

    const filterTexts: string[] = [];
    if (this.filters.employeeId) {
      const employee = this.employees.find(e => e.id === this.filters.employeeId);
      if (employee) filterTexts.push(`الموظف: ${employee.title}`);
    }
    if (this.filters.salaryTypeId) {
      const salaryType = this.salaryTypes.find(s => s.id === this.filters.salaryTypeId);
      if (salaryType) filterTexts.push(`نوع الراتب: ${salaryType.title}`);
    }
    if (this.filters.deductionDateFrom) filterTexts.push(`من تاريخ: ${this.filters.deductionDateFrom}`);
    if (this.filters.deductionDateTo) filterTexts.push(`إلى تاريخ: ${this.filters.deductionDateTo}`);
    if (this.quickSearch) filterTexts.push(`بحث: ${this.quickSearch}`);

    let tableRows = '';
    this.dataSource.data.forEach((item: any, index: number) => {
      tableRows += `
        <tr>
          <td style="text-align: center; padding: 8px; border: 1px solid #ddd;">${index + 1}</td>
          <td style="text-align: right; padding: 8px; border: 1px solid #ddd; font-weight: bold;">${item.employee?.fullName || item.employee?.title || '-'}</td>
          <td style="text-align: center; padding: 8px; border: 1px solid #ddd;">${(item.employee?.salary || 0).toLocaleString('ar-EG')} جم}</td>
          <td style="text-align: center; padding: 8px; border: 1px solid #ddd;">${(item.employee?.remainedSalary || 0).toLocaleString('ar-EG')} جم}</td>
          <td style="text-align: center; padding: 8px; border: 1px solid #ddd; font-weight: bold; color: #dc2626;">
            ${(item.amountDeducted || 0).toLocaleString('ar-EG')} جم
          </td>
          <td style="text-align: center; padding: 8px; border: 1px solid #ddd;">${item.deductionDate || '-'}</td>
          <td style="text-align: center; padding: 8px; border: 1px solid #ddd;">${item.reason || '-'}</td>
          <td style="text-align: center; padding: 8px; border: 1px solid #ddd;">${item.salaryType?.title || '-'}</td>
          <td style="text-align: right; padding: 8px; border: 1px solid #ddd;">${item.note || '-'}</td>
        </tr>
      `;
    });

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
        <title>تقرير خصومات الموظفين</title>
        <style>
          * { font-family: 'Cairo', 'Segoe UI', Tahoma, sans-serif; }
          @media print { body { margin: 0; padding: 20px; } .no-print { display: none; } }
          .header { text-align: center; margin-bottom: 20px; padding: 20px; background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); color: white; border-radius: 8px; }
          .header h1 { margin: 0; font-size: 24px; }
          .header p { margin: 10px 0 0 0; font-size: 12px; }
          .filters { margin-bottom: 20px; padding: 10px; background-color: #f3f4f6; border-radius: 8px; font-size: 12px; }
          .stats { display: flex; gap: 16px; margin-bottom: 20px; padding: 16px; background: #f9fafb; border-radius: 8px; }
          .stat-item { flex: 1; text-align: center; }
          .stat-label { font-size: 12px; color: #6b7280; }
          .stat-value { font-size: 20px; font-weight: bold; color: #dc2626; }
          table { width: 100%; border-collapse: collapse; direction: rtl; }
          th { background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); color: white; padding: 10px; border: 1px solid #ddd; text-align: center; font-weight: bold; }
          td { padding: 8px; border: 1px solid #ddd; }
          .footer { text-align: center; margin-top: 20px; padding: 10px; font-size: 10px; color: #666; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>تقرير خصومات الموظفين</h1>
          <p>تاريخ التقرير: ${new Date().toLocaleDateString('ar-EG')}</p>
          <p>عدد السجلات: ${this.dataSource.data.length} خصم</p>
        </div>
        ${filterTexts.length > 0 ? `<div class="filters"><strong>الفلاتر المطبقة:</strong> ${filterTexts.join(' | ')}</div>` : ''}
        <div class="stats">
          <div class="stat-item"><div class="stat-value">${this.dataSource.data.length}</div><div class="stat-label">عدد الخصومات</div></div>
          <div class="stat-item"><div class="stat-value">${this.totalDeductions.toLocaleString('ar-EG')} جم</div><div class="stat-label">إجمالي الخصومات</div></div>
          <div class="stat-item"><div class="stat-value">${this.averageDeduction.toLocaleString('ar-EG')} جم</div><div class="stat-label">متوسط الخصم</div></div>
        </div>
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>الموظف</th>
              <th>الراتب الأساسي</th>
              <th>الراتب المتبقي</th>
              <th>المبلغ</th>
              <th>تاريخ الخصم</th>
              <th>السبب</th>
              <th>نوع الراتب</th>
              <th>ملاحظات</th>
            </tr>
          </thead>
          <tbody>
            ${tableRows}
          </tbody>
        </table>
        <div class="footer">تم التصدير من نظام إدارة الأكاديمية الأولمبية</div>
        <div class="no-print" style="text-align: center; margin-top: 20px; padding: 10px;">
          <button onclick="window.print();" style="padding: 10px 20px; background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); color: white; border: none; border-radius: 5px; cursor: pointer;">🖨️ طباعة / حفظ كـ PDF</button>
        </div>
      </body>
      </html>
    `;

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

  printList(): void {
    this.exportToPDF();
  }
}