import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy, Inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';

// Material Imports
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator, PageEvent } from '@angular/material/paginator';
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
import { MatDialog, MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatDividerModule } from '@angular/material/divider';

import { FinancialService } from '../../../../../../core/services/financial.service';
import { EmployeeService } from '../../../../../../core/services/employee.service';
import { NotificationService } from '../../../../../../core/services/notification.service';
import { ReportService } from '../../../../../../core/services/report.service';
import { SearchableSelectComponent, SelectOption } from '../../../../../../shared/components/searchable-select/searchable-select.component';
import { SALARY_TRANSACTION_TYPES } from '../../../../../../core/models/financial.model';
import { SALARY_TYPES } from '../../../../../../core/models/common.model';
import { SalaryIncentiveVTO, SalaryIncentiveResultSet } from '../../../../../../core/models/financial.model';
import { EmployeeLookupVTO } from '../../../../../../core/models/employee.model';
import { SalaryIncentiveWizardModalComponent } from '../salary-incentive-wizard/salary-incentive-wizard-modal.component.ts';
import { ConstantService } from '../../../../../../core/services/constant.service';

// ============================================================================
// PRINT DIALOG COMPONENT
// ============================================================================

@Component({
  selector: 'app-print-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatRadioModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatDividerModule
  ],
  template: `
    <h2 mat-dialog-title class="print-dialog-title">
      <mat-icon>print</mat-icon>
      خيارات الطباعة
    </h2>
    <mat-dialog-content class="print-dialog-content">
      <div class="print-info">
        <p><strong>عدد السجلات الكلي:</strong> {{ data.totalRecords }} معاملة</p>
        <p><strong>عدد الصفحات:</strong> {{ data.totalPages }} صفحة</p>
        <p><strong>السجلات لكل صفحة:</strong> {{ data.pageSize }}</p>
      </div>

      <mat-divider></mat-divider>

      <div class="print-options">
        <h3>اختر نطاق الطباعة:</h3>
        
        <mat-radio-group [(ngModel)]="selectedOption" class="print-radio-group">
          <mat-radio-button value="all">
            <mat-icon>description</mat-icon>
            طباعة الكل ({{ data.totalRecords }} سجل)
          </mat-radio-button>
          <mat-radio-button value="current">
            <mat-icon>article</mat-icon>
            طباعة الصفحة الحالية ({{ getCurrentPageRecords() }} سجل)
          </mat-radio-button>
          <mat-radio-button value="range">
            <mat-icon>format_list_numbered</mat-icon>
            طباعة نطاق صفحات
          </mat-radio-button>
        </mat-radio-group>

        <div class="page-range-input" *ngIf="selectedOption === 'range'">
          <mat-form-field appearance="outline" class="range-field">
            <mat-label>من صفحة</mat-label>
            <input matInput type="number" [(ngModel)]="rangeFrom" [min]="1" [max]="data.totalPages">
          </mat-form-field>
          <span class="range-separator">إلى</span>
          <mat-form-field appearance="outline" class="range-field">
            <mat-label>إلى صفحة</mat-label>
            <input matInput type="number" [(ngModel)]="rangeTo" [min]="1" [max]="data.totalPages">
          </mat-form-field>
        </div>
      </div>
    </mat-dialog-content>
    <mat-dialog-actions align="end" class="print-dialog-actions">
      <button mat-button (click)="dialogRef.close()">إلغاء</button>
      <button mat-raised-button color="primary" (click)="confirmPrint()" [disabled]="!isValidSelection()">
        <mat-icon>print</mat-icon>
        طباعة
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .print-dialog-title {
      display: flex;
      align-items: center;
      gap: 12px;
      color: #10b981;
      font-size: 22px;
      margin: 0;
    }
    .print-dialog-title mat-icon {
      font-size: 28px;
      width: 28px;
      height: 28px;
    }
    .print-dialog-content {
      min-width: 400px;
      max-width: 500px;
      padding: 20px 0;
    }
    .print-info {
      padding: 16px;
      background: #f8fafc;
      border-radius: 12px;
      margin-bottom: 16px;
    }
    .print-info p {
      margin: 4px 0;
      font-size: 14px;
      color: #475569;
    }
    .print-info p strong {
      color: #1e293b;
    }
    .print-options {
      margin-top: 16px;
    }
    .print-options h3 {
      font-size: 16px;
      color: #1e293b;
      margin-bottom: 16px;
    }
    .print-radio-group {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .print-radio-group mat-radio-button {
      margin: 4px 0;
    }
    .print-radio-group mat-radio-button mat-icon {
      margin-right: 8px;
      font-size: 18px;
      width: 18px;
      height: 18px;
      vertical-align: middle;
      color: #64748b;
    }
    .page-range-input {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-top: 16px;
      padding: 16px;
      background: #f8fafc;
      border-radius: 12px;
    }
    .range-field {
      flex: 1;
    }
    .range-separator {
      font-weight: 500;
      color: #64748b;
      padding: 0 4px;
    }
    .print-dialog-actions {
      padding: 16px 0 0 0;
      gap: 12px;
    }
    @media (max-width: 600px) {
      .print-dialog-content {
        min-width: unset;
        max-width: 100%;
      }
      .page-range-input {
        flex-direction: column;
        gap: 8px;
      }
      .range-field {
        width: 100%;
      }
      .range-separator {
        padding: 4px 0;
      }
    }
  `]
})
export class PrintDialogComponent {
  selectedOption: 'all' | 'current' | 'range' = 'all';
  rangeFrom: number = 1;
  rangeTo: number = 1;

  constructor(
    public dialogRef: MatDialogRef<PrintDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { totalRecords: number; totalPages: number; pageSize: number; currentPage: number }
  ) {
    this.rangeTo = Math.min(data.totalPages, 1);
  }

  getCurrentPageRecords(): number {
    const remaining = this.data.totalRecords - (this.data.currentPage * this.data.pageSize);
    return remaining > 0 ? this.data.pageSize : this.data.pageSize + remaining;
  }

  isValidSelection(): boolean {
    if (this.selectedOption === 'all') return true;
    if (this.selectedOption === 'current') return true;
    if (this.selectedOption === 'range') {
      return this.rangeFrom >= 1 && 
             this.rangeTo <= this.data.totalPages && 
             this.rangeFrom <= this.rangeTo;
    }
    return false;
  }

