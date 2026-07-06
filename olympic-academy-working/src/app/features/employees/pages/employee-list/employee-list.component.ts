import {
  Component,
  OnInit,
  ViewChild,
  AfterViewInit,
  OnDestroy,
  ChangeDetectorRef,
  Inject,
} from '@angular/core';
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
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule, MatSort, Sort } from '@angular/material/sort';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import {
  MatDialog,
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';

import { EmployeeService } from '../../../../core/services/employee.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { ReportService } from '../../../../core/services/report.service';
import { FileService } from '../../../../core/services/file.service';
import {
  SearchableSelectComponent,
  SelectOption,
} from '../../../../shared/components/searchable-select/searchable-select.component';
import { EMPLOYEE_TYPES } from '../../../../core/models/employee.model';
import { EmployeeDetailsModalComponent } from '../employee-details/employee-details-modal.component';
import { EmployeeWizardModalComponent } from '../employee-form/employee-wizard-modal.component';
import { ErrorVTO } from '../../../../core/models/common.model';

// ============================================================================
// PAGE SELECTION DIALOG COMPONENT
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
        background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
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
        border-color: #f59e0b;
        background: #fffbeb !important;
        box-shadow: 0 4px 12px rgba(245, 158, 11, 0.15);
      }

      .option-btn.selected mat-icon {
        color: #f59e0b;
      }

      .option-btn:hover:not(.selected) {
        border-color: #cbd5e1;
        background: #f8fafc;
        transform: translateY(-1px);
      }

      .check-icon {
        margin-right: auto;
        color: #f59e0b;
        font-weight: 700;
        font-size: 18px;
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
          #f59e0b 0%,
          #d97706 100%
        ) !important;
        color: white !important;
        box-shadow: 0 4px 16px rgba(245, 158, 11, 0.3) !important;
      }

      .confirm-btn:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 8px 24px rgba(245, 158, 11, 0.4) !important;
      }

      .confirm-btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
        transform: none !important;
        box-shadow: none !important;
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
// MAIN EMPLOYEE LIST COMPONENT
// ============================================================================

interface EmployeeListItem {
  id: number;
  fullName: string;
  nationalId: string;
  employeeType?: { id: number; title: string };
  gender?: { id: number; title: string };
  hireDate?: string;
  departments?: { id: number; title: string }[];
  isActive: boolean;
  imageUrl?: string;
}

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
    MatDividerModule,
    SearchableSelectComponent,
  ],
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css'],
})
export class EmployeeListComponent implements OnInit, AfterViewInit, OnDestroy {
  Math = Math;

  displayedColumns: string[] = [
    'index',
    'image',
    'fullName',
    'nationalId',
    'employeeType',
    'gender',
    'hireDate',
    'departments',
    'status',
    'actions',
  ];
  dataSource = new MatTableDataSource<EmployeeListItem>([]);
  allEmployees: EmployeeListItem[] = [];
  imageUrls: Map<number, string> = new Map();
  isLoading = false;

  // ========== PAGINATION ==========
  totalItems: number = 0;
  pageSize: number = 25;
  pageSizeOptions: number[] = [5, 10, 25, 50, 100];
  currentPage: number = 0;

  // ========== SORTING ==========
  sortBy: string = 'HIRE_DATE';
  sortDir: string = 'DESC';

  // Filters
  searchText = '';
  employeeTypeFilter: string | null = null;
  statusFilter: boolean | null = null;
  hireDateFrom: any = null;
  hireDateTo: any = null;

  // Options for searchable selects
  employeeTypeOptions: SelectOption[] = [];
  statusOptions: SelectOption[] = [];

  @ViewChild(MatSort) sort!: MatSort;

  get trainerCount(): number {
    return this.allEmployees.filter((e) => e.employeeType?.id === 1).length;
  }

  get managerCount(): number {
    return this.allEmployees.filter((e) => e.employeeType?.id === 2).length;
  }

  get activeCount(): number {
    return this.allEmployees.filter((e) => e.isActive === true).length;
  }

  get totalDepartments(): number {
    const depts = new Set();
    this.allEmployees.forEach((e) => {
      e.departments?.forEach((d) => depts.add(d.id));
    });
    return depts.size;
  }

  constructor(
    private employeeService: EmployeeService,
    private notification: NotificationService,
    private reportService: ReportService,
    private router: Router,
    private dialog: MatDialog,
    private fileService: FileService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.loadSelectOptions();
    this.loadEmployees();
  }

  ngAfterViewInit(): void {
    // Sort is handled programmatically
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
    this.employeeTypeOptions = [
      { value: null, label: 'الكل' },
      { value: 'TRAINER', label: 'مدرب' },
      { value: 'MANAGER', label: 'مدير' },
    ];

    this.statusOptions = [
      { value: null, label: 'الكل' },
      { value: true, label: 'نشط' },
      { value: false, label: 'غير نشط' },
    ];
  }

