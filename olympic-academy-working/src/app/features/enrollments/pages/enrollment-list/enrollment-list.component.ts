import {
  Component,
  OnInit,
  ViewChild,
  AfterViewInit,
  OnDestroy,
  ChangeDetectorRef,
  Inject,
  ElementRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule, MatSort, Sort } from '@angular/material/sort';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';
import {
  MatDialog,
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDividerModule } from '@angular/material/divider';

import { EnrollmentService } from '../../../../core/services/enrollment.service';
import { TraineeService } from '../../../../core/services/trainee.service';
import { CourseService } from '../../../../core/services/course.service';
import { EmployeeService } from '../../../../core/services/employee.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { ReportService } from '../../../../core/services/report.service';
import { FileService } from '../../../../core/services/file.service';
import {
  SearchableSelectComponent,
  SelectOption,
} from '../../../../shared/components/searchable-select/searchable-select.component';
import { PAYMENT_STATUSES } from '../../../../core/models/common.model';
import { ENROLLMENT_STATUSES } from '../../../../core/models/enrollment.model';
import { EnrollmentDetailsModalComponent } from './../enrollment-details/enrollment-details-modal.component';
import { EnrollmentWizardModalComponent } from './../enrollment-wizard/enrollment-wizard-modal.component';
import { ConstantService } from '../../../../core/services/constant.service';

// ============================================================================
// PAGE SELECTION DIALOG COMPONENT - ENHANCED FOR CARD PRINTING
// ============================================================================

@Component({
  selector: 'app-export-page-select-dialog',
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
        background: linear-gradient(
          135deg,
          #1a1a2e 0%,
          #16213e 50%,
          #0f3460 100%
        );
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
        color: #0f3460;
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
        border-color: #0f3460;
        background: #f0f4f8 !important;
        box-shadow: 0 4px 12px rgba(15, 52, 96, 0.15);
      }

      .option-btn.selected mat-icon {
        color: #0f3460;
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
        color: #0f3460;
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
        color: #0f3460;
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
          #1a1a2e 0%,
          #16213e 50%,
          #0f3460 100%
        ) !important;
        color: white !important;
        box-shadow: 0 4px 16px rgba(15, 52, 96, 0.3) !important;
      }

      .confirm-btn:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 8px 24px rgba(15, 52, 96, 0.4) !important;
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
export class ExportPageSelectDialogComponent {
  selectedOption: 'all' | 'current' | 'range' = 'all';
  startPage: number = 1;
  endPage: number = 1;
  isCardPrint: boolean = false;

  constructor(
    private dialogRef: MatDialogRef<ExportPageSelectDialogComponent>,
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
// MAIN ENROLLMENT LIST COMPONENT
// ============================================================================

interface EnrollmentListItem {
  id: number;
  trainee?: {
    id: number;
    nationalId?: string;
    fullName?: string;
    imageUrl?: string;
  };
  course?: { id: number; title: string };
  trainer?: { id: number; title: string };
  startDate: string;
  endDate?: string;
  isActive: boolean;
  enrollmentStatus?: { id: number; title: string };
  paymentStatus?: { id: number; title: string };
  finalSubscriptionValue?: number;
  remainedSubscriptionValue?: number;
}

@Component({
  selector: 'app-enrollment-list',
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
    MatDividerModule,
    MatSlideToggleModule,
    SearchableSelectComponent,
  ],
  templateUrl: './enrollment-list.component.html',
  styleUrls: ['./enrollment-list.component.css'],
})
export class EnrollmentListComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  Math = Math;

  academyContactNumber: string = '01069911181';

  // Updated columns to include amount and remaining
  displayedColumns: string[] = [
    'index',
    'image',
    'trainee',
    'course',
    'trainer',
    'startDate',
    'endDate',
    'amount',
    'remaining',
    'isActive',
    'enrollmentStatus',
    'paymentStatus',
    'actions',
  ];
  dataSource = new MatTableDataSource<EnrollmentListItem>([]);
  allEnrollments: EnrollmentListItem[] = [];
  isLoading = false;

  // ========== PAGINATION ==========
  totalItems: number = 0;
  pageSize: number = 25;
  pageSizeOptions: number[] = [5, 10, 25, 50, 100];
  currentPage: number = 0;

  // ========== SORTING ==========
  sortBy: string = 'START_DATE';
  sortDir: string = 'DESC';

  trainees: any[] = [];
  courses: any[] = [];
  trainers: any[] = [];
  paymentStatuses = PAYMENT_STATUSES;
  enrollmentStatuses = ENROLLMENT_STATUSES;

  // Image URLs map for trainees
  traineeImageUrls: Map<number, string> = new Map();

  traineeOptions: SelectOption[] = [];
  courseOptions: SelectOption[] = [];
  trainerOptions: SelectOption[] = [];
  enrollmentStatusOptions: SelectOption[] = [];
  paymentStatusOptions: SelectOption[] = [];

  // ========== BARCODE SEARCH ==========
  barcodeSearch: string = '';
  isBarcodeMode: boolean = false;
  @ViewChild('barcodeInput') barcodeInput!: ElementRef<HTMLInputElement>;

  filters = {
    traineeId: null as number | null,
    traineeNationalId: null as string | null,
    courseId: null as number | null,
    trainerId: null as number | null,
    enrollmentStatus: null as number | null,
    paymentStatus: null as number | null,
    startDateFrom: null as string | null,
    startDateTo: null as string | null,
    endDateFrom: null as string | null,
    endDateTo: null as string | null,
    isActive: null as boolean | null,
  };

  quickSearch: string = '';

  @ViewChild(MatSort) sort!: MatSort;

  // Add these enum mapping constants at the top of your component
  private readonly ENROLLMENT_STATUS_MAP: { [key: number]: string } = {
    1: 'PENDING',
    2: 'COMPLETED',
    3: 'CANCELLED',
  };

  private readonly PAYMENT_STATUS_MAP: { [key: number]: string } = {
    1: 'PENDING',
    2: 'PAID',
    3: 'FAILED',
    4: 'REFUNDED',
    5: 'CANCELLED',
    6: 'PARTIAL',
  };
  // Statistics
  get totalAmount(): number {
    return this.allEnrollments.reduce(
      (sum, item) => sum + (item.finalSubscriptionValue || 0),
      0,
    );
  }

  get totalRemaining(): number {
    return this.allEnrollments.reduce(
      (sum, item) => sum + (item.remainedSubscriptionValue || 0),
      0,
    );
  }

  get activeEnrollments(): number {
    return this.allEnrollments.filter((item) => item.enrollmentStatus?.id === 1)
      .length;
  }

  get completedEnrollments(): number {
    return this.allEnrollments.filter((item) => item.enrollmentStatus?.id === 2)
      .length;
  }

