// place-rent-payment-list.component.ts - COMPLETE WITH WATERMARK IN ALL DOCUMENTS

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

import { FinancialService } from '../../../../../../core/services/financial.service';
import { PlaceService } from '../../../../../../core/services/place.service';
import { NotificationService } from '../../../../../../core/services/notification.service';
import { ReportService } from '../../../../../../core/services/report.service';
import { SearchableSelectComponent, SelectOption } from '../../../../../../shared/components/searchable-select/searchable-select.component';
import { PlaceRentPaymentWizardModalComponent } from '../place-rent-payment-wizard/place-rent-payment-wizard-modal.component';

@Component({
  selector: 'app-place-rent-payment-list',
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
  templateUrl: './place-rent-payment-list.component.html',
  styleUrls: ['./place-rent-payment-list.component.css']
})
export class PlaceRentPaymentListComponent implements OnInit, AfterViewInit, OnDestroy {
  
  Math = Math;
  
  // ==========================================================================
  // TABLE CONFIGURATION
  // ==========================================================================

  displayedColumns: string[] = ['id', 'place', 'rentType', 'effect', 'rentAmount', 'payedAmount', 'remainedAmount', 'paymentDate', 'paymentMethod', 'actions'];
  dataSource = new MatTableDataSource<any>([]);
  allPayments: any[] = [];
  isLoading = false;
  
  // ==========================================================================
  // DATA COLLECTIONS
  // ==========================================================================

  places: any[] = [];
  rentTypes: any[] = [];
  paymentMethods: any[] = [];
  
  // ==========================================================================
  // OPTIONS FOR SEARCHABLE SELECTS
  // ==========================================================================

  placeOptions: SelectOption[] = [];
  rentTypeOptions: SelectOption[] = [];
  paymentMethodOptions: SelectOption[] = [];
  
  // Effect options for filter
  effectOptions: any[] = [
    { value: null, label: 'الكل', icon: 'filter_list', color: '#64748b' },
    { value: true, label: 'مدخل (إيراد)', icon: 'arrow_upward', color: '#10b981' },
    { value: false, label: 'مخرج (مصروف)', icon: 'arrow_downward', color: '#ef4444' }
  ];
  
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

  sortBy: string = 'PAYMENT_DATE';
  sortDir: string = 'DESC';
  
  // ==========================================================================
  // FILTER CRITERIA
  // ==========================================================================

  filterDates = {
    paymentDateFrom: null as Date | null,
    paymentDateTo: null as Date | null
  };
  
