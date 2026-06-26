import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy, ChangeDetectorRef, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatSortModule, MatSort, Sort } from '@angular/material/sort';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog, MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatPaginatorModule } from '@angular/material/paginator';

import { CourseSessionService } from '../../../../core/services/course-session.service';
import { CourseService } from '../../../../core/services/course.service';
import { EmployeeService } from '../../../../core/services/employee.service';
import { PlaceService } from '../../../../core/services/place.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { ReportService } from '../../../../core/services/report.service';
import { SearchableSelectComponent, SelectOption } from '../../../../shared/components/searchable-select/searchable-select.component';
import { SESSION_STATUSES, CourseSessionVTO } from '../../../../core/models/employee.model';
import { CourseSessionDetailsModalComponent } from '../course-session-details/course-session-details-modal.component';
import { CourseSessionFormModalComponent } from '../course-session-form/course-session-form-modal.component';
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
    MatDividerModule
  ],
  template: `
    <div class="dialog-container" dir="rtl">
      <div class="dialog-header">
        <div class="header-icon">
          <mat-icon>description</mat-icon>
        </div>
        <div>
          <h2>تصدير التقرير</h2>
          <p>اختر الصفحات التي تريد تصديرها</p>
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
              [class.selected]="selectedOption === 'all'">
              <mat-icon>description</mat-icon>
              <span>جميع الصفحات ({{ data.totalPages }})</span>
              <span class="check-icon" *ngIf="selectedOption === 'all'">✓</span>
            </button>
            
            <button 
              mat-raised-button 
              [color]="selectedOption === 'current' ? 'primary' : 'default'"
              (click)="selectedOption = 'current'"
              class="option-btn"
              [class.selected]="selectedOption === 'current'">
              <mat-icon>description</mat-icon>
              <span>الصفحة الحالية فقط ({{ data.currentPage + 1 }})</span>
              <span class="check-icon" *ngIf="selectedOption === 'current'">✓</span>
            </button>
            
            <button 
              mat-raised-button 
              [color]="selectedOption === 'range' ? 'primary' : 'default'"
              (click)="selectedOption = 'range'"
              class="option-btn"
              [class.selected]="selectedOption === 'range'">
              <mat-icon>description</mat-icon>
              <span>نطاق صفحات محدد</span>
              <span class="check-icon" *ngIf="selectedOption === 'range'">✓</span>
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
                  placeholder="1">
                <mat-error *ngIf="startPage < 1 || startPage > data.totalPages">أدخل صفحة صالحة (1 - {{ data.totalPages }})</mat-error>
              </mat-form-field>
              
              <mat-form-field appearance="outline" class="range-field">
                <mat-label>إلى صفحة</mat-label>
                <input 
                  matInput 
                  type="number" 
                  [(ngModel)]="endPage" 
                  [min]="1" 
                  [max]="data.totalPages"
                  placeholder="{{ data.totalPages }}">
                <mat-error *ngIf="endPage < 1 || endPage > data.totalPages">أدخل صفحة صالحة (1 - {{ data.totalPages }})</mat-error>
                <mat-error *ngIf="startPage > endPage">يجب أن تكون صفحة البداية أقل من صفحة النهاية</mat-error>
              </mat-form-field>
            </div>
            
            <div class="range-info">
              <mat-icon>info</mat-icon>
              <span>سيتم تصدير {{ getRangeCount() }} صفحة ({{ getRangeRecords() }} سجل)</span>
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
          class="confirm-btn">
          <mat-icon>check</mat-icon>
          <span>تصدير</span>
        </button>
      </div>
    </div>
  `,
  styles: [`
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
      border-color: #667eea;
      background: #f0f4ff !important;
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.15);
    }

    .option-btn.selected mat-icon {
      color: #667eea;
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
      color: #667eea;
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
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
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
  `]
})
export class ExportPageSelectDialogComponent {
  selectedOption: 'all' | 'current' | 'range' = 'all';
  startPage: number = 1;
  endPage: number = 1;
  
