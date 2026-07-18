// trainee-list.component.ts - COMPLETE WITH ENHANCED DIALOG AND PRINT CARDS PAGE SELECTION

import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectorRef,
  Inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import {
  MatDialog,
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { RouterLink } from '@angular/router';

import { TraineeService } from '../../../../core/services/trainee.service';
import { ReportService } from '../../../../core/services/report.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { FileService } from '../../../../core/services/file.service';
import {
  SearchableSelectComponent,
  SelectOption,
} from '../../../../shared/components/searchable-select/searchable-select.component';
import { GENDERS } from '../../../../core/models/common.model';
import { TraineeDetailsModalComponent } from '../trainee-details/trainee-details-modal.component';
import { TraineeWizardModalComponent } from '../trainee-wizard/trainee-wizard-modal.component';
import { TraineeListItem } from '../../../../core/models/trainee.model';
import * as JsBarcode from 'jsbarcode';

// ============================================================================
// PAGE SELECTION DIALOG COMPONENT - ENHANCED COLORS
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
      result.startPage = this.startPage - 1; // Convert to 0-based index
      result.endPage = this.endPage - 1;
    }

    this.dialogRef.close(result);
  }

  close(): void {
    this.dialogRef.close(null);
  }
}

// ============================================================================
// MAIN TRAINEE LIST COMPONENT
// ============================================================================

@Component({
  selector: 'app-trainee-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatSortModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatTooltipModule,
    MatDialogModule,
    MatDividerModule,
    RouterLink,
    SearchableSelectComponent,
  ],
  templateUrl: './trainee-list.component.html',
  styleUrls: ['./trainee-list.component.css'],
})
export class TraineeListComponent implements OnInit, OnDestroy {
  Math = Math;

  displayedColumns: string[] = [
    'index',
    'image',
    'fullName',
    'nationalId',
    'academicYear',
    'gender',
    'status',
    'actions',
  ];
  dataSource = new MatTableDataSource<TraineeListItem>([]);
  allTrainees: TraineeListItem[] = [];
  imageUrls: Map<number, string> = new Map();
  isLoading = false;

  // ========== PAGINATION ==========
  totalItems: number = 0;
  pageSize: number = 25;
  pageSizeOptions: number[] = [5, 10, 25, 50, 100];
  currentPage: number = 0;

  // ========== SORTING ==========
  sortBy: string = 'CREATION_DATE';
  sortDir: string = 'DESC';

  // ========== FILTERS ==========
  searchText = '';
  genderFilter: string | null = null;
  statusFilter: boolean | null = null;
  academicYearFilter: string | null = null;

  // Options for selects
  genderOptions: SelectOption[] = [];
  statusOptions: SelectOption[] = [];

  get activeCount(): number {
    return this.allTrainees.filter((t) => t.isActive).length;
  }

  get inactiveCount(): number {
    return this.allTrainees.filter((t) => !t.isActive).length;
  }

  constructor(
    private traineeService: TraineeService,
    private reportService: ReportService,
    private notification: NotificationService,
    private dialog: MatDialog,
    private fileService: FileService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.loadSelectOptions();
    this.loadTrainees();
  }

  ngOnDestroy(): void {
    this.imageUrls.forEach((url) => {
      if (url && url.startsWith('blob:')) {
        URL.revokeObjectURL(url);
      }
    });
    this.imageUrls.clear();
  }

  loadSelectOptions(): void {
    this.genderOptions = [
      { value: null, label: 'الكل' },
      ...GENDERS.map((g) => ({
        value: this.getGenderEnumName(g.id),
        label: g.title,
      })),
    ];

    this.statusOptions = [
      { value: null, label: 'الكل' },
      { value: true, label: 'نشط' },
      { value: false, label: 'غير نشط' },
    ];
  }

  private getGenderEnumName(id: number): string {
    const genderMap: { [key: number]: string } = {
      1: 'MALE',
      2: 'FEMALE',
    };
    return genderMap[id] || '';
  }