  filters = {
    placeId: null as number | null,
    rentTypeId: null as number | null,
    rentTypeEffect: null as boolean | null,
    paymentMethodId: null as number | null,
    paymentDateFrom: null as string | null,
    paymentDateTo: null as string | null
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

  get totalRentAmount(): number {
    return this.allPayments.reduce((sum, item) => sum + (item.rentAmount || 0), 0);
  }

  get totalPayedAmount(): number {
    return this.allPayments.reduce((sum, item) => sum + (item.payedAmount || 0), 0);
  }

  get totalRemainedAmount(): number {
    return this.allPayments.reduce((sum, item) => sum + (item.remainedAmount || 0), 0);
  }

  get totalPaymentsCount(): number {
    return this.allPayments.length;
  }

  get totalPages(): number {
    return Math.ceil(this.totalRecords / this.pageSize);
  }

  // Income/Expense statistics
  get incomeCount(): number {
    return this.allPayments.filter(item => item.rentType?.effect === true).length;
  }

  get expenseCount(): number {
    return this.allPayments.filter(item => item.rentType?.effect === false).length;
  }

  get incomeTotal(): number {
    return this.allPayments
      .filter(item => item.rentType?.effect === true)
      .reduce((sum, item) => sum + (item.payedAmount || 0), 0);
  }

  get expenseTotal(): number {
    return this.allPayments
      .filter(item => item.rentType?.effect === false)
      .reduce((sum, item) => sum + (item.payedAmount || 0), 0);
  }

  // ==========================================================================
  // CONSTRUCTOR
  // ==========================================================================

  constructor(
    private financialService: FinancialService,
    private placeService: PlaceService,
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
  // HELPER METHODS
  // ==========================================================================

  private formatDateForBackend(date: any): string | null {
    if (!date) return null;
    
    if (typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return date;
    }
    
    const d = new Date(date);
    if (isNaN(d.getTime())) return null;
    
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private updateFilterDates(): void {
    this.filters.paymentDateFrom = this.formatDateForBackend(this.filterDates.paymentDateFrom);
    this.filters.paymentDateTo = this.formatDateForBackend(this.filterDates.paymentDateTo);
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
  // INITIALIZATION METHODS
  // ==========================================================================

  loadLookupData() {
    this.placeService.getAllPlacesLookup()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          this.places = res.list || [];
          this.placeOptions = [
            { value: null, label: 'الكل' },
            ...this.places.map(p => ({ value: p.id, label: p.title }))
          ];
        },
        error: () => {
          this.notification.showError('حدث خطأ في تحميل المواقع');
        }
      });

    this.financialService.getAllRentTypesLookup()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          this.rentTypes = res.list || [];
          this.rentTypeOptions = [
            { value: null, label: 'الكل' },
            ...this.rentTypes.map(r => ({ value: r.id, label: r.title }))
          ];
        },
        error: () => {
          this.notification.showError('حدث خطأ في تحميل أنواع الإيجار');
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
  // LOAD DATA WITH PAGINATION
  // ==========================================================================

  loadData() {
    this.isLoading = true;
    
    this.updateFilterDates();
    
    const params: any = {
      pageNum: this.currentPage,
      pageSize: this.pageSize
    };
    
    if (this.filters.placeId) params.placeId = this.filters.placeId;
    if (this.filters.rentTypeId) params.rentTypeId = this.filters.rentTypeId;
    if (this.filters.rentTypeEffect !== null && this.filters.rentTypeEffect !== undefined) {
      params.rentTypeEffect = this.filters.rentTypeEffect;
    }
    if (this.filters.paymentMethodId) params.paymentMethodId = this.filters.paymentMethodId;
    if (this.filters.paymentDateFrom) params.paymentDateFrom = this.filters.paymentDateFrom;
    if (this.filters.paymentDateTo) params.paymentDateTo = this.filters.paymentDateTo;
    
    if (this.quickSearch && this.quickSearch.trim().length > 0) {
      params.quickSearch = this.quickSearch.trim();
    }
    
    if (this.sortBy) params.orderBy = this.sortBy;
    if (this.sortDir) params.orderDir = this.sortDir;

    this.financialService.getAllPlaceRentPaymentsByFilter(params)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          this.allPayments = res.items || [];
          this.totalRecords = res.total || 0;
          this.dataSource.data = this.allPayments;
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

  applyQuickSearch(value: string) {
    this.quickSearch = value;
    this.searchSubject.next(value);
  }

  resetFilters() {
    this.filters = {
      placeId: null,
      rentTypeId: null,
      rentTypeEffect: null,
      paymentMethodId: null,
      paymentDateFrom: null,
      paymentDateTo: null
    };
    this.filterDates = {
      paymentDateFrom: null,
      paymentDateTo: null
    };
    this.quickSearch = '';
    this.currentPage = 0;
    this.loadData();
    this.notification.showSuccess('تم مسح جميع الفلاتر');
  }

  hasActiveFilters(): boolean {
    return !!(this.filters.placeId || 
              this.filters.rentTypeId || 
              this.filters.rentTypeEffect !== null || 
              this.filters.paymentMethodId || 
              this.filters.paymentDateFrom || 
              this.filters.paymentDateTo || 
              this.quickSearch);
  }

  getActiveFiltersCount(): number {
    let count = 0;
    if (this.filters.placeId) count++;
    if (this.filters.rentTypeId) count++;
    if (this.filters.rentTypeEffect !== null && this.filters.rentTypeEffect !== undefined) count++;
    if (this.filters.paymentMethodId) count++;
    if (this.filters.paymentDateFrom) count++;
    if (this.filters.paymentDateTo) count++;
    if (this.quickSearch) count++;
    return count;
  }

  // ==========================================================================
  // EFFECT HELPER METHODS
  // ==========================================================================

  getEffectLabel(effect: boolean | undefined): string {
    if (effect === undefined || effect === null) return '-';
    return effect ? 'مدخل (إيراد)' : 'مخرج (مصروف)';
  }

  getEffectIcon(effect: boolean | undefined): string {
    if (effect === undefined || effect === null) return 'help';
    return effect ? 'arrow_upward' : 'arrow_downward';
  }

  getEffectClass(effect: boolean | undefined): string {
    if (effect === undefined || effect === null) return 'effect-neutral';
    return effect ? 'effect-income' : 'effect-expense';
  }

  getEffectColor(effect: boolean | undefined): string {
    if (effect === undefined || effect === null) return '#64748b';
    return effect ? '#10b981' : '#ef4444';
  }

  // ==========================================================================
  // PAYMENT OPERATIONS
  // ==========================================================================

  openNewPaymentModal() {
    const dialogRef = this.dialog.open(PlaceRentPaymentWizardModalComponent, {
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

  viewPayment(id: number) {
    this.financialService.getPlaceRentPaymentById(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (payment) => {
          this.openDetailsModal(payment);
        },
        error: () => {
          this.notification.showError('حدث خطأ في تحميل بيانات الدفعة');
        }
      });
  }

  // ==========================================================================
  // DELETE PAYMENT
  // ==========================================================================

  deletePayment(item: any) {
    if (confirm(`هل أنت متأكد من حذف دفعة الإيجار للموقع "${item.place?.title}" بقيمة ${item.payedAmount} جم؟`)) {
      this.financialService.deletePlaceRentPayment(item.id)
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
  // DETAILS MODAL - STYLED LIKE RECEIPT WITH WATERMARK
  // ==========================================================================

  openDetailsModal(payment: any): void {
    const isPaid = payment.remainedAmount === 0;
    const statusColor = isPaid ? '#065f46' : '#92400e';
    const statusBg = isPaid ? '#d1fae5' : '#fef3c7';
    const paymentStatus = isPaid ? 'مدفوع بالكامل' : 'متبقي';
    const logoPath = window.location.origin + '/assets/images/mainLogo.jpeg';
    const today = new Date().toLocaleDateString('ar-EG');
    const paymentNumber = `RENT-${payment.id}`;
    const effectLabel = this.getEffectLabel(payment.rentType?.effect);
    const effectIcon = payment.rentType?.effect ? '↑' : '↓';
    const effectColor = this.getEffectColor(payment.rentType?.effect);

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
          color: #8b5cf6;
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
          border-bottom: 2px solid #8b5cf6;
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
          border: 2px solid #8b5cf6;
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
          color: #8b5cf6;
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
          color: #8b5cf6;
          border-bottom: 2px solid #8b5cf6;
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
        
        .modal-receipt .info-row .value.danger {
          color: #dc2626;
          font-weight: 700;
        }
        
        .modal-receipt .info-row .value.amount {
          font-size: 16px;
        }
        
        .modal-receipt .status-badge {
          display: inline-block;
          padding: 4px 14px;
          border-radius: 30px;
          font-size: 12px;
          font-weight: 600;
          background: ${statusBg};
          color: ${statusColor};
        }
        
        .modal-receipt .effect-badge {
          display: inline-block;
          padding: 4px 14px;
          border-radius: 30px;
          font-size: 12px;
          font-weight: 600;
          background: ${effectColor}22;
          color: ${effectColor};
          border: 1px solid ${effectColor}44;
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
          background: linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%);
          color: white;
        }
        
        .modal-receipt .modal-actions .btn-print:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(139, 92, 246, 0.4);
        }
        
        .modal-receipt .modal-actions .btn-close {
          background: #f3f4f6;
          color: #374151;
        }
        
        .modal-receipt .modal-actions .btn-close:hover {
          background: #e5e7eb;
        }
        
        .modal-receipt .modal-actions .btn-delete {
          background: #fee2e2;
          color: #991b1b;
        }
        
        .modal-receipt .modal-actions .btn-delete:hover {
          background: #fecaca;
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
                <span class="receipt-type">✦ إيصال دفع إيجار ✦</span>
              </div>
            </div>
          </div>
          
          <div class="receipt-title">
            <h1>إيصال دفع إيجار</h1>
            <div class="receipt-number">#${paymentNumber}</div>
          </div>
          
          <div class="receipt-meta">
            <div><strong>رقم الإيصال:</strong> ${paymentNumber}</div>
            <div><strong>تاريخ الإصدار:</strong> ${today}</div>
          </div>
          
          <!-- Place Info -->
          <div class="section-title">🏢 الموقع</div>
          <div class="info-row">
            <span class="label">الموقع</span>
            <span class="value">${payment.place?.title || '-'}</span>
          </div>
          <div class="info-row">
            <span class="label">نوع الإيجار</span>
            <span class="value">${payment.rentType?.title || '-'}</span>
          </div>
          <div class="info-row">
            <span class="label">التأثير المالي</span>
            <span class="value">
              <span class="effect-badge">${effectIcon} ${effectLabel}</span>
            </span>
          </div>
          <div class="info-row">
            <span class="label">تاريخ الدفع</span>
            <span class="value">${new Date(payment.paymentDate).toLocaleDateString('ar-EG')}</span>
          </div>
          <div class="info-row">
            <span class="label">قيمة الإيجار</span>
            <span class="value">${payment.rentAmount.toLocaleString('ar-EG')} جم</span>
          </div>
          
          <!-- Payment Details -->
          <div class="section-title">💰 الدفعة</div>
          <div class="info-row">
            <span class="label">طريقة الدفع</span>
            <span class="value">${payment.paymentMethod?.title || '-'}</span>
          </div>
          <div class="info-row">
            <span class="label">المبلغ المدفوع</span>
            <span class="value highlight amount">${payment.payedAmount.toLocaleString('ar-EG')} جم</span>
          </div>
          <div class="info-row">
            <span class="label">المبلغ المتبقي</span>
            <span class="value ${isPaid ? 'highlight' : 'danger'}">${payment.remainedAmount.toLocaleString('ar-EG')} جم</span>
          </div>
          <div class="info-row" style="border-bottom: none; padding-top: 8px;">
            <span class="label">الحالة</span>
            <span class="value">
              <span class="status-badge">${paymentStatus}</span>
            </span>
          </div>
          
          ${payment.note ? `
            <div class="section-title" style="margin-top: 16px;">📝 ملاحظات</div>
            <div class="note-text">${payment.note}</div>
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
            <button class="btn-delete" id="deletePaymentBtn">
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
      this.printRentReceipt(payment);
    };
    
    const deletePayment = () => {
      closeModal();
      this.deletePayment(payment);
    };
    
    modalContent.querySelector('#closeModalBtn')?.addEventListener('click', closeModal);
    modalContent.querySelector('#printReceiptBtn')?.addEventListener('click', printReceipt);
    modalContent.querySelector('#deletePaymentBtn')?.addEventListener('click', deletePayment);
    
    modalContainer.addEventListener('click', (e) => {
      if (e.target === modalContainer) {
        closeModal();
      }
    });
  }

  // ==========================================================================
  // PROFESSIONAL RENT RECEIPT PRINTING WITH WATERMARK
  // ==========================================================================

  printRentReceipt(payment: any): void {
    const printWindow = window.open('', '_blank', 'width=350,height=600,scrollbars=no,menubar=no,toolbar=no,status=no');
    if (!printWindow) {
      this.notification.showError('تعذر فتح نافذة الطباعة. يرجى السماح بالنوافذ المنبثقة.');
      return;
    }

    const data = this.prepareRentReceiptData(payment);
    const html = this.buildRentReceiptHTML(data);
    
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

  private prepareRentReceiptData(payment: any): any {
    const isPaid = payment.remainedAmount === 0;
    const totalPaid = payment.payedAmount || 0;
    const remainedAmount = payment.remainedAmount || 0;
    const effect = payment.rentType?.effect;
    const effectLabel = this.getEffectLabel(effect);
    const effectIcon = effect ? '↑' : '↓';
    const effectColor = this.getEffectColor(effect);

    return {
      id: payment.id || '0000',
      placeTitle: payment.place?.title || 'غير محدد',
      rentTypeTitle: payment.rentType?.title || 'غير محدد',
      rentAmount: payment.rentAmount || 0,
      payedAmount: totalPaid,
      remainedAmount: remainedAmount,
      paymentMethod: payment.paymentMethod?.title || 'غير محدد',
      paymentDate: this.formatDate(payment.paymentDate),
      isPaid: isPaid,
      statusColor: isPaid ? '#065f46' : '#92400e',
      statusBg: isPaid ? '#d1fae5' : '#fef3c7',
      paymentStatus: isPaid ? 'مدفوع بالكامل' : 'متبقي',
      effectLabel: effectLabel,
      effectIcon: effectIcon,
      effectColor: effectColor,
      note: payment.note || '',
      currentDate: this.formatDate(new Date())
    };
  }

  private buildRentReceiptHTML(data: any): string {
    const logoPath = window.location.origin + '/assets/images/mainLogo.jpeg';
    
    return `
<!DOCTYPE html>
<html dir="rtl">
<head>
<meta charset="UTF-8">
<title>إيصال دفع إيجار #${data.id}</title>
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
    color: #8b5cf6;
    letter-spacing: 4px;
    text-transform: uppercase;
    white-space: nowrap;
    opacity: 0.03;
    pointer-events: none;
    z-index: 0;
    text-shadow: 0 2px 8px rgba(139, 92, 246, 0.1);
  }

  .receipt-content {
    position: relative;
    z-index: 1;
  }

  .logo-section {
    text-align: center;
    padding: 1mm 0 1mm 0;
    border-bottom: 2.5px solid #8b5cf6;
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
    border: 2px solid #8b5cf6;
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
    color: #8b5cf6;
    font-weight: 600;
    display: block;
    margin-top: -1px;
  }

  .logo-text {
    display: flex;
    flex-direction: column;
    line-height: 1.2;
  }

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
    color: #8b5cf6;
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
  }
  .info-row .value.danger {
    color: #dc2626;
    font-weight: 700;
  }

  .payment-details {
    background: #f8fafc;
    border-radius: 1mm;
    padding: 1mm 2mm;
    margin-top: 0.5mm;
  }
  .payment-details .info-row {
    border-bottom-color: #e2e8f0;
    padding: 0.3mm 0;
  }
  .payment-details .info-row:last-child { border-bottom: none; }

  .status-badge {
    display: inline-block;
    padding: 0px 2mm;
    border-radius: 3mm;
    font-size: 7pt;
    font-weight: 600;
  }
  
  .effect-badge {
    display: inline-block;
    padding: 0px 2mm;
    border-radius: 3mm;
    font-size: 7pt;
    font-weight: 600;
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
    background: #8b5cf6;
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
    .status-badge,
    .effect-badge,
    .payment-details,
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
    .payment-details { padding: 0.5mm 1mm !important; }
    .status-badge { font-size: 5.5pt !important; padding: 0px 1mm !important; }
    .effect-badge { font-size: 5.5pt !important; padding: 0px 1mm !important; }
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
          <span class="receipt-type">✦ إيصال دفع إيجار ✦</span>
        </div>
      </div>

      <!-- RECEIPT TITLE -->
      <div class="receipt-title">
        <h1>إيصال دفع إيجار</h1>
        <div class="receipt-number">#${data.id}</div>
      </div>

      <!-- BODY -->
      <div class="receipt-body">
        <!-- Place Info -->
        <div class="receipt-section">
          <div class="section-title">🏢 الموقع</div>
          <div class="info-row">
            <span class="label">الموقع</span>
            <span class="value">${data.placeTitle}</span>
          </div>
          <div class="info-row">
            <span class="label">نوع الإيجار</span>
            <span class="value">${data.rentTypeTitle}</span>
          </div>
          <div class="info-row">
            <span class="label">التأثير المالي</span>
            <span class="value">
              <span class="effect-badge" style="background: ${data.effectColor}22; color: ${data.effectColor}; border: 1px solid ${data.effectColor}44; padding: 0px 2mm; border-radius: 3mm; font-size: 7pt; font-weight: 600;">
                ${data.effectIcon} ${data.effectLabel}
              </span>
            </span>
          </div>
          <div class="info-row">
            <span class="label">تاريخ الدفع</span>
            <span class="value">${data.paymentDate}</span>
          </div>
          <div class="info-row">
            <span class="label">قيمة الإيجار</span>
            <span class="value">${data.rentAmount.toLocaleString('ar-EG')} جم</span>
          </div>
        </div>

        <hr class="divider-line">

        <!-- Payment Details -->
        <div class="receipt-section">
          <div class="section-title">💰 الدفعة</div>
          <div class="payment-details">
            <div class="info-row">
              <span class="label">طريقة الدفع</span>
              <span class="value">${data.paymentMethod}</span>
            </div>
            <div class="info-row">
              <span class="label">المبلغ المدفوع</span>
              <span class="value highlight amount">${data.payedAmount.toLocaleString('ar-EG')} جم</span>
            </div>
            <div class="info-row">
              <span class="label">المبلغ المتبقي</span>
              <span class="value ${data.remainedAmount === 0 ? 'highlight' : 'danger'}">${data.remainedAmount.toLocaleString('ar-EG')} جم</span>
            </div>
            <div class="info-row" style="border-bottom: none;">
              <span class="label">الحالة</span>
              <span class="value">
                <span class="status-badge" style="background: ${data.statusBg}; color: ${data.statusColor};">
                  ${data.paymentStatus}
                </span>
              </span>
            </div>
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
  // EXPORT FUNCTIONS WITH WATERMARK
  // ==========================================================================

  exportToExcel() {
    if (this.allPayments.length === 0) {
      this.notification.showWarning('لا توجد بيانات لتصديرها');
      return;
    }

    const exportData = this.allPayments.map((item, index) => ({
      '#': (this.currentPage * this.pageSize) + index + 1,
      'الموقع': item.place?.title || '-',
      'نوع الإيجار': item.rentType?.title || '-',
      'التأثير المالي': this.getEffectLabel(item.rentType?.effect),
      'قيمة الإيجار': item.rentAmount,
      'المبلغ المدفوع': item.payedAmount,
      'المبلغ المتبقي': item.remainedAmount,
      'تاريخ الدفع': item.paymentDate,
      'طريقة الدفع': item.paymentMethod?.title || '-'
    }));

    this.reportService.exportToExcel(exportData, 'place-rent-payments-list', 'مدفوعات إيجار المواقع');
    this.notification.showSuccess('تم تصدير البيانات بنجاح');
  }

  exportToPDF() {
    if (this.allPayments.length === 0) {
      this.notification.showWarning('لا توجد بيانات لتصديرها');
      return;
    }

    this.isLoading = true;

    const filterTexts: string[] = [];
    if (this.filters.placeId) {
      const place = this.places.find(p => p.id === this.filters.placeId);
      if (place) filterTexts.push(`الموقع: ${place.title}`);
    }
    if (this.filters.rentTypeId) {
      const rentType = this.rentTypes.find(r => r.id === this.filters.rentTypeId);
      if (rentType) filterTexts.push(`نوع الإيجار: ${rentType.title}`);
    }
    if (this.filters.rentTypeEffect !== null && this.filters.rentTypeEffect !== undefined) {
      filterTexts.push(`التأثير المالي: ${this.getEffectLabel(this.filters.rentTypeEffect)}`);
    }
    if (this.filters.paymentMethodId) {
      const paymentMethod = this.paymentMethods.find(p => p.id === this.filters.paymentMethodId);
      if (paymentMethod) filterTexts.push(`طريقة الدفع: ${paymentMethod.title}`);
    }
    if (this.filters.paymentDateFrom) filterTexts.push(`من تاريخ: ${this.filters.paymentDateFrom}`);
    if (this.filters.paymentDateTo) filterTexts.push(`إلى تاريخ: ${this.filters.paymentDateTo}`);
    if (this.quickSearch) filterTexts.push(`بحث: ${this.quickSearch}`);

    const totalPayments = this.allPayments.length;
    const totalPayed = this.totalPayedAmount;
    const totalRemained = this.totalRemainedAmount;
    const totalRent = this.totalRentAmount;
    const fullyPaid = this.allPayments.filter(p => p.remainedAmount === 0).length;
    const incomeTotal = this.incomeTotal;
    const expenseTotal = this.expenseTotal;

    const logoPath = window.location.origin + '/assets/images/mainLogo.jpeg';

    let tableRows = '';
    this.allPayments.forEach((item: any, index: number) => {
      const remainedClass = item.remainedAmount === 0 ? 'color: #059669;' : 'color: #d97706; font-weight: bold;';
      const effectColor = this.getEffectColor(item.rentType?.effect);
      const effectLabel = this.getEffectLabel(item.rentType?.effect);
      const effectIcon = item.rentType?.effect ? '↑' : '↓';
      
      tableRows += `
        <tr>
          <td style="text-align: center; padding: 8px; border: 1px solid rgba(229, 231, 235, 0.3); font-size: 11px; background: transparent;">${index + 1}</td>
          <td style="text-align: right; padding: 8px; border: 1px solid rgba(229, 231, 235, 0.3); font-weight: 600; font-size: 11px; background: transparent;">${item.place?.title || '-'}</td>
          <td style="text-align: right; padding: 8px; border: 1px solid rgba(229, 231, 235, 0.3); font-size: 11px; background: transparent;">${item.rentType?.title || '-'}</td>
          <td style="text-align: center; padding: 8px; border: 1px solid rgba(229, 231, 235, 0.3); font-size: 11px; background: transparent;">
            <span style="background: ${effectColor}; color: white; border-radius: 16px; padding: 4px 12px; display: inline-block; font-weight: 600; font-size: 11px;">
              ${effectIcon} ${effectLabel}
            </span>
          </td>
          <td style="text-align: center; padding: 8px; border: 1px solid rgba(229, 231, 235, 0.3); font-size: 11px; background: transparent; font-weight: 700; color: #1a1a2e;">${item.rentAmount.toLocaleString('ar-EG')} جم</td>
          <td style="text-align: center; padding: 8px; border: 1px solid rgba(229, 231, 235, 0.3); font-weight: bold; color: #10b981; font-size: 11px; background: transparent;">
            ${item.payedAmount.toLocaleString('ar-EG')} جم
          </td>
          <td style="text-align: center; padding: 8px; border: 1px solid rgba(229, 231, 235, 0.3); ${remainedClass} font-size: 11px; background: transparent;">
            ${item.remainedAmount.toLocaleString('ar-EG')} جم
          </td>
          <td style="text-align: center; padding: 8px; border: 1px solid rgba(229, 231, 235, 0.3); font-size: 11px; background: transparent;">${item.paymentDate || '-'}</td>
          <td style="text-align: center; padding: 8px; border: 1px solid rgba(229, 231, 235, 0.3); font-size: 11px; background: transparent;">${item.paymentMethod?.title || '-'}</td>
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
        <title>تقرير مدفوعات إيجار المواقع</title>
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
            color: #8b5cf6;
            letter-spacing: 6px;
            text-transform: uppercase;
            white-space: nowrap;
            opacity: 0.05;
            text-shadow: 0 4px 20px rgba(139, 92, 246, 0.15);
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
            .totals-grid {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            .total-card {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
          }
          
          .header {
            text-align: center;
            margin-bottom: 10px;
            padding: 10px 16px;
            background: linear-gradient(135deg, #6d28d9 0%, #8b5cf6 50%, #a78bfa 100%);
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
          
          .totals-grid {
            display: grid;
            grid-template-columns: repeat(7, 1fr);
            gap: 5px;
            margin-bottom: 8px;
          }
          
          .total-card {
            background: rgba(255, 255, 255, 0.85);
            border-radius: 6px;
            padding: 5px 8px;
            text-align: center;
            border: 1px solid rgba(229, 231, 235, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 4px;
            min-height: 30px;
            backdrop-filter: blur(4px);
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          
          .total-card .total-icon {
            font-size: 13px;
            flex-shrink: 0;
          }
          
          .total-card .total-value {
            font-size: 14px;
            font-weight: 700;
            color: #1e293b;
            line-height: 1.2;
          }
          
          .total-card .total-label {
            font-size: 9px;
            color: #64748b;
            margin-right: 2px;
            font-weight: 500;
          }
          
          .total-card.total-all {
            background: linear-gradient(135deg, #6d28d9 0%, #8b5cf6 50%, #a78bfa 100%);
            color: white;
            border-color: #8b5cf6;
          }
          .total-card.total-all .total-value {
            color: white;
          }
          .total-card.total-all .total-label {
            color: rgba(255, 255, 255, 0.85);
          }
          
          .total-card.total-amount {
            background: rgba(219, 234, 254, 0.85);
            border-color: rgba(147, 197, 253, 0.5);
          }
          .total-card.total-amount .total-value {
            color: #2563eb;
          }
          
          .total-card.total-remaining {
            background: rgba(254, 243, 199, 0.85);
            border-color: rgba(252, 211, 77, 0.5);
          }
          .total-card.total-remaining .total-value {
            color: #d97706;
          }
          
          .total-card.total-payments {
            background: rgba(209, 250, 229, 0.85);
            border-color: rgba(110, 231, 183, 0.5);
          }
          .total-card.total-payments .total-value {
            color: #059669;
          }
          
          .total-card.total-income {
            background: rgba(209, 250, 229, 0.85);
            border-color: rgba(110, 231, 183, 0.5);
          }
          .total-card.total-income .total-value {
            color: #059669;
          }
          
          .total-card.total-expense {
            background: rgba(254, 226, 226, 0.85);
            border-color: rgba(248, 113, 113, 0.5);
          }
          .total-card.total-expense .total-value {
            color: #dc2626;
          }
          
          .total-card.total-rent {
            background: rgba(243, 232, 255, 0.85);
            border-color: rgba(196, 181, 253, 0.5);
          }
          .total-card.total-rent .total-value {
            color: #7c3aed;
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
            background: linear-gradient(135deg, #6d28d9 0%, #8b5cf6 50%, #a78bfa 100%);
            color: white;
            padding: 5px 4px;
            border: 1px solid #8b5cf6;
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
            .totals-grid {
              grid-template-columns: repeat(4, 1fr);
              gap: 4px;
            }
            .total-card {
              padding: 4px 6px;
              min-height: 26px;
            }
            .total-card .total-value {
              font-size: 12px;
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
            .totals-grid {
              grid-template-columns: repeat(2, 1fr);
            }
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
              <h1>📋 تقرير مدفوعات إيجار المواقع</h1>
              <p>${new Date().toLocaleDateString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
              <p style="font-size: 10px; opacity: 0.8;">عدد السجلات: ${totalPayments} دفعة</p>
            </div>
            
            ${filterTexts.length > 0 ? `<div class="filters"><strong>🔍 الفلاتر:</strong> ${filterTexts.join(' | ')}</div>` : ''}
            
            <div class="totals-grid">
              <div class="total-card total-all">
                <span class="total-value">${totalPayments}</span>
                <span class="total-label">عدد الدفعات</span>
              </div>
              <div class="total-card total-rent">
                <span class="total-value">${totalRent.toLocaleString('ar-EG')} جم</span>
                <span class="total-label">إجمالي الإيجار</span>
              </div>
              <div class="total-card total-amount">
                <span class="total-value">${totalPayed.toLocaleString('ar-EG')} جم</span>
                <span class="total-label">إجمالي المدفوع</span>
              </div>
              <div class="total-card total-remaining">
                <span class="total-value">${totalRemained.toLocaleString('ar-EG')} جم</span>
                <span class="total-label">إجمالي المتبقي</span>
              </div>
              <div class="total-card total-payments">
                <span class="total-value">${fullyPaid}</span>
                <span class="total-label">مدفوع بالكامل</span>
              </div>
              <div class="total-card total-income">
                <span class="total-value">${incomeTotal.toLocaleString('ar-EG')} جم</span>
                <span class="total-label">إجمالي الإيرادات</span>
              </div>
              <div class="total-card total-expense">
                <span class="total-value">${expenseTotal.toLocaleString('ar-EG')} جم</span>
                <span class="total-label">إجمالي المصروفات</span>
              </div>
            </div>
            
            <table>
              <thead>
                <tr>
                  <th style="width: 4%;">#</th>
                  <th style="width: 16%;">الموقع</th>
                  <th style="width: 12%;">نوع الإيجار</th>
                  <th style="width: 12%;">التأثير</th>
                  <th style="width: 10%;">قيمة الإيجار</th>
                  <th style="width: 10%;">المدفوع</th>
                  <th style="width: 10%;">المتبقي</th>
                  <th style="width: 12%;">تاريخ الدفع</th>
                  <th style="width: 10%;">طريقة الدفع</th>
                </tr>
              </thead>
              <tbody>
                ${tableRows}
              </tbody>
            </table>
            
            <div class="footer">
              الأكاديمية الأولمبية لعلوم الرياضة &copy; ${new Date().getFullYear()} - ${totalPayments} دفعة
            </div>
          </div>
        </div>
        
        <div class="no-print" style="text-align: center; margin-top: 10px; padding: 10px; position: fixed; bottom: 0; left: 0; right: 0; background: white; box-shadow: 0 -2px 10px rgba(0,0,0,0.1); z-index: 9999;">
          <button onclick="window.print();" style="padding: 8px 24px; background: linear-gradient(135deg, #6d28d9 0%, #8b5cf6 50%, #a78bfa 100%); color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 14px; font-weight: 600; box-shadow: 0 2px 10px rgba(139, 92, 246, 0.3);">
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
      this.notification.showSuccess(`تم فتح التقرير - ${totalPayments} دفعة`);
    } else {
      document.body.appendChild(printContainer);
      window.print();
      setTimeout(() => {
        if (document.body.contains(printContainer)) {
          document.body.removeChild(printContainer);
        }
      }, 500);
      this.isLoading = false;
      this.notification.showSuccess(`تم فتح التقرير - ${totalPayments} دفعة`);
    }
  }

  printList(): void {
    this.exportToPDF();
  }
}