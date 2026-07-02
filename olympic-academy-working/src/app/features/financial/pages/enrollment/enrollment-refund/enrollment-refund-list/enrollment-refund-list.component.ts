import { Component, OnInit, ViewChild, AfterViewInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';

import { FinancialService } from '../../../../../../core/services/financial.service';
import { CourseService } from '../../../../../../core/services/course.service';
import { NotificationService } from '../../../../../../core/services/notification.service';
import { ReportService } from '../../../../../../core/services/report.service';
import { REFUND_STATUSES } from '../../../../../../core/models/financial.model';
import { SearchableSelectComponent, SelectOption } from '../../../../../../shared/components/searchable-select/searchable-select.component';
import { EnrollmentRefundWizardModalComponent } from '../enrollment-refund-wizard/enrollment-refund-wizard-modal.component';

@Component({
  selector: 'app-enrollment-refund-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatDialogModule,
    SearchableSelectComponent
  ],
  templateUrl: './enrollment-refund-list.component.html',
  styleUrls: ['./enrollment-refund-list.component.css']
})
export class EnrollmentRefundListComponent implements OnInit, AfterViewInit, OnDestroy {
  
  Math = Math;
  
  // ==========================================================================
  // TABLE CONFIGURATION
  // ==========================================================================

  displayedColumns: string[] = ['id', 'trainee', 'course', 'amountRefunded', 'refundDate', 'paymentMethod', 'status', 'actions'];
  dataSource = new MatTableDataSource<any>([]);
  allRefunds: any[] = [];
  isLoading = false;
  refundStatuses = REFUND_STATUSES;
  
  // ==========================================================================
  // PAGINATION
  // ==========================================================================

  totalItems: number = 0;
  pageSize: number = 25;
  pageSizeOptions: number[] = [5, 10, 25, 50, 100];
  currentPage: number = 0;
  
  // ==========================================================================
  // SORTING
  // ==========================================================================

  sortBy: string = 'CREATION_DATE';
  sortDir: string = 'DESC';
  
  // ==========================================================================
  // DATA FOR FILTERS
  // ==========================================================================

  courses: any[] = [];
  enrollments: any[] = [];
  paymentMethods: any[] = [];
  
  // ==========================================================================
  // OPTIONS FOR SEARCHABLE SELECTS
  // ==========================================================================

  courseOptions: SelectOption[] = [];
  enrollmentOptions: SelectOption[] = [];
  paymentMethodOptions: SelectOption[] = [];
  refundStatusOptions: SelectOption[] = [];
  
  // ==========================================================================
  // FILTER CRITERIA
  // ==========================================================================

  filters = {
    courseId: null as number | null,
    enrollmentId: null as number | null,
    paymentMethodId: null as number | null,
    status: null as number | null,
    refundDateFrom: null as string | null,
    refundDateTo: null as string | null
  };
  
  quickSearch: string = '';
  selectedRefund: any = null;

  // ==========================================================================
  // VIEW CHILDREN
  // ==========================================================================

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  // ==========================================================================
  // DESTROY SUBJECT
  // ==========================================================================

  private destroy$ = new Subject<void>();

  // ==========================================================================
  // CONSTRUCTOR
  // ==========================================================================