  getAcademicYearDisplay(academicYear: string | undefined | null): string {
    if (!academicYear) return '-';
    return academicYear;
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
      this.loadTrainees();
    }
  }

  goToPreviousPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.loadTrainees();
    }
  }

  goToNextPage(): void {
    this.currentPage++;
    console.log('➡️ Going to next page:', this.currentPage);
    this.loadTrainees();
  }

  goToLastPage(): void {
    const totalPages = this.getTotalPages();
    if (this.currentPage !== totalPages - 1 && totalPages > 0) {
      this.currentPage = totalPages - 1;
      this.loadTrainees();
    }
  }

  onPageSizeChange(): void {
    this.currentPage = 0;
    console.log('📏 Page size changed to:', this.pageSize);
    this.loadTrainees();
  }

  // ==========================================================================
  // LOAD TRAINEES
  // ==========================================================================

  loadTrainees(): void {
    console.log('🔄 loadTrainees() called');
    console.log(`  Current Page: ${this.currentPage}`);
    console.log(`  Page Size: ${this.pageSize}`);

    this.isLoading = true;
    const params: any = {};

    if (this.searchText) params.quickSearch = this.searchText;
    if (this.genderFilter) params.gender = this.genderFilter;
    if (this.statusFilter !== null) params.isActive = this.statusFilter;
    if (this.academicYearFilter && this.academicYearFilter.trim() !== '') {
      params.academicYear = this.academicYearFilter.trim();
    }

    params.pageNum = this.currentPage;
    params.pageSize = this.pageSize;

    if (this.sortBy) params.orderBy = this.sortBy;
    if (this.sortDir) params.orderDir = this.sortDir;

    console.log('📤 Sending request with params:', params);

    this.traineeService.getAllTraineesByFilter(params).subscribe({
      next: (res: any) => {
        console.log('✅ Response received:', res);
        console.log(`  Items: ${res.items?.length || 0}`);
        console.log(`  Total: ${res.total || 0}`);

        this.allTrainees = res.items || [];
        this.totalItems = res.total || 0;
        this.loadAllImages();
        this.dataSource.data = this.allTrainees;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('❌ Error loading trainees:', err);
        this.notification.showError('حدث خطأ في تحميل المتدربين');
        this.isLoading = false;
        this.cdr.detectChanges();
      },
    });
  }

  loadAllImages(): void {
    this.imageUrls.forEach((url) => {
      if (url && url.startsWith('blob:')) {
        URL.revokeObjectURL(url);
      }
    });
    this.imageUrls.clear();

    this.allTrainees.forEach((trainee) => {
      this.loadImage(trainee);
    });
  }

  loadImage(trainee: TraineeListItem): void {
    const fid = trainee.imageUrl;
    if (fid) {
      if (/^\d{15}(\d{3})?$/.test(fid)) {
        this.fileService.downloadFile(fid).subscribe({
          next: (blob) => {
            const existingUrl = this.imageUrls.get(trainee.id);
            if (existingUrl && existingUrl.startsWith('blob:')) {
              URL.revokeObjectURL(existingUrl);
            }
            const blobUrl = URL.createObjectURL(blob);
            this.imageUrls.set(trainee.id, blobUrl);
            this.dataSource.data = [...this.dataSource.data];
            this.cdr.detectChanges();
          },
          error: (error) => {
            console.error(
              `Failed to load image for trainee ${trainee.id}:`,
              error,
            );
            this.imageUrls.set(trainee.id, '');
            this.dataSource.data = [...this.dataSource.data];
            this.cdr.detectChanges();
          },
        });
      } else {
        this.imageUrls.set(trainee.id, fid);
      }
    } else {
      this.imageUrls.set(trainee.id, '');
    }
  }

  getImageUrl(traineeId: number): string | null {
    const url = this.imageUrls.get(traineeId);
    return url && url.startsWith('blob:') ? url : null;
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
      this.sortBy = 'CREATION_DATE';
      this.sortDir = 'DESC';
    }
    this.currentPage = 0;
    this.loadTrainees();
  }

  // ==========================================================================
  // FILTER METHODS
  // ==========================================================================

  onSearchChange(): void {
    console.log('🔍 Search changed:', this.searchText);
    this.currentPage = 0;
    this.loadTrainees();
  }

  onGenderChange(value: string | null): void {
    console.log('🚻 Gender filter changed:', value);
    this.genderFilter = value;
    this.currentPage = 0;
    this.loadTrainees();
  }

  onStatusChange(value: boolean | null): void {
    console.log('📌 Status filter changed:', value);
    this.statusFilter = value;
    this.currentPage = 0;
    this.loadTrainees();
  }

  onAcademicYearChange(value: string): void {
    console.log('📚 Academic year filter changed:', value);
    this.academicYearFilter = value;
    this.currentPage = 0;
    this.loadTrainees();
  }

  clearFilters(): void {
    console.log('🧹 Clearing all filters');
    this.searchText = '';
    this.genderFilter = null;
    this.statusFilter = null;
    this.academicYearFilter = null;
    this.currentPage = 0;
    this.loadTrainees();
    this.notification.showSuccess('تم مسح جميع الفلاتر');
  }

  // ==========================================================================
  // TRAINEE OPERATIONS
  // ==========================================================================

  viewTrainee(id: number): void {
    this.traineeService.getTraineeById(id).subscribe({
      next: (trainee) => {
        this.dialog.open(TraineeDetailsModalComponent, {
          data: trainee,
          width: '700px',
          maxWidth: '90vw',
        });
      },
      error: () => {
        this.notification.showError('حدث خطأ في تحميل بيانات المتدرب');
      },
    });
  }

  editTrainee(id: number): void {
    const trainee = this.allTrainees.find((t) => t.id === id);

    const dialogRef = this.dialog.open(TraineeWizardModalComponent, {
      data: {
        traineeId: id,
        traineeData: trainee,
      },
      width: '900px',
      maxWidth: '90vw',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadTrainees();
      }
    });
  }

  openNewTraineeModal(): void {
    const dialogRef = this.dialog.open(TraineeWizardModalComponent, {
      data: {},
      width: '900px',
      maxWidth: '90vw',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadTrainees();
      }
    });
  }

  deleteTrainee(trainee: TraineeListItem): void {
    if (confirm(`هل أنت متأكد من حذف المتدرب "${trainee.fullName}"؟`)) {
      this.traineeService.deleteTrainee(trainee.id).subscribe({
        next: () => {
          this.notification.showSuccess('تم حذف المتدرب بنجاح');
          this.loadTrainees();
        },
        error: () => this.notification.showError('حدث خطأ في الحذف'),
      });
    }
  }

  // ==========================================================================
  // EXPORT FUNCTIONS WITH PAGE SELECTION
  // ==========================================================================

  private showExportPageSelection(isCardPrint: boolean = false): Promise<any> {
    return new Promise((resolve) => {
      const totalPages = this.getTotalPages();

      if (totalPages <= 1) {
        // If only one page, export directly
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
  ): Promise<TraineeListItem[]> {
    const allData: TraineeListItem[] = [];
    const totalPages = this.getTotalPages();

    // If exporting all pages or range, fetch each page
    for (
      let page = startPage;
      page <= Math.min(endPage, totalPages - 1);
      page++
    ) {
      const params: any = {};

      if (this.searchText) params.quickSearch = this.searchText;
      if (this.genderFilter) params.gender = this.genderFilter;
      if (this.statusFilter !== null) params.isActive = this.statusFilter;
      if (this.academicYearFilter && this.academicYearFilter.trim() !== '') {
        params.academicYear = this.academicYearFilter.trim();
      }

      params.pageNum = page;
      params.pageSize = this.pageSize;

      if (this.sortBy) params.orderBy = this.sortBy;
      if (this.sortDir) params.orderDir = this.sortDir;

      try {
        const res = await this.traineeService
          .getAllTraineesByFilter(params)
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
      return; // User cancelled
    }

    let dataToExport: TraineeListItem[] = [];

    if (result.option === 'all') {
      // Get all pages
      dataToExport = await this.fetchPagesForExport(
        0,
        this.getTotalPages() - 1,
      );
    } else if (result.option === 'current') {
      // Use current page data
      dataToExport = this.allTrainees;
    } else if (result.option === 'range') {
      // Get specific range
      dataToExport = await this.fetchPagesForExport(
        result.startPage,
        result.endPage,
      );
    }

    if (dataToExport.length === 0) {
      this.notification.showWarning('لا توجد بيانات لتصديرها');
      return;
    }

    const exportData = dataToExport.map((t: TraineeListItem, i: number) => ({
      '#': i + 1,
      الاسم: t.fullName,
      'رقم الهوية': t.nationalId,
      'السنة الدراسية': this.getAcademicYearDisplay(t.academicYear),
      الجنس: t.gender?.title || '-',
      الحالة: t.isActive ? 'نشط' : 'غير نشط',
    }));

    this.reportService.exportToExcel(exportData, 'trainees-list', 'المتدربين');
    this.notification.showSuccess(`تم تصدير ${exportData.length} سجل بنجاح`);
  }

  async exportToPDF(): Promise<void> {
    const result = await this.showExportPageSelection(false);

    if (!result) {
      return; // User cancelled
    }

    this.isLoading = true;

    let dataToPrint: TraineeListItem[] = [];

    if (result.option === 'all') {
      dataToPrint = await this.fetchPagesForExport(0, this.getTotalPages() - 1);
    } else if (result.option === 'current') {
      dataToPrint = this.allTrainees;
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
    if (this.genderFilter) {
      const gender = GENDERS.find(
        (g) => this.getGenderEnumName(g.id) === this.genderFilter,
      );
      if (gender) filterTexts.push(`الجنس: ${gender.title}`);
    }
    if (this.statusFilter !== null) {
      filterTexts.push(`الحالة: ${this.statusFilter ? 'نشط' : 'غير نشط'}`);
    }
    if (this.academicYearFilter) {
      filterTexts.push(`السنة الدراسية: ${this.academicYearFilter}`);
    }
    if (this.searchText) filterTexts.push(`بحث: ${this.searchText}`);

    // Calculate totals
    const totalTrainees = dataToPrint.length;
    const totalActive = dataToPrint.filter((t) => t.isActive).length;
    const totalInactive = dataToPrint.filter((t) => !t.isActive).length;
    const totalMale = dataToPrint.filter(
      (t) => t.gender?.title === 'ذكر',
    ).length;
    const totalFemale = dataToPrint.filter(
      (t) => t.gender?.title === 'أنثى' || t.gender?.title === 'انثي',
    ).length;

    // Split data into pages
    const rowsPerPage = 20;
    const pages: TraineeListItem[][] = [];
    for (let i = 0; i < dataToPrint.length; i += rowsPerPage) {
      pages.push(dataToPrint.slice(i, i + rowsPerPage));
    }

    let allPagesHTML = '';

    pages.forEach((pageData: TraineeListItem[], pageIndex: number) => {
      let tableRows = '';
      pageData.forEach((t: TraineeListItem, index: number) => {
        const globalIndex = pageIndex * rowsPerPage + index + 1;
        const statusStyle = t.isActive
          ? 'background: #d1fae5; color: #065f46; border-radius: 16px; padding: 3px 12px; display: inline-block; font-weight: 600; font-size: 11px;'
          : 'background: #fee2e2; color: #991b1b; border-radius: 16px; padding: 3px 12px; display: inline-block; font-weight: 600; font-size: 11px;';

        const genderStyle =
          t.gender?.title === 'ذكر'
            ? 'background: #dbeafe; color: #1e40af; border-radius: 16px; padding: 3px 12px; display: inline-block; font-weight: 600; font-size: 11px;'
            : 'background: #fef3c7; color: #92400e; border-radius: 16px; padding: 3px 12px; display: inline-block; font-weight: 600; font-size: 11px;';

        tableRows += `
          <tr>
            <td style="text-align: center; padding: 6px 5px; border: 1px solid rgba(229, 231, 235, 0.3); font-size: 11px; background: transparent;">${globalIndex}</td>
            <td style="text-align: right; padding: 6px 5px; border: 1px solid rgba(229, 231, 235, 0.3); font-weight: 600; font-size: 11px; background: transparent;">${t.fullName || '-'}</td>
            <td style="text-align: center; padding: 6px 5px; border: 1px solid rgba(229, 231, 235, 0.3); font-size: 11px; background: transparent;">${t.nationalId || '-'}</td>
            <td style="text-align: center; padding: 6px 5px; border: 1px solid rgba(229, 231, 235, 0.3); font-size: 11px; background: transparent;">${this.getAcademicYearDisplay(t.academicYear)}</td>
            <td style="text-align: center; padding: 6px 5px; border: 1px solid rgba(229, 231, 235, 0.3); font-size: 11px; background: transparent;"><span style="${genderStyle}">${t.gender?.title || '-'}</span></td>
            <td style="text-align: center; padding: 6px 5px; border: 1px solid rgba(229, 231, 235, 0.3); font-size: 11px; background: transparent;"><span style="${statusStyle}">${t.isActive ? 'نشط' : 'غير نشط'}</span></td>
          </tr>
        `;
      });

      allPagesHTML += `
        <div class="page-container">
          <!-- Watermark - Using pseudo-elements -->
          <div class="content">
            <div class="header">
              <h1>📋 قائمة المتدربين</h1>
              <p>${new Date().toLocaleDateString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
              <p style="font-size: 10px; opacity: 0.8;">صفحة ${pageIndex + 1} من ${pages.length}</p>
            </div>
            
            ${filterTexts.length > 0 && pageIndex === 0 ? `<div class="filters"><strong>🔍 الفلاتر:</strong> ${filterTexts.join(' | ')}</div>` : ''}
            
            ${
              pageIndex === 0
                ? `
            <div class="totals-grid">
              <div class="total-card total-all">
                <span class="total-icon">👥</span>
                <span class="total-value">${totalTrainees}</span>
                <span class="total-label">إجمالي</span>
              </div>
              <div class="total-card total-active">
                <span class="total-icon">✅</span>
                <span class="total-value">${totalActive}</span>
                <span class="total-label">نشطاء</span>
              </div>
              <div class="total-card total-inactive">
                <span class="total-icon">⛔</span>
                <span class="total-value">${totalInactive}</span>
                <span class="total-label">غير نشطاء</span>
              </div>
              <div class="total-card total-male">
                <span class="total-icon">👨</span>
                <span class="total-value">${totalMale}</span>
                <span class="total-label">ذكور</span>
              </div>
              <div class="total-card total-female">
                <span class="total-icon">👩</span>
                <span class="total-value">${totalFemale}</span>
                <span class="total-label">إناث</span>
              </div>
            </div>
            `
                : ''
            }
            
            <table>
              <thead>
                <tr>
                  <th style="width: 4%;">#</th>
                  <th style="width: 25%;">الاسم</th>
                  <th style="width: 18%;">رقم الهوية</th>
                  <th style="width: 16%;">السنة الدراسية</th>
                  <th style="width: 15%;">الجنس</th>
                  <th style="width: 22%;">الحالة</th>
                </tr>
              </thead>
              <tbody>
                ${tableRows}
              </tbody>
            </table>
            
            <div class="footer">
               الأكاديمية الأولمبية لعلوم الرياضة &copy; ${new Date().getFullYear()} - ${dataToPrint.length} متدرب
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

    // Get the logo as base64 for reliable printing
    const logoPath = 'assets/images/simpleLogoSvg.svg';

    printContainer.innerHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>قائمة المتدربين</title>
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
          
          /* ===== WATERMARK with actual logo image ===== */
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
          
          .watermark-wrapper img {
            width: 45%;
            height: 45%;
            object-fit: contain;
            opacity: 0.10;
            transform: rotate(-25deg);
            filter: grayscale(0%) sepia(20%) saturate(150%) hue-rotate(220deg);
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
          
          /* ===== CONTENT - Above watermark ===== */
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
            .watermark-wrapper img {
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
            grid-template-columns: repeat(5, 1fr);
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
          
          .total-card.total-active {
            background: rgba(209, 250, 229, 0.85);
            border-color: rgba(110, 231, 183, 0.5);
          }
          .total-card.total-active .total-value {
            color: #059669;
          }
          
          .total-card.total-inactive {
            background: rgba(254, 226, 226, 0.85);
            border-color: rgba(252, 165, 165, 0.5);
          }
          .total-card.total-inactive .total-value {
            color: #dc2626;
          }
          
          .total-card.total-male {
            background: rgba(219, 234, 254, 0.85);
            border-color: rgba(147, 197, 253, 0.5);
          }
          .total-card.total-male .total-value {
            color: #2563eb;
          }
          
          .total-card.total-female {
            background: rgba(254, 243, 199, 0.85);
            border-color: rgba(252, 211, 77, 0.5);
          }
          .total-card.total-female .total-value {
            color: #92400e;
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
            .watermark-wrapper img {
              width: 65% !important;
              height: 65% !important;
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
            .watermark-wrapper img {
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
        
        <!-- Watermark elements added after page content -->
        <script>
          // Add watermark to each page container
          document.querySelectorAll('.page-container').forEach(function(container) {
            // Create watermark wrapper
            var wrapper = document.createElement('div');
            wrapper.className = 'watermark-wrapper';
            
            // Create image element
            var img = document.createElement('img');
            img.src = '${logoPath}';
            img.alt = ' الأكاديمية الأولمبية لعلوم الرياضة';
            img.onerror = function() { this.style.display = 'none'; };
            
            // Create text element
            var text = document.createElement('div');
            text.className = 'watermark-text';
            text.textContent = ' الأكاديمية الأولمبية لعلوم الرياضة';
            
            wrapper.appendChild(img);
            wrapper.appendChild(text);
            
            // Insert watermark at the beginning of container
            container.insertBefore(wrapper, container.firstChild);
          });
        <\/script>
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
  // PRINT CARDS WITH PAGE SELECTION
  // ==========================================================================

  async printTraineeCards(): Promise<void> {
    const result = await this.showExportPageSelection(true);

    if (!result) {
      return; // User cancelled
    }

    this.isLoading = true;

    let dataToPrint: TraineeListItem[] = [];

    if (result.option === 'all') {
      // Get all pages
      dataToPrint = await this.fetchPagesForExport(0, this.getTotalPages() - 1);
    } else if (result.option === 'current') {
      // Use current page data
      dataToPrint = this.allTrainees;
    } else if (result.option === 'range') {
      // Get specific range
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
    const traineeImagePromises = dataToPrint.map((trainee) => {
      return new Promise<string>((resolve) => {
        const fid = trainee.imageUrl;
        if (fid && /^\d{15}(\d{3})?$/.test(fid)) {
          this.fileService.downloadFile(fid).subscribe({
            next: (blob) => {
              const blobUrl = URL.createObjectURL(blob);
              resolve(blobUrl);
            },
            error: () => {
              resolve('');
            },
          });
        } else if (fid) {
          resolve(fid);
        } else {
          resolve('');
        }
      });
    });

    const imageUrls = await Promise.all(traineeImagePromises);
    this.generateCardsPrintOptimized(dataToPrint, imageUrls);
    this.isLoading = false;
    this.notification.showSuccess(`تم فتح ${dataToPrint.length} بطاقة للطباعة`);
  }

/**
 * Generate optimized card printing view for trainees
 * SAME as details modal - generates barcode as data URL image
 */
private generateCardsPrintOptimized(
  trainees: TraineeListItem[],
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
  let cardsHtml = '';
  const logoPath = 'assets/images/simpleLogo.jpeg';

  trainees.forEach((trainee, index) => {
    const imageUrl = imageUrls[index] || '';
    const traineeName = trainee.fullName || '-';
    const nationalId = trainee.nationalId || '-';
    const genderDisplay = trainee.gender?.title || '-';
    const academicYearDisplay = this.getAcademicYearDisplay(
      trainee.academicYear,
    );
    const isActive = trainee.isActive;

    // ✅ Generate barcode image using the same method as details modal
    let barcodeImage = '';
    try {
      // Create temporary canvas
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = 200;
      tempCanvas.height = 40;
      
      // Use JsBarcode (same as details modal)
      JsBarcode(tempCanvas, nationalId || '000000', {
        format: 'CODE128',
        lineColor: '#000000',
        width: 1.5,
        height: 40,
        displayValue: true,
        fontSize: 10,
        font: 'monospace',
        textAlign: 'center',
        margin: 5
      });
      
      barcodeImage = tempCanvas.toDataURL('image/png');
    } catch (e) {
      console.error('Barcode generation error:', e);
      // Fallback: generate simple text barcode
      barcodeImage = '';
    }

    // ✅ Only show photo section if imageUrl exists and is not empty
    const hasImage = imageUrl && imageUrl.trim() !== '';
    const photoSection = hasImage
      ? `
    <div class="card-photo">
      <img src="${imageUrl}" alt="${traineeName}" onerror="this.style.display='none'">
    </div>
  `
      : '';

    // ✅ Use the barcode image directly (like details modal)
    const barcodeHtml = barcodeImage
      ? `<img src="${barcodeImage}" alt="Barcode" style="max-width:100%;height:auto;">`
      : `<span style="font-family:monospace;font-size:12px;color:#000;">${nationalId}</span>`;

    cardsHtml += `
        <div class="card-wrapper">
          <div class="card">
            <!-- Watermark (transparent background) -->
            <div class="card-watermark">
              <img src="${logoPath}" alt=" الأكاديمية الأولمبية لعلوم الرياضة">
            </div>
            <div class="card-watermark-text"> الأكاديمية الأولمبية لعلوم الرياضة</div>
            
            <!-- Card Content -->
            <div class="card-content">
              <!-- Logo at top - Colored and visible -->
              <div class="card-logo-section">
                <img src="${logoPath}" alt=" الأكاديمية الأولمبية لعلوم الرياضة" class="card-logo-image">
                <div class="card-logo-text">
                  <span class="academy-name"> الأكاديمية الأولمبية لعلوم الرياضة</span>
                  <span class="card-title">✦ بطاقة هوية متدرب ✦</span>
                </div>
              </div>
              
              <div class="card-body">
                ${photoSection}
                <div class="card-info">
                  <div class="card-name">${traineeName}</div>
                  <div class="card-id">رقم الهوية: ${nationalId}</div>
                  <div class="card-details">
                    <div class="detail-row">
                      <span class="detail-label">الجنس:</span>
                      <span class="detail-value">${genderDisplay}</span>
                    </div>
                    <div class="detail-row">
                      <span class="detail-label">السنة الدراسية:</span>
                      <span class="detail-value">${academicYearDisplay}</span>
                    </div>
                    <div class="detail-row">
                      <span class="detail-label">الحالة:</span>
                      <span class="detail-value status ${isActive ? 'active' : 'inactive'}">${isActive ? 'نشط' : 'غير نشط'}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="card-footer">
                <div class="card-barcode">
                  ${barcodeHtml}
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
              <div class="card-issue-date">تاريخ الإصدار: ${today}</div>
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
    <title>بطاقات المتدربين</title>
    <style>
      * { font-family: 'Cairo', 'Segoe UI', Tahoma, sans-serif; box-sizing: border-box; margin: 0; padding: 0; }
      .card-wrapper { display: inline-block; margin: 4px; }
      .card { width: 280px; background: white; border-radius: 12px; border: 1px solid #e2e8f0; padding: 12px 14px; position: relative; }
      .card-watermark { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(-25deg); opacity: 0.06; pointer-events: none; z-index: 0; }
      .card-watermark img { width: 100px; height: auto; }
      .card-watermark-text { position: absolute; top: 56%; left: 50%; transform: translate(-50%, -50%) rotate(-25deg); font-size: 20px; font-weight: 900; color: #667eea; opacity: 0.04; white-space: nowrap; z-index: 0; }
      .card-content { position: relative; z-index: 1; }
      .card-logo-section { display: flex; align-items: center; gap: 12px; padding: 8px 0; margin-bottom: 6px; border-bottom: 2px solid #667eea; }
      .card-logo-image { width: 48px; height: 48px; object-fit: contain; border-radius: 8px; flex-shrink: 0; background: white; padding: 2px; }
      .card-logo-text .academy-name { font-size: 13px; font-weight: 700; color: #667eea; }
      .card-logo-text .card-title { font-size: 9px; color: #64748b; }
      .card-body { display: flex; gap: 10px; margin-bottom: 8px; }
      .card-photo { flex-shrink: 0; }
      .card-photo img { width: 60px; height: 60px; border-radius: 50%; object-fit: cover; border: 2px solid #667eea; }
      .card-info { flex: 1; }
      .card-name { font-size: 13px; font-weight: 700; color: #1a1a2e; }
      .card-id { font-size: 8px; color: #64748b; }
      .card-details { font-size: 9px; }
      .detail-row { display: flex; justify-content: space-between; padding: 2px 0; border-bottom: 1px dashed #f1f5f9; }
      .detail-label { color: #64748b; }
      .detail-value { color: #1e293b; font-weight: 500; }
      .detail-value.status.active { color: #10b981; }
      .detail-value.status.inactive { color: #ef4444; }
      .card-footer { border-top: 2px solid #667eea; padding-top: 6px; margin-top: 4px; text-align: center; }
      .card-barcode img { max-width: 100%; height: 30px; }
      .card-barcode span { font-size: 12px; font-family: monospace; color: #000; }
      .card-signature { display: inline-block; width: 44%; text-align: center; }
      .signature-line { border-top: 1px solid #94a3b8; margin: 3px 0 2px; }
      .signature-label { font-size: 7px; color: #94a3b8; }
      .card-issue-date { text-align: center; font-size: 8px; color: #94a3b8; margin-top: 6px; padding-top: 4px; border-top: 1px dashed #e2e8f0; }
      .no-print { text-align: center; margin-top: 20px; width: 100%; }
      .no-print button { padding: 12px 30px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 16px; }
      @media print { .no-print { display: none; } .card { page-break-inside: avoid; } }
      /* ✅ Ensure barcode images print properly */
      @media print {
        .card-barcode img {
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
      }
    </style>
  </head>
  <body>
    ${cardsHtml}
    <div class="no-print">
      <button onclick="window.print();">🖨️ طباعة / حفظ كـ PDF</button>
    </div>
    <!-- ✅ No JavaScript needed - barcodes are pre-generated as images -->
  </body>
  </html>
`);
  printWindow.document.close();
}
}
