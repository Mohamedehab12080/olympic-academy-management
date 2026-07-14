// expense-list.component.ts - COMPLETE WITH PROFESSIONAL RECEIPT

import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Subject, takeUntil, debounceTime, distinctUntilChanged } from 'rxjs';

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
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { FinancialService } from '../../../../../core/services/financial.service';
import { NotificationService } from '../../../../../core/services/notification.service';
import { ReportService } from '../../../../../core/services/report.service';
import { SearchableSelectComponent, SelectOption } from '../../../../../shared/components/searchable-select/searchable-select.component';
import { ExpenseWizardModalComponent } from '../expense-wizard/expense-wizard-modal.component';

@Component({
  selector: 'app-expense-list',
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
  templateUrl: './expense-list.component.html',
  styleUrls: ['./expense-list.component.css']
})
export class ExpenseListComponent implements OnInit, AfterViewInit, OnDestroy {
  
  Math = Math;
  
  // ==========================================================================
  // TABLE CONFIGURATION
  // ==========================================================================

  displayedColumns: string[] = ['id', 'expenseType', 'amountExpensed', 'expenseDate', 'paymentMethod', 'note', 'actions'];
  dataSource = new MatTableDataSource<any>([]);
  allExpenses: any[] = [];
  isLoading = false;
  
  // ==========================================================================
  // DATA COLLECTIONS
  // ==========================================================================

  expenseTypes: any[] = [];
  paymentMethods: any[] = [];
  
  // ==========================================================================
  // OPTIONS FOR SEARCHABLE SELECTS
  // ==========================================================================