  constructor(
    private dialogRef: MatDialogRef<ExportPageSelectDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { 
      totalPages: number; 
      totalItems: number; 
      pageSize: number; 
      currentPage: number;
    }
  ) {
    this.endPage = data.totalPages;
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
      return this.startPage >= 1 && 
             this.endPage <= this.data.totalPages && 
             this.startPage <= this.endPage;
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
// STATUS ENUM MAP - Backend uses IDs 1-4
// ============================================================================

const STATUS_ENUM_MAP: { [key: number]: string } = {
  1: 'SCHEDULED',
  2: 'IN_PROGRESS',
  3: 'COMPLETED',
  4: 'CANCELLED'
};

const STATUS_ID_MAP: { [key: string]: number } = {
  'SCHEDULED': 1,
  'IN_PROGRESS': 2,
  'COMPLETED': 3,
  'CANCELLED': 4
};

// ============================================================================
// DAY OF WEEK CONSTANTS
// ============================================================================

const DAYS_OF_WEEK: { value: string; label: string }[] = [
  { value: 'SUNDAY', label: 'الأحد' },
  { value: 'MONDAY', label: 'الإثنين' },
  { value: 'TUESDAY', label: 'الثلاثاء' },
  { value: 'WEDNESDAY', label: 'الأربعاء' },
  { value: 'THURSDAY', label: 'الخميس' },
  { value: 'FRIDAY', label: 'الجمعة' },
  { value: 'SATURDAY', label: 'السبت' }
];

// ============================================================================
// COMPONENT
// ============================================================================

@Component({
  selector: 'app-course-session-list',
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
    SearchableSelectComponent
  ],
  templateUrl: './course-session-list.component.html',
  styleUrls: ['./course-session-list.component.css']
})
export class CourseSessionListComponent implements OnInit, AfterViewInit, OnDestroy {
  Math = Math;
  
  displayedColumns: string[] = ['index', 'title', 'course', 'trainer', 'place', 'sessionDate', 'sessionDay', 'startTime', 'endTime', 'status', 'actions'];
  dataSource = new MatTableDataSource<any>([]);
  allSessions: any[] = [];
  isLoading = false;
  
  // ========== PAGINATION ==========
  totalItems: number = 0;
  pageSize: number = 25;
  pageSizeOptions: number[] = [5, 10, 25, 50, 100];
  currentPage: number = 0;
  
  // ========== SORTING ==========
  sortBy: string = 'SESSION_DATE';
  sortDir: string = 'DESC';

  courses: any[] = [];
  trainers: any[] = [];
  places: any[] = [];
  sessionStatuses = SESSION_STATUSES;

  filters = {
    courseId: null as number | null,
    trainerId: null as number | null,
    placeId: null as number | null,
    status: null as string | null,
    sessionDateFrom: null as string | null,
    sessionDateTo: null as string | null,
    sessionDay: null as string | null
  };

  quickSearch: string = '';

  // Options for searchable selects
  courseOptions: SelectOption[] = [];
  trainerOptions: SelectOption[] = [];
  placeOptions: SelectOption[] = [];
  statusOptions: SelectOption[] = [];
  dayOptions: SelectOption[] = [];

  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private sessionService: CourseSessionService,
    private courseService: CourseService,
    private employeeService: EmployeeService,
    private placeService: PlaceService,
    private notification: NotificationService,
    private reportService: ReportService,
    private router: Router,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadSelectOptions();
    this.loadLookupData();
    this.loadSessions();
  }

  ngAfterViewInit(): void {
    // Sort is handled programmatically
  }

  ngOnDestroy(): void {
    // Cleanup
  }

  loadSelectOptions(): void {
    this.statusOptions = [
      { value: null, label: 'الكل' },
      ...this.sessionStatuses.map(s => ({ 
        value: STATUS_ENUM_MAP[s.id] || s.id,
        label: s.title 
      }))
    ];

    this.dayOptions = [
      { value: null, label: 'الكل' },
      ...DAYS_OF_WEEK.map(day => ({ 
        value: day.value, 
        label: day.label 
      }))
    ];
  }

  loadLookupData(): void {
    this.courseService.getAllCourses().subscribe({
      next: (res: any) => {
        this.courses = res.items || [];
        this.courseOptions = [
          { value: null, label: 'الكل' },
          ...this.courses.map(c => ({ value: c.id, label: c.title }))
        ];
      },
      error: (err: ErrorVTO) => {
        this.notification.showError(err);
      }
    });

    this.employeeService.getAllTrainersLookup().subscribe({
      next: (res: any) => {
        this.trainers = res.list || [];
        this.trainerOptions = [
          { value: null, label: 'الكل' },
          ...this.trainers.map(t => ({ value: t.id, label: t.title }))
        ];
      },
      error: (err: ErrorVTO) => {
        this.notification.showError(err);
      }
    });

    this.placeService.getAllPlacesLookup().subscribe({
      next: (res: any) => {
        this.places = res.list || [];
        this.placeOptions = [
          { value: null, label: 'الكل' },
          ...this.places.map(p => ({ value: p.id, label: p.title }))
        ];
      },
      error: (err: ErrorVTO) => {
        this.notification.showError(err);
      }
    });
  }

