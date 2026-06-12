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
import { SALARY_TRANSACTION_TYPES } from '../../../../../../core/models/financial.model';
import { SALARY_TYPES } from '../../../../../../core/models/common.model';
import { SalaryIncentiveWizardModalComponent } from '../salary-incentive-wizard/salary-incentive-wizard-modal.component.ts';

@Component({
  selector: 'app-salary-incentive-list',
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
  templateUrl: './salary-incentive-list.component.html',
  styleUrls: ['./salary-incentive-list.component.css']
})
export class SalaryIncentiveListComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['index', 'employee', 'salary', 'remainedSalary', 'transactionType', 'amount', 'withdrawDate', 'paymentMethod', 'salaryType', 'actions'];
  dataSource = new MatTableDataSource<any>([]);
  isLoading = false;
  transactionTypes = SALARY_TRANSACTION_TYPES;
  salaryTypes = SALARY_TYPES;
  
  employees: any[] = [];
  paymentMethods: any[] = [];
  
  // Filter criteria - using correct parameter names from backend API
  filters = {
    employeeId: null as number | null,
    type: null as string | null,           // 'SALARY', 'INCENTIVE', 'BONUS', 'ADVANCE'
    paymentMethodId: null as number | null,
    salaryType: null as string | null,      // 'MONTHLY', 'HOURLY', 'DAILY', 'PERCENTAGE'
    withdrawDateFrom: null as string | null,
    withdrawDateTo: null as string | null
  };
  
  quickSearch: string = '';
  
  // Options for searchable selects
  employeeOptions: SelectOption[] = [];
  transactionTypeOptions: SelectOption[] = [];
  paymentMethodOptions: SelectOption[] = [];
  salaryTypeOptions: SelectOption[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  // Statistics
  get totalAmount(): number {
    return this.dataSource.data.reduce((sum, item) => sum + (item.amountWithdrawn || 0), 0);
  }

  get salaryTotal(): number {
    return this.dataSource.data.filter(item => item.salaryTransactionType?.id === 1).reduce((sum, item) => sum + (item.amountWithdrawn || 0), 0);
  }

  get incentiveTotal(): number {
    return this.dataSource.data.filter(item => item.salaryTransactionType?.id === 2).reduce((sum, item) => sum + (item.amountWithdrawn || 0), 0);
  }

  get bonusTotal(): number {
    return this.dataSource.data.filter(item => item.salaryTransactionType?.id === 3).reduce((sum, item) => sum + (item.amountWithdrawn || 0), 0);
  }

  get advanceTotal(): number {
    return this.dataSource.data.filter(item => item.salaryTransactionType?.id === 4).reduce((sum, item) => sum + (item.amountWithdrawn || 0), 0);
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
    this.loadLookupData();
    this.loadData();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadSelectOptions(): void {
    // Transaction type options - parameter name 'type'
    this.transactionTypeOptions = [
      { value: null, label: 'الكل' },
      { value: 'SALARY', label: 'راتب' },
      { value: 'INCENTIVE', label: 'حافز' },
      { value: 'BONUS', label: 'مكافأة' },
      { value: 'ADVANCE', label: 'سلفة' }
    ];
    
    // Salary type options - parameter name 'salaryType'
    this.salaryTypeOptions = [
      { value: null, label: 'الكل' },
      { value: 'MONTHLY', label: 'شهري' },
      { value: 'HOURLY', label: 'بالساعة' },
      { value: 'DAILY', label: 'يومي' },
      { value: 'PERCENTAGE', label: 'نسبة' }
    ];
  }

  loadLookupData() {
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

    this.financialService.getAllPaymentMethodsLookup().subscribe({
      next: (res: any) => { 
        this.paymentMethods = res.list || [];
        this.paymentMethodOptions = [
          { value: null, label: 'الكل' },
          ...this.paymentMethods.map(p => ({ value: p.id, label: p.title }))
        ];
      },
      error: () => { 
        this.notification.showError('حدث خطأ في تحميل طرق الدفع'); 
      }
    });
  }

  loadData() {
    this.isLoading = true;
    const params: any = {};
    
    if (this.filters.employeeId) params.employeeId = this.filters.employeeId;
    if (this.filters.type) params.type = this.filters.type;
    if (this.filters.paymentMethodId) params.paymentMethodId = this.filters.paymentMethodId;
    if (this.filters.salaryType) params.salaryType = this.filters.salaryType;
    if (this.filters.withdrawDateFrom) params.withdrawDateFrom = this.filters.withdrawDateFrom;
    if (this.filters.withdrawDateTo) params.withdrawDateTo = this.filters.withdrawDateTo;
    if (this.quickSearch) params.quickSearch = this.quickSearch;

    console.log('Filter params:', params);

    this.financialService.getAllSalaryIncentivesByFilter(params).subscribe({
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
      type: null,
      paymentMethodId: null,
      salaryType: null,
      withdrawDateFrom: null,
      withdrawDateTo: null
    };
    this.quickSearch = '';
    this.loadData();
    this.notification.showSuccess('تم مسح جميع الفلاتر');
  }

  openNewTransactionModal() {
    const dialogRef = this.dialog.open(SalaryIncentiveWizardModalComponent, {
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

  viewTransaction(id: number) {
    this.financialService.getSalaryIncentiveById(id).subscribe({
      next: (transaction) => {
        this.openDetailsModal(transaction);
      },
      error: () => {
        this.notification.showError('حدث خطأ في تحميل بيانات المعاملة');
      }
    });
  }

  openDetailsModal(transaction: any): void {
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
    const transactionNumber = `TRX-${transaction.id}`;
    
    const getTransactionTypeClass = (typeId: number): string => {
      switch(typeId) {
        case 1: return 'salary';
        case 2: return 'incentive';
        case 3: return 'bonus';
        case 4: return 'advance';
        default: return '';
      }
    };
    
    const typeClass = getTransactionTypeClass(transaction.salaryTransactionType?.id);
    
    modalContent.innerHTML = `
      <div style="padding: 20px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; padding-bottom: 15px; border-bottom: 2px solid #e5e7eb;">
          <h2 style="margin: 0; color: #10b981; font-size: 20px;">تفاصيل المعاملة</h2>
          <button id="closeModalBtn" style="background: none; border: none; font-size: 24px; cursor: pointer; color: #6b7280;">&times;</button>
        </div>
        
        <div style="max-width: 100%;">
          <div style="text-align: center; margin-bottom: 20px; padding: 15px; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; border-radius: 10px;">
            <h1 style="margin: 0; font-size: 18px;">إيصال صرف</h1>
            <p style="margin: 5px 0 0 0; font-size: 11px; opacity: 0.9;">نظام إدارة الأكاديمية الأولمبية</p>
          </div>
          
          <div style="display: flex; justify-content: space-between; margin-bottom: 15px; padding: 8px 12px; background: #f9fafb; border-radius: 8px; font-size: 12px;">
            <div><strong>رقم الإيصال:</strong> ${transactionNumber}</div>
            <div><strong>تاريخ الإصدار:</strong> ${today}</div>
          </div>
          
          <h3 style="color: #10b981; border-bottom: 2px solid #10b981; padding-bottom: 5px; margin-top: 15px; margin-bottom: 10px; font-size: 16px;">👤 معلومات الموظف</h3>
          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin-bottom: 10px;">
            <div style="border-bottom: 1px solid #e5e7eb; padding: 5px 0;"><div style="font-weight: 600; color: #374151; font-size: 11px;">الموظف</div><div style="color: #1f2937; font-size: 12px;">${transaction.employee?.fullName || '-'}</div></div>
            <div style="border-bottom: 1px solid #e5e7eb; padding: 5px 0;"><div style="font-weight: 600; color: #374151; font-size: 11px;">الراتب الأساسي</div><div style="color: #1f2937; font-size: 12px;">${(transaction.employee?.salary || 0).toLocaleString('ar-EG')} جم</div></div>
            <div style="border-bottom: 1px solid #e5e7eb; padding: 5px 0;"><div style="font-weight: 600; color: #374151; font-size: 11px;">الراتب المتبقي</div><div style="color: ${transaction.employee?.remainedSalary < transaction.employee?.salary ? '#d97706' : '#1f2937'}; font-size: 12px; font-weight: 500;">${(transaction.employee?.remainedSalary || 0).toLocaleString('ar-EG')} جم</div></div>
          </div>
          
          <h3 style="color: #10b981; border-bottom: 2px solid #10b981; padding-bottom: 5px; margin-top: 15px; margin-bottom: 10px; font-size: 16px;">💰 تفاصيل المعاملة</h3>
          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin-bottom: 10px;">
            <div style="border-bottom: 1px solid #e5e7eb; padding: 5px 0;"><div style="font-weight: 600; color: #374151; font-size: 11px;">نوع المعاملة</div><div style="color: #1f2937; font-size: 12px;"><span style="display: inline-flex; align-items: center; gap: 4px; padding: 2px 10px; border-radius: 20px; font-size: 11px; font-weight: 500; ${typeClass === 'salary' ? 'background: #dbeafe; color: #1e40af;' : typeClass === 'incentive' ? 'background: #d1fae5; color: #065f46;' : typeClass === 'bonus' ? 'background: #fef3c7; color: #92400e;' : 'background: #fee2e2; color: #991b1b;'}">${transaction.salaryTransactionType?.title || '-'}</span></div></div>
            <div style="border-bottom: 1px solid #e5e7eb; padding: 5px 0;"><div style="font-weight: 600; color: #374151; font-size: 11px;">المبلغ</div><div style="color: #dc2626; font-size: 16px; font-weight: 700;">${transaction.amountWithdrawn.toLocaleString('ar-EG')} جم</div></div>
            <div style="border-bottom: 1px solid #e5e7eb; padding: 5px 0;"><div style="font-weight: 600; color: #374151; font-size: 11px;">تاريخ الصرف</div><div style="color: #1f2937; font-size: 12px;">${new Date(transaction.withdrawDate).toLocaleDateString('ar-EG')}</div></div>
            <div style="border-bottom: 1px solid #e5e7eb; padding: 5px 0;"><div style="font-weight: 600; color: #374151; font-size: 11px;">طريقة الدفع</div><div style="color: #1f2937; font-size: 12px;">${transaction.paymentMethod?.title || '-'}</div></div>
            <div style="border-bottom: 1px solid #e5e7eb; padding: 5px 0;"><div style="font-weight: 600; color: #374151; font-size: 11px;">نوع الراتب</div><div style="color: #1f2937; font-size: 12px;">${transaction.salaryType?.title || '-'}</div></div>
          </div>
          
          ${transaction.note ? `
          <h3 style="color: #10b981; border-bottom: 2px solid #10b981; padding-bottom: 5px; margin-top: 15px; margin-bottom: 10px; font-size: 16px;">📝 ملاحظات</h3>
          <div style="padding: 10px; background: #f9fafb; border-radius: 8px; margin-bottom: 15px;"><div style="color: #1f2937; font-size: 12px;">${transaction.note}</div></div>
          ` : ''}
          
          <div style="margin-top: 25px; display: flex; justify-content: space-between; align-items: flex-end; gap: 15px; padding-top: 15px; border-top: 1px solid #e5e7eb;">
            <div style="text-align: center; flex: 1;"><div style="width: 100%; border-top: 1px solid #000; margin-top: 30px; padding-top: 5px;"></div><div style="font-size: 11px;">توقيع المستلم</div><div style="font-size: 9px; color: #6b7280; margin-top: 5px;">التاريخ: ___ / ___ / _____</div></div>
            <div style="text-align: center; flex: 1;"><div style="width: 100%; border-top: 1px solid #000; margin-top: 30px; padding-top: 5px;"></div><div style="font-size: 11px;">توقيع المحاسب</div><div style="font-size: 9px; color: #6b7280; margin-top: 5px;">التاريخ: ___ / ___ / _____</div></div>
            <div style="text-align: center; flex: 1;"><div style="width: 100%; border-top: 1px solid #000; margin-top: 30px; padding-top: 5px;"></div><div style="font-size: 11px;">ختم الأكاديمية</div><div style="font-size: 9px; color: #6b7280; margin-top: 5px;">التاريخ: ___ / ___ / _____</div></div>
          </div>
          
          <div style="text-align: center; margin-top: 20px; padding: 10px; font-size: 9px; color: #9ca3af; border-top: 1px solid #e5e7eb;">
            تم التصدير من نظام إدارة الأكاديمية الأولمبية<br>
            هذا المستند معتمد ويحتوي على جميع بيانات المعاملة
          </div>
        </div>
        
        <div style="display: flex; justify-content: center; gap: 15px; margin-top: 20px; padding-top: 15px; border-top: 1px solid #e5e7eb;">
          <button id="printTransactionBtn" style="padding: 10px 24px; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 14px; font-weight: 500;">
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
    
    // Close modal handlers
    const closeModal = () => {
      document.body.removeChild(modalContainer);
    };
    
    const printTransaction = () => {
      this.printTransactionDetails(transaction);
      closeModal();
    };
    
    modalContent.querySelector('#closeModalBtn')?.addEventListener('click', closeModal);
    modalContent.querySelector('#closeModalBtn2')?.addEventListener('click', closeModal);
    modalContent.querySelector('#printTransactionBtn')?.addEventListener('click', printTransaction);
    
    // Close on backdrop click
    modalContainer.addEventListener('click', (e) => {
      if (e.target === modalContainer) {
        closeModal();
      }
    });
  }

  printTransactionDetails(transaction: any): void {
    const printContainer = document.createElement('div');
    printContainer.style.direction = 'rtl';
    printContainer.style.fontFamily = 'Cairo, "Segoe UI", Tahoma, sans-serif';
    printContainer.style.padding = '0';
    printContainer.style.backgroundColor = 'white';
    printContainer.style.maxWidth = '100%';
    printContainer.style.margin = '0';
    
    const today = new Date().toLocaleDateString('ar-EG');
    const transactionNumber = `TRX-${transaction.id}`;
    
    const getTransactionTypeClass = (typeId: number): string => {
      switch(typeId) {
        case 1: return 'salary';
        case 2: return 'incentive';
        case 3: return 'bonus';
        case 4: return 'advance';
        default: return '';
      }
    };
    
    const typeClass = getTransactionTypeClass(transaction.salaryTransactionType?.id);
    
    printContainer.innerHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>إيصال صرف - ${transactionNumber}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; font-family: 'Cairo', 'Segoe UI', Tahoma, sans-serif; }
          @page { size: A4 portrait; margin: 10mm; }
          @media print { body { margin: 0; padding: 0; } .no-print { display: none; } }
          body { background: white; display: flex; justify-content: center; align-items: center; min-height: 100vh; padding: 20px; }
          .container { max-width: 700px; width: 100%; margin: 0 auto; background: white; border-radius: 12px; padding: 20px; }
          .header { text-align: center; margin-bottom: 20px; padding: 15px; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; border-radius: 10px; }
          .header h1 { margin: 0; font-size: 20px; }
          .header p { margin: 5px 0 0 0; font-size: 11px; opacity: 0.9; }
          .transaction-details { display: flex; justify-content: space-between; margin-bottom: 15px; padding: 8px 12px; background: #f9fafb; border-radius: 8px; font-size: 12px; }
          h2 { color: #10b981; border-bottom: 2px solid #10b981; padding-bottom: 5px; margin-top: 15px; margin-bottom: 10px; font-size: 16px; }
          .info-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin-bottom: 10px; }
          .info-item { border-bottom: 1px solid #e5e7eb; padding: 5px 0; }
          .info-label { font-weight: 600; color: #374151; font-size: 11px; margin-bottom: 2px; }
          .info-value { color: #1f2937; font-size: 12px; font-weight: 500; }
          .info-value.amount { font-weight: 700; color: #dc2626; font-size: 16px; }
          .full-width { grid-column: span 2; }
          .type-badge { display: inline-flex; align-items: center; gap: 4px; padding: 2px 10px; border-radius: 20px; font-size: 11px; font-weight: 500; ${typeClass === 'salary' ? 'background: #dbeafe; color: #1e40af;' : typeClass === 'incentive' ? 'background: #d1fae5; color: #065f46;' : typeClass === 'bonus' ? 'background: #fef3c7; color: #92400e;' : 'background: #fee2e2; color: #991b1b;'} }
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
          <div class="header"><h1>إيصال صرف</h1><p>نظام إدارة الأكاديمية الأولمبية</p></div>
          <div class="transaction-details"><div><strong>رقم الإيصال:</strong> ${transactionNumber}</div><div><strong>تاريخ الإصدار:</strong> ${today}</div></div>
          <h2>👤 معلومات الموظف</h2>
          <div class="info-grid">
            <div class="info-item"><div class="info-label">الموظف</div><div class="info-value">${transaction.employee?.fullName || '-'}</div></div>
            <div class="info-item"><div class="info-label">الراتب الأساسي</div><div class="info-value">${(transaction.employee?.salary || 0).toLocaleString('ar-EG')} جم</div></div>
            <div class="info-item"><div class="info-label">الراتب المتبقي</div><div class="info-value">${(transaction.employee?.remainedSalary || 0).toLocaleString('ar-EG')} جم</div></div>
          </div>
          <h2>💰 تفاصيل المعاملة</h2>
          <div class="info-grid">
            <div class="info-item"><div class="info-label">نوع المعاملة</div><div class="info-value"><span class="type-badge">${transaction.salaryTransactionType?.title || '-'}</span></div></div>
            <div class="info-item"><div class="info-label">المبلغ</div><div class="info-value amount">${transaction.amountWithdrawn.toLocaleString('ar-EG')} جم</div></div>
            <div class="info-item"><div class="info-label">تاريخ الصرف</div><div class="info-value">${new Date(transaction.withdrawDate).toLocaleDateString('ar-EG')}</div></div>
            <div class="info-item"><div class="info-label">طريقة الدفع</div><div class="info-value">${transaction.paymentMethod?.title || '-'}</div></div>
            <div class="info-item"><div class="info-label">نوع الراتب</div><div class="info-value">${transaction.salaryType?.title || '-'}</div></div>
          </div>
          ${transaction.note ? `<h2>📝 ملاحظات</h2><div class="info-item full-width"><div class="info-value">${transaction.note}</div></div>` : ''}
          <div class="signature-section">
            <div class="signature-box"><div class="signature-line"></div><div style="font-size: 11px;">توقيع المستلم</div><div class="signature-date">التاريخ: ___ / ___ / _____</div></div>
            <div class="signature-box"><div class="signature-line"></div><div style="font-size: 11px;">توقيع المحاسب</div><div class="signature-date">التاريخ: ___ / ___ / _____</div></div>
            <div class="signature-box"><div class="signature-line"></div><div style="font-size: 11px;">ختم الأكاديمية</div><div class="signature-date">التاريخ: ___ / ___ / _____</div></div>
          </div>
          <div class="footer">تم التصدير من نظام إدارة الأكاديمية الأولمبية<br>هذا المستند معتمد ويحتوي على جميع بيانات المعاملة</div>
        </div>
        <div class="no-print" style="text-align: center; margin-top: 15px; padding: 10px;">
          <button onclick="window.print();" style="padding: 8px 20px; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 12px;">🖨️ طباعة / حفظ كـ PDF</button>
        </div>
        <script>window.onload = function() { setTimeout(function() { window.print(); }, 300); };</script>
      </body>
      </html>
    `;
    
    const printWindow = window.open('', '_blank', 'width=800,height=800,scrollbars=yes');
    if (printWindow) {
      printWindow.document.write(printContainer.innerHTML);
      printWindow.document.close();
      this.notification.showSuccess('تم فتح إيصال الصرف - جاري تحضير الطباعة...');
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

  editTransaction(id: number) {
    const dialogRef = this.dialog.open(SalaryIncentiveWizardModalComponent, {
      data: { transactionId: id },
      width: '800px',
      maxWidth: '90vw'
    });
    
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadData();
      }
    });
  }

  deleteTransaction(item: any) {
    const typeName = item.salaryTransactionType?.title || 'المعاملة';
    if (confirm(`هل أنت متأكد من حذف ${typeName} للموظف "${item.employee?.fullName}"؟`)) {
      this.financialService.deleteSalaryIncentive(item.id).subscribe({
        next: () => {
          this.notification.showSuccess('تم الحذف بنجاح');
          this.loadData();
        },
        error: () => this.notification.showError('حدث خطأ في الحذف')
      });
    }
  }

  getTransactionTypeClass(typeId: number): string {
    switch(typeId) {
      case 1: return 'salary';
      case 2: return 'incentive';
      case 3: return 'bonus';
      case 4: return 'advance';
      default: return '';
    }
  }

  getTransactionTypeIcon(typeId: number): string {
    switch(typeId) {
      case 1: return 'attach_money';
      case 2: return 'star';
      case 3: return 'celebration';
      case 4: return 'account_balance_wallet';
      default: return 'receipt';
    }
  }

  // Totals Methods
  getTotalTransactionsCount(): number {
    return this.dataSource.data.length;
  }

  exportToExcel() {
    if (this.dataSource.data.length === 0) {
      this.notification.showWarning('لا توجد بيانات لتصديرها');
      return;
    }

    const exportData = this.dataSource.data.map((item, index) => ({
      '#': index + 1,
      'الموظف': item.employee?.fullName || '-',
      'الراتب الأساسي': item.employee?.salary || 0,
      'الراتب المتبقي': item.employee?.remainedSalary || 0,
      'نوع المعاملة': item.salaryTransactionType?.title || '-',
      'المبلغ': item.amountWithdrawn,
      'تاريخ الصرف': item.withdrawDate,
      'طريقة الدفع': item.paymentMethod?.title || '-',
      'نوع الراتب': item.salaryType?.title || '-',
      'ملاحظات': item.note || '-'
    }));

    this.reportService.exportToExcel(exportData, 'salary-incentives-list', 'الرواتب والحوافز');
    this.notification.showSuccess('تم تصدير البيانات بنجاح');
  }

printList(): void {
  if (this.dataSource.data.length === 0) {
    this.notification.showWarning('لا توجد بيانات للطباعة');
    return;
  }

  this.isLoading = true;

  // Build filter text
  const filterTexts: string[] = [];
  if (this.filters.employeeId) {
    const employee = this.employees.find(e => e.id === this.filters.employeeId);
    if (employee) filterTexts.push(`الموظف: ${employee.title}`);
  }
  if (this.filters.type) {
    const type = this.transactionTypes.find(t => this.getTransactionTypeEnumString(t.id) === this.filters.type);
    if (type) filterTexts.push(`نوع المعاملة: ${type.title}`);
  }
  if (this.filters.paymentMethodId) {
    const paymentMethod = this.paymentMethods.find(p => p.id === this.filters.paymentMethodId);
    if (paymentMethod) filterTexts.push(`طريقة الدفع: ${paymentMethod.title}`);
  }
  if (this.filters.salaryType) {
    const salaryType = this.salaryTypes.find(s => this.getSalaryTypeEnumString(s.id) === this.filters.salaryType);
    if (salaryType) filterTexts.push(`نوع الراتب: ${salaryType.title}`);
  }
  if (this.filters.withdrawDateFrom) filterTexts.push(`من تاريخ: ${this.filters.withdrawDateFrom}`);
  if (this.filters.withdrawDateTo) filterTexts.push(`إلى تاريخ: ${this.filters.withdrawDateTo}`);
  if (this.quickSearch) filterTexts.push(`بحث: ${this.quickSearch}`);

  // Build table rows with proper styling
  let tableRows = '';
  this.dataSource.data.forEach((item: any, index: number) => {
    const typeClass = this.getTransactionTypeClass(item.salaryTransactionType?.id);
    let transactionTypeStyle = '';
    if (typeClass === 'salary') transactionTypeStyle = 'background-color: #dbeafe; color: #1e40af;';
    else if (typeClass === 'incentive') transactionTypeStyle = 'background-color: #d1fae5; color: #065f46;';
    else if (typeClass === 'bonus') transactionTypeStyle = 'background-color: #fef3c7; color: #92400e;';
    else if (typeClass === 'advance') transactionTypeStyle = 'background-color: #fee2e2; color: #991b1b;';
    else transactionTypeStyle = 'background-color: #f3f4f6; color: #374151;';
    
    const remainedSalary = item.employee?.remainedSalary || 0;
    const basicSalary = item.employee?.salary || 0;
    const remainedWarning = remainedSalary < basicSalary ? 'color: #d97706; font-weight: bold;' : '';
    
    tableRows += `
      <tr>
        <td style="text-align: center; padding: 8px; border: 1px solid #ddd;">${index + 1}</td>
        <td style="text-align: right; padding: 8px; border: 1px solid #ddd; font-weight: bold;">${item.employee?.fullName || '-'}</td>
        <td style="text-align: center; padding: 8px; border: 1px solid #ddd;">${(basicSalary).toLocaleString('ar-EG')} جم</td>
        <td style="text-align: center; padding: 8px; border: 1px solid #ddd; ${remainedWarning}">${(remainedSalary).toLocaleString('ar-EG')} جم</td>
        <td style="text-align: center; padding: 8px; border: 1px solid #ddd; ${transactionTypeStyle}">
          ${item.salaryTransactionType?.title || '-'}
        </td>
        <td style="text-align: center; padding: 8px; border: 1px solid #ddd; font-weight: bold; color: #10b981;">
          ${(item.amountWithdrawn || 0).toLocaleString('ar-EG')} جم
        </td>
        <td style="text-align: center; padding: 8px; border: 1px solid #ddd;">${item.withdrawDate || '-'}</td>
        <td style="text-align: center; padding: 8px; border: 1px solid #ddd;">${item.paymentMethod?.title || '-'}</td>
        <td style="text-align: center; padding: 8px; border: 1px solid #ddd;">${item.salaryType?.title || '-'}</td>
        <td style="text-align: right; padding: 8px; border: 1px solid #ddd;">${item.note || '-'}</td>
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
      <title>تقرير الرواتب والحوافز</title>
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
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
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
          flex-wrap: wrap;
        }
        .stat-item {
          flex: 1;
          text-align: center;
          min-width: 120px;
        }
        .stat-label { font-size: 12px; color: #6b7280; }
        .stat-value { font-size: 20px; font-weight: bold; color: #10b981; }
        table {
          width: 100%;
          border-collapse: collapse;
          direction: rtl;
          margin-top: 10px;
        }
        th {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
          padding: 10px;
          border: 1px solid #2e7d32;
          text-align: center;
          font-weight: bold;
          font-size: 13px;
        }
        td { 
          padding: 8px; 
          border: 1px solid #ddd;
          font-size: 12px;
        }
        .footer {
          text-align: center;
          margin-top: 20px;
          padding: 10px;
          font-size: 10px;
          color: #666;
        }
        .no-print {
          text-align: center;
          margin-top: 20px;
          padding: 10px;
        }
        .print-btn {
          padding: 10px 20px;
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          font-size: 14px;
        }
        .print-btn:hover {
          opacity: 0.9;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>تقرير الرواتب والحوافز</h1>
        <p>تاريخ التقرير: ${new Date().toLocaleDateString('ar-EG')}</p>
        <p>عدد السجلات: ${this.dataSource.data.length} معاملة</p>
      </div>
      ${filterTexts.length > 0 ? `<div class="filters"><strong>الفلاتر المطبقة:</strong> ${filterTexts.join(' | ')}</div>` : ''}
      <div class="stats">
        <div class="stat-item">
          <div class="stat-value">${this.dataSource.data.length}</div>
          <div class="stat-label">عدد المعاملات</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">${this.salaryTotal.toLocaleString('ar-EG')} جم</div>
          <div class="stat-label">رواتب</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">${this.incentiveTotal.toLocaleString('ar-EG')} جم</div>
          <div class="stat-label">حوافز</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">${this.bonusTotal.toLocaleString('ar-EG')} جم</div>
          <div class="stat-label">مكافآت</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">${this.advanceTotal.toLocaleString('ar-EG')} جم</div>
          <div class="stat-label">سلف</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">${this.totalAmount.toLocaleString('ar-EG')} جم</div>
          <div class="stat-label">إجمالي المبالغ</div>
        </div>
      </div>
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>الموظف</th>
            <th>الراتب الأساسي</th>
            <th>الراتب المتبقي</th>
            <th>نوع المعاملة</th>
            <th>المبلغ</th>
            <th>تاريخ الصرف</th>
            <th>طريقة الدفع</th>
            <th>نوع الراتب</th>
            <th>ملاحظات</th>
          </tr>
        </thead>
        <tbody>
          ${tableRows}
        </tbody>
      </table>
      <div class="footer">
        تم التصدير من نظام إدارة الأكاديمية الأولمبية
      </div>
      <div class="no-print">
        <button class="print-btn" onclick="window.print();">🖨️ طباعة / حفظ كـ PDF</button>
      </div>
      <script>
        window.onload = function() {
          setTimeout(function() {
            window.print();
          }, 500);
        };
      </script>
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
      if (document.body.contains(printContainer)) {
        document.body.removeChild(printContainer);
      }
    }, 500);
    this.isLoading = false;
    this.notification.showSuccess('تم فتح التقرير - يمكنك حفظه كـ PDF من نافذة الطباعة');
  }
}

  // Helper methods for enum conversion
  private getTransactionTypeEnumString(id: number): string {
    switch(id) {
      case 1: return 'SALARY';
      case 2: return 'INCENTIVE';
      case 3: return 'BONUS';
      case 4: return 'ADVANCE';
      default: return '';
    }
  }

  private getSalaryTypeEnumString(id: number): string {
    switch(id) {
      case 1: return 'MONTHLY';
      case 2: return 'HOURLY';
      case 3: return 'DAILY';
      case 4: return 'PERCENTAGE';
      default: return '';
    }
  }
}