  confirmPrint(): void {
    let startPage = 0;
    let endPage = 0;

    switch (this.selectedOption) {
      case 'all':
        startPage = 0;
        endPage = this.data.totalPages - 1;
        break;
      case 'current':
        startPage = this.data.currentPage;
        endPage = this.data.currentPage;
        break;
      case 'range':
        startPage = this.rangeFrom - 1;
        endPage = this.rangeTo - 1;
        break;
    }

    this.dialogRef.close({ startPage, endPage });
  }
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

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
    MatCheckboxModule,
    MatRadioModule,
    MatDividerModule,
    SearchableSelectComponent
  ],
  templateUrl: './salary-incentive-list.component.html',
  styleUrls: ['./salary-incentive-list.component.css']
})
export class SalaryIncentiveListComponent implements OnInit, AfterViewInit, OnDestroy {
  
  Math = Math;
  
  // ==========================================================================
  // TABLE CONFIGURATION
  // ==========================================================================

  displayedColumns: string[] = ['index', 'employee', 'nationalId', 'salary', 'remainedSalary', 'transactionType', 'amount', 'withdrawDate', 'paymentMethod', 'salaryType', 'actions'];
  dataSource = new MatTableDataSource<SalaryIncentiveVTO>([]);
  allTransactions: SalaryIncentiveVTO[] = [];
  isLoading = false;
  isPrinting = false;
  transactionTypes = SALARY_TRANSACTION_TYPES;
  salaryTypes = SALARY_TYPES;
  
  // ==========================================================================
  // DATA COLLECTIONS
  // ==========================================================================

  employees: EmployeeLookupVTO[] = [];
  paymentMethods: any[] = [];
  
  // ==========================================================================
  // PAGINATION
  // ==========================================================================

  totalRecords = 0;
  currentPage = 0;
  pageSize = 25;
  pageSizeOptions = [5, 10, 25, 50, 100];
  
  // ==========================================================================
  // SORTING
  // ==========================================================================

  sortBy: string = 'CREATION_DATE';
  sortDir: string = 'DESC';
  
  // ==========================================================================
  // FILTER CRITERIA
  // ==========================================================================

  filterDates = {
    withdrawDateFrom: null as Date | null,
    withdrawDateTo: null as Date | null
  };
  
  filters = {
    employeeId: null as number | null,
    employeeNationalId: null as string | null,
    type: null as string | null,
    paymentMethodId: null as number | null,
    salaryType: null as string | null,
    withdrawDateFrom: null as string | null,
    withdrawDateTo: null as string | null
  };
  
  quickSearch: string = '';
  barcodeSearch: string = '';
  isBarcodeMode: boolean = false;
  
  // ==========================================================================
  // OPTIONS FOR SEARCHABLE SELECTS
  // ==========================================================================

  employeeOptions: SelectOption[] = [];
  transactionTypeOptions: SelectOption[] = [];
  paymentMethodOptions: SelectOption[] = [];
  salaryTypeOptions: SelectOption[] = [];
  
  // ==========================================================================
  // SUBJECTS
  // ==========================================================================

  private searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();

  // ==========================================================================
  // VIEW CHILDREN
  // ==========================================================================

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  // ==========================================================================
  // STATISTICS - COMPUTED PROPERTIES
  // ==========================================================================

  get totalAmount(): number {
    return this.allTransactions.reduce((sum, item) => sum + (item.amountWithdrawn || 0), 0);
  }

  get salaryTotal(): number {
    return this.allTransactions
      .filter(item => item.salaryTransactionType?.id === 1)
      .reduce((sum, item) => sum + (item.amountWithdrawn || 0), 0);
  }

  get incentiveTotal(): number {
    return this.allTransactions
      .filter(item => item.salaryTransactionType?.id === 2)
      .reduce((sum, item) => sum + (item.amountWithdrawn || 0), 0);
  }

  get bonusTotal(): number {
    return this.allTransactions
      .filter(item => item.salaryTransactionType?.id === 3)
      .reduce((sum, item) => sum + (item.amountWithdrawn || 0), 0);
  }

  get advanceTotal(): number {
    return this.allTransactions
      .filter(item => item.salaryTransactionType?.id === 4)
      .reduce((sum, item) => sum + (item.amountWithdrawn || 0), 0);
  }

  get totalPages(): number {
    return Math.ceil(this.totalRecords / this.pageSize);
  }

  // ==========================================================================
  // CONSTRUCTOR
  // ==========================================================================

  constructor(
    private financialService: FinancialService,
    private employeeService: EmployeeService,
    private notification: NotificationService,
    private reportService: ReportService,
    private router: Router,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef,
    private constantService: ConstantService
  ) {}

  // ==========================================================================
  // LIFECYCLE HOOKS
  // ==========================================================================