  get paidEnrollments(): number {
    return this.allEnrollments.filter((item) => item.paymentStatus?.id === 1)
      .length;
  }

  get isActiveCount(): number {
    return this.allEnrollments.filter((item) => item.isActive === true).length;
  }

  get isInactiveCount(): number {
    return this.allEnrollments.filter((item) => item.isActive === false).length;
  }

  constructor(
    private enrollmentService: EnrollmentService,
    private traineeService: TraineeService,
    private courseService: CourseService,
    private employeeService: EmployeeService,
    private notification: NotificationService,
    private reportService: ReportService,
    private dialog: MatDialog,
    private fileService: FileService,
    private constantService: ConstantService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.loadLookupData();
    this.loadEnrollments();
    this.loadSelectOptions();
  }

  ngAfterViewInit() {
    // Sort is handled programmatically
  }

  ngOnDestroy(): void {
    this.traineeImageUrls.forEach((url) => {
      if (url && url.startsWith('blob:')) {
        URL.revokeObjectURL(url);
      }
    });
    this.traineeImageUrls.clear();
  }

  loadSelectOptions() {
    // Enrollment Status options - use numeric IDs but send string enums
    this.enrollmentStatusOptions = [
      { value: null, label: 'الكل' },
      { value: 1, label: 'قيد الانتظار' },
      { value: 2, label: 'مكتمل' },
      { value: 3, label: 'ملغي' },
    ];

    // Payment Status options - use numeric IDs but send string enums
    this.paymentStatusOptions = [
      { value: null, label: 'الكل' },
      { value: 1, label: 'قيد الانتظار' },
      { value: 2, label: 'تم الدفع' },
      { value: 3, label: 'فشل' },
      { value: 4, label: 'تم استرداد المبلغ' },
      { value: 5, label: 'تم الإلغاء' },
      { value: 6, label: 'جزئي' },
    ];
  }

