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

import { CourseService } from '../../../../core/services/course.service';
import { EnrollmentService } from '../../../../core/services/enrollment.service';
import { CourseSessionService } from '../../../../core/services/course-session.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { ReportService } from '../../../../core/services/report.service';
import { SearchableSelectComponent, SelectOption } from '../../../../shared/components/searchable-select/searchable-select.component';
import { CourseWizardModalComponent } from '../course-wizard/course-wizard-modal.component';
import { CourseDetailsModalComponent } from '../course-details/course-details-modal.component';
import { FileService } from '../../../../core/services/file.service';

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
      <div class="dialog-header" [class.card-print]="isCardPrint">
        <div class="header-icon" [class.card-print]="isCardPrint">
          <mat-icon>{{ isCardPrint ? 'credit_card' : 'description' }}</mat-icon>
        </div>
        <div>
          <h2>{{ isCardPrint ? 'طباعة البطاقات' : 'تصدير التقرير' }}</h2>
          <p>{{ isCardPrint ? 'اختر الصفحات التي تريد طباعة بطاقاتها' : 'اختر الصفحات التي تريد تصديرها' }}</p>
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
              <span>سيتم {{ isCardPrint ? 'طباعة' : 'تصدير' }} {{ getRangeCount() }} صفحة ({{ getRangeRecords() }} سجل)</span>
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
          <mat-icon>{{ isCardPrint ? 'print' : 'check' }}</mat-icon>
          <span>{{ isCardPrint ? 'طباعة' : 'تصدير' }}</span>
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
      background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
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
      border-color: #2563eb;
      background: #eff6ff !important;
      box-shadow: 0 4px 12px rgba(37, 99, 235, 0.15);
    }

    .option-btn.selected mat-icon {
      color: #2563eb;
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
      color: #2563eb;
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
      color: #2563eb;
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
      background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%) !important;
      color: white !important;
      box-shadow: 0 4px 16px rgba(37, 99, 235, 0.3) !important;
    }

    .confirm-btn:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(37, 99, 235, 0.4) !important;
    }

    .confirm-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      transform: none !important;
      box-shadow: none !important;
    }

    .dialog-header.card-print .confirm-btn {
      background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%) !important;
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
  `]
})
export class ExportPageSelectDialogComponent {
  selectedOption: 'all' | 'current' | 'range' = 'all';
  startPage: number = 1;
  endPage: number = 1;
  isCardPrint: boolean = false;
  
  constructor(
    private dialogRef: MatDialogRef<ExportPageSelectDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { 
      totalPages: number; 
      totalItems: number; 
      pageSize: number; 
      currentPage: number;
      isCardPrint?: boolean;
    }
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
// MAIN COURSE LIST COMPONENT
// ============================================================================

interface CourseTypeLookup {
  id: number;
  title: string;
  value: string;
}

@Component({
  selector: 'app-course-list',
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
  templateUrl: './course-list.component.html',
  styleUrls: ['./course-list.component.css']
})
export class CourseListComponent implements OnInit, AfterViewInit, OnDestroy {
  Math = Math;
  
  displayedColumns: string[] = ['index', 'title', 'department', 'courseType', 'duration', 'price', 'enrollmentsCount', 'totalRevenue', 'status', 'actions'];
  dataSource = new MatTableDataSource<any>([]);
  allCourses: any[] = [];
  isLoading = false;
  
  // ========== PAGINATION ==========
  totalItems: number = 0;
  pageSize: number = 25;
  pageSizeOptions: number[] = [5, 10, 25, 50, 100];
  currentPage: number = 0;
  
  // ========== SORTING ==========
  sortBy: string = 'START_DATE';
  sortDir: string = 'DESC';

  filters = {
    quickSearch: '',
    courseType: null as string | null,
    isActive: null as boolean | null,
    startDateFrom: null as Date | null,
    startDateTo: null as Date | null,
    endDateFrom: null as Date | null,
    endDateTo: null as Date | null
  };

  courseTypeOptions: SelectOption[] = [];
  statusOptions: SelectOption[] = [];
  courseTypes: CourseTypeLookup[] = [];

  @ViewChild(MatSort) sort!: MatSort;

  get qualCount(): number {
    return this.allCourses.filter(c => c.courseType?.value === 'QUALIFICATION' || c.courseType?.title === 'تأهيل').length;
  }

  get trainCount(): number {
    return this.allCourses.filter(c => c.courseType?.value === 'TRAINING' || c.courseType?.title === 'تدريب').length;
  }

  get totalRevenue(): number {
    return this.allCourses.reduce((sum, c) => sum + (c.totalRevenue || 0), 0);
  }

  get totalEnrollments(): number {
    return this.allCourses.reduce((sum, c) => sum + (c.enrollmentsCount || 0), 0);
  }

  constructor(
    private courseService: CourseService,
    private enrollmentService: EnrollmentService,
    private courseSessionService: CourseSessionService,
    private notification: NotificationService,
    private reportService: ReportService,
    private router: Router,
    private dialog: MatDialog,
    private fileService: FileService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadCourseTypes();
    this.loadSelectOptions();
    this.loadCourses();
  }

  ngAfterViewInit(): void {
    // Sort is handled programmatically
  }

  ngOnDestroy(): void {
    // Cleanup
  }

  private formatDateForAPI(date: Date | null): string | null {
    if (!date) return null;
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  loadCourseTypes(): void {
    this.courseService.getAllCoursesTypesLookup().subscribe({
      next: (res: any) => {
        const typeMap: { [key: string]: string } = {
          'تأهيل': 'QUALIFICATION',
          'تدريب': 'TRAINING'
        };
        
        this.courseTypes = (res.list || []).map((item: any) => ({
          id: item.id,
          title: item.title,
          value: typeMap[item.title] || item.title
        }));
        
        this.updateCourseTypeOptions();
      },
      error: () => {
        this.notification.showError('حدث خطأ في تحميل أنواع الدورات');
        this.courseTypes = [
          { id: 1, title: 'تأهيل', value: 'QUALIFICATION' },
          { id: 2, title: 'تدريب', value: 'TRAINING' }
        ];
        this.updateCourseTypeOptions();
      }
    });
  }

  updateCourseTypeOptions(): void {
    this.courseTypeOptions = [
      { value: null, label: 'الكل' },
      ...this.courseTypes.map(t => ({ 
        value: t.value,
        label: t.title 
      }))
    ];
  }

  loadSelectOptions(): void {
    this.statusOptions = [
      { value: null, label: 'الكل' },
      { value: true, label: 'نشط' },
      { value: false, label: 'غير نشط' }
    ];
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
      this.loadCourses();
    }
  }

  goToPreviousPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.loadCourses();
    }
  }

  goToNextPage(): void {
    this.currentPage++;
    console.log('➡️ Going to next page:', this.currentPage);
    this.loadCourses();
  }

  goToLastPage(): void {
    const totalPages = this.getTotalPages();
    if (this.currentPage !== totalPages - 1 && totalPages > 0) {
      this.currentPage = totalPages - 1;
      this.loadCourses();
    }
  }

  onPageSizeChange(): void {
    this.currentPage = 0;
    console.log('📏 Page size changed to:', this.pageSize);
    this.loadCourses();
  }

  // ==========================================================================
  // LOAD COURSES
  // ==========================================================================

  loadCourses(): void {
    console.log('🔄 loadCourses() called');
    console.log(`  Current Page: ${this.currentPage}`);
    console.log(`  Page Size: ${this.pageSize}`);
    
    this.isLoading = true;
    
    const params: any = {};
    
    // ===== FILTERS =====
    if (this.filters.quickSearch) params.quickSearch = this.filters.quickSearch;
    if (this.filters.courseType) params.courseType = this.filters.courseType;
    if (this.filters.isActive !== null) params.isActive = this.filters.isActive;
    
    if (this.filters.startDateFrom) params.startDateFrom = this.formatDateForAPI(this.filters.startDateFrom);
    if (this.filters.startDateTo) params.startDateTo = this.formatDateForAPI(this.filters.startDateTo);
    if (this.filters.endDateFrom) params.endDateFrom = this.formatDateForAPI(this.filters.endDateFrom);
    if (this.filters.endDateTo) params.endDateTo = this.formatDateForAPI(this.filters.endDateTo);
    
    // ===== PAGINATION =====
    params.pageNum = this.currentPage;
    params.pageSize = this.pageSize;
    
    // ===== SORTING =====
    if (this.sortBy) params.orderBy = this.sortBy;
    if (this.sortDir) params.orderDir = this.sortDir;

    console.log('📤 Sending request with params:', params);

    this.courseService.getAllCourses(params).subscribe({
      next: (res: any) => {
        console.log('✅ Response received:', res);
        console.log(`  Items: ${res.items?.length || 0}`);
        console.log(`  Total: ${res.total || 0}`);
        
        this.allCourses = res.items || [];
        this.totalItems = res.total || 0;
        this.dataSource.data = [...this.allCourses];
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('❌ Error loading courses:', err);
        this.notification.showError('حدث خطأ في تحميل الدورات');
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  getCourseTypeTitle(courseType: any): string {
    if (!courseType) return '-';
    
    if (typeof courseType === 'object' && courseType.title) {
      return courseType.title;
    }
    
    if (typeof courseType === 'string') {
      const found = this.courseTypes.find(t => t.value === courseType);
      return found?.title || courseType;
    }
    
    return '-';
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
    this.loadCourses();
  }

  // ==========================================================================
  // FILTER METHODS
  // ==========================================================================

  resetFilters(): void {
    this.filters = {
      quickSearch: '',
      courseType: null,
      isActive: null,
      startDateFrom: null,
      startDateTo: null,
      endDateFrom: null,
      endDateTo: null
    };
    this.currentPage = 0;
    this.loadCourses();
    this.notification.showSuccess('تم مسح جميع الفلاتر');
  }

  // ==========================================================================
  // VIEW / EDIT / DELETE
  // ==========================================================================

  viewCourse(id: number): void {
    this.isLoading = true;
    
    const existingCourse = this.allCourses.find(c => c.id === id);
    
    if (existingCourse) {
      this.courseSessionService.getAllCourseSessionsByFilter(id).subscribe({
        next: (sessionsRes: any) => {
          this.dialog.open(CourseDetailsModalComponent, {
            data: {
              course: existingCourse,
              sessions: sessionsRes.items || []
            },
            width: '950px',
            maxWidth: '90vw'
          });
          this.isLoading = false;
        },
        error: () => {
          this.dialog.open(CourseDetailsModalComponent, {
            data: {
              course: existingCourse,
              sessions: []
            },
            width: '950px',
            maxWidth: '90vw'
          });
          this.isLoading = false;
        }
      });
    } else {
      this.courseService.getCourseById(id).subscribe({
        next: (course) => {
          this.courseSessionService.getAllCourseSessionsByFilter(id).subscribe({
            next: (sessionsRes: any) => {
              this.dialog.open(CourseDetailsModalComponent, {
                data: {
                  course: course,
                  sessions: sessionsRes.items || []
                },
                width: '950px',
                maxWidth: '90vw'
              });
              this.isLoading = false;
            },
            error: () => {
              this.dialog.open(CourseDetailsModalComponent, {
                data: {
                  course: course,
                  sessions: []
                },
                width: '950px',
                maxWidth: '90vw'
              });
              this.isLoading = false;
            }
          });
        },
        error: () => {
          this.notification.showError('حدث خطأ في تحميل بيانات الدورة');
          this.isLoading = false;
        }
      });
    }
  }

  openNewCourseModal(): void {
    const dialogRef = this.dialog.open(CourseWizardModalComponent, {
      data: {},
      width: '850px',
      maxWidth: '90vw'
    });
    
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadCourses();
      }
    });
  }

  editCourse(id: number): void {
    const dialogRef = this.dialog.open(CourseWizardModalComponent, {
      data: { courseId: id },
      width: '850px',
      maxWidth: '90vw'
    });
    
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadCourses();
      }
    });
  }

  deleteCourse(course: any): void {
    if (confirm(`هل أنت متأكد من حذف دورة "${course.title}"؟`)) {
      this.courseService.deleteCourse(course.id).subscribe({
        next: () => {
          this.notification.showSuccess('تم حذف الدورة بنجاح');
          this.loadCourses();
        },
        error: () => this.notification.showError('حدث خطأ في حذف الدورة')
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
          isCardPrint: isCardPrint
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
      
      if (this.filters.quickSearch) params.quickSearch = this.filters.quickSearch;
      if (this.filters.courseType) params.courseType = this.filters.courseType;
      if (this.filters.isActive !== null) params.isActive = this.filters.isActive;
      
      if (this.filters.startDateFrom) params.startDateFrom = this.formatDateForAPI(this.filters.startDateFrom);
      if (this.filters.startDateTo) params.startDateTo = this.formatDateForAPI(this.filters.startDateTo);
      if (this.filters.endDateFrom) params.endDateFrom = this.formatDateForAPI(this.filters.endDateFrom);
      if (this.filters.endDateTo) params.endDateTo = this.formatDateForAPI(this.filters.endDateTo);
      
      params.pageNum = page;
      params.pageSize = this.pageSize;
      
      if (this.sortBy) params.orderBy = this.sortBy;
      if (this.sortDir) params.orderDir = this.sortDir;
      
      try {
        const res = await this.courseService.getAllCourses(params).toPromise();
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

    let dataToExport: any[] = [];

    if (result.option === 'all') {
      dataToExport = await this.fetchPagesForExport(0, this.getTotalPages() - 1);
    } else if (result.option === 'current') {
      dataToExport = this.allCourses;
    } else if (result.option === 'range') {
      dataToExport = await this.fetchPagesForExport(result.startPage, result.endPage);
    }

    if (dataToExport.length === 0) {
      this.notification.showWarning('لا توجد بيانات لتصديرها');
      return;
    }

    const exportData = dataToExport.map((course: any, index: number) => ({
      '#': index + 1,
      'اسم الدورة': course.title,
      'القسم': course.department?.title || '-',
      'النوع': this.getCourseTypeTitle(course.courseType),
      'المدة': `${course.duration || 0} ساعة`,
      'السعر': course.price || 0,
      'عدد المسجلين': course.enrollmentsCount || 0,
      'الإيرادات': course.totalRevenue || 0,
      'الحالة': course.isActive ? 'نشط' : 'غير نشط'
    }));

    this.reportService.exportToExcel(exportData, 'courses-list', 'الدورات');
    this.notification.showSuccess(`تم تصدير ${exportData.length} سجل بنجاح`);
  }

  async exportToPDF(): Promise<void> {
    const result = await this.showExportPageSelection(false);
    
    if (!result) {
      return;
    }

    this.isLoading = true;

    let dataToPrint: any[] = [];

    if (result.option === 'all') {
      dataToPrint = await this.fetchPagesForExport(0, this.getTotalPages() - 1);
    } else if (result.option === 'current') {
      dataToPrint = this.allCourses;
    } else if (result.option === 'range') {
      dataToPrint = await this.fetchPagesForExport(result.startPage, result.endPage);
    }

    if (dataToPrint.length === 0) {
      this.notification.showWarning('لا توجد بيانات لتصديرها');
      this.isLoading = false;
      return;
    }

    const filterTexts: string[] = [];
    if (this.filters.quickSearch) filterTexts.push(`بحث: ${this.filters.quickSearch}`);
    if (this.filters.courseType) {
      const courseType = this.courseTypes.find(t => t.value === this.filters.courseType);
      if (courseType) filterTexts.push(`نوع الدورة: ${courseType.title}`);
    }
    if (this.filters.isActive !== null) {
      filterTexts.push(`الحالة: ${this.filters.isActive ? 'نشط' : 'غير نشط'}`);
    }

    const totalRevenue = dataToPrint.reduce((sum, c) => sum + (c.totalRevenue || 0), 0);
    const totalEnrollments = dataToPrint.reduce((sum, c) => sum + (c.enrollmentsCount || 0), 0);
    const qualCount = dataToPrint.filter(c => c.courseType?.value === 'QUALIFICATION' || c.courseType?.title === 'تأهيل').length;
    const trainCount = dataToPrint.filter(c => c.courseType?.value === 'TRAINING' || c.courseType?.title === 'تدريب').length;

    let tableRows = '';
    dataToPrint.forEach((course: any, index: number) => {
      const statusColor = course.isActive ? '#d1fae5' : '#fee2e2';
      const statusTextColor = course.isActive ? '#065f46' : '#991b1b';
      tableRows += `
        <tr>
          <td style="text-align: center; padding: 8px; border: 1px solid #ddd;">${index + 1}</td>
          <td style="text-align: right; padding: 8px; border: 1px solid #ddd; font-weight: bold;">${course.title || '-'}</td>
          <td style="text-align: right; padding: 8px; border: 1px solid #ddd;">${course.department?.title || '-'}</td>
          <td style="text-align: right; padding: 8px; border: 1px solid #ddd;">${this.getCourseTypeTitle(course.courseType)}</td>
          <td style="text-align: center; padding: 8px; border: 1px solid #ddd;">${course.duration || 0} ساعة</td>
          <td style="text-align: right; padding: 8px; border: 1px solid #ddd;">${(course.price || 0).toLocaleString('ar-EG')} جم</td>
          <td style="text-align: center; padding: 8px; border: 1px solid #ddd;">${course.enrollmentsCount || 0}</td>
          <td style="text-align: right; padding: 8px; border: 1px solid #ddd;">${(course.totalRevenue || 0).toLocaleString('ar-EG')} جم</td>
          <td style="text-align: center; padding: 8px; border: 1px solid #ddd; background-color: ${statusColor}; color: ${statusTextColor};">
            ${course.isActive ? 'نشط' : 'غير نشط'}
          </td>
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
        <title>قائمة الدورات التدريبية</title>
        <style>
          @media print {
            body { margin: 0; padding: 20px; }
            .no-print { display: none; }
          }
          * { font-family: 'Cairo', 'Segoe UI', Tahoma, sans-serif; }
          .header {
            text-align: center;
            margin-bottom: 20px;
            padding: 20px;
            background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
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
          .stat-item { flex: 1; text-align: center; min-width: 100px; }
          .stat-label { font-size: 12px; color: #6b7280; }
          .stat-value { font-size: 20px; font-weight: bold; color: #2563eb; }
          table {
            width: 100%;
            border-collapse: collapse;
            direction: rtl;
          }
          th {
            background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
            color: white;
            padding: 10px;
            border: 1px solid #ddd;
            text-align: center;
            font-weight: bold;
          }
          td { padding: 8px; border: 1px solid #ddd; }
          .footer {
            text-align: center;
            margin-top: 20px;
            padding: 10px;
            font-size: 10px;
            color: #666;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>قائمة الدورات التدريبية</h1>
          <p>تاريخ التقرير: ${new Date().toLocaleDateString('ar-EG')}</p>
          <p>عدد السجلات: ${dataToPrint.length} دورة</p>
        </div>
        ${filterTexts.length > 0 ? `<div class="filters"><strong>الفلاتر المطبقة:</strong> ${filterTexts.join(' | ')}</div>` : ''}
        <div class="stats">
          <div class="stat-item"><div class="stat-value">${dataToPrint.length}</div><div class="stat-label">إجمالي الدورات</div></div>
          <div class="stat-item"><div class="stat-value">${qualCount}</div><div class="stat-label">دورات تأهيل</div></div>
          <div class="stat-item"><div class="stat-value">${trainCount}</div><div class="stat-label">دورات تدريب</div></div>
          <div class="stat-item"><div class="stat-value">${totalEnrollments}</div><div class="stat-label">إجمالي المسجلين</div></div>
          <div class="stat-item"><div class="stat-value">${totalRevenue.toLocaleString('ar-EG')} جم</div><div class="stat-label">إجمالي الإيرادات</div></div>
        </div>
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>اسم الدورة</th>
              <th>القسم</th>
              <th>النوع</th>
              <th>المدة</th>
              <th>السعر</th>
              <th>عدد المسجلين</th>
              <th>الإيرادات</th>
              <th>الحالة</th>
            </tr>
          </thead>
          <tbody>${tableRows}</tbody>
        </table>
        <div class="footer">تم التصدير من نظام إدارة  الأكاديمية الأولمبية لعلوم الرياضة</div>
        <div class="no-print" style="text-align: center; margin-top: 20px;">
          <button onclick="window.print();" style="padding: 10px 20px; background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%); color: white; border: none; border-radius: 5px; cursor: pointer;">🖨️ طباعة / حفظ كـ PDF</button>
        </div>
      </body>
      </html>
    `;

    const printWindow = window.open('', '_blank', 'width=1200,height=800,scrollbars=yes');
    if (printWindow) {
      printWindow.document.write(printContainer.innerHTML);
      printWindow.document.close();
      this.isLoading = false;
      this.notification.showSuccess(`تم فتح التقرير - ${dataToPrint.length} سجل`);
    } else {
      document.body.appendChild(printContainer);
      window.print();
      setTimeout(() => { document.body.removeChild(printContainer); }, 500);
      this.isLoading = false;
      this.notification.showSuccess(`تم فتح التقرير - ${dataToPrint.length} سجل`);
    }
  }

  // ==========================================================================
  // PRINT COURSE CARDS WITH PAGE SELECTION
  // ==========================================================================

  async printCourseCards(): Promise<void> {
    const result = await this.showExportPageSelection(true);
    
    if (!result) {
      return;
    }

    this.isLoading = true;

    let dataToPrint: any[] = [];

    if (result.option === 'all') {
      dataToPrint = await this.fetchPagesForExport(0, this.getTotalPages() - 1);
    } else if (result.option === 'current') {
      dataToPrint = this.allCourses;
    } else if (result.option === 'range') {
      dataToPrint = await this.fetchPagesForExport(result.startPage, result.endPage);
    }

    if (dataToPrint.length === 0) {
      this.notification.showWarning('لا توجد بيانات لطباعة البطاقات');
      this.isLoading = false;
      return;
    }

    this.generateCardsPrint(dataToPrint);
    this.isLoading = false;
    this.notification.showSuccess(`تم فتح ${dataToPrint.length} بطاقة للطباعة`);
  }

  private generateCardsPrint(courses: any[]): void {
    const printWindow = window.open('', '_blank', 'width=800,height=800,scrollbars=yes');
    if (!printWindow) {
      this.notification.showError('تعذر فتح نافذة الطباعة');
      return;
    }

    const today = new Date().toLocaleDateString('ar-EG');
    let cardsHtml = '';

    courses.forEach((course, index) => {
      const courseTypeDisplay = this.getCourseTypeTitle(course.courseType);
      const isActive = course.isActive;
      const departmentName = course.department?.title || '-';

      cardsHtml += `
        <div class="card-wrapper">
          <div class="card">
            <div class="card-header">
              <div class="academy-name"> الأكاديمية الأولمبية لعلوم الرياضة</div>
              <div class="card-title">بطاقة دورة تدريبية</div>
            </div>
            <div class="card-body">
              <div class="card-info">
                <div class="card-name">${course.title || '-'}</div>
                <div class="card-details">
                  <div class="detail-row">
                    <span class="detail-label">القسم:</span>
                    <span class="detail-value">${departmentName}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">النوع:</span>
                    <span class="detail-value">${courseTypeDisplay}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">المدة:</span>
                    <span class="detail-value">${course.duration || 0} ساعة</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">السعر:</span>
                    <span class="detail-value price">${(course.price || 0).toLocaleString('ar-EG')} جم</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">السعة:</span>
                    <span class="detail-value">${course.maxCapacity || 'غير محدود'}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">تاريخ البدء:</span>
                    <span class="detail-value">${course.startDate ? new Date(course.startDate).toLocaleDateString('ar-EG') : '-'}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">تاريخ الانتهاء:</span>
                    <span class="detail-value">${course.endDate ? new Date(course.endDate).toLocaleDateString('ar-EG') : '-'}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">عدد المسجلين:</span>
                    <span class="detail-value">${course.enrollmentsCount || 0}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">الإيرادات:</span>
                    <span class="detail-value revenue">${(course.totalRevenue || 0).toLocaleString('ar-EG')} جم</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">الحالة:</span>
                    <span class="detail-value status ${isActive ? 'active' : 'inactive'}">${isActive ? 'نشط' : 'غير نشط'}</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="card-footer">
              <div class="card-id">رقم الدورة: #${course.id}</div>
              <div class="card-signature">
                <div class="signature-line"></div>
                <div class="signature-label">توقيع مدير القسم</div>
              </div>
              <div class="card-signature">
                <div class="signature-line"></div>
                <div class="signature-label">ختم الأكاديمية</div>
              </div>
            </div>
            <div class="card-issue-date">تاريخ الإصدار: ${today}</div>
          </div>
        </div>
      `;
    });

    printWindow.document.write(`
      <!DOCTYPE html>
      <html dir="rtl">
      <head>
        <meta charset="UTF-8">
        <title>بطاقات الدورات التدريبية</title>
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
              min-height: 220px;
              padding: 8px 10px;
            }
            .card-header {
              margin-bottom: 4px;
              padding-bottom: 4px;
            }
            .academy-name {
              font-size: 10px;
            }
            .card-title {
              font-size: 8px;
            }
            .card-body {
              gap: 6px;
              margin-bottom: 4px;
            }
            .card-name {
              font-size: 11px;
            }
            .card-details {
              font-size: 8px;
            }
            .detail-row {
              padding: 1px 0;
            }
            .card-footer {
              padding-top: 4px;
              margin-top: 2px;
            }
            .card-signature {
              width: 42%;
            }
            .signature-label {
              font-size: 6px;
            }
            .signature-line {
              margin: 2px 0;
            }
            .card-issue-date {
              display: none;
            }
            .card-id {
              font-size: 7px !important;
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
          }
          .card-header {
            text-align: center;
            border-bottom: 2px solid #2563eb;
            padding-bottom: 6px;
            margin-bottom: 8px;
          }
          .academy-name {
            font-size: 12px;
            font-weight: 700;
            color: #1a1a2e;
          }
          .card-title {
            font-size: 9px;
            color: #2563eb;
            font-weight: 600;
            margin-top: 1px;
          }
          .card-body {
            display: flex;
            gap: 10px;
            margin-bottom: 8px;
          }
          .card-info {
            flex: 1;
            min-width: 0;
          }
          .card-name {
            font-size: 13px;
            font-weight: 700;
            color: #1a1a2e;
            margin-bottom: 4px;
            text-align: center;
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
          .detail-value.price {
            color: #059669;
            font-weight: 700;
          }
          .detail-value.revenue {
            color: #7c3aed;
            font-weight: 700;
          }
          .detail-value.status.active {
            color: #10b981;
          }
          .detail-value.status.inactive {
            color: #ef4444;
          }
          .card-footer {
            border-top: 2px solid #2563eb;
            padding-top: 6px;
            margin-top: 4px;
            text-align: center;
          }
          .card-id {
            font-size: 9px;
            color: #64748b;
            margin-bottom: 4px;
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
          .card-issue-date {
            text-align: center;
            font-size: 8px;
            color: #94a3b8;
            margin-top: 6px;
            padding-top: 4px;
            border-top: 1px dashed #e2e8f0;
          }
          
          @media (max-width: 600px) {
            .card {
              max-width: 100%;
            }
          }
        </style>
      </head>
      <body>
        ${cardsHtml}
        <div class="no-print" style="text-align: center; margin-top: 20px; width: 100%;">
          <button onclick="window.print();" style="padding: 12px 30px; background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%); color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 16px;">🖨️ طباعة / حفظ كـ PDF</button>
        </div>
      </body>
      </html>
    `);
    printWindow.document.close();
  }
}