  expenseTypeOptions: SelectOption[] = [];
  paymentMethodOptions: SelectOption[] = [];
  
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
    expenseDateFrom: null as Date | null,
    expenseDateTo: null as Date | null
  };
  
  filters = {
    expenseTypeId: null as number | null,
    paymentMethodId: null as number | null,
    expenseDateFrom: null as string | null,
    expenseDateTo: null as string | null
  };
  
  quickSearch: string = '';

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

  get totalExpenses(): number {
    return this.allExpenses.reduce((sum, item) => sum + (item.amountExpensed || 0), 0);
  }

  get averageExpense(): number {
    const count = this.getTotalExpensesCount();
    return count > 0 ? this.totalExpenses / count : 0;
  }

  get totalPages(): number {
    return Math.ceil(this.totalRecords / this.pageSize);
  }

  getTotalExpensesCount(): number {
    return this.allExpenses.length;
  }

  // ==========================================================================
  // CONSTRUCTOR
  // ==========================================================================

  constructor(
    private financialService: FinancialService,
    private notification: NotificationService,
    private reportService: ReportService,
    private router: Router,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef
  ) {}

  // ==========================================================================
  // LIFECYCLE HOOKS
  // ==========================================================================

  ngOnInit() {
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
  // SEARCH DEBOUNCE
  // ==========================================================================

  private setupSearchDebounce(): void {
    this.searchSubject
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe((searchValue: string) => {
        this.quickSearch = searchValue;
        this.currentPage = 0;
        this.loadData();
      });
  }

  // ==========================================================================
  // INITIALIZATION METHODS
  // ==========================================================================

  loadLookupData() {
    // Load expense types
    this.financialService.getAllExpenseTypesLookup(true)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => { 
          this.expenseTypes = res.list || [];
          this.expenseTypeOptions = [
            { value: null, label: 'الكل' },
            ...this.expenseTypes.map(t => ({ value: t.id, label: t.title }))
          ];
        },
        error: () => { 
          this.notification.showError('حدث خطأ في تحميل أنواع المصروفات'); 
        }
      });

    // Load payment methods
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
    this.filters.expenseDateFrom = this.formatDateForBackend(this.filterDates.expenseDateFrom);
    this.filters.expenseDateTo = this.formatDateForBackend(this.filterDates.expenseDateTo);
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
    
    if (this.filters.expenseTypeId) params.expenseTypeId = this.filters.expenseTypeId;
    if (this.filters.paymentMethodId) params.paymentMethodId = this.filters.paymentMethodId;
    if (this.filters.expenseDateFrom) params.expenseDateFrom = this.filters.expenseDateFrom;
    if (this.filters.expenseDateTo) params.expenseDateTo = this.filters.expenseDateTo;
    if (this.quickSearch && this.quickSearch.trim().length > 0) {
      params.quickSearch = this.quickSearch.trim();
    }
    
    if (this.sortBy) params.orderBy = this.sortBy;
    if (this.sortDir) params.orderDir = this.sortDir;

    this.financialService.getAllExpensesByFilter(params)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          this.allExpenses = res.items || [];
          this.totalRecords = res.total || 0;
          this.dataSource.data = this.allExpenses;
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
    this.searchSubject.next(value);
  }

  resetFilters() {
    this.filters = {
      expenseTypeId: null,
      paymentMethodId: null,
      expenseDateFrom: null,
      expenseDateTo: null
    };
    this.filterDates = {
      expenseDateFrom: null,
      expenseDateTo: null
    };
    this.quickSearch = '';
    this.currentPage = 0;
    this.loadData();
    this.notification.showSuccess('تم مسح جميع الفلاتر');
  }

  hasActiveFilters(): boolean {
    return !!(this.filters.expenseTypeId || 
              this.filters.paymentMethodId || 
              this.filters.expenseDateFrom || 
              this.filters.expenseDateTo || 
              this.quickSearch);
  }

  getActiveFiltersCount(): number {
    let count = 0;
    if (this.filters.expenseTypeId) count++;
    if (this.filters.paymentMethodId) count++;
    if (this.filters.expenseDateFrom) count++;
    if (this.filters.expenseDateTo) count++;
    if (this.quickSearch) count++;
    return count;
  }

  // ==========================================================================
  // EXPENSE OPERATIONS
  // ==========================================================================

  openNewExpenseModal() {
    const dialogRef = this.dialog.open(ExpenseWizardModalComponent, {
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

  viewExpense(id: number) {
    this.financialService.getExpenseById(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (expense) => {
          this.openDetailsModal(expense);
        },
        error: () => {
          this.notification.showError('حدث خطأ في تحميل بيانات المصروف');
        }
      });
  }

  editExpense(id: number) {
    const dialogRef = this.dialog.open(ExpenseWizardModalComponent, {
      data: { expenseId: id },
      width: '800px',
      maxWidth: '90vw'
    });
    
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadData();
      }
    });
  }

  deleteExpense(item: any) {
    if (confirm(`هل أنت متأكد من حذف المصروف "${item.expenseType?.title}" بقيمة ${item.amountExpensed} جم؟`)) {
      this.financialService.deleteExpense(item.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.notification.showSuccess('تم الحذف بنجاح');
            this.loadData();
          },
          error: () => this.notification.showError('حدث خطأ في الحذف')
        });
    }
  }

  // ==========================================================================
  // DETAILS MODAL WITH PROFESSIONAL RECEIPT
  // ==========================================================================

  openDetailsModal(expense: any): void {
    const logoPath = window.location.origin + '/assets/images/simpleLogo.jpeg';
    const today = new Date().toLocaleDateString('ar-EG');
    const expenseNumber = `EXP-${expense.id}`;

    const modalContainer = document.createElement('div');
    modalContainer.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 10000;
      direction: rtl;
      padding: 20px;
    `;
    
    const modalContent = document.createElement('div');
    modalContent.style.cssText = `
      background: white;
      border-radius: 16px;
      max-width: 500px;
      width: 100%;
      max-height: 90vh;
      overflow: auto;
      position: relative;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    `;
    
    modalContent.innerHTML = `
      <style>
        .modal-receipt {
          padding: 24px;
          font-family: 'Cairo', 'Segoe UI', Tahoma, sans-serif;
          direction: rtl;
          position: relative;
          overflow: hidden;
        }
        
        .modal-receipt .watermark-container {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(-25deg) scale(1.5);
          opacity: 0.05;
          pointer-events: none;
          z-index: 0;
          width: 200px;
          height: 200px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .modal-receipt .watermark-container img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          opacity: 0.8;
        }
        
        .modal-receipt .watermark-text {
          position: absolute;
          top: 56%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(-25deg);
          font-size: 18px;
          font-weight: 900;
          color: #3b82f6;
          letter-spacing: 4px;
          text-transform: uppercase;
          white-space: nowrap;
          opacity: 0.03;
          pointer-events: none;
          z-index: 0;
        }
        
        .modal-receipt .receipt-content {
          position: relative;
          z-index: 1;
        }
        
        .modal-receipt .receipt-header {
          text-align: center;
          padding-bottom: 16px;
          border-bottom: 2px solid #3b82f6;
          margin-bottom: 16px;
        }
        
        .modal-receipt .logo-section {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          margin-bottom: 8px;
        }
        
        .modal-receipt .logo-section img {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          border: 2px solid #3b82f6;
          padding: 3px;
          background: white;
          object-fit: contain;
        }
        
        .modal-receipt .logo-section .academy-name {
          font-size: 18px;
          font-weight: 700;
          color: #1a1a2e;
        }
        
        .modal-receipt .receipt-type {
          font-size: 11px;
          color: #3b82f6;
          font-weight: 600;
          display: block;
        }
        
        .modal-receipt .receipt-title {
          text-align: center;
          margin-bottom: 16px;
        }
        
        .modal-receipt .receipt-title h1 {
          font-size: 20px;
          font-weight: 700;
          color: #1e293b;
          margin: 0;
        }
        
        .modal-receipt .receipt-number {
          font-size: 12px;
          color: #6b7280;
          margin-top: 4px;
        }
        
        .modal-receipt .receipt-meta {
          display: flex;
          justify-content: space-between;
          padding: 8px 12px;
          background: #f9fafb;
          border-radius: 8px;
          font-size: 12px;
          margin-bottom: 16px;
        }
        
        .modal-receipt .section-title {
          font-size: 14px;
          font-weight: 600;
          color: #3b82f6;
          border-bottom: 2px solid #3b82f6;
          padding-bottom: 6px;
          margin-top: 16px;
          margin-bottom: 12px;
        }
        
        .modal-receipt .info-row {
          display: flex;
          justify-content: space-between;
          padding: 6px 0;
          border-bottom: 1px dashed #f1f5f9;
          font-size: 13px;
        }
        
        .modal-receipt .info-row:last-child {
          border-bottom: none;
        }
        
        .modal-receipt .info-row .label {
          color: #6b7280;
        }
        
        .modal-receipt .info-row .value {
          font-weight: 500;
          color: #1e293b;
          text-align: left;
        }
        
        .modal-receipt .info-row .value.highlight {
          color: #059669;
          font-weight: 700;
        }
        
        .modal-receipt .info-row .value.amount {
          font-size: 16px;
          color: #3b82f6;
          font-weight: 700;
        }
        
        .modal-receipt .note-text {
          font-size: 12px;
          color: #4b5563;
          background: #f9fafb;
          padding: 8px 12px;
          border-radius: 8px;
          margin-top: 4px;
        }
        
        .modal-receipt .receipt-footer {
          text-align: center;
          padding-top: 16px;
          margin-top: 16px;
          border-top: 1px solid #e5e7eb;
          font-size: 11px;
          color: #94a3b8;
        }
        
        .modal-receipt .receipt-credit {
          text-align: center;
          font-size: 8px;
          color: #1a1a2e;
          opacity: 0.6;
          margin-top: 8px;
          padding-top: 8px;
          border-top: 1px dashed rgba(26, 26, 46, 0.15);
        }
        
        .modal-receipt .modal-actions {
          display: flex;
          gap: 12px;
          justify-content: center;
          padding-top: 16px;
          margin-top: 16px;
          border-top: 1px solid #e5e7eb;
          flex-wrap: wrap;
        }
        
        .modal-receipt .modal-actions button {
          padding: 10px 24px;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .modal-receipt .modal-actions .btn-print {
          background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
          color: white;
        }
        
        .modal-receipt .modal-actions .btn-print:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
        }
        
        .modal-receipt .modal-actions .btn-edit {
          background: #fef3c7;
          color: #92400e;
        }
        
        .modal-receipt .modal-actions .btn-edit:hover {
          background: #fde68a;
        }
        
        .modal-receipt .modal-actions .btn-delete {
          background: #fee2e2;
          color: #991b1b;
        }
        
        .modal-receipt .modal-actions .btn-delete:hover {
          background: #fecaca;
        }
        
        .modal-receipt .modal-actions .btn-close {
          background: #f3f4f6;
          color: #374151;
        }
        
        .modal-receipt .modal-actions .btn-close:hover {
          background: #e5e7eb;
        }
        
        @media (max-width: 480px) {
          .modal-receipt { padding: 16px; }
          .modal-receipt .logo-section .academy-name { font-size: 14px; }
          .modal-receipt .logo-section img { width: 40px; height: 40px; }
          .modal-receipt .receipt-title h1 { font-size: 16px; }
          .modal-receipt .info-row { font-size: 12px; }
          .modal-receipt .modal-actions button { padding: 8px 16px; font-size: 12px; }
        }
      </style>
      
      <div class="modal-receipt">
        <!-- Watermark -->
        <div class="watermark-container">
          <img src="${logoPath}" alt="الأكاديمية الأولمبية لعلوم الرياضة">
        </div>
        <div class="watermark-text">الأكاديمية الأولمبية لعلوم الرياضة</div>
        
        <div class="receipt-content">
          <!-- Header -->
          <div class="receipt-header">
            <div class="logo-section">
              <img src="${logoPath}" alt="الأكاديمية الأولمبية لعلوم الرياضة" onerror="this.style.display='none'">
              <div>
                <div class="academy-name">الأكاديمية الأولمبية لعلوم الرياضة</div>
                <span class="receipt-type">✦ إيصال مصروف ✦</span>
              </div>
            </div>
          </div>
          
          <div class="receipt-title">
            <h1>إيصال مصروف</h1>
            <div class="receipt-number">#${expenseNumber}</div>
          </div>
          
          <div class="receipt-meta">
            <div><strong>رقم الإيصال:</strong> ${expenseNumber}</div>
            <div><strong>تاريخ الإصدار:</strong> ${today}</div>
          </div>
          
          <!-- Expense Info -->
          <div class="section-title">💰 معلومات المصروف</div>
          <div class="info-row">
            <span class="label">نوع المصروف</span>
            <span class="value">${expense.expenseType?.title || '-'}</span>
          </div>
          <div class="info-row">
            <span class="label">المبلغ</span>
            <span class="value amount">${expense.amountExpensed.toLocaleString('ar-EG')} جم</span>
          </div>
          <div class="info-row">
            <span class="label">تاريخ المصروف</span>
            <span class="value">${new Date(expense.expenseDate).toLocaleDateString('ar-EG')}</span>
          </div>
          <div class="info-row">
            <span class="label">طريقة الدفع</span>
            <span class="value">${expense.paymentMethod?.title || '-'}</span>
          </div>
          
          ${expense.note ? `
            <div class="section-title" style="margin-top: 16px;">📝 ملاحظات</div>
            <div class="note-text">${expense.note}</div>
          ` : ''}
          
          <!-- Footer -->
          <div class="receipt-footer">
            <div>شكراً لثقتكم بنا</div>
            <div style="margin-top: 2px; font-size: 9px;">${today}</div>
          </div>
          
          <div class="receipt-credit">powered by CoreStack Solutions | 01069911181</div>
          
          <!-- Actions -->
          <div class="modal-actions">
            <button class="btn-print" id="printReceiptBtn">
              🖨️ طباعة الإيصال
            </button>
            <button class="btn-edit" id="editExpenseBtn">
              ✏️ تعديل
            </button>
            <button class="btn-delete" id="deleteExpenseBtn">
              🗑️ حذف
            </button>
            <button class="btn-close" id="closeModalBtn">
              ✕ إغلاق
            </button>
          </div>
        </div>
      </div>
    `;
    
    modalContainer.appendChild(modalContent);
    document.body.appendChild(modalContainer);
    
    const closeModal = () => {
      document.body.removeChild(modalContainer);
    };
    
    const printReceipt = () => {
      this.printExpenseReceipt(expense);
    };
    
    const editExpense = () => {
      closeModal();
      this.editExpense(expense.id);
    };
    
    const deleteExpense = () => {
      closeModal();
      this.deleteExpense(expense);
    };
    
    modalContent.querySelector('#closeModalBtn')?.addEventListener('click', closeModal);
    modalContent.querySelector('#printReceiptBtn')?.addEventListener('click', printReceipt);
    modalContent.querySelector('#editExpenseBtn')?.addEventListener('click', editExpense);
    modalContent.querySelector('#deleteExpenseBtn')?.addEventListener('click', deleteExpense);
    
    modalContainer.addEventListener('click', (e) => {
      if (e.target === modalContainer) {
        closeModal();
      }
    });
  }

  // ==========================================================================
  // PROFESSIONAL EXPENSE RECEIPT PRINTING WITH WATERMARK
  // ==========================================================================

  printExpenseReceipt(expense: any): void {
    const printWindow = window.open('', '_blank', 'width=350,height=600,scrollbars=no,menubar=no,toolbar=no,status=no');
    if (!printWindow) {
      this.notification.showError('تعذر فتح نافذة الطباعة. يرجى السماح بالنوافذ المنبثقة.');
      return;
    }

    const data = this.prepareExpenseReceiptData(expense);
    const html = this.buildExpenseReceiptHTML(data);
    
    printWindow.document.write(html);
    printWindow.document.close();

    setTimeout(() => {
      try {
        printWindow.focus();
        printWindow.print();
      } catch (error) {
        console.error('Print error:', error);
        this.notification.showError('حدث خطأ أثناء الطباعة');
      }
    }, 1000);
  }

  private prepareExpenseReceiptData(expense: any): any {
    return {
      id: expense.id || '0000',
      expenseTypeTitle: expense.expenseType?.title || 'غير محدد',
      amountExpensed: expense.amountExpensed || 0,
      expenseDate: this.formatDate(expense.expenseDate),
      paymentMethodTitle: expense.paymentMethod?.title || 'غير محدد',
      note: expense.note || '',
      currentDate: this.formatDate(new Date())
    };
  }

  private buildExpenseReceiptHTML(data: any): string {
    const logoPath = window.location.origin + '/assets/images/simpleLogo.jpeg';
    
    return `
<!DOCTYPE html>
<html dir="rtl">
<head>
<meta charset="UTF-8">
<title>إيصال مصروف #${data.id}</title>
<style>
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  @page {
    size: 80mm auto;
    margin: 0mm;
  }

  html, body {
    margin: 0;
    padding: 0;
    background: white;
    width: 80mm;
    min-width: 80mm;
    max-width: 80mm;
  }

  .receipt-wrapper {
    width: 80mm;
    min-width: 80mm;
    max-width: 80mm;
    margin: 0;
    padding: 0;
    background: white;
    position: relative;
    overflow: hidden;
  }

  .receipt {
    width: 80mm;
    min-width: 80mm;
    max-width: 80mm;
    margin: 0;
    padding: 2.5mm 3mm 3mm 3mm;
    background: white;
    font-family: 'Arial', 'Tahoma', sans-serif;
    font-size: 9pt;
    line-height: 1.4;
    color: #000000;
    position: relative;
    overflow: hidden;
  }

  /* ===== WATERMARK - Behind content ===== */
  .receipt-watermark {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) rotate(-25deg) scale(1.6);
    opacity: 0.05;
    pointer-events: none;
    z-index: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
  }
  
  .receipt-watermark img {
    width: 100px;
    height: auto;
    object-fit: contain;
    opacity: 0.9;
  }
  
  .receipt-watermark-text {
    position: absolute;
    top: 56%;
    left: 50%;
    transform: translate(-50%, -50%) rotate(-25deg) scale(0.8);
    font-size: 20px;
    font-weight: 900;
    color: #3b82f6;
    letter-spacing: 4px;
    text-transform: uppercase;
    white-space: nowrap;
    opacity: 0.03;
    pointer-events: none;
    z-index: 0;
    text-shadow: 0 2px 8px rgba(59, 130, 246, 0.1);
  }

  /* ===== CONTENT - Above watermark ===== */
  .receipt-content {
    position: relative;
    z-index: 1;
  }

  /* ===== LOGO SECTION ===== */
  .logo-section {
    text-align: center;
    padding: 1mm 0 1mm 0;
    border-bottom: 2.5px solid #3b82f6;
    margin-bottom: 2mm;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }
  
  .logo-section img {
    width: 36px;
    height: 36px;
    object-fit: contain;
    border-radius: 50%;
    border: 2px solid #3b82f6;
    padding: 2px;
    background: white;
  }
  
  .logo-section .academy-name {
    font-size: 13pt;
    font-weight: 700;
    color: #1a1a2e;
    display: block;
  }
  
  .logo-section .receipt-type {
    font-size: 7pt;
    color: #3b82f6;
    font-weight: 600;
    display: block;
    margin-top: -1px;
  }

  .logo-text {
    display: flex;
    flex-direction: column;
    line-height: 1.2;
  }

  /* ===== RECEIPT TITLE ===== */
  .receipt-title {
    text-align: center;
    padding: 0.5mm 0 1.5mm 0;
    border-bottom: 1px dashed #e5e7eb;
    margin-bottom: 2mm;
  }
  .receipt-title h1 {
    font-size: 14pt;
    font-weight: 700;
    color: #1e293b;
    margin: 0;
  }
  .receipt-title .receipt-number {
    font-size: 8pt;
    color: #6b7280;
    margin-top: 0.5mm;
  }

  /* ===== BODY ===== */
  .receipt-body {
    padding: 1mm 0;
  }

  .receipt-section {
    margin-bottom: 2mm;
  }
  .receipt-section:last-child { margin-bottom: 0; }

  .section-title {
    font-size: 8pt;
    font-weight: 600;
    color: #3b82f6;
    margin-bottom: 1mm;
    padding-bottom: 0.5mm;
    border-bottom: 0.5pt solid #eef2f6;
  }

  .info-row {
    display: flex;
    justify-content: space-between;
    padding: 0.5mm 0;
    font-size: 8pt;
    border-bottom: 0.3pt dashed #f1f5f9;
  }
  .info-row:last-child { border-bottom: none; }

  .info-row .label {
    color: #6b7280;
    flex-shrink: 0;
  }
  .info-row .value {
    font-weight: 500;
    color: #1e293b;
    text-align: left;
  }
  .info-row .value.highlight {
    color: #059669;
    font-weight: 700;
  }
  .info-row .value.amount {
    font-size: 10pt;
    color: #3b82f6;
    font-weight: 700;
  }

  .divider-line {
    border: none;
    border-top: 0.5pt dashed #e2e8f0;
    margin: 1mm 0;
  }

  .receipt-footer {
    text-align: center;
    padding: 2mm 0 0 0;
    font-size: 6pt;
    color: #94a3b8;
    border-top: 1px solid #e5e7eb;
    margin-top: 2mm;
  }

  /* ===== COPYRIGHT CREDIT - Inside receipt at bottom ===== */
  .receipt-credit {
    text-align: center;
    font-size: 4.5px;
    color: #1a1a2e;
    font-weight: 500;
    opacity: 0.6;
    letter-spacing: 0.3px;
    direction: ltr;
    margin-top: 1mm;
    padding-top: 0.5mm;
    border-top: 0.5px dashed rgba(26, 26, 46, 0.15);
  }

  .note-text {
    font-size: 7pt;
    color: #4b5563;
  }

  .print-btn-container {
    text-align: center;
    padding: 2mm 0;
    background: white;
  }
  .print-btn {
    padding: 1mm 4mm;
    background: #3b82f6;
    color: white;
    border: none;
    border-radius: 1mm;
    font-size: 8pt;
    font-weight: 600;
    cursor: pointer;
  }

  @media print {
    html, body {
      width: 80mm !important;
      min-width: 80mm !important;
      max-width: 80mm !important;
      margin: 0 !important;
      padding: 0 !important;
    }
    .receipt {
      width: 80mm !important;
      min-width: 80mm !important;
      max-width: 80mm !important;
      margin: 0 !important;
      padding: 2mm 2.5mm 2.5mm 2.5mm !important;
    }
    .print-btn-container {
      display: none !important;
    }
    .receipt-title,
    .logo-section,
    .receipt-watermark {
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    .logo-section img {
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    .receipt-watermark {
      opacity: 0.06 !important;
    }
    .receipt-watermark img {
      width: 90px !important;
    }
    .receipt-watermark-text {
      font-size: 18px !important;
      opacity: 0.04 !important;
    }
    .receipt-credit {
      opacity: 0.5 !important;
      color: #000000 !important;
    }
  }

  @media (max-width: 60mm) {
    html, body {
      width: 58mm !important;
      min-width: 58mm !important;
      max-width: 58mm !important;
    }
    .receipt {
      width: 58mm !important;
      min-width: 58mm !important;
      max-width: 58mm !important;
      padding: 1.5mm 2mm 2mm 2mm !important;
      font-size: 7pt !important;
    }
    .logo-section img { width: 28px !important; height: 28px !important; }
    .logo-section .academy-name { font-size: 10pt !important; }
    .logo-section .receipt-type { font-size: 5.5pt !important; }
    .receipt-title h1 { font-size: 11pt !important; }
    .receipt-body { padding: 0.5mm 0 !important; }
    .section-title { font-size: 6.5pt !important; }
    .info-row { font-size: 6.5pt !important; padding: 0.3mm 0 !important; }
    .info-row .value.amount { font-size: 8pt !important; }
    .note-text { font-size: 5.5pt !important; }
    .receipt-footer { font-size: 4.5pt !important; }
    .receipt-watermark img { width: 70px !important; }
    .receipt-watermark-text { font-size: 14px !important; }
    .receipt-credit { font-size: 3.5px !important; }
  }
</style>
</head>
<body>
<div class="receipt-wrapper">
  <div class="receipt">
    <!-- ===== WATERMARK - Behind content ===== -->
    <div class="receipt-watermark">
      <img src="${logoPath}" alt="الأكاديمية الأولمبية لعلوم الرياضة">
    </div>
    <div class="receipt-watermark-text">الأكاديمية الأولمبية لعلوم الرياضة</div>

    <!-- ===== CONTENT ===== -->
    <div class="receipt-content">
      <!-- LOGO AND ACADEMY NAME -->
      <div class="logo-section">
        <img src="${logoPath}" alt="الأكاديمية الأولمبية لعلوم الرياضة" onerror="this.style.display='none'">
        <div class="logo-text">
          <span class="academy-name">الأكاديمية الأولمبية لعلوم الرياضة</span>
          <span class="receipt-type">✦ إيصال مصروف ✦</span>
        </div>
      </div>

      <!-- RECEIPT TITLE -->
      <div class="receipt-title">
        <h1>إيصال مصروف</h1>
        <div class="receipt-number">#${data.id}</div>
      </div>

      <!-- BODY -->
      <div class="receipt-body">
        <!-- Expense Info -->
        <div class="receipt-section">
          <div class="section-title">💰 المصروف</div>
          <div class="info-row">
            <span class="label">نوع المصروف</span>
            <span class="value">${data.expenseTypeTitle}</span>
          </div>
          <div class="info-row">
            <span class="label">المبلغ</span>
            <span class="value amount">${data.amountExpensed.toLocaleString('ar-EG')} جم</span>
          </div>
          <div class="info-row">
            <span class="label">تاريخ المصروف</span>
            <span class="value">${data.expenseDate}</span>
          </div>
          <div class="info-row">
            <span class="label">طريقة الدفع</span>
            <span class="value">${data.paymentMethodTitle}</span>
          </div>
        </div>

        ${data.note ? `
          <hr class="divider-line">
          <div class="receipt-section">
            <div class="section-title">📝 ملاحظات</div>
            <div class="info-row" style="border-bottom: none;">
              <span class="note-text">${data.note}</span>
            </div>
          </div>
        ` : ''}
      </div>

      <!-- FOOTER -->
      <div class="receipt-footer">
        <div>شكراً لثقتكم بنا</div>
        <div style="margin-top: 1px; font-size: 5pt;">${data.currentDate}</div>
      </div>

      <!-- ===== COPYRIGHT CREDIT - Inside receipt at bottom ===== -->
      <div class="receipt-credit">powered by CoreStack Solutions | 01069911181</div>
    </div>
  </div>

  <!-- PRINT BUTTON -->
  <div class="print-btn-container">
    <button class="print-btn" onclick="window.print();">🖨️ طباعة</button>
  </div>
</div>
</body>
</html>`;
  }

  private formatDate(dateValue: any): string {
    if (!dateValue) return '-';
    let dateObj: Date;
    if (typeof dateValue === 'string') {
      dateObj = new Date(dateValue);
    } else if (dateValue instanceof Date) {
      dateObj = dateValue;
    } else {
      return '-';
    }
    if (isNaN(dateObj.getTime())) return '-';
    const day = dateObj.getDate().toString().padStart(2, '0');
    const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
    const year = dateObj.getFullYear();
    return `${day}/${month}/${year}`;
  }

  // ==========================================================================
  // EXPORT FUNCTIONS
  // ==========================================================================

  exportToExcel() {
    if (this.allExpenses.length === 0) {
      this.notification.showWarning('لا توجد بيانات لتصديرها');
      return;
    }

    const exportData = this.allExpenses.map((item, index) => ({
      '#': (this.currentPage * this.pageSize) + index + 1,
      'نوع المصروف': item.expenseType?.title || '-',
      'المبلغ': item.amountExpensed,
      'تاريخ المصروف': item.expenseDate,
      'طريقة الدفع': item.paymentMethod?.title || '-',
      'ملاحظات': item.note || '-'
    }));

    this.reportService.exportToExcel(exportData, 'expenses-list', 'المصروفات');
    this.notification.showSuccess('تم تصدير البيانات بنجاح');
  }

  exportToPDF() {
    if (this.allExpenses.length === 0) {
      this.notification.showWarning('لا توجد بيانات لتصديرها');
      return;
    }

    this.isLoading = true;

    const filterTexts: string[] = [];
    if (this.filters.expenseTypeId) {
      const expenseType = this.expenseTypes.find(t => t.id === this.filters.expenseTypeId);
      if (expenseType) filterTexts.push(`نوع المصروف: ${expenseType.title}`);
    }
    if (this.filters.paymentMethodId) {
      const paymentMethod = this.paymentMethods.find(p => p.id === this.filters.paymentMethodId);
      if (paymentMethod) filterTexts.push(`طريقة الدفع: ${paymentMethod.title}`);
    }
    if (this.filters.expenseDateFrom) filterTexts.push(`من تاريخ: ${this.filters.expenseDateFrom}`);
    if (this.filters.expenseDateTo) filterTexts.push(`إلى تاريخ: ${this.filters.expenseDateTo}`);
    if (this.quickSearch) filterTexts.push(`بحث: ${this.quickSearch}`);

    const totalExpenses = this.totalExpenses;
    const avgExpense = this.averageExpense;
    const count = this.allExpenses.length;

    const logoPath = window.location.origin + '/assets/images/simpleLogo.jpeg';

    let tableRows = '';
    this.allExpenses.forEach((item: any, index: number) => {
      tableRows += `
        <tr>
          <td style="text-align: center; padding: 8px; border: 1px solid rgba(229, 231, 235, 0.3); font-size: 11px; background: transparent;">${index + 1}</td>
          <td style="text-align: right; padding: 8px; border: 1px solid rgba(229, 231, 235, 0.3); font-size: 11px; background: transparent;">${item.expenseType?.title || '-'}</td>
          <td style="text-align: center; padding: 8px; border: 1px solid rgba(229, 231, 235, 0.3); font-weight: bold; color: #3b82f6; font-size: 11px; background: transparent;">
            ${item.amountExpensed.toLocaleString('ar-EG')} جم
          </td>
          <td style="text-align: center; padding: 8px; border: 1px solid rgba(229, 231, 235, 0.3); font-size: 11px; background: transparent;">${item.expenseDate || '-'}</td>
          <td style="text-align: center; padding: 8px; border: 1px solid rgba(229, 231, 235, 0.3); font-size: 11px; background: transparent;">${item.paymentMethod?.title || '-'}</td>
          <td style="text-align: right; padding: 8px; border: 1px solid rgba(229, 231, 235, 0.3); font-size: 11px; background: transparent;">${item.note || '-'}</td>
        </tr>
      `;
    });

    const printContainer = document.createElement('div');
    printContainer.style.direction = 'rtl';
    printContainer.style.fontFamily = 'Cairo, "Segoe UI", Tahoma, sans-serif';
    printContainer.style.padding = '0';
    printContainer.style.backgroundColor = 'white';
    printContainer.style.position = 'relative';
    printContainer.style.width = '100%';
    
    printContainer.innerHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>تقرير المصروفات</title>
        <style>
          * { 
            font-family: 'Cairo', 'Segoe UI', Tahoma, sans-serif; 
            margin: 0; 
            padding: 0; 
            box-sizing: border-box; 
          }
          
          html, body {
            width: 100%;
            min-height: 100vh;
            background: white;
            margin: 0;
            padding: 0;
          }
          
          @page { 
            size: A4 landscape; 
            margin: 8mm;
          }
          
          .page-container {
            position: relative;
            width: 100%;
            min-height: 100vh;
            page-break-after: always;
            background: white;
            overflow: hidden;
            page-break-inside: avoid;
          }
          
          .page-container:last-child {
            page-break-after: auto;
          }
          
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
            opacity: 0.10;
            transform: rotate(-25deg);
          }
          
          .watermark-container .watermark-logo {
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
            font-size: 45px;
            font-weight: 900;
            color: #3b82f6;
            letter-spacing: 6px;
            text-transform: uppercase;
            white-space: nowrap;
            opacity: 0.05;
            text-shadow: 0 4px 20px rgba(59, 130, 246, 0.15);
            pointer-events: none;
            z-index: 0;
          }
          
          .content {
            position: relative;
            z-index: 1;
            padding: 12px;
            background: transparent;
            min-height: 100vh;
          }
          
          @media print {
            html, body {
              width: 100%;
              height: 100%;
              margin: 0;
              padding: 0;
            }
            .no-print { display: none !important; }
            .page-container {
              min-height: 100vh !important;
              page-break-after: always !important;
              page-break-inside: avoid !important;
            }
            .page-container:last-child {
              page-break-after: auto !important;
            }
            .watermark-wrapper {
              width: 60% !important;
              height: 60% !important;
            }
            .watermark-container {
              opacity: 0.12 !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            .watermark-container .watermark-logo {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            .watermark-text {
              opacity: 0.06 !important;
              font-size: 50px !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            td {
              background: transparent !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            tr {
              background: transparent !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            tbody {
              background: transparent !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            .header {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            th {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            .stats {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            .stat-item {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
          }
          
          .header {
            text-align: center;
            margin-bottom: 10px;
            padding: 10px 16px;
            background: linear-gradient(135deg, #1e40af 0%, #3b82f6 50%, #60a5fa 100%);
            color: white;
            border-radius: 8px;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .header h1 { 
            margin: 0; 
            font-size: 18px; 
            font-weight: 700;
            letter-spacing: 1px;
          }
          .header p { 
            margin: 2px 0 0 0; 
            font-size: 11px; 
            opacity: 0.9;
          }
          
          .filters {
            margin-bottom: 8px;
            padding: 6px 12px;
            background: rgba(248, 250, 252, 0.8);
            border-radius: 6px;
            font-size: 10px;
            border: 1px solid rgba(229, 231, 235, 0.5);
          }
          .filters strong {
            color: #1e293b;
          }
          
          .stats {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 5px;
            margin-bottom: 8px;
          }
          
          .stat-item {
            background: rgba(255, 255, 255, 0.85);
            border-radius: 6px;
            padding: 5px 8px;
            text-align: center;
            border: 1px solid rgba(229, 231, 235, 0.5);
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          
          .stat-item .stat-value {
            font-size: 16px;
            font-weight: 700;
            color: #1e293b;
            display: block;
          }
          
          .stat-item .stat-label {
            font-size: 9px;
            color: #64748b;
          }
          
          .stat-item.total {
            background: linear-gradient(135deg, #1e40af 0%, #3b82f6 50%, #60a5fa 100%);
            color: white;
            border-color: #3b82f6;
          }
          .stat-item.total .stat-value {
            color: white;
          }
          .stat-item.total .stat-label {
            color: rgba(255, 255, 255, 0.85);
          }
          
          .stat-item.amount {
            background: rgba(219, 234, 254, 0.85);
            border-color: rgba(147, 197, 253, 0.5);
          }
          .stat-item.amount .stat-value {
            color: #2563eb;
          }
          
          .stat-item.average {
            background: rgba(209, 250, 229, 0.85);
            border-color: rgba(110, 231, 183, 0.5);
          }
          .stat-item.average .stat-value {
            color: #059669;
          }
          
          table {
            width: 100%;
            border-collapse: collapse;
            direction: rtl;
            margin-top: 4px;
            font-size: 10px;
            background: transparent !important;
          }
          th {
            background: linear-gradient(135deg, #1e40af 0%, #3b82f6 50%, #60a5fa 100%);
            color: white;
            padding: 5px 4px;
            border: 1px solid #3b82f6;
            text-align: center;
            font-weight: 700;
            font-size: 10px;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          td { 
            padding: 4px 4px; 
            border: 1px solid rgba(229, 231, 235, 0.3);
            font-size: 10px;
            background: transparent !important;
          }
          tr {
            background: transparent !important;
          }
          tbody {
            background: transparent !important;
          }
          tr:nth-child(even) td {
            background: rgba(250, 251, 252, 0.4) !important;
          }
          
          .footer {
            text-align: center;
            margin-top: 8px;
            padding: 5px;
            font-size: 8px;
            color: rgba(148, 163, 184, 0.8);
            border-top: 1px solid rgba(229, 231, 235, 0.3);
          }
          
          @media (max-width: 768px) {
            .watermark-wrapper {
              width: 70% !important;
              height: 70% !important;
            }
            .watermark-text {
              font-size: 30px !important;
            }
            .stats {
              grid-template-columns: 1fr;
              gap: 4px;
            }
            .stat-item {
              padding: 4px 6px;
            }
            .stat-item .stat-value {
              font-size: 14px;
            }
            table { 
              font-size: 9px; 
            }
            th, td { 
              padding: 3px 2px; 
            }
            .header h1 {
              font-size: 15px;
            }
          }
          
          @media (max-width: 480px) {
            .watermark-wrapper {
              width: 80% !important;
              height: 80% !important;
            }
            .watermark-text {
              font-size: 20px !important;
            }
          }
        </style>
      </head>
      <body>
        <div class="page-container">
          <!-- Watermark -->
          <div class="watermark-wrapper">
            <div class="watermark-container">
              <img src="${logoPath}" alt="الأكاديمية الأولمبية لعلوم الرياضة" class="watermark-logo">
            </div>
            <div class="watermark-text">الأكاديمية الأولمبية لعلوم الرياضة</div>
          </div>
          
          <div class="content">
            <div class="header">
              <h1>📋 تقرير المصروفات</h1>
              <p>${new Date().toLocaleDateString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
              <p style="font-size: 10px; opacity: 0.8;">عدد السجلات: ${count} مصروف</p>
            </div>
            
            ${filterTexts.length > 0 ? `<div class="filters"><strong>🔍 الفلاتر:</strong> ${filterTexts.join(' | ')}</div>` : ''}
            
            <div class="stats">
              <div class="stat-item total">
                <span class="stat-value">${count}</span>
                <span class="stat-label">عدد المصروفات</span>
              </div>
              <div class="stat-item amount">
                <span class="stat-value">${totalExpenses.toLocaleString('ar-EG')} جم</span>
                <span class="stat-label">إجمالي المصروفات</span>
              </div>
              <div class="stat-item average">
                <span class="stat-value">${avgExpense.toLocaleString('ar-EG')} جم</span>
                <span class="stat-label">متوسط المصروف</span>
              </div>
            </div>
            
            <table>
              <thead>
                <tr>
                  <th style="width: 4%;">#</th>
                  <th style="width: 20%;">نوع المصروف</th>
                  <th style="width: 14%;">المبلغ</th>
                  <th style="width: 14%;">تاريخ المصروف</th>
                  <th style="width: 14%;">طريقة الدفع</th>
                  <th style="width: 34%;">ملاحظات</th>
                </tr>
              </thead>
              <tbody>
                ${tableRows}
              </tbody>
            </table>
            
            <div class="footer">
              الأكاديمية الأولمبية لعلوم الرياضة &copy; ${new Date().getFullYear()} - ${count} مصروف
            </div>
          </div>
        </div>
        
        <div class="no-print" style="text-align: center; margin-top: 10px; padding: 10px; position: fixed; bottom: 0; left: 0; right: 0; background: white; box-shadow: 0 -2px 10px rgba(0,0,0,0.1); z-index: 9999;">
          <button onclick="window.print();" style="padding: 8px 24px; background: linear-gradient(135deg, #1e40af 0%, #3b82f6 50%, #60a5fa 100%); color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 14px; font-weight: 600; box-shadow: 0 2px 10px rgba(59, 130, 246, 0.3);">
            🖨️ طباعة / PDF
          </button>
          <button onclick="window.close();" style="padding: 8px 24px; background: #f1f5f9; color: #475569; border: none; border-radius: 6px; cursor: pointer; font-size: 14px; font-weight: 600; margin-right: 10px;">
            ✖ إغلاق
          </button>
        </div>
      </body>
      </html>
    `;

    const printWindow = window.open('', '_blank', 'width=1100,height=850,scrollbars=yes');
    if (printWindow) {
      printWindow.document.write(printContainer.innerHTML);
      printWindow.document.close();
      this.isLoading = false;
      this.notification.showSuccess(`تم فتح التقرير - ${count} مصروف`);
    } else {
      document.body.appendChild(printContainer);
      window.print();
      setTimeout(() => {
        if (document.body.contains(printContainer)) {
          document.body.removeChild(printContainer);
        }
      }, 500);
      this.isLoading = false;
      this.notification.showSuccess(`تم فتح التقرير - ${count} مصروف`);
    }
  }

  printList(): void {
    this.exportToPDF();
  }
}