// enrollment-payment-list.component.ts - COMPLETE WITH ALL METHODS

import {
  Component,
  OnInit,
  ViewChild,
  Inject,
  ChangeDetectorRef,
  OnDestroy,
  AfterViewInit,
  ElementRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
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
import {
  MatDialog,
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';

import { FinancialService } from '../../../../../../core/services/financial.service';
import { CourseService } from '../../../../../../core/services/course.service';
import { NotificationService } from '../../../../../../core/services/notification.service';
import { ReportService } from '../../../../../../core/services/report.service';
import { FileService } from '../../../../../../core/services/file.service';
import { PAYMENT_STATUSES } from '../../../../../../core/models/common.model';
import {
  SearchableSelectComponent,
  SelectOption,
} from '../../../../../../shared/components/searchable-select/searchable-select.component';
import { EnrollmentPaymentDetailsModalComponent } from '../enrollment-payment-details/enrollment-payment-details-modal.component';
import { EnrollmentPaymentWizardModalComponent } from '../enrollment-payment-wizard/enrollment-payment-wizard-modal.component';
import {EnrollmentRefundWizardModalComponent} from '../../enrollment-refund/enrollment-refund-wizard/enrollment-refund-wizard-modal.component';

// ============================================================================
// PAGE SELECTION DIALOG COMPONENT
// ============================================================================

@Component({
  selector: 'app-payment-export-page-select-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDividerModule,
  ],
  template: `
    <div class="dialog-container" dir="rtl">
      <div class="dialog-header" [class.card-print]="isCardPrint">
        <div class="header-icon" [class.card-print]="isCardPrint">
          <mat-icon>{{ isCardPrint ? 'credit_card' : 'description' }}</mat-icon>
        </div>
        <div>
          <h2>{{ isCardPrint ? 'طباعة البطاقات' : 'تصدير التقرير' }}</h2>
          <p>
            {{
              isCardPrint
                ? 'اختر الصفحات التي تريد طباعة بطاقاتها'
                : 'اختر الصفحات التي تريد تصديرها'
            }}
          </p>
        </div>
        <button mat-icon-button (click)="close()" class="close-btn">
          <mat-icon>close</mat-icon>
        </button>
      </div>

      <mat-divider></mat-divider>

      <div class="dialog-body">
        <div class="info-section">
          <div class="info-row">
            <span class="info-label">إجمالي الصفحات</span>
            <span class="info-value">{{ data.totalPages }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">إجمالي السجلات</span>
            <span class="info-value">{{ data.totalItems }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">حجم الصفحة</span>
            <span class="info-value">{{ data.pageSize }}</span>
          </div>
        </div>

        <div class="selection-section">
          <div class="selection-options">
            <button
              mat-raised-button
              [color]="selectedOption === 'all' ? 'primary' : 'default'"
              (click)="selectedOption = 'all'"
              class="option-btn"
              [class.selected]="selectedOption === 'all'"
            >
              <mat-icon>description</mat-icon>
              <span>جميع الصفحات ({{ data.totalPages }})</span>
              <span class="check-icon" *ngIf="selectedOption === 'all'">✓</span>
            </button>

            <button
              mat-raised-button
              [color]="selectedOption === 'current' ? 'primary' : 'default'"
              (click)="selectedOption = 'current'"
              class="option-btn"
              [class.selected]="selectedOption === 'current'"
            >
              <mat-icon>description</mat-icon>
              <span>الصفحة الحالية فقط ({{ data.currentPage + 1 }})</span>
              <span class="check-icon" *ngIf="selectedOption === 'current'"
                >✓</span
              >
            </button>

            <button
              mat-raised-button
              [color]="selectedOption === 'range' ? 'primary' : 'default'"
              (click)="selectedOption = 'range'"
              class="option-btn"
              [class.selected]="selectedOption === 'range'"
            >
              <mat-icon>description</mat-icon>
              <span>نطاق صفحات محدد</span>
              <span class="check-icon" *ngIf="selectedOption === 'range'"
                >✓</span
              >
            </button>
          </div>

          <div class="range-section" *ngIf="selectedOption === 'range'">
            <div class="range-inputs">
              <mat-form-field appearance="outline" class="range-field">
                <mat-label>من صفحة</mat-label>
                <input
                  matInput
                  type="number"
                  [(ngModel)]="startPage"
                  [min]="1"
                  [max]="data.totalPages"
                  placeholder="1"
                />
                <mat-error *ngIf="startPage < 1 || startPage > data.totalPages"
                  >أدخل صفحة صالحة (1 - {{ data.totalPages }})</mat-error
                >
              </mat-form-field>

              <mat-form-field appearance="outline" class="range-field">
                <mat-label>إلى صفحة</mat-label>
                <input
                  matInput
                  type="number"
                  [(ngModel)]="endPage"
                  [min]="1"
                  [max]="data.totalPages"
                  placeholder="{{ data.totalPages }}"
                />
                <mat-error *ngIf="endPage < 1 || endPage > data.totalPages"
                  >أدخل صفحة صالحة (1 - {{ data.totalPages }})</mat-error
                >
                <mat-error *ngIf="startPage > endPage"
                  >يجب أن تكون صفحة البداية أقل من صفحة النهاية</mat-error
                >
              </mat-form-field>
            </div>

            <div class="range-info">
              <mat-icon>info</mat-icon>
              <span
                >سيتم {{ isCardPrint ? 'طباعة' : 'تصدير' }}
                {{ getRangeCount() }} صفحة ({{ getRangeRecords() }} سجل)</span
              >
            </div>
          </div>
        </div>
      </div>

      <mat-divider></mat-divider>

      <div class="dialog-actions">
        <button mat-button (click)="close()" class="cancel-btn">إلغاء</button>
        <button
          mat-raised-button
          color="primary"
          (click)="confirm()"
          [disabled]="!isValid()"
          class="confirm-btn"
        >
          <mat-icon>{{ isCardPrint ? 'print' : 'check' }}</mat-icon>
          <span>{{ isCardPrint ? 'طباعة' : 'تصدير' }}</span>
        </button>
      </div>
    </div>
  `,
  styles: [
    `
      .dialog-container {
        min-width: 480px;
        max-width: 580px;
        background: white;
        border-radius: 24px;
        overflow: hidden;
        direction: rtl;
        box-shadow: 0 24px 48px rgba(0, 0, 0, 0.2);
      }
      .dialog-header {
        display: flex;
        align-items: center;
        gap: 16px;
        padding: 20px 24px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        position: relative;
      }
      .dialog-header.card-print {
        background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
      }
      .header-icon {
        width: 48px;
        height: 48px;
        background: rgba(255, 255, 255, 0.2);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        backdrop-filter: blur(4px);
      }
      .header-icon.card-print {
        background: rgba(255, 255, 255, 0.25);
      }
      .header-icon mat-icon {
        font-size: 28px;
        width: 28px;
        height: 28px;
      }
      .dialog-header h2 {
        margin: 0;
        font-size: 20px;
        font-weight: 700;
      }
      .dialog-header p {
        margin: 4px 0 0;
        font-size: 13px;
        opacity: 0.9;
      }
      .close-btn {
        color: white !important;
        position: absolute;
        left: 16px;
        top: 50%;
        transform: translateY(-50%);
        background: rgba(255, 255, 255, 0.15) !important;
        transition: all 0.3s;
      }
      .close-btn:hover {
        background: rgba(255, 255, 255, 0.3) !important;
        transform: translateY(-50%) rotate(90deg);
      }
      .dialog-body {
        padding: 24px;
        background: #fafbfc;
      }
      .info-section {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 12px;
        margin-bottom: 24px;
        padding: 16px;
        background: white;
        border-radius: 12px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
        border: 1px solid #eef2f6;
      }
      .info-row {
        text-align: center;
        padding: 4px 0;
      }
      .info-label {
        display: block;
        font-size: 11px;
        color: #94a3b8;
        margin-bottom: 4px;
        font-weight: 500;
        text-transform: uppercase;
        letter-spacing: 0.3px;
      }
      .info-value {
        font-size: 20px;
        font-weight: 700;
        color: #1e293b;
      }
      .info-value:last-child {
        color: #667eea;
      }
      .dialog-header.card-print .info-value:last-child {
        color: #f59e0b;
      }
      .selection-section {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }
      .selection-options {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }
      .option-btn {
        width: 100%;
        justify-content: flex-start;
        padding: 12px 20px;
        height: auto;
        border: 2px solid #e5e7eb;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        border-radius: 12px;
        background: white;
        position: relative;
        font-weight: 500;
      }
      .option-btn mat-icon {
        margin-left: 12px;
        color: #94a3b8;
        transition: color 0.3s;
      }
      .option-btn.selected {
        border-color: #667eea;
        background: #eff6ff !important;
        box-shadow: 0 4px 12px rgba(102, 126, 234, 0.15);
      }
      .option-btn.selected mat-icon {
        color: #667eea;
      }
      .dialog-header.card-print .option-btn.selected {
        border-color: #f59e0b;
        background: #fffbeb !important;
        box-shadow: 0 4px 12px rgba(245, 158, 11, 0.15);
      }
      .dialog-header.card-print .option-btn.selected mat-icon {
        color: #f59e0b;
      }
      .option-btn:hover:not(.selected) {
        border-color: #cbd5e1;
        background: #f8fafc;
        transform: translateY(-1px);
      }
      .check-icon {
        margin-right: auto;
        color: #667eea;
        font-weight: 700;
        font-size: 18px;
      }
      .dialog-header.card-print .check-icon {
        color: #f59e0b;
      }
      .range-section {
        padding: 16px;
        background: white;
        border-radius: 12px;
        border: 1px solid #e5e7eb;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
      }
      .range-inputs {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 16px;
      }
      .range-field {
        width: 100%;
      }
      .range-field ::ng-deep .mat-form-field-outline {
        background: #fafbfc !important;
        border-radius: 8px !important;
      }
      .range-info {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-top: 12px;
        padding: 10px 14px;
        background: #f1f5f9;
        border-radius: 8px;
        font-size: 13px;
        color: #475569;
      }
      .range-info mat-icon {
        font-size: 18px;
        width: 18px;
        height: 18px;
        color: #667eea;
      }
      .dialog-header.card-print .range-info mat-icon {
        color: #f59e0b;
      }
      .dialog-actions {
        display: flex;
        justify-content: flex-end;
        gap: 12px;
        padding: 16px 24px;
        background: white;
        border-top: 1px solid #eef2f6;
      }
      .dialog-actions button {
        min-width: 100px;
        font-weight: 600;
        border-radius: 10px;
        transition: all 0.3s;
      }
      .cancel-btn {
        color: #64748b !important;
      }
      .cancel-btn:hover {
        background: #f1f5f9 !important;
      }
      .confirm-btn {
        background: linear-gradient(
          135deg,
          #667eea 0%,
          #764ba2 100%
        ) !important;
        color: white !important;
        box-shadow: 0 4px 16px rgba(102, 126, 234, 0.3) !important;
      }
      .confirm-btn:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 8px 24px rgba(102, 126, 234, 0.4) !important;
      }
      .confirm-btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
        transform: none !important;
        box-shadow: none !important;
      }
      .dialog-header.card-print .confirm-btn {
        background: linear-gradient(
          135deg,
          #f59e0b 0%,
          #d97706 100%
        ) !important;
        box-shadow: 0 4px 16px rgba(245, 158, 11, 0.3) !important;
      }
      .dialog-header.card-print .confirm-btn:hover:not(:disabled) {
        box-shadow: 0 8px 24px rgba(245, 158, 11, 0.4) !important;
      }
      @media (max-width: 600px) {
        .dialog-container {
          min-width: 320px;
          max-width: 95vw;
        }
        .dialog-header {
          padding: 16px 20px;
          flex-wrap: wrap;
        }
        .header-icon {
          width: 40px;
          height: 40px;
        }
        .header-icon mat-icon {
          font-size: 22px;
          width: 22px;
          height: 22px;
        }
        .dialog-header h2 {
          font-size: 17px;
        }
        .dialog-body {
          padding: 16px;
        }
        .info-section {
          grid-template-columns: 1fr 1fr;
          gap: 8px;
          padding: 12px;
        }
        .info-row:last-child {
          grid-column: span 2;
        }
        .info-value {
          font-size: 17px;
        }
        .range-inputs {
          grid-template-columns: 1fr;
          gap: 8px;
        }
        .dialog-actions {
          flex-direction: column-reverse;
          padding: 12px 16px;
          gap: 8px;
        }
        .dialog-actions button {
          width: 100%;
          min-width: unset;
        }
        .close-btn {
          position: relative;
          left: auto;
          top: auto;
          transform: none;
        }
        .close-btn:hover {
          transform: rotate(90deg);
        }
      }
      @media (max-width: 400px) {
        .dialog-container {
          min-width: 280px;
        }
        .info-section {
          grid-template-columns: 1fr;
        }
        .info-row:last-child {
          grid-column: span 1;
        }
        .option-btn {
          font-size: 13px;
          padding: 10px 14px;
        }
        .option-btn mat-icon {
          font-size: 18px;
          width: 18px;
          height: 18px;
        }
      }
    `,
  ],
})
export class PaymentExportPageSelectDialogComponent {
  selectedOption: 'all' | 'current' | 'range' = 'all';
  startPage: number = 1;
  endPage: number = 1;
  isCardPrint: boolean = false;

  constructor(
    private dialogRef: MatDialogRef<PaymentExportPageSelectDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      totalPages: number;
      totalItems: number;
      pageSize: number;
      currentPage: number;
      isCardPrint?: boolean;
    },
  ) {
    this.endPage = data.totalPages;
    this.isCardPrint = data.isCardPrint || false;
  }

  getRangeCount(): number {
    if (this.startPage <= this.endPage) {
      return this.endPage - this.startPage + 1;
    }
    return 0;
  }

  getRangeRecords(): number {
    const count = this.getRangeCount();
    return count * this.data.pageSize;
  }

  isValid(): boolean {
    if (this.selectedOption === 'range') {
      return (
        this.startPage >= 1 &&
        this.endPage <= this.data.totalPages &&
        this.startPage <= this.endPage
      );
    }
    return true;
  }

  confirm(): void {
    let result: any = { option: this.selectedOption };
    if (this.selectedOption === 'range') {
      result.startPage = this.startPage - 1;
      result.endPage = this.endPage - 1;
    }
    this.dialogRef.close(result);
  }

  close(): void {
    this.dialogRef.close(null);
  }
}