  private formatDateForBackend(date: any): string | null {
    if (!date) return null;

    if (typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return date;
    }

    try {
      const d = new Date(date);
      if (isNaN(d.getTime())) return null;

      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');

      return `${year}-${month}-${day}`;
    } catch (error) {
      return null;
    }
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
      this.loadEmployees();
    }
  }

  goToPreviousPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.loadEmployees();
    }
  }

  goToNextPage(): void {
    this.currentPage++;
    console.log('➡️ Going to next page:', this.currentPage);
    this.loadEmployees();
  }

  goToLastPage(): void {
    const totalPages = this.getTotalPages();
    if (this.currentPage !== totalPages - 1 && totalPages > 0) {
      this.currentPage = totalPages - 1;
      this.loadEmployees();
    }
  }

  onPageSizeChange(): void {
    this.currentPage = 0;
    console.log('📏 Page size changed to:', this.pageSize);
    this.loadEmployees();
  }

  // ==========================================================================
  // LOAD EMPLOYEES
  // ==========================================================================

  loadEmployees(): void {
    console.log('🔄 loadEmployees() called');
    console.log(`  Current Page: ${this.currentPage}`);
    console.log(`  Page Size: ${this.pageSize}`);

    this.isLoading = true;

    const params: any = {};

    // ===== FILTERS =====
    if (this.searchText) params.quickSearch = this.searchText;
    if (this.employeeTypeFilter) params.employeeType = this.employeeTypeFilter;
    if (this.statusFilter !== null) params.isActive = this.statusFilter;

    if (this.hireDateFrom) {
      const formattedDate = this.formatDateForBackend(this.hireDateFrom);
      if (formattedDate) params.hireDateFrom = formattedDate;
    }
    if (this.hireDateTo) {
      const formattedDate = this.formatDateForBackend(this.hireDateTo);
      if (formattedDate) params.hireDateTo = formattedDate;
    }

    // ===== PAGINATION =====
    params.pageNum = this.currentPage;
    params.pageSize = this.pageSize;

    // ===== SORTING =====
    if (this.sortBy) params.orderBy = this.sortBy;
    if (this.sortDir) params.orderDir = this.sortDir;

    console.log('📤 Sending request with params:', params);

    this.employeeService.getAllEmployees(params).subscribe({
      next: (res: any) => {
        console.log('✅ Response received:', res);
        console.log(`  Items: ${res.items?.length || 0}`);
        console.log(`  Total: ${res.total || 0}`);

        this.allEmployees = res.items || [];
        this.totalItems = res.total || 0;
        this.loadAllImages();
        this.dataSource.data = this.allEmployees;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err: ErrorVTO) => {
        console.error('❌ Error loading employees:', err);
        this.notification.showError(err);
        this.isLoading = false;
        this.cdr.detectChanges();
      },
    });
  }

  // ==========================================================================
  // IMAGE HANDLING
  // ==========================================================================

  loadAllImages(): void {
    this.imageUrls.forEach((url) => {
      if (url && url.startsWith('blob:')) {
        URL.revokeObjectURL(url);
      }
    });
    this.imageUrls.clear();

    this.allEmployees.forEach((employee) => {
      this.loadImage(employee);
    });
  }

  loadImage(employee: EmployeeListItem): void {
    const fid = employee.imageUrl;
    if (fid && /^\d{15}(\d{3})?$/.test(fid)) {
      this.fileService.downloadFile(fid).subscribe({
        next: (blob) => {
          const existingUrl = this.imageUrls.get(employee.id);
          if (existingUrl && existingUrl.startsWith('blob:')) {
            URL.revokeObjectURL(existingUrl);
          }
          const blobUrl = URL.createObjectURL(blob);
          this.imageUrls.set(employee.id, blobUrl);
          this.dataSource.data = [...this.dataSource.data];
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error(
            `Failed to load image for employee ${employee.id}:`,
            error,
          );
          this.imageUrls.set(employee.id, '');
          this.dataSource.data = [...this.dataSource.data];
          this.cdr.detectChanges();
        },
      });
    } else {
      this.imageUrls.set(employee.id, '');
    }
  }

  getImageUrl(employeeId: number): string | null {
    const url = this.imageUrls.get(employeeId);
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
      this.sortBy = 'HIRE_DATE';
      this.sortDir = 'DESC';
    }
    this.currentPage = 0;
    this.loadEmployees();
  }

  // ==========================================================================
  // FILTER METHODS
  // ==========================================================================

  onSearchChange(): void {
    this.currentPage = 0;
    this.loadEmployees();
  }

  onEmployeeTypeChange(value: string | null): void {
    this.employeeTypeFilter = value;
    this.currentPage = 0;
    this.loadEmployees();
  }

  onStatusChange(value: boolean | null): void {
    this.statusFilter = value;
    this.currentPage = 0;
    this.loadEmployees();
  }

  onDateFromChange(): void {
    this.currentPage = 0;
    this.loadEmployees();
  }

  onDateToChange(): void {
    this.currentPage = 0;
    this.loadEmployees();
  }

  resetFilters(): void {
    this.searchText = '';
    this.employeeTypeFilter = null;
    this.statusFilter = null;
    this.hireDateFrom = null;
    this.hireDateTo = null;
    this.currentPage = 0;
    this.loadEmployees();
    this.notification.showSuccess('تم مسح جميع الفلاتر');
  }

  // ==========================================================================
  // EMPLOYEE OPERATIONS
  // ==========================================================================

  viewEmployee(id: number): void {
    this.employeeService.getEmployeeById(id).subscribe({
      next: (employee) => {
        this.dialog.open(EmployeeDetailsModalComponent, {
          data: employee,
          width: '850px',
          maxWidth: '90vw',
        });
      },
      error: (err: ErrorVTO) => {
        this.notification.showError(err);
      },
    });
  }

  editEmployee(id: number): void {
    const dialogRef = this.dialog.open(EmployeeWizardModalComponent, {
      data: { employeeId: id },
      width: '900px',
      maxWidth: '90vw',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadEmployees();
      }
    });
  }

  openNewEmployeeModal(): void {
    const dialogRef = this.dialog.open(EmployeeWizardModalComponent, {
      data: {},
      width: '900px',
      maxWidth: '90vw',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadEmployees();
      }
    });
  }

  deleteEmployee(employee: EmployeeListItem): void {
    if (confirm(`هل أنت متأكد من حذف الموظف "${employee.fullName}"؟`)) {
      this.employeeService.deleteEmployee(employee.id).subscribe({
        next: () => {
          this.notification.showSuccess('تم حذف الموظف بنجاح');
          this.loadEmployees();
        },
        error: (err: ErrorVTO) => {
          this.notification.showError(err);
        },
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
  ): Promise<EmployeeListItem[]> {
    const allData: EmployeeListItem[] = [];
    const totalPages = this.getTotalPages();

    for (
      let page = startPage;
      page <= Math.min(endPage, totalPages - 1);
      page++
    ) {
      const params: any = {};

      if (this.searchText) params.quickSearch = this.searchText;
      if (this.employeeTypeFilter)
        params.employeeType = this.employeeTypeFilter;
      if (this.statusFilter !== null) params.isActive = this.statusFilter;

      if (this.hireDateFrom) {
        const formattedDate = this.formatDateForBackend(this.hireDateFrom);
        if (formattedDate) params.hireDateFrom = formattedDate;
      }
      if (this.hireDateTo) {
        const formattedDate = this.formatDateForBackend(this.hireDateTo);
        if (formattedDate) params.hireDateTo = formattedDate;
      }

      params.pageNum = page;
      params.pageSize = this.pageSize;

      if (this.sortBy) params.orderBy = this.sortBy;
      if (this.sortDir) params.orderDir = this.sortDir;

      try {
        const res = await this.employeeService
          .getAllEmployees(params)
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

    let dataToExport: EmployeeListItem[] = [];

    if (result.option === 'all') {
      dataToExport = await this.fetchPagesForExport(
        0,
        this.getTotalPages() - 1,
      );
    } else if (result.option === 'current') {
      dataToExport = this.allEmployees;
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

    const exportData = dataToExport.map(
      (employee: EmployeeListItem, index: number) => ({
        '#': index + 1,
        الاسم: employee.fullName,
        'رقم الهوية': employee.nationalId,
        النوع: employee.employeeType?.title || '-',
        الجنس: employee.gender?.title || '-',
        'تاريخ التوظيف': employee.hireDate || '-',
        الأقسام:
          employee.departments?.map((d: any) => d.title).join(', ') || '-',
        الحالة: employee.isActive ? 'نشط' : 'غير نشط',
      }),
    );

    this.reportService.exportToExcel(exportData, 'employees-list', 'الموظفين');
    this.notification.showSuccess(`تم تصدير ${exportData.length} سجل بنجاح`);
  }

  async exportToPDF(): Promise<void> {
    const result = await this.showExportPageSelection(false);

    if (!result) {
      return;
    }

    this.isLoading = true;

    let dataToPrint: EmployeeListItem[] = [];

    if (result.option === 'all') {
      dataToPrint = await this.fetchPagesForExport(0, this.getTotalPages() - 1);
    } else if (result.option === 'current') {
      dataToPrint = this.allEmployees;
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
    if (this.employeeTypeFilter) {
      const type = this.employeeTypeFilter === 'TRAINER' ? 'مدرب' : 'مدير';
      filterTexts.push(`نوع الموظف: ${type}`);
    }
    if (this.statusFilter !== null) {
      filterTexts.push(`الحالة: ${this.statusFilter ? 'نشط' : 'غير نشط'}`);
    }
    if (this.hireDateFrom) {
      const formattedDate = this.formatDateForBackend(this.hireDateFrom);
      if (formattedDate) filterTexts.push(`من تاريخ التوظيف: ${formattedDate}`);
    }
    if (this.hireDateTo) {
      const formattedDate = this.formatDateForBackend(this.hireDateTo);
      if (formattedDate)
        filterTexts.push(`إلى تاريخ التوظيف: ${formattedDate}`);
    }
    if (this.searchText) filterTexts.push(`بحث: ${this.searchText}`);

    // Calculate totals
    const totalEmployees = dataToPrint.length;
    const totalTrainers = dataToPrint.filter(
      (e) => e.employeeType?.id === 1,
    ).length;
    const totalManagers = dataToPrint.filter(
      (e) => e.employeeType?.id === 2,
    ).length;
    const totalActive = dataToPrint.filter((e) => e.isActive).length;

    // Split data into pages
    const rowsPerPage = 20;
    const pages: EmployeeListItem[][] = [];
    for (let i = 0; i < dataToPrint.length; i += rowsPerPage) {
      pages.push(dataToPrint.slice(i, i + rowsPerPage));
    }

    let allPagesHTML = '';

    pages.forEach((pageData: EmployeeListItem[], pageIndex: number) => {
      let tableRows = '';
      pageData.forEach((employee: EmployeeListItem, index: number) => {
        const globalIndex = pageIndex * rowsPerPage + index + 1;
        const statusStyle = employee.isActive
          ? 'background: #d1fae5; color: #065f46; border-radius: 16px; padding: 3px 12px; display: inline-block; font-weight: 600; font-size: 11px;'
          : 'background: #fee2e2; color: #991b1b; border-radius: 16px; padding: 3px 12px; display: inline-block; font-weight: 600; font-size: 11px;';

        const typeStyle =
          employee.employeeType?.id === 1
            ? 'background: #dbeafe; color: #1e40af; border-radius: 16px; padding: 3px 12px; display: inline-block; font-weight: 600; font-size: 11px;'
            : 'background: #fef3c7; color: #92400e; border-radius: 16px; padding: 3px 12px; display: inline-block; font-weight: 600; font-size: 11px;';

        const departmentsText =
          employee.departments?.map((d: any) => d.title).join(', ') || '-';

        tableRows += `
        <tr>
          <td style="text-align: center; padding: 6px 5px; border: 1px solid rgba(229, 231, 235, 0.3); font-size: 11px; background: transparent;">${globalIndex}</td>
          <td style="text-align: right; padding: 6px 5px; border: 1px solid rgba(229, 231, 235, 0.3); font-weight: 600; font-size: 11px; background: transparent;">${this.escapeHtml(employee.fullName) || '-'}</td>
          <td style="text-align: center; padding: 6px 5px; border: 1px solid rgba(229, 231, 235, 0.3); font-size: 11px; background: transparent;">${employee.nationalId || '-'}</td>
          <td style="text-align: center; padding: 6px 5px; border: 1px solid rgba(229, 231, 235, 0.3); font-size: 11px; background: transparent;"><span style="${typeStyle}">${employee.employeeType?.title || '-'}</span></td>
          <td style="text-align: center; padding: 6px 5px; border: 1px solid rgba(229, 231, 235, 0.3); font-size: 11px; background: transparent;">${employee.gender?.title || '-'}</td>
          <td style="text-align: center; padding: 6px 5px; border: 1px solid rgba(229, 231, 235, 0.3); font-size: 11px; background: transparent;">${employee.hireDate || '-'}</td>
          <td style="text-align: right; padding: 6px 5px; border: 1px solid rgba(229, 231, 235, 0.3); font-size: 11px; background: transparent;">${this.escapeHtml(departmentsText)}</td>
          <td style="text-align: center; padding: 6px 5px; border: 1px solid rgba(229, 231, 235, 0.3); font-size: 11px; background: transparent;"><span style="${statusStyle}">${employee.isActive ? 'نشط' : 'غير نشط'}</span></td>
        </tr>
      `;
      });

      allPagesHTML += `
      <div class="page-container">
        <!-- Watermark - Behind content -->
        <div class="watermark-wrapper">
          <div class="watermark-container">
            <img src="assets/images/simpleLogoSvg.svg" alt="الأكاديمية الأولمبية">
          </div>
          <div class="watermark-text">الأكاديمية الأولمبية</div>
        </div>
        
        <!-- Content - Above watermark -->
        <div class="content">
          <div class="header">
            <h1>📋 قائمة الموظفين</h1>
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
              <span class="total-value">${totalEmployees}</span>
              <span class="total-label">إجمالي</span>
            </div>
            <div class="total-card total-trainers">
              <span class="total-icon">🏊</span>
              <span class="total-value">${totalTrainers}</span>
              <span class="total-label">مدربين</span>
            </div>
            <div class="total-card total-managers">
              <span class="total-icon">👔</span>
              <span class="total-value">${totalManagers}</span>
              <span class="total-label">مديرين</span>
            </div>
            <div class="total-card total-active">
              <span class="total-icon">✅</span>
              <span class="total-value">${totalActive}</span>
              <span class="total-label">نشطاء</span>
            </div>
            <div class="total-card total-inactive">
              <span class="total-icon">⛔</span>
              <span class="total-value">${totalEmployees - totalActive}</span>
              <span class="total-label">غير نشطاء</span>
            </div>
          </div>
          `
              : ''
          }
          
          <table>
            <thead>
              <tr>
                <th style="width: 4%;">#</th>
                <th style="width: 18%;">الاسم</th>
                <th style="width: 14%;">رقم الهوية</th>
                <th style="width: 12%;">النوع</th>
                <th style="width: 10%;">الجنس</th>
                <th style="width: 12%;">تاريخ التوظيف</th>
                <th style="width: 18%;">الأقسام</th>
                <th style="width: 12%;">الحالة</th>
              </tr>
            </thead>
            <tbody>
              ${tableRows}
            </tbody>
          </table>
          
          <div class="footer">
            الأكاديمية الأولمبية &copy; ${new Date().getFullYear()} - ${dataToPrint.length} موظف
          </div>
        </div>
      </div>
    `;
    });

    // Build the complete HTML with watermark behind content
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
      <title>قائمة الموظفين</title>
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
        
        /* ===== PAGE CONTAINER ===== */
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
        
        /* ===== WATERMARK - Properly sized in center ===== */
        .watermark-wrapper {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 0;
          overflow: hidden;
        }
        
        .watermark-container {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(-25deg);
          width: 60%;
          height: 60%;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0.10;
        }
        
        .watermark-container img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          filter: grayscale(0%) sepia(20%) saturate(150%) hue-rotate(220deg);
        }
        
        .watermark-text {
          position: absolute;
          top: 56%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(-25deg);
          font-size: 50px;
          font-weight: 900;
          color: #f59e0b;
          letter-spacing: 6px;
          text-transform: uppercase;
          white-space: nowrap;
          opacity: 0.05;
          text-shadow: 0 4px 20px rgba(245, 158, 11, 0.15);
        }
        
        /* ===== CONTENT - ABOVE WATERMARK ===== */
        .content {
          position: relative;
          z-index: 1;
          padding: 12px;
          background: transparent;
          min-height: 100vh;
        }
        
        /* ===== PRINT STYLES ===== */
        @media print {
          html, body {
            width: 100%;
            height: 100%;
            margin: 0;
            padding: 0;
          }
          .no-print { 
            display: none !important; 
          }
          .page-container {
            min-height: 100vh !important;
            page-break-after: always !important;
          }
          .page-container:last-child {
            page-break-after: auto !important;
          }
          .watermark-container {
            opacity: 0.12 !important;
            width: 65% !important;
            height: 65% !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .watermark-container img {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .watermark-text {
            opacity: 0.06 !important;
            font-size: 55px !important;
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
          /* Make table rows transparent to show watermark */
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
        }
        
        /* ===== HEADER ===== */
        .header {
          text-align: center;
          margin-bottom: 10px;
          padding: 10px 16px;
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
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
        
        /* ===== FILTERS ===== */
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
        
        /* ===== TOTALS ===== */
        .totals-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 5px;
          margin-bottom: 8px;
        }
        
        .total-card {
          background: rgba(255, 255, 255, 0.9);
          border-radius: 6px;
          padding: 5px 8px;
          text-align: center;
          border: 1px solid rgba(229, 231, 235, 0.5);
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
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
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
          color: white;
          border-color: #f59e0b;
        }
        .total-card.total-all .total-value {
          color: white;
        }
        .total-card.total-all .total-label {
          color: rgba(255, 255, 255, 0.85);
        }
        
        .total-card.total-trainers {
          background: rgba(219, 234, 254, 0.9);
          border-color: rgba(147, 197, 253, 0.5);
        }
        .total-card.total-trainers .total-value {
          color: #2563eb;
        }
        
        .total-card.total-managers {
          background: rgba(254, 243, 199, 0.9);
          border-color: rgba(252, 211, 77, 0.5);
        }
        .total-card.total-managers .total-value {
          color: #92400e;
        }
        
        .total-card.total-active {
          background: rgba(209, 250, 229, 0.9);
          border-color: rgba(110, 231, 183, 0.5);
        }
        .total-card.total-active .total-value {
          color: #059669;
        }
        
        .total-card.total-inactive {
          background: rgba(254, 226, 226, 0.9);
          border-color: rgba(252, 165, 165, 0.5);
        }
        .total-card.total-inactive .total-value {
          color: #dc2626;
        }
        
        /* ===== TABLE - Transparent background ===== */
        table {
          width: 100%;
          border-collapse: collapse;
          direction: rtl;
          margin-top: 4px;
          font-size: 10px;
          background: transparent;
        }
        th {
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
          color: white;
          padding: 5px 4px;
          border: 1px solid #d97706;
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
        
        /* Only apply alternating row colors for readability, but with transparency */
        tr:nth-child(even) td {
          background: rgba(250, 251, 252, 0.5) !important;
        }
        
        /* ===== FOOTER ===== */
        .footer {
          text-align: center;
          margin-top: 8px;
          padding: 5px;
          font-size: 8px;
          color: rgba(148, 163, 184, 0.8);
          border-top: 1px solid rgba(229, 231, 235, 0.3);
        }
        
        /* ===== RESPONSIVE ===== */
        @media (max-width: 768px) {
          .watermark-container {
            width: 80% !important;
            height: 80% !important;
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
          .watermark-container {
            width: 90% !important;
            height: 90% !important;
          }
          .watermark-text {
            font-size: 20px !important;
          }
        }
      </style>
    </head>
    <body>
      <!-- All Pages with Watermarks Behind Content -->
      ${allPagesHTML}
      
      <!-- Print Controls -->
      <div class="no-print" style="text-align: center; margin-top: 10px; padding: 10px; position: fixed; bottom: 0; left: 0; right: 0; background: white; box-shadow: 0 -2px 10px rgba(0,0,0,0.1); z-index: 9999;">
        <button onclick="window.print();" style="padding: 8px 24px; background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 14px; font-weight: 600; box-shadow: 0 2px 10px rgba(245, 158, 11, 0.3);">
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
  // PRINT EMPLOYEE CARDS WITH PAGE SELECTION
  // ==========================================================================

  async printEmployeeCards(): Promise<void> {
    const result = await this.showExportPageSelection(true);

    if (!result) {
      return;
    }

    this.isLoading = true;

    let dataToPrint: EmployeeListItem[] = [];

    if (result.option === 'all') {
      dataToPrint = await this.fetchPagesForExport(0, this.getTotalPages() - 1);
    } else if (result.option === 'current') {
      dataToPrint = this.allEmployees;
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

    // Collect all image URLs for the employees
    const employeeImagePromises = dataToPrint.map((employee) => {
      return new Promise<string>((resolve) => {
        const fid = employee.imageUrl;
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

    const imageUrls = await Promise.all(employeeImagePromises);
    this.generateCardsPrint(dataToPrint, imageUrls);
    this.isLoading = false;
    this.notification.showSuccess(`تم فتح ${dataToPrint.length} بطاقة للطباعة`);
  }

  private generateCardsPrint(
    employees: EmployeeListItem[],
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

    employees.forEach((employee, index) => {
      const imageUrl = imageUrls[index] || '';
      const genderDisplay = employee.gender?.title || '-';
      const employeeTypeDisplay = employee.employeeType?.title || '-';
      const isActive = employee.isActive;
      const hireDate = employee.hireDate || '-';

      // Conditional photo section - only show if image exists
      const photoSection = imageUrl
        ? `
      <div class="thermal-photo">
        <img src="${imageUrl}" alt="${this.escapeHtml(employee.fullName)}">
      </div>
    `
        : '';

      cardsHtml += `
      <div class="card-wrapper">
        <div class="thermal-card">
          <!-- Watermark on Card -->
          <div class="card-watermark">
            <img src="${logoPath}" alt="الأكاديمية الأولمبية">
          </div>
          <div class="card-watermark-text">الأكاديمية الأولمبية</div>
          
          <div class="card-content">
            <!-- Logo Section at Top -->
            <div class="card-logo-section">
              <img src="${logoPath}" alt="الأكاديمية الأولمبية" class="card-logo-image">
              <div class="card-logo-text">
                <span class="academy-name">🏛️ الأكاديمية الأولمبية</span>
                <span class="card-type">✦ بطاقة هوية موظف ✦</span>
              </div>
            </div>
            
            <!-- Photo - Only shown if image exists -->
            ${photoSection}
            
            <!-- Name & ID -->
            <div class="thermal-name">${this.escapeHtml(employee.fullName) || ''}</div>
            <div class="thermal-id">🆔 ${employee.nationalId || ''}</div>
            
            <div class="thermal-divider"></div>
            
            <!-- Info Table -->
            <table class="thermal-table">
              <tr>
                <td class="thermal-label">🧑 النوع</td>
                <td class="thermal-value">${employeeTypeDisplay}</td>
              </tr>
              <tr>
                <td class="thermal-label">👤 الجنس</td>
                <td class="thermal-value">${genderDisplay}</td>
              </tr>
              <tr>
                <td class="thermal-label">📅 التوظيف</td>
                <td class="thermal-value">${hireDate}</td>
              </tr>
              <tr>
                <td class="thermal-label">✓ الحالة</td>
                <td class="thermal-value ${isActive ? 'status-active' : 'status-inactive'}">${isActive ? '✅ نشط' : '⛔ غير نشط'}</td>
              </tr>
            </table>
            
            <div class="thermal-divider"></div>
            
            <!-- Barcode -->
            <div class="thermal-barcode">
              <svg id="barcode-${index}" class="barcode-svg"></svg>
              <div class="thermal-barcode-number">${employee.nationalId || ''}</div>
            </div>
            
            <!-- Footer with Signatures -->
            <div class="thermal-footer">
              <div class="thermal-signature">
                <div class="thermal-line"></div>
                <div>توقيع الموظف</div>
              </div>
              <div class="thermal-signature">
                <div class="thermal-line"></div>
                <div>ختم الأكاديمية</div>
              </div>
            </div>
            
            <!-- Issue Date -->
            <div class="thermal-issue-date">📅 تاريخ الإصدار: ${today}</div>
            
            <!-- ===== COPYRIGHT CREDIT - INSIDE EACH CARD at the bottom ===== -->
            <div class="card-credit">powered by CoreStack Solutions | 01069911181</div>
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
      <title>بطاقات الموظفين</title>
      <script src="https://cdn.jsdelivr.net/npm/jsbarcode@3.11.6/dist/JsBarcode.all.min.js"><\/script>
      <style>
        @page { 
          size: 58mm auto; 
          margin: 0mm; 
        }
        
        * { 
          font-family: 'Cairo', 'Segoe UI', Tahoma, sans-serif; 
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }
        
        body { 
          width: 58mm; 
          margin: 0; 
          padding: 0; 
          background: white;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          align-items: center;
          min-height: 100vh;
          padding-bottom: 2mm;
        }
        
        .card-wrapper {
          width: 100%;
          max-width: 58mm;
          margin: 0;
          flex-shrink: 0;
        }
        
        .thermal-card {
          width: 100%;
          max-width: 58mm;
          margin: 0;
          padding: 2.5mm 3mm 3.5mm 3mm;
          background: white;
          position: relative;
          overflow: hidden;
          direction: rtl;
        }
        
        /* ===== WATERMARK - Behind content with logo ===== */
        .card-watermark {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(-25deg) scale(1.8);
          opacity: 0.07;
          pointer-events: none;
          z-index: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 100%;
        }
        
        .card-watermark img {
          width: 90px;
          height: auto;
          object-fit: contain;
          opacity: 0.9;
        }
        
        .card-watermark-text {
          position: absolute;
          top: 57%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(-25deg) scale(0.9);
          font-size: 18px;
          font-weight: 900;
          color: #f59e0b;
          letter-spacing: 4px;
          text-transform: uppercase;
          white-space: nowrap;
          opacity: 0.04;
          pointer-events: none;
          z-index: 0;
          text-shadow: 0 2px 8px rgba(245, 158, 11, 0.1);
        }
        
        /* ===== CONTENT - Above watermark ===== */
        .card-content {
          position: relative;
          z-index: 1;
          width: 100%;
        }
        
        /* ===== LOGO SECTION AT TOP ===== */
        .card-logo-section {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 2.5mm 0 2mm 0;
          margin-bottom: 2mm;
          border-bottom: 2.5px solid #f59e0b;
          justify-content: center;
          background: linear-gradient(to right, transparent, rgba(245, 158, 11, 0.05), transparent);
          border-radius: 2px;
        }
        
        .card-logo-image {
          width: 34px;
          height: 34px;
          object-fit: contain;
          border-radius: 50%;
          background: white;
          padding: 2px;
          border: 2px solid #f59e0b;
          flex-shrink: 0;
          box-shadow: 0 2px 8px rgba(245, 158, 11, 0.2);
        }
        
        .card-logo-text {
          display: flex;
          flex-direction: column;
          line-height: 1.2;
        }
        
        .card-logo-text .academy-name {
          font-size: 11px;
          font-weight: 700;
          color: #1a1a2e;
          letter-spacing: 0.5px;
        }
        
        .card-logo-text .card-type {
          font-size: 7px;
          color: #f59e0b;
          font-weight: 600;
          letter-spacing: 0.5px;
        }
        
        /* Compact Photo */
        .thermal-photo { 
          text-align: center; 
          margin-bottom: 1mm; 
        }
        .thermal-photo img { 
          width: 36px; 
          height: 36px; 
          border-radius: 50%; 
          object-fit: cover;
          border: 2px solid #f59e0b;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        }
        
        /* Compact Name & ID */
        .thermal-name { 
          font-size: 11px; 
          font-weight: 700; 
          text-align: center; 
          margin-bottom: 0.5mm; 
          color: #1a1a2e;
          line-height: 1.2;
        }
        .thermal-id { 
          font-size: 8px; 
          color: #64748b; 
          text-align: center; 
          margin-bottom: 0.8mm; 
          font-weight: 500;
          letter-spacing: 0.5px;
        }
        
        /* Divider */
        .thermal-divider { 
          border-top: 1px dashed #e5e7eb; 
          margin: 0.8mm 0; 
          opacity: 0.6;
        }
        
        /* Info Table */
        .thermal-table { 
          width: 100%; 
          font-size: 7px; 
          margin-bottom: 0.8mm; 
          border-collapse: collapse; 
        }
        .thermal-table tr { 
          line-height: 1.3; 
        }
        .thermal-label { 
          text-align: right; 
          padding: 0.3mm 0.5mm; 
          color: #64748b; 
          width: 38%;
          font-weight: 500;
          font-size: 6.5px;
        }
        .thermal-value { 
          text-align: left; 
          padding: 0.3mm 0.5mm; 
          font-weight: 600; 
          width: 62%;
          color: #1e293b;
          font-size: 6.5px;
        }
        .thermal-value.status-active { 
          color: #10b981; 
        }
        .thermal-value.status-inactive { 
          color: #ef4444; 
        }
        
        /* Barcode */
        .thermal-barcode { 
          text-align: center; 
          margin: 0.8mm 0; 
        }
        .thermal-barcode .barcode-svg { 
          width: 100%; 
          max-width: 150px; 
          height: 30px;
        }
        .thermal-barcode-number { 
          font-size: 8px; 
          font-family: monospace; 
          text-align: center; 
          margin-top: 0.5mm; 
          color: #f59e0b;
          font-weight: 600;
          letter-spacing: 1.5px;
        }
        
        /* Footer */
        .thermal-footer { 
          display: flex; 
          justify-content: space-between; 
          align-items: flex-start;
          gap: 2mm; 
          margin-top: 1.5mm; 
          padding-top: 1.5mm;
          border-top: 2px solid #f59e0b;
        }
        .thermal-signature { 
          flex: 1; 
          text-align: center; 
          font-size: 5.5px; 
          color: #94a3b8;
        }
        .thermal-line { 
          border-top: 0.5px solid #94a3b8; 
          margin-bottom: 0.3mm; 
          padding-top: 3mm; 
        }
        
        .thermal-issue-date {
          text-align: center;
          font-size: 6px;
          color: #94a3b8;
          margin-top: 0.8mm;
          padding-top: 0.5mm;
          border-top: 1px dashed #e5e7eb;
        }
        
        /* ===== COPYRIGHT CREDIT - INSIDE EACH CARD at the bottom ===== */
        .card-credit {
          text-align: center;
          font-size: 4px;
          color: #1a1a2e;
          font-weight: 500;
          opacity: 0.6;
          letter-spacing: 0.3px;
          direction: ltr;
          margin-top: 0.5mm;
          padding-top: 0.5mm;
          border-top: 0.5px dashed rgba(26, 26, 46, 0.15);
        }
        
        @media print {
          body { 
            margin: 0; 
            padding: 0; 
            background: white; 
            padding-bottom: 1.5mm;
          }
          .thermal-card {
            padding: 2mm 2.5mm 2.5mm 2.5mm;
            border: none !important;
            box-shadow: none !important;
          }
          .card-watermark {
            opacity: 0.08 !important;
          }
          .card-watermark img {
            width: 80px !important;
          }
          .card-watermark-text {
            font-size: 16px !important;
            opacity: 0.05 !important;
          }
          .card-logo-image {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .card-credit {
            opacity: 0.5 !important;
            color: #000000 !important;
          }
          .no-print { 
            display: none !important; 
          }
        }
        
        @media screen {
          .thermal-card {
            box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
            border: 1px solid #e5e7eb;
            border-radius: 6px;
            margin-bottom: 2px;
          }
        }
      </style>
    </head>
    <body>
      ${cardsHtml}
      
      <div class="no-print" style="text-align: center; margin-top: 10px; padding: 10px; width: 100%; position: fixed; bottom: 0; left: 0; right: 0; background: white; box-shadow: 0 -2px 10px rgba(0,0,0,0.1); z-index: 9999;">
        <button onclick="window.print();" style="padding: 8px 24px; background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 14px; font-weight: 600; box-shadow: 0 2px 10px rgba(245, 158, 11, 0.3);">
          🖨️ طباعة / PDF
        </button>
        <button onclick="window.close();" style="padding: 8px 24px; background: #f1f5f9; color: #475569; border: none; border-radius: 6px; cursor: pointer; font-size: 14px; font-weight: 600; margin-right: 10px;">
          ✖ إغلاق
        </button>
      </div>
      
      <script>
        window.onload = function() {
          setTimeout(function() {
            const employees = ${JSON.stringify(employees.map((e) => e.nationalId))};
            employees.forEach(function(nationalId, index) {
              try {
                JsBarcode('#barcode-' + index, nationalId || '000000', {
                  format: 'CODE128',
                  lineColor: '#000000',
                  width: 1.2,
                  height: 25,
                  displayValue: true,
                  fontSize: 8,
                  font: 'monospace',
                  textAlign: 'center',
                  margin: 2
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
  private escapeHtml(str: string | null | undefined): string {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }
}