  ngOnInit() {
    this.loadSelectOptions();
    this.loadLookupData();
    this.loadData();
    this.setupSearchDebounce();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ==========================================================================
  // GET TOTAL PAGES
  // ==========================================================================

  getTotalPages(): number {
    return Math.ceil(this.totalRecords / this.pageSize);
  }

  // ==========================================================================
  // PAGINATION METHODS
  // ==========================================================================

  goToFirstPage(): void {
    if (this.currentPage !== 0) {
      this.currentPage = 0;
      this.loadData();
    }
  }

  goToPreviousPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.loadData();
    }
  }

  goToNextPage(): void {
    this.currentPage++;
    this.loadData();
  }

  goToLastPage(): void {
    const totalPages = this.getTotalPages();
    if (this.currentPage !== totalPages - 1 && totalPages > 0) {
      this.currentPage = totalPages - 1;
      this.loadData();
    }
  }

  onPageSizeChange(): void {
    this.currentPage = 0;
    this.loadData();
  }

  onPageEvent(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadData();
  }

  // ==========================================================================
  // INITIALIZATION METHODS
  // ==========================================================================

  private setupSearchDebounce(): void {
    this.searchSubject
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.currentPage = 0;
        this.loadData();
      });
  }

  loadSelectOptions(): void {
    this.transactionTypeOptions = [
      { value: null, label: 'الكل' },
      { value: 'SALARY', label: 'راتب' },
      { value: 'INCENTIVE', label: 'حافز' },
      { value: 'BONUS', label: 'مكافأة' },
      { value: 'ADVANCE', label: 'سلفة' }
    ];
    
    this.salaryTypeOptions = [
      { value: null, label: 'الكل' },
      { value: 'MONTHLY', label: 'شهري' },
      { value: 'HOURLY', label: 'بالساعة' },
      { value: 'DAILY', label: 'يومي' },
      { value: 'PERCENTAGE', label: 'نسبة' }
    ];
  }

  loadLookupData() {
    this.employeeService.getAllEmployeesLookup()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: EmployeeLookupVTO[]) => { 
          this.employees = res || [];
          this.employeeOptions = [
            { value: null, label: 'الكل' },
            ...this.employees.map(e => ({ 
              value: e.id, 
              label: `${e.fullName} - (الراتب المتبقي: ${e.remainedSalary || 0} جم)`
            }))
          ];
        },
        error: () => { 
          this.notification.showError('حدث خطأ في تحميل الموظفين'); 
        }
      });

    this.financialService.getAllPaymentMethodsLookup()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
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

  // ==========================================================================
  // HELPER METHODS
  // ==========================================================================

  private formatDateForBackend(date: Date | null): string | null {
    if (!date) return null;
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private updateFilterDates(): void {
    this.filters.withdrawDateFrom = this.formatDateForBackend(this.filterDates.withdrawDateFrom);
    this.filters.withdrawDateTo = this.formatDateForBackend(this.filterDates.withdrawDateTo);
  }

  // ==========================================================================
  // DATE CHANGE HANDLERS
  // ==========================================================================

  onDateFromChange(): void {
    this.currentPage = 0;
    this.loadData();
  }

  onDateToChange(): void {
    this.currentPage = 0;
    this.loadData();
  }

  // ==========================================================================
  // LOAD DATA WITH PAGINATION
  // ==========================================================================

  loadData() {
    this.isLoading = true;
    
    this.updateFilterDates();
    
    const params: any = {
      pageNum: this.currentPage,
      pageSize: this.pageSize
    };
    
    if (this.filters.employeeId) params.employeeId = this.filters.employeeId;
    if (this.filters.employeeNationalId) params.employeeNationalId = this.filters.employeeNationalId;
    if (this.filters.type) params.type = this.filters.type;
    if (this.filters.paymentMethodId) params.paymentMethodId = this.filters.paymentMethodId;
    if (this.filters.salaryType) params.salaryType = this.filters.salaryType;
    if (this.filters.withdrawDateFrom) params.withdrawDateFrom = this.filters.withdrawDateFrom;
    if (this.filters.withdrawDateTo) params.withdrawDateTo = this.filters.withdrawDateTo;
    if (this.quickSearch) params.quickSearch = this.quickSearch;
    
    if (this.sortBy) params.orderBy = this.sortBy;
    if (this.sortDir) params.orderDir = this.sortDir;

    this.financialService.getAllSalaryIncentivesByFilter(params)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: SalaryIncentiveResultSet) => {
          this.allTransactions = res.items || [];
          this.totalRecords = res.total || 0;
          this.dataSource.data = this.allTransactions;
          this.isLoading = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Error loading data:', err);
          this.notification.showError('حدث خطأ في تحميل البيانات');
          this.isLoading = false;
          this.cdr.detectChanges();
        }
      });
  }

  // ==========================================================================
  // FILTER METHODS
  // ==========================================================================

  applyQuickSearch(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.quickSearch = value;
    this.searchSubject.next(value);
  }

  applyBarcodeSearch(): void {
    if (!this.barcodeSearch?.trim()) {
      this.notification.showWarning('الرجاء إدخال رقم الباركود');
      return;
    }

    this.filters.employeeNationalId = this.barcodeSearch.trim();
    this.currentPage = 0;
    this.loadData();
    this.notification.showSuccess('تم تطبيق البحث بالباركود');
  }

  clearBarcodeSearch(): void {
    this.barcodeSearch = '';
    this.filters.employeeNationalId = null;
    this.currentPage = 0;
    this.loadData();
  }

  toggleBarcodeMode(): void {
    this.isBarcodeMode = !this.isBarcodeMode;
    if (!this.isBarcodeMode) {
      this.barcodeSearch = '';
      this.filters.employeeNationalId = null;
      this.currentPage = 0;
      this.loadData();
    }
  }

  resetFilters() {
    this.filters = {
      employeeId: null,
      employeeNationalId: null,
      type: null,
      paymentMethodId: null,
      salaryType: null,
      withdrawDateFrom: null,
      withdrawDateTo: null
    };
    this.filterDates = {
      withdrawDateFrom: null,
      withdrawDateTo: null
    };
    this.quickSearch = '';
    this.barcodeSearch = '';
    this.isBarcodeMode = false;
    this.currentPage = 0;
    this.loadData();
    this.notification.showSuccess('تم مسح جميع الفلاتر');
  }

  hasActiveFilters(): boolean {
    return !!(this.filters.employeeId || 
              this.filters.employeeNationalId || 
              this.filters.type || 
              this.filters.paymentMethodId || 
              this.filters.salaryType || 
              this.filters.withdrawDateFrom || 
              this.filters.withdrawDateTo || 
              this.quickSearch);
  }

  getActiveFiltersCount(): number {
    let count = 0;
    if (this.filters.employeeId) count++;
    if (this.filters.employeeNationalId) count++;
    if (this.filters.type) count++;
    if (this.filters.paymentMethodId) count++;
    if (this.filters.salaryType) count++;
    if (this.filters.withdrawDateFrom) count++;
    if (this.filters.withdrawDateTo) count++;
    if (this.quickSearch) count++;
    return count;
  }

  // ==========================================================================
  // TRANSACTION OPERATIONS
  // ==========================================================================

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
    this.financialService.getSalaryIncentiveById(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (transaction) => {
          this.openDetailsModal(transaction);
        },
        error: () => {
          this.notification.showError('حدث خطأ في تحميل بيانات المعاملة');
        }
      });
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

  deleteTransaction(item: SalaryIncentiveVTO) {
    const typeName = item.salaryTransactionType?.title || 'المعاملة';
    if (confirm(`هل أنت متأكد من حذف ${typeName} للموظف "${item.employee?.fullName}"؟`)) {
      this.isLoading = true;
      this.financialService.deleteSalaryIncentive(item.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.notification.showSuccess('تم الحذف بنجاح');
            this.loadData();
          },
          error: () => {
            this.notification.showError('حدث خطأ في الحذف');
            this.isLoading = false;
          }
        });
    }
  }

  // ==========================================================================
  // DETAILS MODAL
  // ==========================================================================