// ============================================================================
// MAIN COMPONENT - COMPLETE WITH ALL METHODS
// ============================================================================

@Component({
  selector: 'app-enrollment-payment-list',
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
    MatDividerModule,
    MatChipsModule,
    SearchableSelectComponent,
    PaymentExportPageSelectDialogComponent,
  ],
  templateUrl: './enrollment-payment-list.component.html',
  styleUrls: ['./enrollment-payment-list.component.css'],
})
export class EnrollmentPaymentListComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  Math = Math;

  displayedColumns: string[] = [
    'id',
    'trainee',
    'course',
    'paidAmount',
    'remainedValue',
    'paymentDate',
    'paymentMethod',
    'paymentStatus',
    'actions',
  ];
  dataSource = new MatTableDataSource<any>([]);
  allPayments: any[] = [];
  isLoading = false;

  // ========== IMAGE CACHE ==========
  imageUrls: Map<number, string> = new Map();

  // ========== PAGINATION ==========
  totalItems: number = 0;
  pageSize: number = 25;
  pageSizeOptions: number[] = [5, 10, 25, 50, 100];
  currentPage: number = 0;

  // ========== SORTING ==========
  sortBy: string = 'CREATION_DATE';
  sortDir: string = 'DESC';

  paymentStatuses = PAYMENT_STATUSES;

  courses: any[] = [];
  enrollments: any[] = [];
  paymentMethods: any[] = [];

  // Options for searchable selects
  courseOptions: SelectOption[] = [];
  enrollmentOptions: SelectOption[] = [];
  paymentMethodOptions: SelectOption[] = [];
  paymentStatusOptions: SelectOption[] = [];

  filters = {
    courseId: null as number | null,
    enrollmentId: null as number | null,
    paymentMethodId: null as number | null,
    paymentStatus: null as number | null,
    paymentDateFrom: null as string | null,
    paymentDateTo: null as string | null,
    traineeNationalId: null as string | null,
  };

  quickSearch: string = '';
  barcodeSearch: string = '';
  isBarcodeMode: boolean = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('barcodeInput') barcodeInput!: ElementRef<HTMLInputElement>;

  constructor(
    private financialService: FinancialService,
    private courseService: CourseService,
    private notification: NotificationService,
    private reportService: ReportService,
    private fileService: FileService,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.loadSelectOptions();
    this.loadLookupData();
    this.loadData();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    if (this.barcodeInput) {
      this.barcodeInput.nativeElement.focus();
    }
  }

  ngOnDestroy(): void {
    this.imageUrls.forEach((url) => {
      if (url && url.startsWith('blob:')) {
        URL.revokeObjectURL(url);
      }
    });
    this.imageUrls.clear();
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

  // ==========================================================================
  // IMAGE LOADING
  // ==========================================================================

  loadAllImages(): void {
    this.imageUrls.forEach((url) => {
      if (url && url.startsWith('blob:')) {
        URL.revokeObjectURL(url);
      }
    });
    this.imageUrls.clear();

    this.allPayments.forEach((payment) => {
      const trainee = payment.enrollment?.trainee;
      if (trainee?.id && trainee?.imageUrl) {
        this.loadImage(trainee.id, trainee.imageUrl);
      }
    });
  }

  loadImage(traineeId: number, imageUrl: string): void {
    if (!imageUrl) {
      this.imageUrls.set(traineeId, '');
      return;
    }

    if (/^\d{15}(\d{3})?$/.test(imageUrl)) {
      this.fileService.downloadFile(imageUrl).subscribe({
        next: (blob) => {
          const existingUrl = this.imageUrls.get(traineeId);
          if (existingUrl && existingUrl.startsWith('blob:')) {
            URL.revokeObjectURL(existingUrl);
          }
          const blobUrl = URL.createObjectURL(blob);
          this.imageUrls.set(traineeId, blobUrl);
          this.cdr.detectChanges();
        },
        error: () => {
          this.imageUrls.set(traineeId, '');
          this.cdr.detectChanges();
        },
      });
    } else {
      this.imageUrls.set(traineeId, imageUrl);
    }
  }

  getImageUrl(traineeId: number): string | null {
    if (!traineeId) return null;
    const url = this.imageUrls.get(traineeId);
    return url && url.startsWith('blob:') ? url : url || null;
  }

  // ==========================================================================
  // INITIALIZATION METHODS
  // ==========================================================================

  loadSelectOptions(): void {
    this.paymentStatusOptions = [
      { value: null, label: 'الكل' },
      ...this.paymentStatuses.map((s) => ({ value: s.id, label: s.title })),
    ];
  }

  loadLookupData() {
    this.courseService.getAllCourses().subscribe({
      next: (res: any) => {
        this.courses = res.items || [];
        this.courseOptions = [
          { value: null, label: 'الكل' },
          ...this.courses.map((c) => ({ value: c.id, label: c.title })),
        ];
      },
      error: () => {
        this.notification.showError('حدث خطأ في تحميل الدورات');
      },
    });

    this.financialService.getAllPaymentMethodsLookup().subscribe({
      next: (res: any) => {
        this.paymentMethods = res.list || [];
        this.paymentMethodOptions = [
          { value: null, label: 'الكل' },
          ...this.paymentMethods.map((p) => ({ value: p.id, label: p.title })),
        ];
      },
      error: () => {
        this.notification.showError('حدث خطأ في تحميل طرق الدفع');
      },
    });
  }

  // ==========================================================================
  // LOAD DATA WITH PAGINATION
  // ==========================================================================

  loadData() {
    this.isLoading = true;
    const params: any = {
      pageNum: this.currentPage,
      pageSize: this.pageSize,
    };

    if (this.filters.courseId) params.courseId = this.filters.courseId;
    if (this.filters.enrollmentId)
      params.enrollmentId = this.filters.enrollmentId;
    if (this.filters.paymentMethodId)
      params.paymentMethodId = this.filters.paymentMethodId;
    if (this.filters.paymentStatus)
      params.paymentStatus = this.filters.paymentStatus;
    if (this.filters.paymentDateFrom)
      params.paymentDateFrom = this.filters.paymentDateFrom;
    if (this.filters.paymentDateTo)
      params.paymentDateTo = this.filters.paymentDateTo;
    if (this.filters.traineeNationalId)
      params.traineeNationalId = this.filters.traineeNationalId;
    if (this.quickSearch) params.quickSearch = this.quickSearch;

    if (this.sortBy) params.orderBy = this.sortBy;
    if (this.sortDir) params.orderDir = this.sortDir;

    this.financialService.getAllEnrollmentPaymentsByFilter(params).subscribe({
      next: (res: any) => {
        this.allPayments = res.items || [];
        this.totalItems = res.total || 0;
        this.dataSource.data = this.allPayments;
        this.loadAllImages();

        const uniqueEnrollments = new Map();
        res.items.forEach((item: any) => {
          if (item.enrollment && !uniqueEnrollments.has(item.enrollment.id)) {
            uniqueEnrollments.set(item.enrollment.id, {
              id: item.enrollment.id,
              title: `${item.enrollment.trainee?.fullName || ''} - ${item.enrollment.course?.title || ''}`,
              traineeFullName: item.enrollment.trainee?.fullName,
              courseTitle: item.enrollment.course?.title,
            });
          }
        });
        this.enrollments = Array.from(uniqueEnrollments.values());
        this.enrollmentOptions = [
          { value: null, label: 'الكل' },
          ...this.enrollments.map((e) => ({ value: e.id, label: e.title })),
        ];

        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading data:', err);
        this.notification.showError('حدث خطأ في تحميل البيانات');
        this.isLoading = false;
        this.cdr.detectChanges();
      },
    });
  }

  // ==========================================================================
  // BARCODE SEARCH
  // ==========================================================================

  searchByBarcode(): void {
    if (!this.barcodeSearch?.trim()) {
      this.notification.showWarning('الرجاء إدخال رقم الباركود');
      return;
    }

    this.filters.traineeNationalId = this.barcodeSearch.trim();
    this.currentPage = 0;
    this.loadData();
    this.notification.showSuccess(`تم البحث عن: ${this.barcodeSearch}`);
    this.clearBarcodeSearch();
  }

  clearBarcodeSearch(): void {
    this.barcodeSearch = '';
    this.isBarcodeMode = false;
  }

  onBarcodeKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.searchByBarcode();
    }
  }

  toggleBarcodeMode(): void {
    this.isBarcodeMode = !this.isBarcodeMode;
    if (this.isBarcodeMode) {
      setTimeout(() => this.barcodeInput?.nativeElement.focus(), 100);
    } else {
      this.barcodeSearch = '';
      this.filters.traineeNationalId = null;
      this.loadData();
    }
  }

  // ==========================================================================
  // FILTERS - ALL METHODS INCLUDED
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
      paymentStatus: null,
      paymentDateFrom: null,
      paymentDateTo: null,
      traineeNationalId: null,
    };
    this.quickSearch = '';
    this.barcodeSearch = '';
    this.isBarcodeMode = false;
    this.currentPage = 0;
    this.loadData();
    this.notification.showSuccess('تم مسح جميع الفلاتر');
  }

  hasActiveFilters(): boolean {
    return !!(
      this.filters.courseId ||
      this.filters.enrollmentId ||
      this.filters.paymentMethodId ||
      this.filters.paymentStatus ||
      this.filters.paymentDateFrom ||
      this.filters.paymentDateTo ||
      this.filters.traineeNationalId ||
      this.quickSearch
    );
  }

  getActiveFiltersCount(): number {
    let count = 0;
    if (this.filters.courseId) count++;
    if (this.filters.enrollmentId) count++;
    if (this.filters.paymentMethodId) count++;
    if (this.filters.paymentStatus) count++;
    if (this.filters.paymentDateFrom) count++;
    if (this.filters.paymentDateTo) count++;
    if (this.filters.traineeNationalId) count++;
    if (this.quickSearch) count++;
    return count;
  }

  // ==========================================================================
  // PAYMENT OPERATIONS
  // ==========================================================================

  viewPayment(id: number) {
    this.financialService.getEnrollmentPaymentById(id).subscribe({
      next: (payment) => {
        this.dialog.open(EnrollmentPaymentDetailsModalComponent, {
          data: payment,
          width: '650px',
          maxWidth: '90vw',
        });
      },
      error: () => {
        this.notification.showError('حدث خطأ في تحميل بيانات الدفعة');
      },
    });
  }

  openNewPaymentModal() {
    const dialogRef = this.dialog.open(EnrollmentPaymentWizardModalComponent, {
      data: {},
      width: '800px',
      maxWidth: '90vw',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadData();
      }
    });
  }

  editPayment(id: number) {
    const dialogRef = this.dialog.open(EnrollmentPaymentWizardModalComponent, {
      data: { paymentId: id },
      width: '800px',
      maxWidth: '90vw',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadData();
      }
    });
  }

  deletePayment(item: any) {
    if (confirm(`هل أنت متأكد من حذف دفعة التسجيل؟`)) {
      this.financialService.deleteEnrollmentPayment(item.id).subscribe({
        next: () => {
          this.notification.showSuccess('تم الحذف بنجاح');
          this.loadData();
        },
        error: () => {
          this.notification.showError('حدث خطأ في الحذف');
        },
      });
    }
  }

  // ==========================================================================
  // TOTALS METHODS
  // ==========================================================================

  getTotalPaymentsCount(): number {
    return this.allPayments.length;
  }

  getTotalPaidAmount(): number {
    return this.allPayments.reduce(
      (sum, payment) => sum + (payment.paidAmount || 0),
      0,
    );
  }

  getTotalRemainingAmount(): number {
    return this.allPayments.reduce(
      (sum, payment) => sum + (payment.remainedValue || 0),
      0,
    );
  }

  getAveragePayment(): number {
    const count = this.getTotalPaymentsCount();
    if (count === 0) return 0;
    return this.getTotalPaidAmount() / count;
  }

  // ==========================================================================
  // CHIP STATUS COUNTS
  // ==========================================================================

  getPaidCount(): number {
    return (
      this.allPayments?.filter((p) => p.paymentStatus?.id === 2)?.length || 0
    );
  }

  getPartialCount(): number {
    return (
      this.allPayments?.filter((p) => p.paymentStatus?.id === 6)?.length || 0
    );
  }

  getPendingCount(): number {
    return (
      this.allPayments?.filter((p) => p.paymentStatus?.id === 1)?.length || 0
    );
  }

  // ==========================================================================
  // EXPORT FUNCTIONS WITH PAGE SELECTION
  // ==========================================================================

  private showExportPageSelection(isCardPrint: boolean = false): Promise<any> {
    return new Promise((resolve) => {
      const totalPages = this.getTotalPages();

      if (totalPages <= 1) {
        resolve({ option: 'all' });
        return;
      }

      const dialogRef = this.dialog.open(
        PaymentExportPageSelectDialogComponent,
        {
          width: '580px',
          maxWidth: '95vw',
          disableClose: true,
          data: {
            totalPages: totalPages,
            totalItems: this.totalItems,
            pageSize: this.pageSize,
            currentPage: this.currentPage,
            isCardPrint: isCardPrint,
          },
        },
      );

      dialogRef.afterClosed().subscribe((result) => {
        resolve(result);
      });
    });
  }

  private async fetchPagesForExport(
    startPage: number,
    endPage: number,
  ): Promise<any[]> {
    const allData: any[] = [];
    const totalPages = this.getTotalPages();

    for (
      let page = startPage;
      page <= Math.min(endPage, totalPages - 1);
      page++
    ) {
      const params: any = {
        pageNum: page,
        pageSize: this.pageSize,
      };

      if (this.filters.courseId) params.courseId = this.filters.courseId;
      if (this.filters.enrollmentId)
        params.enrollmentId = this.filters.enrollmentId;
      if (this.filters.paymentMethodId)
        params.paymentMethodId = this.filters.paymentMethodId;
      if (this.filters.paymentStatus)
        params.paymentStatus = this.filters.paymentStatus;
      if (this.filters.paymentDateFrom)
        params.paymentDateFrom = this.filters.paymentDateFrom;
      if (this.filters.paymentDateTo)
        params.paymentDateTo = this.filters.paymentDateTo;
      if (this.filters.traineeNationalId)
        params.traineeNationalId = this.filters.traineeNationalId;
      if (this.quickSearch) params.quickSearch = this.quickSearch;

      if (this.sortBy) params.orderBy = this.sortBy;
      if (this.sortDir) params.orderDir = this.sortDir;

      try {
        const res = await this.financialService
          .getAllEnrollmentPaymentsByFilter(params)
          .toPromise();
        if (res && res.items) {
          allData.push(...res.items);
        }
      } catch (error) {
        console.error(`Error fetching page ${page}:`, error);
        this.notification.showError(`حدث خطأ في تحميل الصفحة ${page + 1}`);
      }
    }

    return allData;
  }

  async exportToExcel(): Promise<void> {
    const result = await this.showExportPageSelection(false);
    if (!result) return;

    let dataToExport: any[] = [];

    if (result.option === 'all') {
      dataToExport = await this.fetchPagesForExport(
        0,
        this.getTotalPages() - 1,
      );
    } else if (result.option === 'current') {
      dataToExport = this.allPayments;
    } else if (result.option === 'range') {
      dataToExport = await this.fetchPagesForExport(
        result.startPage,
        result.endPage,
      );
    }

    if (dataToExport.length === 0) {
      this.notification.showWarning('لا توجد بيانات لتصديرها');
      return;
    }

    const exportData = dataToExport.map((item, index) => ({
      '#': index + 1,
      المتدرب: item.enrollment?.trainee?.fullName || '-',
      الدورة: item.enrollment?.course?.title || '-',
      'المبلغ المدفوع': item.paidAmount,
      'المبلغ المتبقي': item.remainedValue,
      'تاريخ الدفع': item.paymentDate,
      'طريقة الدفع': item.paymentMethod?.title || '-',
      'حالة الدفع': item.paymentStatus?.title || '-',
      ملاحظات: item.note || '-',
    }));

    this.reportService.exportToExcel(
      exportData,
      'enrollment-payments-list',
      'مدفوعات التسجيلات',
    );
    this.notification.showSuccess(`تم تصدير ${exportData.length} سجل بنجاح`);
  }

  async exportToPDF(): Promise<void> {
    const result = await this.showExportPageSelection(false);
    if (!result) return;

    this.isLoading = true;

    let dataToPrint: any[] = [];

    if (result.option === 'all') {
      dataToPrint = await this.fetchPagesForExport(0, this.getTotalPages() - 1);
    } else if (result.option === 'current') {
      dataToPrint = this.allPayments;
    } else if (result.option === 'range') {
      dataToPrint = await this.fetchPagesForExport(
        result.startPage,
        result.endPage,
      );
    }

    if (dataToPrint.length === 0) {
      this.notification.showWarning('لا توجد بيانات لتصديرها');
      this.isLoading = false;
      return;
    }

    const filterTexts: string[] = [];
    if (this.filters.courseId) {
      const course = this.courses.find((c) => c.id === this.filters.courseId);
      if (course) filterTexts.push(`الدورة: ${course.title}`);
    }
    if (this.filters.enrollmentId) {
      const enrollment = this.enrollments.find(
        (e) => e.id === this.filters.enrollmentId,
      );
      if (enrollment) filterTexts.push(`التسجيل: ${enrollment.title}`);
    }
    if (this.filters.paymentMethodId) {
      const paymentMethod = this.paymentMethods.find(
        (p) => p.id === this.filters.paymentMethodId,
      );
      if (paymentMethod)
        filterTexts.push(`طريقة الدفع: ${paymentMethod.title}`);
    }
    if (this.filters.paymentStatus) {
      const status = this.paymentStatuses.find(
        (s) => s.id === this.filters.paymentStatus,
      );
      if (status) filterTexts.push(`حالة الدفع: ${status.title}`);
    }
    if (this.filters.paymentDateFrom)
      filterTexts.push(`من تاريخ: ${this.filters.paymentDateFrom}`);
    if (this.filters.paymentDateTo)
      filterTexts.push(`إلى تاريخ: ${this.filters.paymentDateTo}`);
    if (this.filters.traineeNationalId)
      filterTexts.push(`رقم الهوية: ${this.filters.traineeNationalId}`);
    if (this.quickSearch) filterTexts.push(`بحث: ${this.quickSearch}`);

    // Calculate totals
    const totalPayments = dataToPrint.length;
    const totalPaidAmount = dataToPrint.reduce(
      (sum, p) => sum + (p.paidAmount || 0),
      0,
    );
    const totalRemainingAmount = dataToPrint.reduce(
      (sum, p) => sum + (p.remainedValue || 0),
      0,
    );
    const averagePayment =
      totalPayments > 0 ? totalPaidAmount / totalPayments : 0;

    // Split data into pages
    const rowsPerPage = 20;
    const pages: any[][] = [];
    for (let i = 0; i < dataToPrint.length; i += rowsPerPage) {
      pages.push(dataToPrint.slice(i, i + rowsPerPage));
    }

    // Read the SVG file content and embed it directly
    const svgContent = await this.getSvgContent();

    let allPagesHTML = '';

    pages.forEach((pageData: any[], pageIndex: number) => {
      let tableRows = '';
      pageData.forEach((item: any, index: number) => {
        const globalIndex = pageIndex * rowsPerPage + index + 1;
        const statusColor = this.getPaymentStatusColor(item.paymentStatus?.id);
        const statusTextColor = this.getPaymentStatusTextColor(
          item.paymentStatus?.id,
        );

        tableRows += `
        <tr>
          <td style="text-align: center; padding: 6px 5px; border: 1px solid rgba(229, 231, 235, 0.3); font-size: 11px; background: transparent;">${globalIndex}</td>
          <td style="text-align: right; padding: 6px 5px; border: 1px solid rgba(229, 231, 235, 0.3); font-weight: 600; font-size: 11px; background: transparent;">${item.enrollment?.trainee?.fullName || '-'}</td>
          <td style="text-align: right; padding: 6px 5px; border: 1px solid rgba(229, 231, 235, 0.3); font-size: 11px; background: transparent;">${item.enrollment?.course?.title || '-'}</td>
          <td style="text-align: right; padding: 6px 5px; border: 1px solid rgba(229, 231, 235, 0.3); font-size: 11px; background: transparent; font-weight: 600; color: #10b981;">${item.paidAmount || 0} جم</td>
          <td style="text-align: right; padding: 6px 5px; border: 1px solid rgba(229, 231, 235, 0.3); font-size: 11px; background: transparent; font-weight: 600; color: #f59e0b;">${item.remainedValue || 0} جم</td>
          <td style="text-align: center; padding: 6px 5px; border: 1px solid rgba(229, 231, 235, 0.3); font-size: 11px; background: transparent;">${item.paymentDate || '-'}</td>
          <td style="text-align: center; padding: 6px 5px; border: 1px solid rgba(229, 231, 235, 0.3); font-size: 11px; background: transparent;">${item.paymentMethod?.title || '-'}</td>
          <td style="text-align: center; padding: 6px 5px; border: 1px solid rgba(229, 231, 235, 0.3); font-size: 11px; background: transparent;">
            <span style="background: ${statusColor}; color: ${statusTextColor}; border-radius: 16px; padding: 3px 12px; display: inline-block; font-weight: 600; font-size: 11px;">${item.paymentStatus?.title || '-'}</span>
          </td>
          <td style="text-align: right; padding: 6px 5px; border: 1px solid rgba(229, 231, 235, 0.3); font-size: 11px; background: transparent;">${item.note || '-'}</td>
        </tr>
      `;
      });

      allPagesHTML += `
      <div class="page-container">
        <!-- WATERMARK - Embedded SVG -->
        <div class="watermark-wrapper">
          <div class="watermark-container">
            ${svgContent}
          </div>
          <div class="watermark-text"> الأكاديمية الأولمبية لعلوم الرياضة</div>
        </div>
        
        <div class="content">
          <div class="header">
            <h1>📋 تقرير مدفوعات التسجيلات</h1>
            <p>${new Date().toLocaleDateString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            <p style="font-size: 10px; opacity: 0.8;">صفحة ${pageIndex + 1} من ${pages.length}</p>
          </div>
          
          ${filterTexts.length > 0 && pageIndex === 0 ? `<div class="filters"><strong>🔍 الفلاتر:</strong> ${filterTexts.join(' | ')}</div>` : ''}
          
          ${
            pageIndex === 0
              ? `
          <div class="totals-grid">
            <div class="total-card total-all">
              <span class="total-icon">📋</span>
              <span class="total-value">${totalPayments}</span>
              <span class="total-label">إجمالي المدفوعات</span>
            </div>
            <div class="total-card total-paid">
              <span class="total-icon">💰</span>
              <span class="total-value">${totalPaidAmount.toLocaleString('ar-EG')} جم</span>
              <span class="total-label">إجمالي المدفوع</span>
            </div>
            <div class="total-card total-remaining">
              <span class="total-icon">📊</span>
              <span class="total-value">${totalRemainingAmount.toLocaleString('ar-EG')} جم</span>
              <span class="total-label">إجمالي المتبقي</span>
            </div>
            <div class="total-card total-average">
              <span class="total-icon">📈</span>
              <span class="total-value">${averagePayment.toLocaleString('ar-EG')} جم</span>
              <span class="total-label">متوسط الدفعة</span>
            </div>
          </div>
          `
              : ''
          }
          
          <table>
            <thead>
              <tr>
                <th style="width: 4%;">#</th>
                <th style="width: 18%;">المتدرب</th>
                <th style="width: 16%;">الدورة</th>
                <th style="width: 12%;">المبلغ المدفوع</th>
                <th style="width: 12%;">المبلغ المتبقي</th>
                <th style="width: 12%;">تاريخ الدفع</th>
                <th style="width: 12%;">طريقة الدفع</th>
                <th style="width: 14%;">حالة الدفع</th>
                <th style="width: 10%;">ملاحظات</th>
              </tr>
            </thead>
            <tbody>
              ${tableRows}
            </tbody>
          </table>
          
          <div class="footer">
             الأكاديمية الأولمبية لعلوم الرياضة &copy; ${new Date().getFullYear()} - ${dataToPrint.length} دفعة
          </div>
        </div>
      </div>
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
      <title>تقرير مدفوعات التسجيلات</title>
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
        }
        
        .page-container:last-child {
          page-break-after: auto;
        }
        
        /* ===== WATERMARK ===== */
        .watermark-wrapper {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          width: 100%;
          height: 100%;
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
          width: 45%;
          height: 45%;
          opacity: 0.10;
          transform: rotate(-25deg);
        }
        
        .watermark-container svg {
          width: 100%;
          height: 100%;
        }
        
        .watermark-text {
          position: absolute;
          top: 56%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(-25deg);
          font-size: 50px;
          font-weight: 900;
          color: #667eea;
          letter-spacing: 6px;
          text-transform: uppercase;
          white-space: nowrap;
          opacity: 0.05;
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
          }
          .page-container:last-child {
            page-break-after: auto !important;
          }
          .watermark-container {
            opacity: 0.12 !important;
            width: 50% !important;
            height: 50% !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .watermark-text {
            opacity: 0.06 !important;
            font-size: 55px !important;
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
          table {
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
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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
          grid-template-columns: repeat(4, 1fr);
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
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border-color: #667eea;
        }
        .total-card.total-all .total-value {
          color: white;
        }
        .total-card.total-all .total-label {
          color: rgba(255, 255, 255, 0.85);
        }
        
        .total-card.total-paid {
          background: rgba(209, 250, 229, 0.85);
          border-color: rgba(110, 231, 183, 0.5);
        }
        .total-card.total-paid .total-value {
          color: #059669;
        }
        
        .total-card.total-remaining {
          background: rgba(254, 243, 199, 0.85);
          border-color: rgba(252, 211, 77, 0.5);
        }
        .total-card.total-remaining .total-value {
          color: #92400e;
        }
        
        .total-card.total-average {
          background: rgba(219, 234, 254, 0.85);
          border-color: rgba(147, 197, 253, 0.5);
        }
        .total-card.total-average .total-value {
          color: #2563eb;
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
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 5px 4px;
          border: 1px solid #5b6fd8;
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
          .watermark-container {
            width: 65% !important;
            height: 65% !important;
          }
          .watermark-text {
            font-size: 30px !important;
          }
          .totals-grid {
            grid-template-columns: repeat(2, 1fr);
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
            grid-template-columns: 1fr;
          }
          .watermark-container {
            width: 75% !important;
            height: 75% !important;
          }
          .watermark-text {
            font-size: 20px !important;
          }
        }
      </style>
    </head>
    <body>
      ${allPagesHTML}
      
      <div class="no-print" style="text-align: center; margin-top: 10px; padding: 10px; position: fixed; bottom: 0; left: 0; right: 0; background: white; box-shadow: 0 -2px 10px rgba(0,0,0,0.1); z-index: 9999;">
        <button onclick="window.print();" style="padding: 8px 24px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 14px; font-weight: 600; box-shadow: 0 2px 10px rgba(102, 126, 234, 0.3);">
          🖨️ طباعة / PDF
        </button>
        <button onclick="window.close();" style="padding: 8px 24px; background: #f1f5f9; color: #475569; border: none; border-radius: 6px; cursor: pointer; font-size: 14px; font-weight: 600; margin-right: 10px;">
          ✖ إغلاق
        </button>
      </div>
    </body>
    </html>
  `;

    const printWindow = window.open(
      '',
      '_blank',
      'width=1100,height=850,scrollbars=yes',
    );
    if (printWindow) {
      printWindow.document.write(printContainer.innerHTML);
      printWindow.document.close();
      this.isLoading = false;
      this.notification.showSuccess(
        `تم فتح التقرير - ${dataToPrint.length} سجل`,
      );
    } else {
      document.body.appendChild(printContainer);
      window.print();
      setTimeout(() => {
        if (document.body.contains(printContainer)) {
          document.body.removeChild(printContainer);
        }
      }, 500);
      this.isLoading = false;
      this.notification.showSuccess(
        `تم فتح التقرير - ${dataToPrint.length} سجل`,
      );
    }
  }

  // ==========================================================================
// REFUND ACTION
// ==========================================================================

/**
 * Open refund wizard for a specific enrollment payment
 * Auto-selects the enrollment for refund
 */
openRefundWizard(payment: any): void {
  if (!payment?.enrollment?.id) {
    this.notification.showWarning('لا يمكن استرداد هذه الدفعة - بيانات التسجيل غير مكتملة');
    return;
  }

  // Check if payment can be refunded
  if (payment.paymentStatus?.id === 4) {
    this.notification.showWarning('هذه الدفعة مستردة بالفعل');
    return;
  }

  if (payment.paymentStatus?.id === 5) {
    this.notification.showWarning('هذه الدفعة ملغية');
    return;
  }

  // Check if there's an amount to refund
  if (!payment.paidAmount || payment.paidAmount <= 0) {
    this.notification.showWarning('لا يوجد مبلغ مستحق للاسترداد');
    return;
  }

  const dialogRef = this.dialog.open(EnrollmentRefundWizardModalComponent, {
    data: { 
      enrollmentId: payment.enrollment.id,
      prefillAmount: payment.paidAmount // Pre-fill the refund amount
    },
    width: '800px',
    maxWidth: '90vw'
  });

  dialogRef.afterClosed().subscribe((result) => {
    if (result) {
      this.loadData(); // Refresh the list after refund
      this.notification.showSuccess('تم عملية الاسترداد بنجاح');
    }
  });
}
  // Add this helper method to read the SVG file
  private async getSvgContent(): Promise<string> {
    try {
      const response = await fetch('assets/images/simpleLogoSvg.svg');
      const svgText = await response.text();
      return svgText;
    } catch (error) {
      console.error('Error loading SVG:', error);
      // Fallback SVG if file cannot be loaded
      return `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%">
        <circle cx="100" cy="100" r="80" fill="none" stroke="#667eea" stroke-width="2" opacity="0.3"/>
        <text x="50%" y="45%" dominant-baseline="middle" text-anchor="middle" font-size="40" font-weight="900" fill="#667eea" opacity="0.25">🏛️</text>
        <text x="50%" y="58%" dominant-baseline="middle" text-anchor="middle" font-size="18" font-weight="700" fill="#667eea" opacity="0.2">الأكاديمية</text>
        <text x="50%" y="70%" dominant-baseline="middle" text-anchor="middle" font-size="16" font-weight="700" fill="#667eea" opacity="0.15">الأولمبية</text>
      </svg>
    `;
    }
  }

  // ==========================================================================
  // HELPER METHODS - STATUS COLORS
  // ==========================================================================

  getPaymentStatusColor(statusId: number): string {
    switch (statusId) {
      case 2:
        return '#d1fae5';
      case 1:
        return '#fef3c7';
      default:
        return '#f3f4f6';
    }
  }

  getPaymentStatusTextColor(statusId: number): string {
    switch (statusId) {
      case 2:
        return '#065f46';
      case 1:
        return '#92400e';
      default:
        return '#374151';
    }
  }
}