  constructor(
    private financialService: FinancialService,
    private courseService: CourseService,
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
    this.loadSelectOptions();
    this.loadLookupData();
    this.loadData();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ==========================================================================
  // GET TOTAL PAGES
  // ==========================================================================

  getTotalPages(): number {
    return Math.ceil(this.totalItems / this.pageSize);
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

  loadSelectOptions(): void {
    this.refundStatusOptions = [
      { value: null, label: 'الكل' },
      ...this.refundStatuses.map(s => ({ value: s.id, label: s.title }))
    ];
  }

  loadLookupData() {
    // Load courses for filter
    this.courseService.getAllCourses()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          this.courses = res.items || [];
          this.courseOptions = [
            { value: null, label: 'الكل' },
            ...this.courses.map(c => ({ value: c.id, label: c.title }))
          ];
        },
        error: () => {
          this.notification.showError('حدث خطأ في تحميل الدورات');
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
  // LOAD DATA WITH PAGINATION
  // ==========================================================================

  loadData() {
    this.isLoading = true;
    const params: any = {
      pageNum: this.currentPage,
      pageSize: this.pageSize
    };
    
    if (this.filters.courseId) params.courseId = this.filters.courseId;
    if (this.filters.enrollmentId) params.enrollmentId = this.filters.enrollmentId;
    if (this.filters.paymentMethodId) params.paymentMethodId = this.filters.paymentMethodId;
    if (this.filters.status) params.status = this.filters.status;
    if (this.filters.refundDateFrom) params.refundDateFrom = this.filters.refundDateFrom;
    if (this.filters.refundDateTo) params.refundDateTo = this.filters.refundDateTo;
    if (this.quickSearch) params.quickSearch = this.quickSearch;
    
    if (this.sortBy) params.orderBy = this.sortBy;
    if (this.sortDir) params.orderDir = this.sortDir;

    this.financialService.getAllEnrollmentRefundsByFilter(params)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          this.allRefunds = res.items || [];
          this.totalItems = res.total || 0;
          this.dataSource.data = this.allRefunds;
          
          // Extract unique enrollments for filter dropdown
          const uniqueEnrollments = new Map();
          res.items.forEach((item: any) => {
            if (item.enrollment && !uniqueEnrollments.has(item.enrollment.id)) {
              uniqueEnrollments.set(item.enrollment.id, {
                id: item.enrollment.id,
                title: `${item.enrollment.trainee?.fullName || ''} - ${item.enrollment.course?.title || ''}`,
                traineeTitle: item.enrollment.trainee?.fullName,
                courseTitle: item.enrollment.course?.title
              });
            }
          });
          this.enrollments = Array.from(uniqueEnrollments.values());
          this.enrollmentOptions = [
            { value: null, label: 'الكل' },
            ...this.enrollments.map(e => ({ value: e.id, label: e.title }))
          ];
          
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
    this.quickSearch = (event.target as HTMLInputElement).value;
    this.currentPage = 0;
    this.loadData();
  }

  resetFilters() {
    this.filters = {
      courseId: null,
      enrollmentId: null,
      paymentMethodId: null,
      status: null,
      refundDateFrom: null,
      refundDateTo: null
    };
    this.quickSearch = '';
    this.currentPage = 0;
    this.loadData();
    this.notification.showSuccess('تم مسح جميع الفلاتر');
  }

  hasActiveFilters(): boolean {
    return !!(this.filters.courseId || 
              this.filters.enrollmentId || 
              this.filters.paymentMethodId || 
              this.filters.status || 
              this.filters.refundDateFrom || 
              this.filters.refundDateTo || 
              this.quickSearch);
  }

  getActiveFiltersCount(): number {
    let count = 0;
    if (this.filters.courseId) count++;
    if (this.filters.enrollmentId) count++;
    if (this.filters.paymentMethodId) count++;
    if (this.filters.status) count++;
    if (this.filters.refundDateFrom) count++;
    if (this.filters.refundDateTo) count++;
    if (this.quickSearch) count++;
    return count;
  }

  // ==========================================================================
  // REFUND OPERATIONS
  // ==========================================================================

  openNewRefundModal() {
    const dialogRef = this.dialog.open(EnrollmentRefundWizardModalComponent, {
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

  viewRefund(id: number) {
    this.financialService.getEnrollmentRefundById(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (refund) => {
          this.selectedRefund = refund;
          this.openDetailsModal();
        },
        error: () => {
          this.notification.showError('حدث خطأ في تحميل بيانات الاسترداد');
        }
      });
  }

  editRefund(id: number) {
    const dialogRef = this.dialog.open(EnrollmentRefundWizardModalComponent, {
      data: { refundId: id },
      width: '800px',
      maxWidth: '90vw'
    });
    
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadData();
      }
    });
  }

  deleteRefund(item: any) {
    if (confirm(`هل أنت متأكد من حذف استرداد التسجيل؟`)) {
      this.financialService.deleteEnrollmentRefund(item.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.notification.showSuccess('تم الحذف بنجاح');
            this.loadData();
          },
          error: () => {
            this.notification.showError('حدث خطأ في الحذف');
          }
        });
    }
  }