  // ==========================================================================
  // DATE FORMATTING HELPERS
  // ==========================================================================

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
      this.loadSessions();
    }
  }

  goToPreviousPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.loadSessions();
    }
  }

  goToNextPage(): void {
    this.currentPage++;
    console.log('➡️ Going to next page:', this.currentPage);
    this.loadSessions();
  }

  goToLastPage(): void {
    const totalPages = this.getTotalPages();
    if (this.currentPage !== totalPages - 1 && totalPages > 0) {
      this.currentPage = totalPages - 1;
      this.loadSessions();
    }
  }

  onPageSizeChange(): void {
    this.currentPage = 0;
    console.log('📏 Page size changed to:', this.pageSize);
    this.loadSessions();
  }

  // ==========================================================================
  // LOAD SESSIONS
  // ==========================================================================

  loadSessions(): void {
    console.log('🔄 loadSessions() called');
    console.log(`  Current Page: ${this.currentPage}`);
    console.log(`  Page Size: ${this.pageSize}`);
    
    this.isLoading = true;
    const params: any = {};
    
    // ===== FILTERS =====
    if (this.filters.courseId) params.courseId = this.filters.courseId;
    if (this.filters.trainerId) params.trainerId = this.filters.trainerId;
    if (this.filters.placeId) params.placeId = this.filters.placeId;
    if (this.filters.status) params.status = this.filters.status;
    if (this.filters.sessionDay) params.sessionDay = this.filters.sessionDay;
    
    if (this.filters.sessionDateFrom) {
      const formattedDate = this.formatDateForBackend(this.filters.sessionDateFrom);
      if (formattedDate) params.sessionDateFrom = formattedDate;
    }
    if (this.filters.sessionDateTo) {
      const formattedDate = this.formatDateForBackend(this.filters.sessionDateTo);
      if (formattedDate) params.sessionDateTo = formattedDate;
    }
    
    if (this.quickSearch) params.quickSearch = this.quickSearch;
    
    // ===== PAGINATION =====
    params.pageNum = this.currentPage;
    params.pageSize = this.pageSize;
    
    // ===== SORTING =====
    if (this.sortBy) params.orderBy = this.sortBy;
    if (this.sortDir) params.orderDir = this.sortDir;

    console.log('📤 Sending request with params:', params);

    this.sessionService.getAllSessionsByFilter(params).subscribe({
      next: (res: any) => {
        console.log('✅ Response received:', res);
        console.log(`  Items: ${res.items?.length || 0}`);
        console.log(`  Total: ${res.total || 0}`);
        
        this.allSessions = res.items || [];
        this.totalItems = res.total || 0;
        this.dataSource.data = this.allSessions;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err: ErrorVTO) => {
        console.error('❌ Error loading sessions:', err);
        if (err.code === 'INVALID_DATE_RANGE_FROM_AFTER_TO') {
          this.notification.showError('تاريخ البداية لا يمكن أن يكون بعد تاريخ النهاية');
        } else {
          this.notification.showError(err);
        }
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  // ==========================================================================
  // HELPER METHODS
  // ==========================================================================

  getStatusEnum(id: number): string {
    return STATUS_ENUM_MAP[id] || '';
  }

  getStatusIdFromEnum(enumValue: string | null): number | null {
    if (!enumValue) return null;
    return STATUS_ID_MAP[enumValue] || null;
  }

  formatTime(time: string): string {
    if (!time) return '-';
    
    const [hours, minutes] = time.split(':');
    let hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'م' : 'ص';
    hour = hour % 12;
    hour = hour ? hour : 12;
    const hourStr = hour.toString().padStart(2, '0');
    return `${hourStr}:${minutes} ${ampm}`;
  }

  getDayLabel(dayEnum: string): string {
    if (!dayEnum) return '-';
    const found = DAYS_OF_WEEK.find(d => d.value === dayEnum);
    return found ? found.label : dayEnum;
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
      this.sortBy = 'SESSION_DATE';
      this.sortDir = 'DESC';
    }
    this.currentPage = 0;
    this.loadSessions();
  }

  // ==========================================================================
  // FILTERS
  // ==========================================================================

  applyQuickSearch(event: Event): void {
    this.quickSearch = (event.target as HTMLInputElement).value;
    this.currentPage = 0;
    this.loadSessions();
  }

  resetFilters(): void {
    this.filters = {
      courseId: null,
      trainerId: null,
      placeId: null,
      status: null,
      sessionDateFrom: null,
      sessionDateTo: null,
      sessionDay: null
    };
    this.quickSearch = '';
    this.currentPage = 0;
    this.loadSessions();
    this.notification.showSuccess('تم مسح جميع الفلاتر');
  }

  // ==========================================================================
  // STATUS HELPERS - IDs 1-4
  // ==========================================================================

  getStatusCount(statusId: number): number {
    return this.allSessions.filter(s => s.status?.id === statusId).length;
  }

  getStatusClass(statusId: number): string {
    const classes: { [key: number]: string } = {
      1: 'status-scheduled',
      2: 'status-in-progress',
      3: 'status-completed',
      4: 'status-cancelled'
    };
    return classes[statusId] || '';
  }

  getStatusColor(statusId: number): string {
    const colors: { [key: number]: string } = {
      1: 'primary',
      2: 'accent',
      3: 'primary',
      4: 'warn'
    };
    return colors[statusId] || 'default';
  }

  // ==========================================================================
  // MODAL OPERATIONS
  // ==========================================================================

  openAddModal(): void {
    const dialogRef = this.dialog.open(CourseSessionFormModalComponent, {
      width: '800px',
      maxWidth: '90vw',
      disableClose: true,
      data: {
        mode: 'add'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'saved') {
        this.loadSessions();
      }
    });
  }

  editSession(session: any): void {
    this.sessionService.getCourseSessionById(session.id).subscribe({
      next: (fullSession: CourseSessionVTO) => {
        const dialogRef = this.dialog.open(CourseSessionFormModalComponent, {
          width: '800px',
          maxWidth: '90vw',
          disableClose: true,
          data: {
            mode: 'edit',
            session: fullSession,
            sessionId: session.id
          }
        });

        dialogRef.afterClosed().subscribe(result => {
          if (result === 'updated') {
            this.loadSessions();
          }
        });
      },
      error: (err: ErrorVTO) => {
        this.notification.showError(err);
      }
    });
  }

  viewSessionDetails(session: any): void {
    this.sessionService.getCourseSessionById(session.id).subscribe({
      next: (fullSession: CourseSessionVTO) => {
        const dialogRef = this.dialog.open(CourseSessionDetailsModalComponent, {
          data: fullSession,
          width: '650px',
          maxWidth: '90vw'
        });

        dialogRef.afterClosed().subscribe(result => {
          if (result?.action === 'delete') {
            this.confirmAndDelete(result.session);
          } else if (result?.action === 'edit') {
            this.openEditModalFromDetails(result.session);
          }
        });
      },
      error: (err: ErrorVTO) => {
        this.notification.showError(err);
      }
    });
  }

  openEditModalFromDetails(session: any): void {
    this.sessionService.getCourseSessionById(session.id).subscribe({
      next: (fullSession: CourseSessionVTO) => {
        const dialogRef = this.dialog.open(CourseSessionFormModalComponent, {
          width: '800px',
          maxWidth: '90vw',
          disableClose: true,
          data: {
            mode: 'edit',
            session: fullSession,
            sessionId: session.id
          }
        });

        dialogRef.afterClosed().subscribe(result => {
          if (result === 'updated') {
            this.loadSessions();
          }
        });
      },
      error: (err: ErrorVTO) => {
        this.notification.showError(err);
      }
    });
  }

  confirmAndDelete(session: any): void {
    if (confirm(`هل أنت متأكد من حذف الجلسة "${session.title}"؟`)) {
      this.sessionService.deleteCourseSession(session.id).subscribe({
        next: () => {
          this.notification.showSuccess('تم حذف الجلسة بنجاح');
          this.loadSessions();
        },
        error: (err: ErrorVTO) => {
          this.notification.showError(err);
        }
      });
    }
  }

  deleteSession(session: any): void {
    this.confirmAndDelete(session);
  }

  // ==========================================================================
  // GENERATE WATERMARK CSS
  // ==========================================================================

  private getWatermarkCSS(): string {
    return `
      .watermark {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) rotate(-30deg);
        opacity: 0.08;
        pointer-events: none;
        z-index: 9999;
        user-select: none;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
      }
      
      .watermark img {
        width: 200px;
        height: auto;
        filter: grayscale(100%);
      }
      
      .watermark-text {
        font-size: 48px;
        font-weight: 900;
        color: #1e293b;
        letter-spacing: 4px;
        text-transform: uppercase;
        white-space: nowrap;
      }
      
      @media print {
        .watermark {
          opacity: 0.06 !important;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        .watermark img {
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
      }
      
      @media (max-width: 768px) {
        .watermark img {
          width: 120px;
        }
        .watermark-text {
          font-size: 28px;
        }
      }
    `;
  }

  private getWatermarkHTML(): string {
    return `
      <div class="watermark">
        <img src="assets/images/logo.jpeg" alt="الأكاديمية الأولمبية">
      </div>
    `;
  }

  // ==========================================================================
  // EXPORT FUNCTIONS WITH PAGE SELECTION
  // ==========================================================================

  private showExportPageSelection(): Promise<any> {
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
          currentPage: this.currentPage
        }
      });

      dialogRef.afterClosed().subscribe(result => {
        resolve(result);
      });
    });
  }

  private async fetchPagesForExport(startPage: number, endPage: number): Promise<any[]> {
    const allData: any[] = [];
    const totalPages = this.getTotalPages();
    
    for (let page = startPage; page <= Math.min(endPage, totalPages - 1); page++) {
      const params: any = {};
      
      if (this.filters.courseId) params.courseId = this.filters.courseId;
      if (this.filters.trainerId) params.trainerId = this.filters.trainerId;
      if (this.filters.placeId) params.placeId = this.filters.placeId;
      if (this.filters.status) params.status = this.filters.status;
      if (this.filters.sessionDay) params.sessionDay = this.filters.sessionDay;
      
      if (this.filters.sessionDateFrom) {
        const formattedDate = this.formatDateForBackend(this.filters.sessionDateFrom);
        if (formattedDate) params.sessionDateFrom = formattedDate;
      }
      if (this.filters.sessionDateTo) {
        const formattedDate = this.formatDateForBackend(this.filters.sessionDateTo);
        if (formattedDate) params.sessionDateTo = formattedDate;
      }
      
      if (this.quickSearch) params.quickSearch = this.quickSearch;
      
      params.pageNum = page;
      params.pageSize = this.pageSize;
      
      if (this.sortBy) params.orderBy = this.sortBy;
      if (this.sortDir) params.orderDir = this.sortDir;
      
      try {
        const res = await this.sessionService.getAllSessionsByFilter(params).toPromise();
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
    const result = await this.showExportPageSelection();
    
    if (!result) {
      return;
    }

    let dataToExport: any[] = [];

    if (result.option === 'all') {
      dataToExport = await this.fetchPagesForExport(0, this.getTotalPages() - 1);
    } else if (result.option === 'current') {
      dataToExport = this.allSessions;
    } else if (result.option === 'range') {
      dataToExport = await this.fetchPagesForExport(result.startPage, result.endPage);
    }

    if (dataToExport.length === 0) {
      this.notification.showWarning('لا توجد بيانات لتصديرها');
      return;
    }

    const exportData = dataToExport.map((session: any, index: number) => ({
      '#': index + 1,
      'عنوان الجلسة': session.title,
      'الدورة': session.course?.title,
      'المدرب': session.trainer?.title,
      'المكان': session.place?.title,
      'التاريخ': session.sessionDate,
      'اليوم': this.getDayLabel(session.sessionDay),
      'وقت البدء': this.formatTime(session.startTime),
      'وقت الانتهاء': this.formatTime(session.endTime),
      'الحالة': session.status?.title,
      'ملاحظات': session.note || '-'
    }));

    this.reportService.exportToExcel(exportData, 'course-sessions', 'جلسات الدورات');
    this.notification.showSuccess(`تم تصدير ${exportData.length} سجل بنجاح`);
  }

async exportToPDF(): Promise<void> {
  const result = await this.showExportPageSelection();
  
  if (!result) {
    return;
  }

  this.isLoading = true;

  let dataToPrint: any[] = [];

  if (result.option === 'all') {
    dataToPrint = await this.fetchPagesForExport(0, this.getTotalPages() - 1);
  } else if (result.option === 'current') {
    dataToPrint = this.allSessions;
  } else if (result.option === 'range') {
    dataToPrint = await this.fetchPagesForExport(result.startPage, result.endPage);
  }

  if (dataToPrint.length === 0) {
    this.notification.showWarning('لا توجد بيانات لتصديرها');
    this.isLoading = false;
    return;
  }

  const filterTexts: string[] = [];
  if (this.filters.courseId) {
    const course = this.courses.find(c => c.id === this.filters.courseId);
    if (course) filterTexts.push(`الدورة: ${course.title}`);
  }
  if (this.filters.trainerId) {
    const trainer = this.trainers.find(t => t.id === this.filters.trainerId);
    if (trainer) filterTexts.push(`المدرب: ${trainer.title}`);
  }
  if (this.filters.placeId) {
    const place = this.places.find(p => p.id === this.filters.placeId);
    if (place) filterTexts.push(`المكان: ${place.title}`);
  }
  if (this.filters.status) {
    const statusId = this.getStatusIdFromEnum(this.filters.status);
    const status = this.sessionStatuses.find(s => s.id === statusId);
    if (status) filterTexts.push(`الحالة: ${status.title}`);
  }
  if (this.filters.sessionDay) {
    const day = DAYS_OF_WEEK.find(d => d.value === this.filters.sessionDay);
    if (day) filterTexts.push(`اليوم: ${day.label}`);
  }
  if (this.filters.sessionDateFrom) {
    const formattedDate = this.formatDateForBackend(this.filters.sessionDateFrom);
    if (formattedDate) filterTexts.push(`من تاريخ: ${formattedDate}`);
  }
  if (this.filters.sessionDateTo) {
    const formattedDate = this.formatDateForBackend(this.filters.sessionDateTo);
    if (formattedDate) filterTexts.push(`إلى تاريخ: ${formattedDate}`);
  }
  if (this.quickSearch) filterTexts.push(`بحث: ${this.quickSearch}`);

  // Calculate totals
  const totalSessions = dataToPrint.length;
  const scheduledCount = dataToPrint.filter(s => s.status?.id === 1).length;
  const inProgressCount = dataToPrint.filter(s => s.status?.id === 2).length;
  const completedCount = dataToPrint.filter(s => s.status?.id === 3).length;
  const cancelledCount = dataToPrint.filter(s => s.status?.id === 4).length;

  let tableRows = '';
  dataToPrint.forEach((session: any, index: number) => {
    const statusClass = this.getStatusClass(session.status?.id);
    let statusStyle = '';
    if (statusClass === 'status-scheduled') statusStyle = 'background: #dbeafe; color: #1e40af; border-radius: 20px; padding: 3px 10px; display: inline-block; font-weight: 600; font-size: 11px;';
    else if (statusClass === 'status-in-progress') statusStyle = 'background: #fed7aa; color: #92400e; border-radius: 20px; padding: 3px 10px; display: inline-block; font-weight: 600; font-size: 11px;';
    else if (statusClass === 'status-completed') statusStyle = 'background: #d1fae5; color: #065f46; border-radius: 20px; padding: 3px 10px; display: inline-block; font-weight: 600; font-size: 11px;';
    else if (statusClass === 'status-cancelled') statusStyle = 'background: #fee2e2; color: #991b1b; border-radius: 20px; padding: 3px 10px; display: inline-block; font-weight: 600; font-size: 11px;';
    
    tableRows += `
      <tr>
        <td style="text-align: center; padding: 6px 5px; border: 1px solid #e5e7eb; font-size: 12px;">${index + 1}</td>
        <td style="text-align: right; padding: 6px 5px; border: 1px solid #e5e7eb; font-weight: 600; font-size: 12px;">${session.title || '-'}</td>
        <td style="text-align: right; padding: 6px 5px; border: 1px solid #e5e7eb; font-size: 12px;">${session.course?.title || '-'}</td>
        <td style="text-align: right; padding: 6px 5px; border: 1px solid #e5e7eb; font-size: 12px;">${session.trainer?.title || '-'}</td>
        <td style="text-align: right; padding: 6px 5px; border: 1px solid #e5e7eb; font-size: 12px;">${session.place?.title || '-'}</td>
        <td style="text-align: center; padding: 6px 5px; border: 1px solid #e5e7eb; font-size: 12px;">${session.sessionDate || '-'}</td>
        <td style="text-align: center; padding: 6px 5px; border: 1px solid #e5e7eb; font-size: 12px;">${this.getDayLabel(session.sessionDay)}</td>
        <td style="text-align: center; padding: 6px 5px; border: 1px solid #e5e7eb; font-size: 12px;">${this.formatTime(session.startTime)}</td>
        <td style="text-align: center; padding: 6px 5px; border: 1px solid #e5e7eb; font-size: 12px;">${this.formatTime(session.endTime)}</td>
        <td style="text-align: center; padding: 6px 5px; border: 1px solid #e5e7eb; font-size: 12px;">
          <span style="${statusStyle}">${session.status?.title || '-'}</span>
        </td>
      </tr>
    `;
  });

  // Build the complete HTML with large watermark
  const printContainer = document.createElement('div');
  printContainer.style.direction = 'rtl';
  printContainer.style.fontFamily = 'Cairo, "Segoe UI", Tahoma, sans-serif';
  printContainer.style.padding = '0';
  printContainer.style.backgroundColor = 'white';
  printContainer.style.position = 'relative';
  printContainer.style.minHeight = '100vh';
  printContainer.style.width = '100%';
  
  printContainer.innerHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>تقرير جلسات الدورات</title>
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
        }
        
        @page { 
          size: A4 landscape; 
          margin: 8mm;
        }
        
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
          .watermark {
            opacity: 0.15 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .watermark img {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .watermark-text {
            opacity: 0.10 !important;
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
        
        /* Large Watermark - covers most of the page */
        .watermark {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(-25deg) scale(2.8);
          opacity: 0.12;
          pointer-events: none;
          z-index: 9999;
          user-select: none;
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          filter: drop-shadow(0 4px 20px rgba(102, 126, 234, 0.2));
        }
        
        .watermark img {
          width: 400px;
          height: auto;
          filter: grayscale(0%) sepia(20%) saturate(150%) hue-rotate(220deg);
        }
        
        /* Print-specific watermark - even larger for print */
        @media print {
          .watermark {
            transform: translate(-50%, -50%) rotate(-25deg) scale(3.2) !important;
            opacity: 0.15 !important;
          }
          .watermark img {
            width: 500px !important;
          }
        }
        
        /* Watermark text overlay - also larger */
        .watermark-text {
          position: fixed;
          top: 58%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(-25deg) scale(1.2);
          opacity: 0.07;
          pointer-events: none;
          z-index: 9998;
          user-select: none;
          font-size: 70px;
          font-weight: 900;
          color: #667eea;
          letter-spacing: 8px;
          text-transform: uppercase;
          white-space: nowrap;
          text-shadow: 0 4px 20px rgba(102, 126, 234, 0.15);
        }
        
        @media print {
          .watermark-text {
            font-size: 80px !important;
            opacity: 0.08 !important;
            transform: translate(-50%, -50%) rotate(-25deg) scale(1.4) !important;
          }
        }
        
        .content {
          position: relative;
          z-index: 1;
          padding: 12px;
          background: transparent;
        }
        
        .header {
          text-align: center;
          margin-bottom: 12px;
          padding: 12px 16px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border-radius: 8px;
        }
        .header h1 { 
          margin: 0; 
          font-size: 20px; 
          font-weight: 700;
          letter-spacing: 1px;
        }
        .header p { 
          margin: 3px 0 0 0; 
          font-size: 11px; 
          opacity: 0.9;
        }
        
        .filters {
          margin-bottom: 10px;
          padding: 6px 12px;
          background: #f8fafc;
          border-radius: 6px;
          font-size: 11px;
          border: 1px solid #e5e7eb;
        }
        .filters strong {
          color: #1e293b;
        }
        
        /* Compact Horizontal Totals Grid */
        .totals-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 6px;
          margin-bottom: 10px;
        }
        
        .total-card {
          background: white;
          border-radius: 6px;
          padding: 6px 8px;
          text-align: center;
          border: 1px solid #e5e7eb;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 4px;
          min-height: 34px;
        }
        
        .total-card .total-icon {
          font-size: 14px;
          flex-shrink: 0;
        }
        
        .total-card .total-value {
          font-size: 15px;
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
        
        .total-card.total-scheduled {
          background: #eff6ff;
          border-color: #93c5fd;
        }
        .total-card.total-scheduled .total-value {
          color: #2563eb;
        }
        
        .total-card.total-progress {
          background: #fffbeb;
          border-color: #fcd34d;
        }
        .total-card.total-progress .total-value {
          color: #d97706;
        }
        
        .total-card.total-completed {
          background: #ecfdf5;
          border-color: #6ee7b7;
        }
        .total-card.total-completed .total-value {
          color: #059669;
        }
        
        .total-card.total-cancelled {
          background: #fef2f2;
          border-color: #fca5a5;
        }
        .total-card.total-cancelled .total-value {
          color: #dc2626;
        }
        
        table {
          width: 100%;
          border-collapse: collapse;
          direction: rtl;
          margin-top: 4px;
          font-size: 10px;
        }
        th {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 6px 4px;
          border: 1px solid #5b6fd8;
          text-align: center;
          font-weight: 700;
          font-size: 10px;
        }
        td { 
          padding: 5px 4px; 
          border: 1px solid #e5e7eb;
          font-size: 10px;
        }
        
        tr:nth-child(even) {
          background: #fafbfc;
        }
        
        .footer {
          text-align: center;
          margin-top: 10px;
          padding: 6px;
          font-size: 9px;
          color: #94a3b8;
          border-top: 1px solid #e5e7eb;
        }
        
        @media (max-width: 768px) {
          .watermark {
            transform: translate(-50%, -50%) rotate(-25deg) scale(2) !important;
          }
          .watermark img { 
            width: 280px !important; 
          }
          .watermark-text {
            font-size: 40px !important;
            transform: translate(-50%, -50%) rotate(-25deg) scale(0.8) !important;
          }
          .totals-grid {
            grid-template-columns: repeat(3, 1fr);
            gap: 4px;
          }
          .total-card {
            padding: 4px 6px;
            min-height: 28px;
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
            font-size: 16px;
          }
        }
        
        @media (max-width: 480px) {
          .totals-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .watermark {
            transform: translate(-50%, -50%) rotate(-25deg) scale(1.5) !important;
          }
          .watermark img {
            width: 200px !important;
          }
          .watermark-text {
            font-size: 28px !important;
            transform: translate(-50%, -50%) rotate(-25deg) scale(0.6) !important;
          }
        }
      </style>
    </head>
    <body>
      <!-- Large Colored Watermark -->
      <div class="watermark">
        <img src="assets/images/logo.jpeg" alt="الأكاديمية الأولمبية">
      </div>
      <div class="watermark-text">الأكاديمية الأولمبية</div>
      
      <div class="content">
        <div class="header">
          <h1>تقرير جلسات الدورات</h1>
          <p>${new Date().toLocaleDateString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
        
        ${filterTexts.length > 0 ? `<div class="filters"><strong>الفلاتر:</strong> ${filterTexts.join(' | ')}</div>` : ''}
        
        <!-- Compact Horizontal Totals -->
        <div class="totals-grid">
          <div class="total-card total-all">
            <span class="total-icon">📋</span>
            <span class="total-value">${totalSessions}</span>
            <span class="total-label">إجمالي</span>
          </div>
          <div class="total-card total-scheduled">
            <span class="total-icon">⏰</span>
            <span class="total-value">${scheduledCount}</span>
            <span class="total-label">مجدول</span>
          </div>
          <div class="total-card total-progress">
            <span class="total-icon">▶️</span>
            <span class="total-value">${inProgressCount}</span>
            <span class="total-label">تقدم</span>
          </div>
          <div class="total-card total-completed">
            <span class="total-icon">✅</span>
            <span class="total-value">${completedCount}</span>
            <span class="total-label">مكتمل</span>
          </div>
          <div class="total-card total-cancelled">
            <span class="total-icon">❌</span>
            <span class="total-value">${cancelledCount}</span>
            <span class="total-label">ملغي</span>
          </div>
        </div>
        
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>عنوان الجلسة</th>
              <th>الدورة</th>
              <th>المدرب</th>
              <th>المكان</th>
              <th>التاريخ</th>
              <th>اليوم</th>
              <th>البدء</th>
              <th>الانتهاء</th>
              <th>الحالة</th>
            </tr>
          </thead>
          <tbody>
            ${tableRows}
          </tbody>
        </table>
        
        <div class="footer">
          الأكاديمية الأولمبية &copy; ${new Date().getFullYear()} - ${dataToPrint.length} جلسة
        </div>
      </div>
      
      <div class="no-print" style="text-align: center; margin-top: 10px; padding: 10px;">
        <button onclick="window.print();" style="padding: 6px 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 13px; font-weight: 600; box-shadow: 0 2px 10px rgba(102, 126, 234, 0.3);">
          🖨️ طباعة / PDF
        </button>
        <button onclick="window.close();" style="padding: 6px 20px; background: #f1f5f9; color: #475569; border: none; border-radius: 6px; cursor: pointer; font-size: 13px; font-weight: 600; margin-right: 8px;">
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
    this.notification.showSuccess(`تم فتح التقرير - ${dataToPrint.length} سجل`);
  } else {
    document.body.appendChild(printContainer);
    window.print();
    setTimeout(() => {
      if (document.body.contains(printContainer)) {
        document.body.removeChild(printContainer);
      }
    }, 500);
    this.isLoading = false;
    this.notification.showSuccess(`تم فتح التقرير - ${dataToPrint.length} سجل`);
  }
}
}