  loadLookupData() {
    this.traineeService.getAllTraineesLookup().subscribe({
      next: (res: any) => {
        this.trainees = res.list || [];
        this.traineeOptions = [
          { value: null, label: 'الكل' },
          ...this.trainees.map((t) => ({ value: t.id, label: t.title })),
        ];
      },
      error: () => {
        this.notification.showError('حدث خطأ في تحميل المتدربين');
      },
    });

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

    this.employeeService.getAllTrainersLookup().subscribe({
      next: (res: any) => {
        this.trainers = res.list || [];
        this.trainerOptions = [
          { value: null, label: 'الكل' },
          ...this.trainers.map((t) => ({ value: t.id, label: t.title })),
        ];
      },
      error: () => {
        this.notification.showError('حدث خطأ في تحميل المدربين');
      },
    });
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
      this.loadEnrollments();
    }
  }

  goToPreviousPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.loadEnrollments();
    }
  }

  goToNextPage(): void {
    this.currentPage++;
    console.log('➡️ Going to next page:', this.currentPage);
    this.loadEnrollments();
  }

  goToLastPage(): void {
    const totalPages = this.getTotalPages();
    if (this.currentPage !== totalPages - 1 && totalPages > 0) {
      this.currentPage = totalPages - 1;
      this.loadEnrollments();
    }
  }

  onPageSizeChange(): void {
    this.currentPage = 0;
    console.log('📏 Page size changed to:', this.pageSize);
    this.loadEnrollments();
  }

  // ==========================================================================
  // BARCODE SEARCH METHODS
  // ==========================================================================

  toggleBarcodeMode(): void {
    this.isBarcodeMode = !this.isBarcodeMode;
    if (this.isBarcodeMode) {
      setTimeout(() => this.barcodeInput?.nativeElement.focus(), 100);
    } else {
      this.barcodeSearch = '';
      this.filters.traineeNationalId = null;
      this.loadEnrollments();
    }
  }

  searchByBarcode(): void {
    if (!this.barcodeSearch?.trim()) {
      this.notification.showWarning('الرجاء إدخال رقم الباركود');
      return;
    }

    this.filters.traineeNationalId = this.barcodeSearch.trim();
    this.currentPage = 0;
    this.loadEnrollments();
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

  // ==========================================================================
  // HELPER METHOD - FORMAT DATE FOR BACKEND
  // ==========================================================================

  // ==========================================================================
  // HELPER METHOD - FORMAT DATE FOR BACKEND
  // ==========================================================================

  private formatDateForBackend(date: any): string | null {
    if (!date) return null;

    // If it's already a string in YYYY-MM-DD format, return it
    if (typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return date;
    }

    // If it's a Date object or string, convert it
    const d = new Date(date);
    if (isNaN(d.getTime())) return null;

    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // ==========================================================================
  // LOAD ENROLLMENTS WITH PROPER FORMATTING
  // ==========================================================================

  loadEnrollments() {
    console.log('🔄 loadEnrollments() called');
    console.log(`  Current Page: ${this.currentPage}`);
    console.log(`  Page Size: ${this.pageSize}`);

    this.isLoading = true;
    const params: any = {};

    // ===== FILTERS with proper formatting =====
    if (this.filters.traineeId) params.traineeId = this.filters.traineeId;
    if (this.filters.traineeNationalId)
      params.traineeNationalId = this.filters.traineeNationalId;
    if (this.filters.courseId) params.courseId = this.filters.courseId;
    if (this.filters.trainerId) params.trainerId = this.filters.trainerId;

    // ===== ENROLLMENT STATUS - Convert to String Enum =====
    if (this.filters.enrollmentStatus) {
      params.enrollmentStatus =
        this.ENROLLMENT_STATUS_MAP[this.filters.enrollmentStatus] ||
        this.filters.enrollmentStatus;
    }

    // ===== PAYMENT STATUS - Convert to String Enum =====
    if (this.filters.paymentStatus) {
      params.paymentStatus =
        this.PAYMENT_STATUS_MAP[this.filters.paymentStatus] ||
        this.filters.paymentStatus;
    }

    // ===== DATES - Format as YYYY-MM-DD =====
    if (this.filters.startDateFrom) {
      params.startDateFrom = this.formatDateForBackend(
        this.filters.startDateFrom,
      );
    }
    if (this.filters.startDateTo) {
      params.startDateTo = this.formatDateForBackend(this.filters.startDateTo);
    }
    if (this.filters.endDateFrom) {
      params.endDateFrom = this.formatDateForBackend(this.filters.endDateFrom);
    }
    if (this.filters.endDateTo) {
      params.endDateTo = this.formatDateForBackend(this.filters.endDateTo);
    }

    if (this.filters.isActive !== null) params.isActive = this.filters.isActive;
    if (this.quickSearch) params.quickSearch = this.quickSearch;

    // ===== PAGINATION =====
    params.pageNum = this.currentPage;
    params.pageSize = this.pageSize;

    // ===== SORTING =====
    if (this.sortBy) params.orderBy = this.sortBy;
    if (this.sortDir) params.orderDir = this.sortDir;

    console.log('📤 Sending request with params:', params);

    this.enrollmentService.getAllEnrollmentsByFilter(params).subscribe({
      next: (res: any) => {
        console.log('✅ Response received:', res);
        console.log(`  Items: ${res.items?.length || 0}`);
        console.log(`  Total: ${res.total || 0}`);

        this.allEnrollments = res.items || [];
        this.totalItems = res.total || 0;
        this.loadTraineeImages(this.allEnrollments);
        this.dataSource.data = this.allEnrollments;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('❌ Error loading enrollments:', err);
        this.notification.showError('حدث خطأ في تحميل البيانات');
        this.isLoading = false;
        this.cdr.detectChanges();
      },
    });
  }

  loadTraineeImages(items: EnrollmentListItem[]): void {
    this.traineeImageUrls.forEach((url) => {
      if (url && url.startsWith('blob:')) {
        URL.revokeObjectURL(url);
      }
    });
    this.traineeImageUrls.clear();

    items.forEach((item) => {
      const trainee = item.trainee;
      if (
        trainee &&
        trainee.imageUrl &&
        /^\d{15}(\d{3})?$/.test(trainee.imageUrl)
      ) {
        this.fileService.downloadFile(trainee.imageUrl).subscribe({
          next: (blob) => {
            const blobUrl = URL.createObjectURL(blob);
            this.traineeImageUrls.set(trainee.id, blobUrl);
            this.dataSource.data = [...this.dataSource.data];
            this.cdr.detectChanges();
          },
          error: (error) => {
            console.error(
              `Failed to load image for trainee ${trainee.id}:`,
              error,
            );
          },
        });
      }
    });
  }

  getTraineeImageUrl(traineeId: number): string | null {
    const url = this.traineeImageUrls.get(traineeId);
    return url && url.startsWith('blob:') ? url : null;
  }

  getTraineeName(trainee: any): string {
    if (!trainee) return '-';
    return trainee.fullName || '-';
  }

  toggleActiveFilter(event: any): void {
    this.filters.isActive = event.checked;
    this.currentPage = 0;
    this.loadEnrollments();
  }

  applyQuickSearch(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.quickSearch = value;
    this.currentPage = 0;
    this.loadEnrollments();
  }

  resetFilters() {
    this.filters = {
      traineeId: null,
      traineeNationalId: null,
      courseId: null,
      trainerId: null,
      enrollmentStatus: null,
      paymentStatus: null,
      startDateFrom: null,
      startDateTo: null,
      endDateFrom: null,
      endDateTo: null,
      isActive: null,
    };
    this.quickSearch = '';
    this.barcodeSearch = '';
    this.isBarcodeMode = false;
    this.currentPage = 0;
    const toggle = document.querySelector('#activeToggle') as HTMLInputElement;
    if (toggle) {
      toggle.checked = false;
    }
    this.loadEnrollments();
    this.notification.showSuccess('تم مسح جميع الفلاتر');
  }
  // ==========================================================================
  // SORTING EVENTS
  // ==========================================================================

  onSortChange(sort: Sort): void {
    console.log('📊 Sort changed:', sort);
    if (sort.active && sort.direction) {
      this.sortBy = sort.active;
      this.sortDir = sort.direction.toUpperCase();
    } else {
      this.sortBy = 'START_DATE';
      this.sortDir = 'DESC';
    }
    this.currentPage = 0;
    this.loadEnrollments();
  }

  // ==========================================================================
  // FILTER METHODS
  // ==========================================================================

  onFilterChange(): void {
    this.currentPage = 0;
    this.loadEnrollments();
  }

  // ==========================================================================
  // ENROLLMENT OPERATIONS
  // ==========================================================================

  viewEnrollment(id: number): void {
    this.enrollmentService.getEnrollmentById(id).subscribe({
      next: (enrollment) => {
        this.dialog.open(EnrollmentDetailsModalComponent, {
          data: enrollment,
          width: 'auto',
          maxWidth: '95vw',
          maxHeight: '85vh',
          disableClose: false,
          autoFocus: false,
        });
      },
      error: () => {
        this.notification.showError('حدث خطأ في تحميل بيانات التسجيل');
      },
    });
  }

  editEnrollment(id: number): void {
    const dialogRef = this.dialog.open(EnrollmentWizardModalComponent, {
      data: { enrollmentId: id },
      panelClass: 'enrollment-wizard-modal-panel',
      width: 'auto',
      maxWidth: '95vw',
      height: 'auto',
      maxHeight: '95vh',
      disableClose: false,
      autoFocus: false,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadEnrollments();
      }
    });
  }

  openNewEnrollmentModal(): void {
    const dialogRef = this.dialog.open(EnrollmentWizardModalComponent, {
      data: {},
      panelClass: 'enrollment-wizard-modal-panel',
      width: 'auto',
      maxWidth: '95vw',
      height: 'auto',
      maxHeight: '95vh',
      disableClose: false,
      autoFocus: false,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadEnrollments();
      }
    });
  }

  deleteEnrollment(enrollment: EnrollmentListItem): void {
    const traineeName = this.getTraineeName(enrollment.trainee);
    if (
      confirm(
        `هل أنت متأكد من حذف تسجيل "${traineeName}" في دورة "${enrollment.course?.title}"؟`,
      )
    ) {
      this.enrollmentService.deleteEnrollment(enrollment.id).subscribe({
        next: () => {
          this.notification.showSuccess('تم حذف التسجيل بنجاح');
          this.loadEnrollments();
        },
        error: () => this.notification.showError('حدث خطأ في حذف التسجيل'),
      });
    }
  }

  // ==========================================================================
  // PRINT CARDS WITH PAGE SELECTION
  // ==========================================================================
  async printEnrollmentCards(): Promise<void> {
    const result = await this.showExportPageSelection(true);

    if (!result) {
      return;
    }

    this.isLoading = true;

    let dataToPrint: EnrollmentListItem[] = [];

    if (result.option === 'all') {
      dataToPrint = await this.fetchPagesForExport(0, this.getTotalPages() - 1);
    } else if (result.option === 'current') {
      dataToPrint = this.allEnrollments;
    } else if (result.option === 'range') {
      dataToPrint = await this.fetchPagesForExport(
        result.startPage,
        result.endPage,
      );
    }

    if (dataToPrint.length === 0) {
      this.notification.showWarning('لا توجد بيانات لطباعة البطاقات');
      this.isLoading = false;
      return;
    }

    // Load images for all trainees
    const enrollmentImagePromises = dataToPrint.map((enrollment) => {
      return new Promise<string>((resolve) => {
        const trainee = enrollment.trainee;
        if (
          trainee &&
          trainee.imageUrl &&
          /^\d{15}(\d{3})?$/.test(trainee.imageUrl)
        ) {
          this.fileService.downloadFile(trainee.imageUrl).subscribe({
            next: (blob) => {
              const blobUrl = URL.createObjectURL(blob);
              resolve(blobUrl);
            },
            error: () => {
              resolve('');
            },
          });
        } else {
          resolve('');
        }
      });
    });

    const imageUrls = await Promise.all(enrollmentImagePromises);

    // Fetch contact number from constant service (id = 1)
    this.constantService.getConstantById(1).subscribe({
      next: (constant) => {
        this.academyContactNumber = constant?.value || '01069911181';
        this.generateEnrollmentCards(dataToPrint, imageUrls);
        this.isLoading = false;
        this.notification.showSuccess(
          `تم فتح ${dataToPrint.length} بطاقة للطباعة`,
        );
      },
      error: () => {
        this.academyContactNumber = '01069911181'; // Fallback
        this.generateEnrollmentCards(dataToPrint, imageUrls);
        this.isLoading = false;
        this.notification.showSuccess(
          `تم فتح ${dataToPrint.length} بطاقة للطباعة`,
        );
      },
    });
  }

  private generateEnrollmentCards(
    enrollments: EnrollmentListItem[],
    imageUrls: string[],
  ): void {
    const printWindow = window.open(
      '',
      '_blank',
      'width=800,height=800,scrollbars=yes',
    );
    if (!printWindow) {
      this.notification.showError('تعذر فتح نافذة الطباعة');
      return;
    }

    const today = new Date().toLocaleDateString('ar-EG');
    const currentYear = new Date().getFullYear();
    let cardsHtml = '';
    const logoPath = 'assets/images/simpleLogo.jpeg';
    const academyName = 'الأكاديمية الأولمبية';
    const academyAddress = 'الفيوم - حي الجامعة';

    // Get contact number from constant service (id = 1)
    let contactNumber = '01069911181'; // Default fallback

    // We'll use the constant from the service, but we need to fetch it first
    // Since this is called from printEnrollmentCards, we'll pass it as a parameter
    // For now, we'll use the value passed from the parent method

    enrollments.forEach((enrollment, index) => {
      const imageUrl = imageUrls[index] || '';
      const traineeName = this.getTraineeName(enrollment.trainee);
      const courseTitle = enrollment.course?.title || '-';
      const trainerTitle = enrollment.trainer?.title || '-';
      const startDate = enrollment.startDate || '-';
      const endDate = enrollment.endDate || '-';
      const amount = enrollment.finalSubscriptionValue || 0;
      const remaining = enrollment.remainedSubscriptionValue || 0;
      const isActive = enrollment.isActive;
      const enrollmentStatus = enrollment.enrollmentStatus?.title || '-';
      const paymentStatus = enrollment.paymentStatus?.title || '-';

      cardsHtml += `
      <div class="card-wrapper">
        <div class="card">
          <!-- Watermark (transparent background) -->
          <div class="card-watermark">
            <img src="${logoPath}" alt="${academyName}">
          </div>
          <div class="card-watermark-text">${academyName}</div>
          
          <!-- Card Content -->
          <div class="card-content">
            <!-- Logo at top - Colored and visible -->
            <div class="card-logo-section">
              <img src="${logoPath}" alt="${academyName}" class="card-logo-image">
              <div class="card-logo-text">
                <span class="academy-name">${academyName}</span>
                <span class="card-title">بطاقة تسجيل متدرب</span>
              </div>
            </div>
            
            <div class="card-body">
              <div class="card-photo">
                ${imageUrl ? `<img src="${imageUrl}" alt="${traineeName}">` : '<div class="placeholder-photo">📷</div>'}
              </div>
              <div class="card-info">
                <div class="card-name">${traineeName}</div>
                <div class="card-id">رقم التسجيل: ${enrollment.id}</div>
                <div class="card-details">
                  <div class="detail-row">
                    <span class="detail-label">الدورة:</span>
                    <span class="detail-value">${courseTitle}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">المدرب:</span>
                    <span class="detail-value">${trainerTitle}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">تاريخ البدء:</span>
                    <span class="detail-value">${startDate}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">تاريخ الانتهاء:</span>
                    <span class="detail-value">${endDate}</span>
                  </div>
                  <div class="detail-row amount-row">
                    <span class="detail-label">💰 القيمة:</span>
                    <span class="detail-value amount">${amount.toLocaleString()} جم</span>
                  </div>
                  <div class="detail-row remaining-row">
                    <span class="detail-label">💳 المتبقي:</span>
                    <span class="detail-value remaining ${remaining === 0 ? 'zero' : ''}">${remaining.toLocaleString()} جم</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">الحالة:</span>
                    <span class="detail-value status ${isActive ? 'active' : 'inactive'}">${isActive ? 'نشط' : 'غير نشط'}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">حالة التسجيل:</span>
                    <span class="detail-value">${enrollmentStatus}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">حالة الدفع:</span>
                    <span class="detail-value">${paymentStatus}</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="card-footer">
              <div class="card-barcode">
                <svg id="barcode-${index}" class="barcode-svg"></svg>
              </div>
              <div class="card-signature">
                <div class="signature-line"></div>
                <div class="signature-label">توقيع المتدرب</div>
              </div>
              <div class="card-signature">
                <div class="signature-line"></div>
                <div class="signature-label">ختم الأكاديمية</div>
              </div>
            </div>
            
            <!-- ===== ACADEMY INFO - Smallest size ===== -->
            <div class="card-academy-info">
              <span class="academy-name-small">🏛️ ${academyName}</span>
              <span class="separator-dot">•</span>
              <span class="academy-address">📍 ${academyAddress}</span>
              <span class="separator-dot">•</span>
              <span class="academy-phone">📞 ${this.academyContactNumber || '01069911181'}</span>
            </div>
            
            <!-- ===== ISSUE DATE ===== -->
            <div class="card-issue-date">📅 تاريخ الإصدار: ${today}</div>
            
            <!-- ===== POWERED BY - Bottom Left ===== -->
            <div class="card-powered-by">
              <span class="company-name">⚡ CoreStack Solutions</span>
              <span class="separator">|</span>
              <span class="company-phone">📱 01069911181</span>
              <span class="separator">|</span>
              <span class="copyright">© ${currentYear}</span>
            </div>
          </div>
        </div>
      </div>
    `;
    });

    printWindow.document.write(`
    <!DOCTYPE html>
    <html dir="rtl">
    <head>
      <meta charset="UTF-8">
      <title>بطاقات التسجيلات</title>
      <script src="https://cdn.jsdelivr.net/npm/jsbarcode@3.11.6/dist/JsBarcode.all.min.js"><\/script>
      <style>
        * { 
          font-family: 'Cairo', 'Segoe UI', Tahoma, sans-serif; 
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }
        
        @media print {
          body { 
            margin: 0; 
            padding: 4px; 
            background: white; 
          }
          .no-print { display: none; }
          .card-wrapper { 
            page-break-after: avoid;
            display: inline-block;
            width: 50%;
            padding: 3px;
          }
          .card {
            box-shadow: none !important;
            border: 1px solid #ddd !important;
            border-radius: 4px !important;
            min-height: 260px;
            padding: 8px 10px;
          }
          .card-watermark {
            opacity: 0.08 !important;
          }
          .card-watermark img {
            width: 80px !important;
          }
          .card-watermark-text {
            font-size: 16px !important;
            opacity: 0.04 !important;
          }
          .card-logo-section {
            padding: 4px 0 !important;
            margin-bottom: 4px !important;
          }
          .card-logo-image {
            width: 40px !important;
            height: 40px !important;
          }
          .card-logo-text .academy-name {
            font-size: 11px !important;
          }
          .card-logo-text .card-title {
            font-size: 7px !important;
          }
          .card-body {
            gap: 6px;
            margin-bottom: 4px;
          }
          .card-photo img, .placeholder-photo {
            width: 45px !important;
            height: 45px !important;
          }
          .card-name {
            font-size: 10px !important;
          }
          .card-id {
            font-size: 7px !important;
          }
          .card-details {
            font-size: 7px !important;
          }
          .detail-row {
            padding: 1px 0;
          }
          .card-footer {
            padding-top: 4px;
            margin-top: 2px;
          }
          .card-barcode svg {
            height: 20px !important;
          }
          .card-signature {
            width: 42%;
          }
          .signature-label {
            font-size: 5px !important;
          }
          .signature-line {
            margin: 2px 0;
          }
          .card-academy-info {
            font-size: 5px !important;
          }
          .card-issue-date {
            font-size: 5px !important;
          }
          .card-powered-by {
            font-size: 4px !important;
          }
          .card-powered-by .company-name {
            font-size: 4.5px !important;
          }
          .card-logo-image {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        }
        
        @media screen {
          body { 
            margin: 0; 
            padding: 20px; 
            background: #f0f2f5; 
            display: flex;
            flex-wrap: wrap;
            gap: 16px;
            justify-content: center;
          }
          .card-wrapper { 
            flex: 0 0 auto;
            margin: 0;
          }
        }
        
        .card-wrapper {
          display: inline-block;
        }
        
        .card {
          width: 100%;
          max-width: 280px;
          min-width: 220px;
          height: auto;
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          overflow: hidden;
          border: 1px solid #e2e8f0;
          direction: rtl;
          padding: 12px 14px;
          position: relative;
        }
        
        /* ===== WATERMARK - Transparent background ===== */
        .card-watermark {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(-25deg) scale(1.6);
          opacity: 0.06;
          pointer-events: none;
          z-index: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 100%;
        }
        
        .card-watermark img {
          width: 100px;
          height: auto;
          filter: grayscale(0%) sepia(20%) saturate(150%) hue-rotate(220deg);
          opacity: 0.8;
        }
        
        .card-watermark-text {
          position: absolute;
          top: 56%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(-25deg) scale(0.9);
          font-size: 20px;
          font-weight: 900;
          color: #0f3460;
          letter-spacing: 4px;
          text-transform: uppercase;
          white-space: nowrap;
          opacity: 0.04;
          pointer-events: none;
          z-index: 0;
          text-shadow: 0 2px 10px rgba(15, 52, 96, 0.1);
        }
        
        /* ===== CARD CONTENT - Above watermark ===== */
        .card-content {
          position: relative;
          z-index: 1;
        }
        
        /* ===== LOGO AT TOP - Colored and visible ===== */
        .card-logo-section {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 8px 0;
          margin-bottom: 6px;
          border-bottom: 2px solid #0f3460;
        }
        
        .card-logo-image {
          width: 48px;
          height: 48px;
          object-fit: contain;
          border-radius: 8px;
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
          font-size: 13px;
          font-weight: 700;
          color: #0f3460;
          line-height: 1.2;
        }
        
        .card-logo-text .card-title {
          font-size: 9px;
          color: #64748b;
          font-weight: 500;
        }
        
        .card-body {
          display: flex;
          gap: 10px;
          margin-bottom: 8px;
        }
        
        .card-photo {
          flex-shrink: 0;
        }
        
        .card-photo img {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid #0f3460;
        }
        
        .placeholder-photo {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 28px;
          color: white;
        }
        
        .card-info {
          flex: 1;
          min-width: 0;
        }
        
        .card-name {
          font-size: 13px;
          font-weight: 700;
          color: #1a1a2e;
          margin-bottom: 2px;
        }
        
        .card-id {
          font-size: 8px;
          color: #64748b;
          margin-bottom: 2px;
        }
        
        .card-details {
          font-size: 9px;
        }
        
        .detail-row {
          display: flex;
          justify-content: space-between;
          padding: 2px 0;
          border-bottom: 1px dashed #f1f5f9;
        }
        
        .detail-label {
          color: #64748b;
        }
        
        .detail-value {
          color: #1e293b;
          font-weight: 500;
        }
        
        .detail-value.amount {
          color: #0f3460;
          font-weight: 700;
        }
        
        .detail-value.remaining {
          color: #d97706;
          font-weight: 600;
        }
        
        .detail-value.remaining.zero {
          color: #10b981;
        }
        
        .detail-value.status.active {
          color: #10b981;
        }
        
        .detail-value.status.inactive {
          color: #ef4444;
        }
        
        .amount-row {
          background: #f0f4f8;
          border-radius: 4px;
          padding: 2px 4px;
        }
        
        .remaining-row {
          background: #fffbeb;
          border-radius: 4px;
          padding: 2px 4px;
        }
        
        .card-footer {
          border-top: 2px solid #0f3460;
          padding-top: 6px;
          margin-top: 4px;
        }
        
        .card-barcode {
          text-align: center;
          margin-bottom: 6px;
        }
        
        .card-barcode svg {
          max-width: 100%;
          height: 30px;
        }
        
        .card-signature {
          display: inline-block;
          width: 44%;
          text-align: center;
          vertical-align: top;
        }
        
        .card-signature:last-child {
          margin-right: 5%;
        }
        
        .signature-line {
          border-top: 1px solid #94a3b8;
          margin: 3px 0 2px;
        }
        
        .signature-label {
          font-size: 7px;
          color: #94a3b8;
        }
        
        /* ===== ACADEMY INFO - Smallest size ===== */
        .card-academy-info {
          text-align: center;
          font-size: 6px;
          color: #94a3b8;
          margin-top: 4px;
          padding-top: 3px;
          border-top: 1px solid #f1f5f9;
        }
        
        .card-academy-info .academy-name-small {
          color: #0f3460;
          font-weight: 600;
        }
        
        .card-academy-info .academy-address {
          color: #64748b;
        }
        
        .card-academy-info .academy-phone {
          color: #0f3460;
          font-weight: 500;
        }
        
        .card-academy-info .separator-dot {
          color: #d1d5db;
          margin: 0 3px;
          font-weight: 700;
        }
        
        .card-issue-date {
          text-align: center;
          font-size: 6px;
          color: #94a3b8;
          margin-top: 2px;
          padding-top: 2px;
          border-top: 1px dashed #e2e8f0;
        }
        
        /* ===== POWERED BY - Bottom Left ===== */
        .card-powered-by {
          text-align: left;
          font-size: 5px;
          color: #94a3b8;
          margin-top: 2px;
          padding-top: 2px;
          border-top: 1px solid #f1f5f9;
          direction: ltr;
        }
        
        .card-powered-by .company-name {
          color: #8b5cf6;
          font-weight: 700;
          font-size: 5.5px;
        }
        
        .card-powered-by .company-phone {
          color: #94a3b8;
          font-weight: 500;
        }
        
        .card-powered-by .separator {
          color: #e5e7eb;
          margin: 0 2px;
        }
        
        .card-powered-by .copyright {
          color: #d1d5db;
        }
        
        @media print {
          .card-academy-info {
            font-size: 5px !important;
          }
          .card-academy-info .academy-name-small {
            font-size: 5px !important;
          }
          .card-academy-info .academy-address {
            font-size: 5px !important;
          }
          .card-academy-info .academy-phone {
            font-size: 5px !important;
          }
          .card-academy-info .separator-dot {
            margin: 0 2px !important;
          }
          .card-issue-date {
            font-size: 5px !important;
          }
          .card-powered-by {
            font-size: 4px !important;
            text-align: left !important;
          }
          .card-powered-by .company-name {
            font-size: 4.5px !important;
          }
          .card-powered-by .company-phone {
            font-size: 4px !important;
          }
          .card-powered-by .separator {
            margin: 0 1.5px !important;
          }
          .card-powered-by .copyright {
            font-size: 4px !important;
          }
        }
        
        @media (max-width: 600px) {
          .card {
            max-width: 100%;
          }
          .card-watermark img {
            width: 80px !important;
          }
          .card-watermark-text {
            font-size: 16px !important;
          }
          .card-logo-image {
            width: 36px !important;
            height: 36px !important;
          }
          .card-logo-text .academy-name {
            font-size: 11px !important;
          }
          .card-photo img, .placeholder-photo {
            width: 50px !important;
            height: 50px !important;
          }
          .card-academy-info {
            font-size: 5px !important;
          }
          .card-powered-by {
            font-size: 4.5px !important;
          }
          .card-powered-by .company-name {
            font-size: 5px !important;
          }
        }
      </style>
    </head>
    <body>
      ${cardsHtml}
      <div class="no-print" style="text-align: center; margin-top: 20px; width: 100%;">
        <button onclick="window.print();" style="padding: 12px 30px; background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%); color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 16px;">🖨️ طباعة / حفظ كـ PDF</button>
      </div>
      <script>
        window.onload = function() {
          setTimeout(function() {
            const enrollments = ${JSON.stringify(enrollments.map((e) => e.trainee?.nationalId || e.id))};
            enrollments.forEach(function(id, index) {
              try {
                JsBarcode('#barcode-' + index, id || '000000', {
                  format: 'CODE128',
                  lineColor: '#000000',
                  width: 1,
                  height: 25,
                  displayValue: true,
                  fontSize: 7,
                  font: 'monospace',
                  textAlign: 'center',
                  margin: 1
                });
              } catch(e) {
                console.error('Barcode error for index', index, e);
              }
            });
          }, 300);
        };
      <\/script>
    </body>
    </html>
  `);
    printWindow.document.close();
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

      const dialogRef = this.dialog.open(ExportPageSelectDialogComponent, {
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
      });

      dialogRef.afterClosed().subscribe((result) => {
        resolve(result);
      });
    });
  }

  private async fetchPagesForExport(
    startPage: number,
    endPage: number,
  ): Promise<EnrollmentListItem[]> {
    const allData: EnrollmentListItem[] = [];
    const totalPages = this.getTotalPages();

    for (
      let page = startPage;
      page <= Math.min(endPage, totalPages - 1);
      page++
    ) {
      const params: any = {};

      if (this.filters.traineeId) params.traineeId = this.filters.traineeId;
      if (this.filters.traineeNationalId)
        params.traineeNationalId = this.filters.traineeNationalId;
      if (this.filters.courseId) params.courseId = this.filters.courseId;
      if (this.filters.trainerId) params.trainerId = this.filters.trainerId;
      if (this.filters.enrollmentStatus)
        params.enrollmentStatus = this.filters.enrollmentStatus;
      if (this.filters.paymentStatus)
        params.paymentStatus = this.filters.paymentStatus;
      if (this.filters.startDateFrom)
        params.startDateFrom = this.filters.startDateFrom;
      if (this.filters.startDateTo)
        params.startDateTo = this.filters.startDateTo;
      if (this.filters.endDateFrom)
        params.endDateFrom = this.filters.endDateFrom;
      if (this.filters.endDateTo) params.endDateTo = this.filters.endDateTo;
      if (this.filters.isActive !== null)
        params.isActive = this.filters.isActive;
      if (this.quickSearch) params.quickSearch = this.quickSearch;

      params.pageNum = page;
      params.pageSize = this.pageSize;

      if (this.sortBy) params.orderBy = this.sortBy;
      if (this.sortDir) params.orderDir = this.sortDir;

      try {
        const res = await this.enrollmentService
          .getAllEnrollmentsByFilter(params)
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

    if (!result) {
      return;
    }

    let dataToExport: EnrollmentListItem[] = [];

    if (result.option === 'all') {
      dataToExport = await this.fetchPagesForExport(
        0,
        this.getTotalPages() - 1,
      );
    } else if (result.option === 'current') {
      dataToExport = this.allEnrollments;
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
      المتدرب: this.getTraineeName(item.trainee),
      الدورة: item.course?.title,
      المدرب: item.trainer?.title,
      'تاريخ البدء': item.startDate,
      'تاريخ الانتهاء': item.endDate || '-',
      'القيمة النهائية': item.finalSubscriptionValue,
      المتبقي: item.remainedSubscriptionValue,
      الحالة: item.isActive ? 'نشط' : 'غير نشط',
      'حالة التسجيل': item.enrollmentStatus?.title,
      'حالة الدفع': item.paymentStatus?.title,
    }));

    this.reportService.exportToExcel(
      exportData,
      'enrollments-list',
      'التسجيلات',
    );
    this.notification.showSuccess(`تم تصدير ${exportData.length} سجل بنجاح`);
  }

  async exportToPDF(): Promise<void> {
    const result = await this.showExportPageSelection(false);

    if (!result) {
      return;
    }

    this.isLoading = true;

    let dataToPrint: EnrollmentListItem[] = [];

    if (result.option === 'all') {
      dataToPrint = await this.fetchPagesForExport(0, this.getTotalPages() - 1);
    } else if (result.option === 'current') {
      dataToPrint = this.allEnrollments;
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
    if (this.filters.traineeId) {
      const trainee = this.trainees.find(
        (t) => t.id === this.filters.traineeId,
      );
      if (trainee) filterTexts.push(`المتدرب: ${trainee.title}`);
    }
    if (this.filters.traineeNationalId) {
      filterTexts.push(`رقم الهوية: ${this.filters.traineeNationalId}`);
    }
    if (this.filters.courseId) {
      const course = this.courses.find((c) => c.id === this.filters.courseId);
      if (course) filterTexts.push(`الدورة: ${course.title}`);
    }
    if (this.filters.trainerId) {
      const trainer = this.trainers.find(
        (t) => t.id === this.filters.trainerId,
      );
      if (trainer) filterTexts.push(`المدرب: ${trainer.title}`);
    }
    if (this.filters.enrollmentStatus) {
      const status = this.enrollmentStatuses.find(
        (s) => s.id === this.filters.enrollmentStatus,
      );
      if (status) filterTexts.push(`حالة التسجيل: ${status.title}`);
    }
    if (this.filters.paymentStatus) {
      const status = this.paymentStatuses.find(
        (s) => s.id === this.filters.paymentStatus,
      );
      if (status) filterTexts.push(`حالة الدفع: ${status.title}`);
    }
    if (this.filters.isActive !== null) {
      filterTexts.push(`الحالة: ${this.filters.isActive ? 'نشط' : 'غير نشط'}`);
    }
    if (this.filters.startDateFrom)
      filterTexts.push(`من تاريخ البدء: ${this.filters.startDateFrom}`);
    if (this.filters.startDateTo)
      filterTexts.push(`إلى تاريخ البدء: ${this.filters.startDateTo}`);
    if (this.filters.endDateFrom)
      filterTexts.push(`من تاريخ الانتهاء: ${this.filters.endDateFrom}`);
    if (this.filters.endDateTo)
      filterTexts.push(`إلى تاريخ الانتهاء: ${this.filters.endDateTo}`);
    if (this.quickSearch) filterTexts.push(`بحث: ${this.quickSearch}`);

    // Calculate totals
    const totalEnrollments = dataToPrint.length;
    const totalAmount = dataToPrint.reduce(
      (sum, item) => sum + (item.finalSubscriptionValue || 0),
      0,
    );
    const totalPaid = dataToPrint.filter(
      (item) => item.paymentStatus?.id === 1,
    ).length;
    const totalActive = dataToPrint.filter(
      (item) => item.isActive === true,
    ).length;
    const totalInactive = dataToPrint.filter(
      (item) => item.isActive === false,
    ).length;
    const totalRemaining = dataToPrint.reduce(
      (sum, item) => sum + (item.remainedSubscriptionValue || 0),
      0,
    );

    // Split data into pages
    const rowsPerPage = 18;
    const pages: EnrollmentListItem[][] = [];
    for (let i = 0; i < dataToPrint.length; i += rowsPerPage) {
      pages.push(dataToPrint.slice(i, i + rowsPerPage));
    }

    let allPagesHTML = '';

    // Use simpleLogo.jpeg for watermark
    const logoPath = 'assets/images/simpleLogo.jpeg';

    pages.forEach((pageData: EnrollmentListItem[], pageIndex: number) => {
      let tableRows = '';
      pageData.forEach((item: any, index: number) => {
        const globalIndex = pageIndex * rowsPerPage + index + 1;
        const activeStyle = item.isActive
          ? 'background: #d1fae5; color: #065f46; border-radius: 16px; padding: 3px 12px; display: inline-block; font-weight: 600; font-size: 11px;'
          : 'background: #fee2e2; color: #991b1b; border-radius: 16px; padding: 3px 12px; display: inline-block; font-weight: 600; font-size: 11px;';

        let enrollmentStatusStyle = '';
        const statusId = item.enrollmentStatus?.id;
        if (statusId === 1) {
          enrollmentStatusStyle =
            'background: #d1fae5; color: #065f46; border-radius: 16px; padding: 3px 12px; display: inline-block; font-weight: 600; font-size: 11px;';
        } else if (statusId === 2) {
          enrollmentStatusStyle =
            'background: #dbeafe; color: #1e40af; border-radius: 16px; padding: 3px 12px; display: inline-block; font-weight: 600; font-size: 11px;';
        } else if (statusId === 3) {
          enrollmentStatusStyle =
            'background: #fee2e2; color: #991b1b; border-radius: 16px; padding: 3px 12px; display: inline-block; font-weight: 600; font-size: 11px;';
        } else {
          enrollmentStatusStyle =
            'background: #f3f4f6; color: #6b7280; border-radius: 16px; padding: 3px 12px; display: inline-block; font-weight: 600; font-size: 11px;';
        }

        let paymentStatusStyle = '';
        const paymentId = item.paymentStatus?.id;
        if (paymentId === 1) {
          paymentStatusStyle =
            'background: #d1fae5; color: #065f46; border-radius: 16px; padding: 3px 12px; display: inline-block; font-weight: 600; font-size: 11px;';
        } else if (paymentId === 2) {
          paymentStatusStyle =
            'background: #fef3c7; color: #92400e; border-radius: 16px; padding: 3px 12px; display: inline-block; font-weight: 600; font-size: 11px;';
        } else if (paymentId === 3) {
          paymentStatusStyle =
            'background: #fee2e2; color: #991b1b; border-radius: 16px; padding: 3px 12px; display: inline-block; font-weight: 600; font-size: 11px;';
        } else {
          paymentStatusStyle =
            'background: #f3f4f6; color: #6b7280; border-radius: 16px; padding: 3px 12px; display: inline-block; font-weight: 600; font-size: 11px;';
        }

        const traineeName = this.getTraineeName(item.trainee);

        tableRows += `
          <tr>
            <td style="text-align: center; padding: 6px 5px; border: 1px solid rgba(229, 231, 235, 0.3); font-size: 11px; background: transparent;">${globalIndex}</td>
            <td style="text-align: right; padding: 6px 5px; border: 1px solid rgba(229, 231, 235, 0.3); font-weight: 600; font-size: 11px; background: transparent;">${traineeName}</td>
            <td style="text-align: right; padding: 6px 5px; border: 1px solid rgba(229, 231, 235, 0.3); font-size: 11px; background: transparent;">${item.course?.title || '-'}</td>
            <td style="text-align: right; padding: 6px 5px; border: 1px solid rgba(229, 231, 235, 0.3); font-size: 11px; background: transparent;">${item.trainer?.title || '-'}</td>
            <td style="text-align: center; padding: 6px 5px; border: 1px solid rgba(229, 231, 235, 0.3); font-size: 11px; background: transparent;">${item.startDate || '-'}</td>
            <td style="text-align: center; padding: 6px 5px; border: 1px solid rgba(229, 231, 235, 0.3); font-size: 11px; background: transparent;">${item.endDate || '-'}</td>
            <td style="text-align: center; padding: 6px 5px; border: 1px solid rgba(229, 231, 235, 0.3); font-size: 11px; background: transparent; font-weight: 700; color: #0f3460;">${(item.finalSubscriptionValue || 0).toLocaleString('ar-EG')} جم</td>
            <td style="text-align: center; padding: 6px 5px; border: 1px solid rgba(229, 231, 235, 0.3); font-size: 11px; background: transparent; font-weight: 600; color: ${item.remainedSubscriptionValue === 0 ? '#10b981' : '#d97706'};">${(item.remainedSubscriptionValue || 0).toLocaleString('ar-EG')} جم</td>
            <td style="text-align: center; padding: 6px 5px; border: 1px solid rgba(229, 231, 235, 0.3); font-size: 11px; background: transparent;">
              <span style="${activeStyle}">${item.isActive ? 'نشط' : 'غير نشط'}</span>
            </td>
            <td style="text-align: center; padding: 6px 5px; border: 1px solid rgba(229, 231, 235, 0.3); font-size: 11px; background: transparent;">
              <span style="${enrollmentStatusStyle}">${item.enrollmentStatus?.title || '-'}</span>
            </td>
            <td style="text-align: center; padding: 6px 5px; border: 1px solid rgba(229, 231, 235, 0.3); font-size: 11px; background: transparent;">
              <span style="${paymentStatusStyle}">${item.paymentStatus?.title || '-'}</span>
            </td>
          </tr>
        `;
      });

      allPagesHTML += `
        <div class="page-container">
          <!-- Watermark -->
          <div class="watermark-wrapper">
            <div class="watermark-container">
              <img src="${logoPath}" alt="الأكاديمية الأولمبية" class="watermark-logo">
            </div>
            <div class="watermark-text">الأكاديمية الأولمبية</div>
          </div>
          
          <div class="content">
            <div class="header">
              <h1>📋 تقرير التسجيلات</h1>
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
                <span class="total-value">${totalEnrollments}</span>
                <span class="total-label">إجمالي التسجيلات</span>
              </div>
              <div class="total-card total-amount">
                <span class="total-icon">💰</span>
                <span class="total-value">${totalAmount.toLocaleString('ar-EG')} جم</span>
                <span class="total-label">إجمالي المبالغ</span>
              </div>
              <div class="total-card total-remaining">
                <span class="total-icon">📊</span>
                <span class="total-value">${totalRemaining.toLocaleString('ar-EG')} جم</span>
                <span class="total-label">إجمالي المتبقي</span>
              </div>
              <div class="total-card total-paid">
                <span class="total-icon">💳</span>
                <span class="total-value">${totalPaid}</span>
                <span class="total-label">مدفوع</span>
              </div>
              <div class="total-card total-active">
                <span class="total-icon">🟢</span>
                <span class="total-value">${totalActive}</span>
                <span class="total-label">نشط</span>
              </div>
              <div class="total-card total-inactive">
                <span class="total-icon">🔴</span>
                <span class="total-value">${totalInactive}</span>
                <span class="total-label">غير نشط</span>
              </div>
            </div>
            `
                : ''
            }
            
            <table>
              <thead>
                <tr>
                  <th style="width: 4%;">#</th>
                  <th style="width: 16%;">المتدرب</th>
                  <th style="width: 14%;">الدورة</th>
                  <th style="width: 12%;">المدرب</th>
                  <th style="width: 10%;">تاريخ البدء</th>
                  <th style="width: 10%;">تاريخ الانتهاء</th>
                  <th style="width: 10%;">القيمة</th>
                  <th style="width: 10%;">المتبقي</th>
                  <th style="width: 8%;">الحالة</th>
                  <th style="width: 10%;">حالة التسجيل</th>
                  <th style="width: 10%;">حالة الدفع</th>
                </tr>
              </thead>
              <tbody>
                ${tableRows}
              </tbody>
            </table>
            
            <div class="footer">
              الأكاديمية الأولمبية &copy; ${new Date().getFullYear()} - ${dataToPrint.length} تسجيل
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
        <title>تقرير التسجيلات</title>
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
            color: #0f3460;
            letter-spacing: 6px;
            text-transform: uppercase;
            white-space: nowrap;
            opacity: 0.05;
            text-shadow: 0 4px 20px rgba(15, 52, 96, 0.15);
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
            background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
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
            grid-template-columns: repeat(6, 1fr);
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
            background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
            color: white;
            border-color: #0f3460;
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
          
          .total-card.total-paid {
            background: rgba(209, 250, 229, 0.85);
            border-color: rgba(110, 231, 183, 0.5);
          }
          .total-card.total-paid .total-value {
            color: #059669;
          }
          
          .total-card.total-active {
            background: rgba(167, 243, 208, 0.85);
            border-color: rgba(52, 211, 153, 0.5);
          }
          .total-card.total-active .total-value {
            color: #065f46;
          }
          
          .total-card.total-inactive {
            background: rgba(254, 226, 226, 0.85);
            border-color: rgba(252, 165, 165, 0.5);
          }
          .total-card.total-inactive .total-value {
            color: #dc2626;
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
            background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
            color: white;
            padding: 5px 4px;
            border: 1px solid #0f3460;
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
              grid-template-columns: repeat(3, 1fr);
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
        ${allPagesHTML}
        
        <div class="no-print" style="text-align: center; margin-top: 10px; padding: 10px; position: fixed; bottom: 0; left: 0; right: 0; background: white; box-shadow: 0 -2px 10px rgba(0,0,0,0.1); z-index: 9999;">
          <button onclick="window.print();" style="padding: 8px 24px; background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%); color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 14px; font-weight: 600; box-shadow: 0 2px 10px rgba(15, 52, 96, 0.3);">
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

  getPaymentStatusClass(statusId: number): string {
    const classes: { [key: number]: string } = {
      1: 'paid',
      2: 'partial',
      3: 'unpaid',
    };
    return classes[statusId] || 'unpaid';
  }

  getEnrollmentStatusClass(statusId: number): string {
    const classes: { [key: number]: string } = {
      1: 'active',
      2: 'completed',
      3: 'cancelled',
    };
    return classes[statusId] || 'active';
  }

  getActiveStatusClass(isActive: boolean): string {
    return isActive ? 'active-status' : 'inactive-status';
  }

  getActiveStatusText(isActive: boolean): string {
    return isActive ? 'نشط' : 'غير نشط';
  }
}