  // ==========================================================================
  // DETAILS MODAL
  // ==========================================================================

  openDetailsModal(): void {
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
    
    const refund = this.selectedRefund;
    const today = new Date().toLocaleDateString('ar-EG');
    const refundNumber = `REF-${refund.id}`;
    
    const getStatusBadgeStyle = (statusId: number) => {
      switch(statusId) {
        case 2: return 'background: #d1fae5; color: #065f46;';
        case 4: return 'background: #dbeafe; color: #1e40af;';
        case 1: return 'background: #fef3c7; color: #92400e;';
        case 3: return 'background: #fee2e2; color: #991b1b;';
        default: return 'background: #f3f4f6; color: #374151;';
      }
    };
    
    modalContent.innerHTML = `
      <div style="padding: 20px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; padding-bottom: 15px; border-bottom: 2px solid #e5e7eb;">
          <h2 style="margin: 0; color: #dc2626; font-size: 20px;">تفاصيل الاسترداد</h2>
          <button id="closeModalBtn" style="background: none; border: none; font-size: 24px; cursor: pointer; color: #6b7280;">&times;</button>
        </div>
        
        <div style="max-width: 100%;">
          <div style="text-align: center; margin-bottom: 20px; padding: 15px; background: linear-gradient(135deg, #ef4444 0%, #b91c1c 100%); color: white; border-radius: 10px;">
            <h1 style="margin: 0; font-size: 18px;">إيصال استرداد مبلغ</h1>
            <p style="margin: 5px 0 0 0; font-size: 11px; opacity: 0.9;">نظام إدارة الأكاديمية الأولمبية</p>
          </div>
          
          <div style="display: flex; justify-content: space-between; margin-bottom: 15px; padding: 8px 12px; background: #f9fafb; border-radius: 8px; font-size: 12px;">
            <div><strong>رقم الإيصال:</strong> ${refundNumber}</div>
            <div><strong>تاريخ الإصدار:</strong> ${today}</div>
          </div>
          
          <h3 style="color: #dc2626; border-bottom: 2px solid #dc2626; padding-bottom: 5px; margin-top: 15px; margin-bottom: 10px; font-size: 16px;">📋 معلومات التسجيل</h3>
          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin-bottom: 10px;">
            <div style="border-bottom: 1px solid #e5e7eb; padding: 5px 0;"><div style="font-weight: 600; color: #374151; font-size: 11px;">المتدرب</div><div style="color: #1f2937; font-size: 12px;">${refund.enrollment?.trainee?.fullName || '-'}</div></div>
            <div style="border-bottom: 1px solid #e5e7eb; padding: 5px 0;"><div style="font-weight: 600; color: #374151; font-size: 11px;">الدورة التدريبية</div><div style="color: #1f2937; font-size: 12px;">${refund.enrollment?.course?.title || '-'}</div></div>
            <div style="border-bottom: 1px solid #e5e7eb; padding: 5px 0;"><div style="font-weight: 600; color: #374151; font-size: 11px;">المدرب</div><div style="color: #1f2937; font-size: 12px;">${refund.enrollment?.trainer?.fullName || '-'}</div></div>
            <div style="border-bottom: 1px solid #e5e7eb; padding: 5px 0;"><div style="font-weight: 600; color: #374151; font-size: 11px;">تاريخ التسجيل</div><div style="color: #1f2937; font-size: 12px;">${refund.enrollment?.startDate ? new Date(refund.enrollment.startDate).toLocaleDateString('ar-EG') : '-'}</div></div>
          </div>
          
          <h3 style="color: #dc2626; border-bottom: 2px solid #dc2626; padding-bottom: 5px; margin-top: 15px; margin-bottom: 10px; font-size: 16px;">💰 تفاصيل الاسترداد</h3>
          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin-bottom: 10px;">
            <div style="border-bottom: 1px solid #e5e7eb; padding: 5px 0;"><div style="font-weight: 600; color: #374151; font-size: 11px;">المبلغ المسترد</div><div style="color: #dc2626; font-size: 16px; font-weight: 700;">${refund.amountRefunded.toLocaleString('ar-EG')} جم</div></div>
            <div style="border-bottom: 1px solid #e5e7eb; padding: 5px 0;"><div style="font-weight: 600; color: #374151; font-size: 11px;">تاريخ الاسترداد</div><div style="color: #1f2937; font-size: 12px;">${new Date(refund.refundDate).toLocaleDateString('ar-EG')}</div></div>
            <div style="border-bottom: 1px solid #e5e7eb; padding: 5px 0;"><div style="font-weight: 600; color: #374151; font-size: 11px;">طريقة الدفع</div><div style="color: #1f2937; font-size: 12px;">${refund.paymentMethod?.title || '-'}</div></div>
            <div style="border-bottom: 1px solid #e5e7eb; padding: 5px 0;"><div style="font-weight: 600; color: #374151; font-size: 11px;">حالة الاسترداد</div><div style="color: #1f2937; font-size: 12px;"><span style="display: inline-block; padding: 2px 10px; border-radius: 20px; font-size: 11px; font-weight: 500; ${getStatusBadgeStyle(refund.refundStatus?.id)}">${refund.refundStatus?.title || '-'}</span></div></div>
          </div>
          
          <div style="margin: 12px 0; padding: 12px; background: #fef3c7; border-radius: 10px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 6px; font-size: 12px;"><span style="font-weight: 600;">قيمة التسجيل الإجمالية:</span><span style="font-weight: 700;">${(refund.enrollment?.finalSubscriptionValue || 0).toLocaleString('ar-EG')} جم</span></div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 6px; font-size: 12px;"><span style="font-weight: 600;">المبلغ المدفوع:</span><span style="font-weight: 700; color: #059669;">${((refund.enrollment?.finalSubscriptionValue || 0) - (refund.enrollment?.remainedSubscriptionValue || 0)).toLocaleString('ar-EG')} جم</span></div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 6px; font-size: 12px;"><span style="font-weight: 600;">المبلغ المسترد الآن:</span><span style="font-weight: 700; color: #dc2626;">${refund.amountRefunded.toLocaleString('ar-EG')} جم</span></div>
          </div>
          
          ${refund.note ? `
          <h3 style="color: #dc2626; border-bottom: 2px solid #dc2626; padding-bottom: 5px; margin-top: 15px; margin-bottom: 10px; font-size: 16px;">📝 ملاحظات</h3>
          <div style="padding: 10px; background: #f9fafb; border-radius: 8px; margin-bottom: 15px;"><div style="color: #1f2937; font-size: 12px;">${refund.note}</div></div>
          ` : ''}
          
          <div style="margin-top: 25px; display: flex; justify-content: space-between; align-items: flex-end; gap: 15px; padding-top: 15px; border-top: 1px solid #e5e7eb;">
            <div style="text-align: center; flex: 1;"><div style="width: 100%; border-top: 1px solid #000; margin-top: 30px; padding-top: 5px;"></div><div style="font-size: 11px;">توقيع المستلم</div><div style="font-size: 9px; color: #6b7280; margin-top: 5px;">التاريخ: ___ / ___ / _____</div></div>
            <div style="text-align: center; flex: 1;"><div style="width: 100%; border-top: 1px solid #000; margin-top: 30px; padding-top: 5px;"></div><div style="font-size: 11px;">توقيع المحاسب</div><div style="font-size: 9px; color: #6b7280; margin-top: 5px;">التاريخ: ___ / ___ / _____</div></div>
            <div style="text-align: center; flex: 1;"><div style="width: 100%; border-top: 1px solid #000; margin-top: 30px; padding-top: 5px;"></div><div style="font-size: 11px;">ختم الأكاديمية</div><div style="font-size: 9px; color: #6b7280; margin-top: 5px;">التاريخ: ___ / ___ / _____</div></div>
          </div>
          
          <div style="text-align: center; margin-top: 20px; padding: 10px; font-size: 9px; color: #9ca3af; border-top: 1px solid #e5e7eb;">
            تم التصدير من نظام إدارة الأكاديمية الأولمبية<br>
            هذا المستند معتمد ويحتوي على جميع بيانات الاسترداد
          </div>
        </div>
        
        <div style="display: flex; justify-content: center; gap: 15px; margin-top: 20px; padding-top: 15px; border-top: 1px solid #e5e7eb;">
          <button id="printRefundBtn" style="padding: 10px 24px; background: linear-gradient(135deg, #ef4444 0%, #b91c1c 100%); color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 14px; font-weight: 500;">
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
    
    const printRefund = () => {
      this.printRefundDetails(refund);
      closeModal();
    };
    
    modalContent.querySelector('#closeModalBtn')?.addEventListener('click', closeModal);
    modalContent.querySelector('#closeModalBtn2')?.addEventListener('click', closeModal);
    modalContent.querySelector('#printRefundBtn')?.addEventListener('click', printRefund);
    
    // Close on backdrop click
    modalContainer.addEventListener('click', (e) => {
      if (e.target === modalContainer) {
        closeModal();
      }
    });
  }

  printRefundDetails(refund: any): void {
    const printContainer = document.createElement('div');
    printContainer.style.direction = 'rtl';
    printContainer.style.fontFamily = 'Cairo, "Segoe UI", Tahoma, sans-serif';
    printContainer.style.padding = '0';
    printContainer.style.backgroundColor = 'white';
    printContainer.style.maxWidth = '100%';
    printContainer.style.margin = '0';
    
    const today = new Date().toLocaleDateString('ar-EG');
    const refundNumber = `REF-${refund.id}`;
    
    const getStatusBadgeStyle = (statusId: number) => {
      switch(statusId) {
        case 2: return 'background: #d1fae5; color: #065f46;';
        case 4: return 'background: #dbeafe; color: #1e40af;';
        case 1: return 'background: #fef3c7; color: #92400e;';
        case 3: return 'background: #fee2e2; color: #991b1b;';
        default: return 'background: #f3f4f6; color: #374151;';
      }
    };
    
    printContainer.innerHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>إيصال استرداد - ${refundNumber}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; font-family: 'Cairo', 'Segoe UI', Tahoma, sans-serif; }
          @page { size: A4 portrait; margin: 10mm; }
          @media print { body { margin: 0; padding: 0; } .no-print { display: none; } }
          body { background: white; display: flex; justify-content: center; align-items: center; min-height: 100vh; padding: 20px; }
          .container { max-width: 700px; width: 100%; margin: 0 auto; background: white; border-radius: 12px; padding: 20px; }
          .header { text-align: center; margin-bottom: 20px; padding: 15px; background: linear-gradient(135deg, #ef4444 0%, #b91c1c 100%); color: white; border-radius: 10px; }
          .header h1 { margin: 0; font-size: 20px; }
          .header p { margin: 5px 0 0 0; font-size: 11px; opacity: 0.9; }
          .refund-details { display: flex; justify-content: space-between; margin-bottom: 15px; padding: 8px 12px; background: #f9fafb; border-radius: 8px; font-size: 12px; }
          h2 { color: #dc2626; border-bottom: 2px solid #dc2626; padding-bottom: 5px; margin-top: 15px; margin-bottom: 10px; font-size: 16px; }
          .info-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin-bottom: 10px; }
          .info-item { border-bottom: 1px solid #e5e7eb; padding: 5px 0; }
          .info-label { font-weight: 600; color: #374151; font-size: 11px; margin-bottom: 2px; }
          .info-value { color: #1f2937; font-size: 12px; font-weight: 500; }
          .info-value.amount { font-weight: 700; color: #dc2626; font-size: 16px; }
          .info-value.paid { color: #059669; font-weight: 700; }
          .full-width { grid-column: span 2; }
          .status-badge { display: inline-block; padding: 2px 10px; border-radius: 20px; font-size: 11px; font-weight: 500; ${getStatusBadgeStyle(refund.refundStatus?.id)} }
          .financial-summary { margin: 12px 0; padding: 12px; background: #fef3c7; border-radius: 10px; }
          .financial-row { display: flex; justify-content: space-between; margin-bottom: 6px; font-size: 12px; }
          .financial-label { font-weight: 600; color: #374151; }
          .financial-value { font-weight: 700; }
          .financial-value.refund { color: #dc2626; }
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
          <div class="header"><h1>إيصال استرداد مبلغ</h1><p>نظام إدارة الأكاديمية الأولمبية</p></div>
          <div class="refund-details"><div><strong>رقم الإيصال:</strong> ${refundNumber}</div><div><strong>تاريخ الإصدار:</strong> ${today}</div></div>
          <h2>📋 معلومات التسجيل</h2>
          <div class="info-grid">
            <div class="info-item"><div class="info-label">المتدرب</div><div class="info-value">${refund.enrollment?.trainee?.fullName || '-'}</div></div>
            <div class="info-item"><div class="info-label">الدورة التدريبية</div><div class="info-value">${refund.enrollment?.course?.title || '-'}</div></div>
            <div class="info-item"><div class="info-label">المدرب</div><div class="info-value">${refund.enrollment?.trainer?.fullName || '-'}</div></div>
            <div class="info-item"><div class="info-label">تاريخ التسجيل</div><div class="info-value">${refund.enrollment?.startDate ? new Date(refund.enrollment.startDate).toLocaleDateString('ar-EG') : '-'}</div></div>
          </div>
          <h2>💰 تفاصيل الاسترداد</h2>
          <div class="info-grid">
            <div class="info-item"><div class="info-label">المبلغ المسترد</div><div class="info-value amount">${refund.amountRefunded.toLocaleString('ar-EG')} جم</div></div>
            <div class="info-item"><div class="info-label">تاريخ الاسترداد</div><div class="info-value">${new Date(refund.refundDate).toLocaleDateString('ar-EG')}</div></div>
            <div class="info-item"><div class="info-label">طريقة الدفع</div><div class="info-value">${refund.paymentMethod?.title || '-'}</div></div>
            <div class="info-item"><div class="info-label">حالة الاسترداد</div><div class="info-value"><span class="status-badge">${refund.refundStatus?.title || '-'}</span></div></div>
          </div>
          <div class="financial-summary">
            <div class="financial-row"><span class="financial-label">قيمة التسجيل الإجمالية:</span><span class="financial-value">${(refund.enrollment?.finalSubscriptionValue || 0).toLocaleString('ar-EG')} جم</span></div>
            <div class="financial-row"><span class="financial-label">المبلغ المدفوع:</span><span class="financial-value paid">${((refund.enrollment?.finalSubscriptionValue || 0) - (refund.enrollment?.remainedSubscriptionValue || 0)).toLocaleString('ar-EG')} جم</span></div>
            <div class="financial-row"><span class="financial-label">المبلغ المسترد الآن:</span><span class="financial-value refund">${refund.amountRefunded.toLocaleString('ar-EG')} جم</span></div>
          </div>
          ${refund.note ? `<h2>📝 ملاحظات</h2><div class="info-item full-width"><div class="info-value">${refund.note}</div></div>` : ''}
          <div class="signature-section">
            <div class="signature-box"><div class="signature-line"></div><div style="font-size: 11px;">توقيع المستلم</div><div class="signature-date">التاريخ: ___ / ___ / _____</div></div>
            <div class="signature-box"><div class="signature-line"></div><div style="font-size: 11px;">توقيع المحاسب</div><div class="signature-date">التاريخ: ___ / ___ / _____</div></div>
            <div class="signature-box"><div class="signature-line"></div><div style="font-size: 11px;">ختم الأكاديمية</div><div class="signature-date">التاريخ: ___ / ___ / _____</div></div>
          </div>
          <div class="footer">تم التصدير من نظام إدارة الأكاديمية الأولمبية<br>هذا المستند معتمد ويحتوي على جميع بيانات الاسترداد</div>
        </div>
        <div class="no-print" style="text-align: center; margin-top: 15px; padding: 10px;">
          <button onclick="window.print();" style="padding: 8px 20px; background: linear-gradient(135deg, #ef4444 0%, #b91c1c 100%); color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 12px;">🖨️ طباعة / حفظ كـ PDF</button>
        </div>
      </body>
      </html>
    `;
    
    const printWindow = window.open('', '_blank', 'width=800,height=800,scrollbars=yes');
    if (printWindow) {
      printWindow.document.write(printContainer.innerHTML);
      printWindow.document.close();
      this.notification.showSuccess('تم فتح إيصال الاسترداد - جاري تحضير الطباعة...');
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

  // ==========================================================================
  // TOTALS METHODS
  // ==========================================================================

  getTotalRefundsCount(): number {
    return this.allRefunds.length;
  }

  getTotalRefundedAmount(): number {
    return this.allRefunds.reduce((sum, refund) => sum + (refund.amountRefunded || 0), 0);
  }

  getAverageRefundAmount(): number {
    const count = this.getTotalRefundsCount();
    if (count === 0) return 0;
    return this.getTotalRefundedAmount() / count;
  }

  // ==========================================================================
  // STATUS COLOR HELPERS
  // ==========================================================================

  getStatusColor(statusId: number): string {
    switch(statusId) {
      case 2: return '#d1fae5';
      case 4: return '#dbeafe';
      case 1: return '#fef3c7';
      case 3: return '#fee2e2';
      default: return '#f3f4f6';
    }
  }

  getStatusTextColor(statusId: number): string {
    switch(statusId) {
      case 2: return '#065f46';
      case 4: return '#1e40af';
      case 1: return '#92400e';
      case 3: return '#991b1b';
      default: return '#374151';
    }
  }

  // ==========================================================================
  // EXPORT FUNCTIONS
  // ==========================================================================

  exportToExcel() {
    if (this.allRefunds.length === 0) {
      this.notification.showWarning('لا توجد بيانات لتصديرها');
      return;
    }

    const exportData = this.allRefunds.map((item, index) => ({
      '#': index + 1,
      'المتدرب': item.enrollment?.trainee?.fullName || '-',
      'الدورة': item.enrollment?.course?.title || '-',
      'المبلغ المسترد': item.amountRefunded,
      'تاريخ الاسترداد': item.refundDate,
      'طريقة الدفع': item.paymentMethod?.title || '-',
      'حالة الاسترداد': item.refundStatus?.title || '-',
      'ملاحظات': item.note || '-'
    }));

    this.reportService.exportToExcel(exportData, 'enrollment-refunds-list', 'استردادات التسجيلات');
    this.notification.showSuccess('تم تصدير البيانات بنجاح');
  }

  exportToPDF() {
    if (this.allRefunds.length === 0) {
      this.notification.showWarning('لا توجد بيانات لتصديرها');
      return;
    }

    this.isLoading = true;

    // Build filter text
    const filterTexts: string[] = [];
    if (this.filters.courseId) {
      const course = this.courses.find(c => c.id === this.filters.courseId);
      if (course) filterTexts.push(`الدورة: ${course.title}`);
    }
    if (this.filters.enrollmentId) {
      const enrollment = this.enrollments.find(e => e.id === this.filters.enrollmentId);
      if (enrollment) filterTexts.push(`التسجيل: ${enrollment.title}`);
    }
    if (this.filters.paymentMethodId) {
      const paymentMethod = this.paymentMethods.find(p => p.id === this.filters.paymentMethodId);
      if (paymentMethod) filterTexts.push(`طريقة الدفع: ${paymentMethod.title}`);
    }
    if (this.filters.status) {
      const status = this.refundStatuses.find(s => s.id === this.filters.status);
      if (status) filterTexts.push(`حالة الاسترداد: ${status.title}`);
    }
    if (this.filters.refundDateFrom) filterTexts.push(`من تاريخ: ${this.filters.refundDateFrom}`);
    if (this.filters.refundDateTo) filterTexts.push(`إلى تاريخ: ${this.filters.refundDateTo}`);
    if (this.quickSearch) filterTexts.push(`بحث: ${this.quickSearch}`);

    // Build table rows
    let tableRows = '';
    this.allRefunds.forEach((item: any, index: number) => {
      const statusColor = this.getStatusColor(item.refundStatus?.id);
      const statusTextColor = this.getStatusTextColor(item.refundStatus?.id);
      
      tableRows += `
        <tr>
          <td style="text-align: center; padding: 8px; border: 1px solid #ddd;">${index + 1}</td>
          <td style="text-align: right; padding: 8px; border: 1px solid #ddd;">${item.enrollment?.trainee?.fullName || '-'}</td>
          <td style="text-align: right; padding: 8px; border: 1px solid #ddd;">${item.enrollment?.course?.title || '-'}</td>
          <td style="text-align: center; padding: 8px; border: 1px solid #ddd;">${item.amountRefunded} جم</td>
          <td style="text-align: center; padding: 8px; border: 1px solid #ddd;">${item.refundDate || '-'}</td>
          <td style="text-align: center; padding: 8px; border: 1px solid #ddd;">${item.paymentMethod?.title || '-'}</td>
          <td style="text-align: center; padding: 8px; border: 1px solid #ddd; background-color: ${statusColor}; color: ${statusTextColor};">
            ${item.refundStatus?.title || '-'}
          </td>
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
        <title>تقرير استردادات التسجيلات</title>
        <style>
          * { font-family: 'Cairo', 'Segoe UI', Tahoma, sans-serif; }
          @media print { body { margin: 0; padding: 20px; } .no-print { display: none; } }
          .header { text-align: center; margin-bottom: 20px; padding: 20px; background: linear-gradient(135deg, #ef4444 0%, #b91c1c 100%); color: white; border-radius: 8px; }
          .header h1 { margin: 0; font-size: 24px; }
          .header p { margin: 10px 0 0 0; font-size: 12px; }
          .filters { margin-bottom: 20px; padding: 10px; background-color: #f3f4f6; border-radius: 8px; font-size: 12px; }
          .stats { display: flex; gap: 16px; margin-bottom: 20px; padding: 16px; background: #f9fafb; border-radius: 8px; }
          .stat-item { flex: 1; text-align: center; }
          .stat-label { font-size: 12px; color: #6b7280; }
          .stat-value { font-size: 20px; font-weight: bold; color: #dc2626; }
          table { width: 100%; border-collapse: collapse; direction: rtl; }
          th { background: linear-gradient(135deg, #ef4444 0%, #b91c1c 100%); color: white; padding: 10px; border: 1px solid #ddd; text-align: center; font-weight: bold; }
          td { padding: 8px; border: 1px solid #ddd; }
          .footer { text-align: center; margin-top: 20px; padding: 10px; font-size: 10px; color: #666; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>تقرير استردادات التسجيلات</h1>
          <p>تاريخ التقرير: ${new Date().toLocaleDateString('ar-EG')}</p>
          <p>عدد السجلات: ${this.allRefunds.length} استرداد</p>
        </div>
        ${filterTexts.length > 0 ? `<div class="filters"><strong>الفلاتر المطبقة:</strong> ${filterTexts.join(' | ')}</div>` : ''}
        <div class="stats">
          <div class="stat-item"><div class="stat-value">${this.allRefunds.length}</div><div class="stat-label">عدد الاستردادات</div></div>
          <div class="stat-item"><div class="stat-value">${this.getTotalRefundedAmount().toLocaleString('ar-EG')} جم</div><div class="stat-label">إجمالي المبالغ المستردة</div></div>
          <div class="stat-item"><div class="stat-value">${this.getAverageRefundAmount().toLocaleString('ar-EG')} جم</div><div class="stat-label">متوسط الاسترداد</div></div>
        </div>
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>المتدرب</th>
              <th>الدورة</th>
              <th>المبلغ المسترد</th>
              <th>تاريخ الاسترداد</th>
              <th>طريقة الدفع</th>
              <th>حالة الاسترداد</th>
              <th>ملاحظات</th>
            </tr>
          </thead>
          <tbody>
            ${tableRows}
          </tbody>
        </table>
        <div class="footer">تم التصدير من نظام إدارة الأكاديمية الأولمبية</div>
        <div class="no-print" style="text-align: center; margin-top: 20px; padding: 10px;">
          <button onclick="window.print();" style="padding: 10px 20px; background: linear-gradient(135deg, #ef4444 0%, #b91c1c 100%); color: white; border: none; border-radius: 5px; cursor: pointer;">
            🖨️ طباعة / حفظ كـ PDF
          </button>
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