openDetailsModal(transaction: SalaryIncentiveVTO): void {
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
  modalContent.style.padding = '20px';
  
  const today = new Date().toLocaleDateString('ar-EG');
  const transactionNumber = `TRX-${transaction.id}`;
  
  const getTransactionTypeStyle = (typeId: number) => {
    switch(typeId) {
      case 1: return 'background: #dbeafe; color: #1e40af;';
      case 2: return 'background: #d1fae5; color: #065f46;';
      case 3: return 'background: #fef3c7; color: #92400e;';
      case 4: return 'background: #fee2e2; color: #991b1b;';
      default: return 'background: #f3f4f6; color: #374151;';
    }
  };
  
  modalContent.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; padding-bottom: 15px; border-bottom: 2px solid #e5e7eb;">
      <h2 style="margin: 0; color: #10b981; font-size: 20px;">تفاصيل المعاملة</h2>
      <div style="display: flex; gap: 8px; align-items: center;">
        <button id="printDetailsBtn" style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; border: none; border-radius: 8px; padding: 8px 16px; cursor: pointer; font-size: 13px; display: flex; align-items: center; gap: 6px;">
          <span style="font-size: 18px;">🖨️</span> طباعة
        </button>
        <button id="closeModalBtn" style="background: none; border: none; font-size: 24px; cursor: pointer; color: #6b7280;">&times;</button>
      </div>
    </div>
    
    <div style="text-align: center; margin-bottom: 20px; padding: 15px; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; border-radius: 10px;">
      <h1 style="margin: 0; font-size: 18px;">إيصال صرف</h1>
      <p style="margin: 5px 0 0 0; font-size: 11px; opacity: 0.9;">نظام إدارة  الأكاديمية الأولمبية لعلوم الرياضة</p>
    </div>
    
    <div style="display: flex; justify-content: space-between; margin-bottom: 15px; padding: 8px 12px; background: #f9fafb; border-radius: 8px; font-size: 12px;">
      <div><strong>رقم الإيصال:</strong> ${transactionNumber}</div>
      <div><strong>تاريخ الإصدار:</strong> ${today}</div>
    </div>
    
    <h3 style="color: #10b981; border-bottom: 2px solid #10b981; padding-bottom: 5px; margin-top: 15px; margin-bottom: 10px; font-size: 16px;">👤 معلومات الموظف</h3>
    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin-bottom: 10px;">
      <div><div style="font-weight: 600; color: #374151; font-size: 11px;">الموظف</div><div style="color: #1f2937; font-size: 12px;">${transaction.employee?.fullName || '-'}</div></div>
      <div><div style="font-weight: 600; color: #374151; font-size: 11px;">الرقم القومي</div><div style="color: #1f2937; font-size: 12px;">${transaction.employee?.nationalId || '-'}</div></div>
      <div><div style="font-weight: 600; color: #374151; font-size: 11px;">الراتب الأساسي</div><div style="color: #1f2937; font-size: 12px;">${(transaction.employee?.salary || 0).toLocaleString('ar-EG')} جم</div></div>
      <div><div style="font-weight: 600; color: #374151; font-size: 11px;">الراتب المتبقي</div><div style="color: ${(transaction.employee?.remainedSalary || 0) < (transaction.employee?.salary || 0) ? '#d97706' : '#1f2937'}; font-size: 12px; font-weight: 500;">${(transaction.employee?.remainedSalary || 0).toLocaleString('ar-EG')} جم</div></div>
      <div><div style="font-weight: 600; color: #374151; font-size: 11px;">نوع الراتب</div><div style="color: #1f2937; font-size: 12px;">${transaction.employee?.salaryType?.title || '-'}</div></div>
    </div>
    
    <h3 style="color: #10b981; border-bottom: 2px solid #10b981; padding-bottom: 5px; margin-top: 15px; margin-bottom: 10px; font-size: 16px;">💰 تفاصيل المعاملة</h3>
    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin-bottom: 10px;">
      <div><div style="font-weight: 600; color: #374151; font-size: 11px;">نوع المعاملة</div><div style="padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 500; ${getTransactionTypeStyle(transaction.salaryTransactionType?.id)}">${transaction.salaryTransactionType?.title || '-'}</div></div>
      <div><div style="font-weight: 600; color: #374151; font-size: 11px;">المبلغ</div><div style="color: #dc2626; font-size: 16px; font-weight: 700;">${(transaction.amountWithdrawn || 0).toLocaleString('ar-EG')} جم</div></div>
      <div><div style="font-weight: 600; color: #374151; font-size: 11px;">تاريخ الصرف</div><div style="color: #1f2937; font-size: 12px;">${transaction.withdrawDate ? new Date(transaction.withdrawDate).toLocaleDateString('ar-EG') : '-'}</div></div>
      <div><div style="font-weight: 600; color: #374151; font-size: 11px;">طريقة الدفع</div><div style="color: #1f2937; font-size: 12px;">${transaction.paymentMethod?.title || '-'}</div></div>
      <div><div style="font-weight: 600; color: #374151; font-size: 11px;">نوع الراتب</div><div style="color: #1f2937; font-size: 12px;">${transaction.salaryType?.title || '-'}</div></div>
    </div>
    
    ${transaction.note ? `
    <h3 style="color: #10b981; border-bottom: 2px solid #10b981; padding-bottom: 5px; margin-top: 15px; margin-bottom: 10px; font-size: 16px;">📝 ملاحظات</h3>
    <div style="padding: 10px; background: #f9fafb; border-radius: 8px; margin-bottom: 15px;">${transaction.note}</div>
    ` : ''}
    
    <div style="margin-top: 20px; display: flex; justify-content: center; gap: 12px;">
      <button id="printBtnBottom" style="padding: 10px 24px; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 14px; display: flex; align-items: center; gap: 8px;">
        <span style="font-size: 18px;">🖨️</span> طباعة الإيصال
      </button>
      <button id="closeModalBtn2" style="padding: 10px 24px; background: #f3f4f6; color: #374151; border: none; border-radius: 8px; cursor: pointer; font-size: 14px;">إغلاق</button>
    </div>
  `;
  
  modalContainer.appendChild(modalContent);
  document.body.appendChild(modalContainer);
  
  const closeModal = () => {
    document.body.removeChild(modalContainer);
  };
  
  // Print function that fetches contact number from API
  const printReceipt = () => {
    // Show loading indicator on button
    const printBtn = modalContent.querySelector('#printDetailsBtn') as HTMLElement;
    const printBtnBottom = modalContent.querySelector('#printBtnBottom') as HTMLElement;
    const originalText = printBtn?.innerHTML || '';
    const originalTextBottom = printBtnBottom?.innerHTML || '';
    
    if (printBtn) {
      printBtn.innerHTML = '<span style="display: inline-block; animation: spin 1s linear infinite;">⏳</span> جاري التحميل...';
      printBtn.style.opacity = '0.7';
      printBtn.style.pointerEvents = 'none';
    }
    if (printBtnBottom) {
      printBtnBottom.innerHTML = '<span style="display: inline-block; animation: spin 1s linear infinite;">⏳</span> جاري التحميل...';
      printBtnBottom.style.opacity = '0.7';
      printBtnBottom.style.pointerEvents = 'none';
    }
    
    // Fetch contact number from constant service (id = 1)
    this.constantService.getConstantById(1).subscribe({
      next: (constant) => {
        const contactNumber = constant?.value || '01069911181'; // Fallback number
        this.printSalaryReceipt(transaction, contactNumber);
        
        // Reset buttons
        if (printBtn) {
          printBtn.innerHTML = originalText;
          printBtn.style.opacity = '1';
          printBtn.style.pointerEvents = 'auto';
        }
        if (printBtnBottom) {
          printBtnBottom.innerHTML = originalTextBottom;
          printBtnBottom.style.opacity = '1';
          printBtnBottom.style.pointerEvents = 'auto';
        }
      },
      error: () => {
        // If error, use fallback number
        this.printSalaryReceipt(transaction, '01069911181');
        
        // Reset buttons
        if (printBtn) {
          printBtn.innerHTML = originalText;
          printBtn.style.opacity = '1';
          printBtn.style.pointerEvents = 'auto';
        }
        if (printBtnBottom) {
          printBtnBottom.innerHTML = originalTextBottom;
          printBtnBottom.style.opacity = '1';
          printBtnBottom.style.pointerEvents = 'auto';
        }
      }
    });
  };
  
  // Add spin animation
  const styleElement = document.createElement('style');
  styleElement.textContent = `
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
  `;
  document.head.appendChild(styleElement);
  
  modalContent.querySelector('#printDetailsBtn')?.addEventListener('click', printReceipt);
  modalContent.querySelector('#printBtnBottom')?.addEventListener('click', printReceipt);
  modalContent.querySelector('#closeModalBtn')?.addEventListener('click', closeModal);
  modalContent.querySelector('#closeModalBtn2')?.addEventListener('click', closeModal);
  modalContainer.addEventListener('click', (e) => {
    if (e.target === modalContainer) {
      closeModal();
    }
  });
}

// ==========================================================================
// PRINT SALARY RECEIPT
// ==========================================================================

private printSalaryReceipt(transaction: SalaryIncentiveVTO, contactNumber: string): void {
  const today = new Date().toLocaleDateString('ar-EG');
  const transactionNumber = `TRX-${transaction.id}`;
  const logoPath = 'assets/images/mainLogo.jpeg';
  const academyName = ' الأكاديمية الأولمبية لعلوم الرياضة';
  const currentYear = new Date().getFullYear();
  
  const getTypeColor = (typeId: number) => {
    switch(typeId) {
      case 1: return '#1e40af';
      case 2: return '#065f46';
      case 3: return '#92400e';
      case 4: return '#991b1b';
      default: return '#374151';
    }
  };
  
  const getTypeBg = (typeId: number) => {
    switch(typeId) {
      case 1: return '#dbeafe';
      case 2: return '#d1fae5';
      case 3: return '#fef3c7';
      case 4: return '#fee2e2';
      default: return '#f3f4f6';
    }
  };
  
  const printWindow = window.open('', '_blank', 'width=400,height=600,scrollbars=no,menubar=no,toolbar=no,status=no');
  if (!printWindow) {
    this.notification.showError('تعذر فتح نافذة الطباعة');
    return;
  }
  
  const e = transaction;
  const typeId = e.salaryTransactionType?.id || 0;
  const typeTitle = e.salaryTransactionType?.title || '-';
  const typeColor = getTypeColor(typeId);
  const typeBg = getTypeBg(typeId);
  
  printWindow.document.write(`
    <!DOCTYPE html>
    <html dir="rtl">
    <head>
      <meta charset="UTF-8">
      <title>إيصال صرف - ${typeTitle}</title>
      <style>
        @page { 
          size: 58mm auto; 
          margin: 0mm; 
        }
        
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        html, body { 
          margin: 0;
          padding: 0;
          background: white;
          width: 58mm;
          min-width: 58mm;
          max-width: 58mm;
          display: flex;
          justify-content: flex-start;
          align-items: flex-start;
          min-height: 100vh;
        }
        
        .thermal-card { 
          width: 100%;
          max-width: 58mm;
          margin: 0;
          padding: 1.5mm 2mm 2mm 2mm;
          background: white;
          position: relative;
          overflow: hidden;
          direction: rtl;
          border: 0.5px solid #e5e7eb;
          border-radius: 4px;
        }
        
        /* Watermark */
        .watermark-wrapper {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 55%;
          height: 55%;
          pointer-events: none;
          z-index: 0;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .watermark-container {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 100%;
          opacity: 0.06;
          transform: rotate(-25deg);
        }
        
        .watermark-container img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          filter: grayscale(0%) sepia(20%) saturate(150%) hue-rotate(220deg);
        }
        
        .watermark-text {
          position: absolute;
          top: 58%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(-25deg);
          font-size: 16px;
          font-weight: 900;
          color: #0f3460;
          letter-spacing: 4px;
          text-transform: uppercase;
          white-space: nowrap;
          opacity: 0.04;
          pointer-events: none;
          z-index: 0;
        }
        
        .card-content {
          position: relative;
          z-index: 1;
        }
        
        /* Logo Section */
        .card-logo-section {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 4px 0;
          margin-bottom: 4px;
          border-bottom: 2px solid #0f3460;
        }
        
        .card-logo-image {
          width: 36px;
          height: 36px;
          object-fit: contain;
          border-radius: 6px;
          flex-shrink: 0;
          background: white;
          padding: 2px;
        }
        
        .card-logo-text {
          display: flex;
          flex-direction: column;
          flex: 1;
        }
        
        .card-logo-text .academy-name {
          font-size: 11px;
          font-weight: 700;
          color: #0f3460;
          line-height: 1.2;
        }
        
        .card-logo-text .card-title {
          font-size: 7px;
          color: #64748b;
          font-weight: 500;
        }
        
        .thermal-divider { 
          border-top: 1px dashed #d1d5db; 
          margin: 0.5mm 0; 
        }
        
        .thermal-title-section {
          text-align: center;
          margin: 0.5mm 0;
        }
        .thermal-title-section .receipt-title {
          font-size: 12px;
          font-weight: 700;
          color: #0f3460;
        }
        .thermal-title-section .receipt-subtitle {
          font-size: 7px;
          color: #6b7280;
        }
        
        .thermal-transaction-id {
          display: flex;
          justify-content: space-between;
          font-size: 6px;
          color: #6b7280;
          padding: 0.3mm 0;
          margin-bottom: 0.3mm;
        }
        .thermal-transaction-id strong {
          color: #1e293b;
        }
        
        .thermal-employee-info {
          background: #f8fafc;
          border-radius: 4px;
          padding: 0.5mm 1.5mm;
          margin: 0.3mm 0;
        }
        .thermal-employee-info .employee-name {
          font-size: 10px;
          font-weight: 700;
          color: #1a1a2e;
          text-align: center;
        }
        .thermal-employee-info .employee-details {
          display: flex;
          justify-content: space-between;
          font-size: 6px;
          color: #6b7280;
          margin-top: 0.2mm;
        }
        
        .thermal-table { 
          width: 100%; 
          font-size: 6.5px; 
          margin-bottom: 0.5mm; 
          border-collapse: collapse; 
        }
        .thermal-table tr { 
          line-height: 1.3; 
        }
        .thermal-label { 
          text-align: right; 
          padding: 0.2mm 0.5mm; 
          color: #6b7280; 
          width: 40%;
          font-weight: 500;
          font-size: 6px;
        }
        .thermal-value { 
          text-align: left; 
          padding: 0.2mm 0.5mm; 
          font-weight: 600; 
          width: 60%;
          color: #1e293b;
          font-size: 6px;
        }
        .thermal-value.amount { 
          color: #dc2626; 
          font-weight: 700; 
          font-size: 12px;
        }
        .thermal-value.type-badge {
          display: inline-block;
          padding: 0.2mm 2mm;
          border-radius: 12px;
          font-size: 6px;
          font-weight: 600;
          background: ${typeBg};
          color: ${typeColor};
        }
        
        .thermal-amount-section {
          text-align: center;
          padding: 0.5mm 0;
          margin: 0.3mm 0;
          background: #fef2f2;
          border-radius: 4px;
          border: 1px solid #fecaca;
        }
        .thermal-amount-section .amount-label {
          font-size: 6px;
          color: #6b7280;
        }
        .thermal-amount-section .amount-value {
          font-size: 18px;
          font-weight: 700;
          color: #dc2626;
        }
        .thermal-amount-section .amount-currency {
          font-size: 12px;
          color: #6b7280;
        }
        
        .thermal-note {
          font-size: 6px;
          color: #6b7280;
          padding: 0.3mm 1mm;
          background: #f9fafb;
          border-radius: 4px;
          margin: 0.3mm 0;
          border-right: 2px solid #d1d5db;
        }
        .thermal-note strong {
          color: #1e293b;
        }
        
        .thermal-footer { 
          display: flex; 
          flex-direction: column;
          align-items: center;
          gap: 1mm; 
          margin-top: 0.6mm; 
          padding-top: 0.6mm;
          border-top: 2px solid #0f3460;
        }
        
        .thermal-footer .footer-row {
          display: flex;
          justify-content: space-between;
          width: 100%;
          gap: 1.5mm;
        }
        
        .thermal-signature { 
          flex: 1; 
          text-align: center; 
          font-size: 4.5px; 
          color: #94a3b8;
        }
        .thermal-line { 
          border-top: 0.5px solid #94a3b8; 
          margin-bottom: 0.2mm; 
          padding-top: 2mm; 
        }
        
        .thermal-contact {
          text-align: center;
          font-size: 6px;
          color: #0f3460;
          font-weight: 600;
          margin-top: 0.3mm;
          padding-top: 0.3mm;
          border-top: 1px solid #e5e7eb;
          width: 100%;
        }
        .thermal-contact .contact-label {
          color: #6b7280;
          font-weight: 500;
        }
        .thermal-contact .contact-number {
          color: #0f3460;
          font-weight: 700;
          letter-spacing: 0.5px;
        }
        
        .thermal-issue-date {
          text-align: center;
          font-size: 5px;
          color: #94a3b8;
          margin-top: 0.3mm;
          padding-top: 0.3mm;
          border-top: 1px dashed #e5e7eb;
        }
        
        .powered-by {
          text-align: left;
          font-size: 4px;
          color: #94a3b8;
          margin-top: 0.5mm;
          padding-top: 0.3mm;
          border-top: 1px solid #f1f5f9;
          letter-spacing: 0.3px;
          direction: ltr;
        }
        .powered-by .company-name {
          color: #8b5cf6;
          font-weight: 700;
          font-size: 4.5px;
        }
        .powered-by .separator {
          color: #e5e7eb;
          margin: 0 2px;
        }
        
        @media print {
          html, body {
            width: 58mm !important;
            min-width: 58mm !important;
            max-width: 58mm !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          .thermal-card {
            padding: 1mm 1.5mm 1.5mm 1.5mm;
            border: none !important;
            box-shadow: none !important;
          }
          .watermark-container {
            opacity: 0.08 !important;
          }
          .watermark-container img {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .watermark-text {
            opacity: 0.05 !important;
          }
          .card-logo-image {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .thermal-amount-section {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .thermal-employee-info {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        }
      </style>
    </head>
    <body>
      <div class="thermal-card">
        <!-- Watermark -->
        <div class="watermark-wrapper">
          <div class="watermark-container">
            <img src="${logoPath}" alt="${academyName}" onerror="this.style.display='none'">
          </div>
          <div class="watermark-text">${academyName}</div>
        </div>
        
        <!-- Content -->
        <div class="card-content">
          <!-- Logo -->
          <div class="card-logo-section">
            <img src="${logoPath}" alt="${academyName}" class="card-logo-image" onerror="this.style.display='none'">
            <div class="card-logo-text">
              <span class="academy-name">${academyName}</span>
              <span class="card-title">إيصال صرف</span>
            </div>
          </div>
          
          <!-- Title -->
          <div class="thermal-title-section">
            <div class="receipt-title">${typeTitle}</div>
            <div class="receipt-subtitle">إيصال صرف معاملة</div>
          </div>
          
          <!-- Transaction ID -->
          <div class="thermal-transaction-id">
            <span><strong>رقم الإيصال:</strong> ${transactionNumber}</span>
            <span><strong>التاريخ:</strong> ${today}</span>
          </div>
          
          <div class="thermal-divider"></div>
          
          <!-- Employee Info -->
          <div class="thermal-employee-info">
            <div class="employee-name">${e.employee?.fullName || '-'}</div>
            <div class="employee-details">
              <span>الرقم القومي: ${e.employee?.nationalId || '-'}</span>
              <span>الراتب الأساسي: ${(e.employee?.salary || 0).toLocaleString('ar-EG')} جم</span>
              <span>الراتب المتبقي: ${(e.employee?.remainedSalary || 0).toLocaleString('ar-EG')} جم</span>
            </div>
          </div>
          
          <div class="thermal-divider"></div>
          
          <!-- Transaction Details -->
          <table class="thermal-table">
            <tr>
              <td class="thermal-label">نوع المعاملة</td>
              <td class="thermal-value"><span class="type-badge">${typeTitle}</span></td>
            </tr>
            <tr>
              <td class="thermal-label">طريقة الدفع</td>
              <td class="thermal-value">${e.paymentMethod?.title || '-'}</td>
            </tr>
            <tr>
              <td class="thermal-label">نوع الراتب</td>
              <td class="thermal-value">${e.salaryType?.title || '-'}</td>
            </tr>
            <tr>
              <td class="thermal-label">تاريخ الصرف</td>
              <td class="thermal-value">${e.withdrawDate ? new Date(e.withdrawDate).toLocaleDateString('ar-EG') : '-'}</td>
            </tr>
          </table>
          
          <div class="thermal-divider"></div>
          
          <!-- Amount -->
          <div class="thermal-amount-section">
            <div class="amount-label">المبلغ المصروف</div>
            <div class="amount-value">${(e.amountWithdrawn || 0).toLocaleString('ar-EG')} <span class="amount-currency">جم</span></div>
          </div>
          
          ${e.note ? `
          <div class="thermal-note">
            <strong>📝 ملاحظة:</strong> ${e.note}
          </div>
          ` : ''}
          
          <div class="thermal-divider"></div>
          
          <!-- Footer -->
          <div class="thermal-footer">
            <div class="footer-row">
              <div class="thermal-signature">
                <div class="thermal-line"></div>
                <div>توقيع المستلم</div>
              </div>
              <div class="thermal-signature">
                <div class="thermal-line"></div>
                <div>ختم الأكاديمية</div>
              </div>
            </div>
            
            <div class="thermal-contact">
              <span class="contact-label">🏛️</span>
              <span class="contact-number">${academyName}</span>
              <span style="color: #94a3b8; margin: 0 4px;">|</span>
              <span class="contact-label">📞</span>
              <span class="contact-number">${contactNumber}</span>
            </div>
          </div>
          
          <div class="thermal-issue-date">📅 تاريخ الإصدار: ${today}</div>
          
          <div class="powered-by">
            <span class="company-name">⚡ CoreStack Solutions</span>
            <span class="separator">|</span>
            <span class="contact-number">01069911181</span>
            <span style="color: #e5e7eb;">© ${currentYear}</span>
          </div>
        </div>
      </div>
      
      <script>
        window.onload = function() { 
          setTimeout(function() { 
            window.print(); 
            setTimeout(function() { 
              window.close(); 
            }, 500); 
          }, 300); 
        };
      <\/script>
    </body>
    </html>
  `);
  printWindow.document.close();
}

  // ==========================================================================
  // HELPER METHODS - GETTERS
  // ==========================================================================

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

  getTotalTransactionsCount(): number {
    return this.totalRecords;
  }

  // ==========================================================================
  // EXPORT FUNCTIONS
  // ==========================================================================

  exportToExcel() {
    if (this.allTransactions.length === 0) {
      this.notification.showWarning('لا توجد بيانات لتصديرها');
      return;
    }

    const exportData = this.allTransactions.map((item, index) => ({
      '#': (this.currentPage * this.pageSize) + index + 1,
      'الموظف': item.employee?.fullName || '-',
      'الرقم القومي': item.employee?.nationalId || '-',
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

  // ==========================================================================
  // PRINT FUNCTIONS
  // ==========================================================================

  openPrintDialog(): void {
    if (this.totalRecords === 0) {
      this.notification.showWarning('لا توجد بيانات للطباعة');
      return;
    }

    const dialogRef = this.dialog.open(PrintDialogComponent, {
      width: '500px',
      maxWidth: '90vw',
      data: {
        totalRecords: this.totalRecords,
        totalPages: this.totalPages,
        pageSize: this.pageSize,
        currentPage: this.currentPage
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.printListWithRange(result.startPage, result.endPage);
      }
    });
  }

  private printListWithRange(startPage: number, endPage: number): void {
    this.isPrinting = true;
    
    const fetchPromises: Promise<SalaryIncentiveVTO[]>[] = [];
    
    for (let page = startPage; page <= endPage; page++) {
      const params: any = {
        pageNum: page,
        pageSize: this.pageSize
      };
      
      if (this.filters.employeeId) params.employeeId = this.filters.employeeId;
      if (this.filters.employeeNationalId) params.employeeNationalId = this.filters.employeeNationalId;
      if (this.filters.type) params.type = this.filters.type;
      if (this.filters.paymentMethodId) params.paymentMethodId = this.filters.paymentMethodId;
      if (this.filters.salaryType) params.salaryType = this.filters.salaryType;
      if (this.filters.withdrawDateFrom) params.withdrawDateFrom = this.filters.withdrawDateFrom;
      if (this.filters.withdrawDateTo) params.withdrawDateTo = this.filters.withdrawDateTo;
      if (this.quickSearch) params.quickSearch = this.quickSearch;

      fetchPromises.push(
        new Promise((resolve, reject) => {
          this.financialService.getAllSalaryIncentivesByFilter(params).subscribe({
            next: (res: SalaryIncentiveResultSet) => resolve(res.items || []),
            error: reject
          });
        })
      );
    }

    Promise.all(fetchPromises).then((results) => {
      const allData = results.flat();
      this.generatePrintContent(allData);
      this.isPrinting = false;
    }).catch((error) => {
      console.error('Error fetching data for print:', error);
      this.notification.showError('حدث خطأ في تحميل البيانات للطباعة');
      this.isPrinting = false;
    });
  }

  private generatePrintContent(data: SalaryIncentiveVTO[]): void {
    // Build filter text
    const filterTexts: string[] = [];
    if (this.filters.employeeId) {
      const employee = this.employees.find(e => e.id === this.filters.employeeId);
      if (employee) filterTexts.push(`الموظف: ${employee.fullName}`);
    }
    if (this.filters.employeeNationalId) {
      filterTexts.push(`الرقم القومي: ${this.filters.employeeNationalId}`);
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

    // Calculate totals
    const totalAmount = data.reduce((sum, item) => sum + (item.amountWithdrawn || 0), 0);
    const salaryTotal = data.filter(item => item.salaryTransactionType?.id === 1).reduce((sum, item) => sum + (item.amountWithdrawn || 0), 0);
    const incentiveTotal = data.filter(item => item.salaryTransactionType?.id === 2).reduce((sum, item) => sum + (item.amountWithdrawn || 0), 0);
    const bonusTotal = data.filter(item => item.salaryTransactionType?.id === 3).reduce((sum, item) => sum + (item.amountWithdrawn || 0), 0);
    const advanceTotal = data.filter(item => item.salaryTransactionType?.id === 4).reduce((sum, item) => sum + (item.amountWithdrawn || 0), 0);

    // Build table rows
    let tableRows = '';
    data.forEach((item: SalaryIncentiveVTO, index: number) => {
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
          <td style="text-align: center; padding: 8px; border: 1px solid #ddd;">${item.employee?.nationalId || '-'}</td>
          <td style="text-align: center; padding: 8px; border: 1px solid #ddd;">${(basicSalary).toLocaleString('ar-EG')} جم</td>
          <td style="text-align: center; padding: 8px; border: 1px solid #ddd; ${remainedWarning}">${(remainedSalary).toLocaleString('ar-EG')} جم</td>
          <td style="text-align: center; padding: 8px; border: 1px solid #ddd; ${transactionTypeStyle}">${item.salaryTransactionType?.title || '-'}</td>
          <td style="text-align: center; padding: 8px; border: 1px solid #ddd; font-weight: bold; color: #10b981;">${(item.amountWithdrawn || 0).toLocaleString('ar-EG')} جم</td>
          <td style="text-align: center; padding: 8px; border: 1px solid #ddd;">${item.withdrawDate ? new Date(item.withdrawDate).toLocaleDateString('ar-EG') : '-'}</td>
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
          @page { size: A4 landscape; margin: 10mm; }
          @media print { body { margin: 0; padding: 20px; } .no-print { display: none; } }
          .header { text-align: center; margin-bottom: 20px; padding: 20px; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; border-radius: 8px; }
          .header h1 { margin: 0; font-size: 24px; }
          .header p { margin: 10px 0 0 0; font-size: 12px; }
          .filters { margin-bottom: 20px; padding: 10px; background-color: #f3f4f6; border-radius: 8px; font-size: 12px; }
          .stats { display: grid; grid-template-columns: repeat(6, 1fr); gap: 12px; margin-bottom: 20px; padding: 16px; background: #f9fafb; border-radius: 8px; }
          .stat-item { text-align: center; }
          .stat-label { font-size: 11px; color: #6b7280; }
          .stat-value { font-size: 18px; font-weight: bold; color: #10b981; }
          table { width: 100%; border-collapse: collapse; direction: rtl; margin-top: 10px; font-size: 11px; }
          th { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 8px; border: 1px solid #2e7d32; text-align: center; font-weight: bold; }
          td { padding: 6px; border: 1px solid #ddd; }
          .footer { text-align: center; margin-top: 20px; padding: 10px; font-size: 10px; color: #666; }
          .no-print { text-align: center; margin-top: 20px; padding: 10px; }
          .print-btn { padding: 10px 20px; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 14px; }
          .print-btn:hover { opacity: 0.9; }
          @media (max-width: 768px) { .stats { grid-template-columns: repeat(3, 1fr); } table { font-size: 9px; } th, td { padding: 4px; } }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>تقرير الرواتب والحوافز</h1>
          <p>تاريخ التقرير: ${new Date().toLocaleDateString('ar-EG')}</p>
          <p>عدد السجلات: ${data.length} معاملة</p>
        </div>
        ${filterTexts.length > 0 ? `<div class="filters"><strong>الفلاتر المطبقة:</strong> ${filterTexts.join(' | ')}</div>` : ''}
        <div class="stats">
          <div class="stat-item"><div class="stat-value">${data.length}</div><div class="stat-label">عدد المعاملات</div></div>
          <div class="stat-item"><div class="stat-value">${salaryTotal.toLocaleString('ar-EG')} جم</div><div class="stat-label">رواتب</div></div>
          <div class="stat-item"><div class="stat-value">${incentiveTotal.toLocaleString('ar-EG')} جم</div><div class="stat-label">حوافز</div></div>
          <div class="stat-item"><div class="stat-value">${bonusTotal.toLocaleString('ar-EG')} جم</div><div class="stat-label">مكافآت</div></div>
          <div class="stat-item"><div class="stat-value">${advanceTotal.toLocaleString('ar-EG')} جم</div><div class="stat-label">سلف</div></div>
          <div class="stat-item"><div class="stat-value">${totalAmount.toLocaleString('ar-EG')} جم</div><div class="stat-label">إجمالي المبالغ</div></div>
        </div>
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>الموظف</th>
              <th>الرقم القومي</th>
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
        <div class="footer">تم التصدير من نظام إدارة  الأكاديمية الأولمبية لعلوم الرياضة</div>
        <div class="no-print"><button class="print-btn" onclick="window.print();">🖨️ طباعة / حفظ كـ PDF</button></div>
      </body>
      </html>
    `;

    const printWindow = window.open('', '_blank', 'width=1200,height=800,scrollbars=yes');
    if (printWindow) {
      printWindow.document.write(printContainer.innerHTML);
      printWindow.document.close();
      this.notification.showSuccess('تم فتح التقرير - يمكنك طباعته أو حفظه كـ PDF');
    } else {
      document.body.appendChild(printContainer);
      window.print();
      setTimeout(() => {
        if (document.body.contains(printContainer)) {
          document.body.removeChild(printContainer);
        }
      }, 500);
      this.notification.showSuccess('تم فتح التقرير - يمكنك حفظه كـ PDF من نافذة الطباعة');
    }
  }

  // ==========================================================================
  // ENUM CONVERTERS
  // ==========================================================================

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