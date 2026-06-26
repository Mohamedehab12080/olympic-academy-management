import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy, ChangeDetectorRef, Inject } from '@angular/core';
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
import { MatDialog, MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDividerModule } from '@angular/material/divider';

import { EnrollmentService } from '../../../../core/services/enrollment.service';
import { TraineeService } from '../../../../core/services/trainee.service';
import { CourseService } from '../../../../core/services/course.service';
import { EmployeeService } from '../../../../core/services/employee.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { ReportService } from '../../../../core/services/report.service';
import { FileService } from '../../../../core/services/file.service';
import { SearchableSelectComponent, SelectOption } from '../../../../shared/components/searchable-select/searchable-select.component';
import { PAYMENT_STATUSES } from '../../../../core/models/common.model';
import { ENROLLMENT_STATUSES } from '../../../../core/models/enrollment.model';
import { EnrollmentDetailsModalComponent } from './../enrollment-details/enrollment-details-modal.component';
import { EnrollmentWizardModalComponent } from './../enrollment-wizard/enrollment-wizard-modal.component';

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
      background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
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
      border-color: #0f3460;
      background: #f0f4f8 !important;
      box-shadow: 0 4px 12px rgba(15, 52, 96, 0.15);
    }

    .option-btn.selected mat-icon {
      color: #0f3460;
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
      color: #0f3460;
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
      background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%) !important;
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
// MAIN ENROLLMENT LIST COMPONENT
// ============================================================================

interface EnrollmentListItem {
  id: number;
  trainee?: {
    id: number;
    title: string;
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
    SearchableSelectComponent
  ],
  templateUrl: './enrollment-list.component.html',
  styleUrls: ['./enrollment-list.component.css']
})
export class EnrollmentListComponent implements OnInit, AfterViewInit, OnDestroy {
  Math = Math;
  
  displayedColumns: string[] = ['index', 'image', 'trainee', 'course', 'trainer', 'startDate', 'endDate', 'isActive', 'enrollmentStatus', 'paymentStatus', 'amount', 'actions'];
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
  
  filters = {
    traineeId: null as number | null,
    courseId: null as number | null,
    trainerId: null as number | null,
    enrollmentStatus: null as number | null,
    paymentStatus: null as number | null,
    startDateFrom: null as string | null,
    startDateTo: null as string | null,
    endDateFrom: null as string | null,
    endDateTo: null as string | null,
    isActive: null as boolean | null
  };
  
  quickSearch: string = '';

  @ViewChild(MatSort) sort!: MatSort;

  // Statistics
  get totalAmount(): number {
    return this.allEnrollments.reduce((sum, item) => sum + (item.finalSubscriptionValue || 0), 0);
  }

  get activeEnrollments(): number {
    return this.allEnrollments.filter(item => item.enrollmentStatus?.id === 1).length;
  }

  get completedEnrollments(): number {
    return this.allEnrollments.filter(item => item.enrollmentStatus?.id === 2).length;
  }

  get paidEnrollments(): number {
    return this.allEnrollments.filter(item => item.paymentStatus?.id === 1).length;
  }

  get isActiveCount(): number {
    return this.allEnrollments.filter(item => item.isActive === true).length;
  }

  get isInactiveCount(): number {
    return this.allEnrollments.filter(item => item.isActive === false).length;
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
    private cdr: ChangeDetectorRef
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
    this.traineeImageUrls.forEach(url => {
      if (url && url.startsWith('blob:')) {
        URL.revokeObjectURL(url);
      }
    });
    this.traineeImageUrls.clear();
  }

  loadSelectOptions() {
    this.enrollmentStatusOptions = [
      { value: null, label: 'الكل' },
      ...this.enrollmentStatuses.map(s => ({ value: s.id, label: s.title }))
    ];
    
    this.paymentStatusOptions = [
      { value: null, label: 'الكل' },
      ...this.paymentStatuses.map(s => ({ value: s.id, label: s.title }))
    ];
  }

  loadLookupData() {
    this.traineeService.getAllTraineesLookup().subscribe({
      next: (res: any) => { 
        this.trainees = res.list || [];
        this.traineeOptions = [
          { value: null, label: 'الكل' },
          ...this.trainees.map(t => ({ value: t.id, label: t.title }))
        ];
      },
      error: () => { 
        this.notification.showError('حدث خطأ في تحميل المتدربين'); 
      }
    });

    this.courseService.getAllCourses().subscribe({
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

    this.employeeService.getAllTrainersLookup().subscribe({
      next: (res: any) => { 
        this.trainers = res.list || [];
        this.trainerOptions = [
          { value: null, label: 'الكل' },
          ...this.trainers.map(t => ({ value: t.id, label: t.title }))
        ];
      },
      error: () => { 
        this.notification.showError('حدث خطأ في تحميل المدربين'); 
      }
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
  // LOAD ENROLLMENTS
  // ==========================================================================

  loadEnrollments() {
    console.log('🔄 loadEnrollments() called');
    console.log(`  Current Page: ${this.currentPage}`);
    console.log(`  Page Size: ${this.pageSize}`);
    
    this.isLoading = true;
    const params: any = {};
    
    // ===== FILTERS =====
    if (this.filters.traineeId) params.traineeId = this.filters.traineeId;
    if (this.filters.courseId) params.courseId = this.filters.courseId;
    if (this.filters.trainerId) params.trainerId = this.filters.trainerId;
    if (this.filters.enrollmentStatus) params.enrollmentStatus = this.filters.enrollmentStatus;
    if (this.filters.paymentStatus) params.paymentStatus = this.filters.paymentStatus;
    if (this.filters.startDateFrom) params.startDateFrom = this.filters.startDateFrom;
    if (this.filters.startDateTo) params.startDateTo = this.filters.startDateTo;
    if (this.filters.endDateFrom) params.endDateFrom = this.filters.endDateFrom;
    if (this.filters.endDateTo) params.endDateTo = this.filters.endDateTo;
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
      }
    });
  }

  loadTraineeImages(items: EnrollmentListItem[]): void {
    this.traineeImageUrls.forEach(url => {
      if (url && url.startsWith('blob:')) {
        URL.revokeObjectURL(url);
      }
    });
    this.traineeImageUrls.clear();

    items.forEach(item => {
      const trainee = item.trainee;
      if (trainee && trainee.imageUrl && /^\d{15}(\d{3})?$/.test(trainee.imageUrl)) {
        this.fileService.downloadFile(trainee.imageUrl).subscribe({
          next: (blob) => {
            const blobUrl = URL.createObjectURL(blob);
            this.traineeImageUrls.set(trainee.id, blobUrl);
            this.dataSource.data = [...this.dataSource.data];
            this.cdr.detectChanges();
          },
          error: (error) => {
            console.error(`Failed to load image for trainee ${trainee.id}:`, error);
          }
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
    return trainee.fullName || trainee.title || '-';
  }

  toggleActiveFilter(event: any): void {
    this.filters.isActive = event.checked;
    this.currentPage = 0;
    this.loadEnrollments();
  }

  applyQuickSearch(event: Event) {
    this.quickSearch = (event.target as HTMLInputElement).value;
    this.currentPage = 0;
    this.loadEnrollments();
  }

  resetFilters() {
    this.filters = {
      traineeId: null,
      courseId: null,
      trainerId: null,
      enrollmentStatus: null,
      paymentStatus: null,
      startDateFrom: null,
      startDateTo: null,
      endDateFrom: null,
      endDateTo: null,
      isActive: null
    };
    this.quickSearch = '';
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
  // TRAINEE OPERATIONS
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
          autoFocus: false
        });
      },
      error: () => {
        this.notification.showError('حدث خطأ في تحميل بيانات التسجيل');
      }
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
      autoFocus: false
    });
    
    dialogRef.afterClosed().subscribe(result => {
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
      autoFocus: false
    });
    
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadEnrollments();
      }
    });
  }

  deleteEnrollment(enrollment: EnrollmentListItem): void {
    const traineeName = this.getTraineeName(enrollment.trainee);
    if (confirm(`هل أنت متأكد من حذف تسجيل "${traineeName}" في دورة "${enrollment.course?.title}"؟`)) {
      this.enrollmentService.deleteEnrollment(enrollment.id).subscribe({
        next: () => {
          this.notification.showSuccess('تم حذف التسجيل بنجاح');
          this.loadEnrollments();
        },
        error: () => this.notification.showError('حدث خطأ في حذف التسجيل')
      });
    }
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

  private async fetchPagesForExport(startPage: number, endPage: number): Promise<EnrollmentListItem[]> {
    const allData: EnrollmentListItem[] = [];
    const totalPages = this.getTotalPages();
    
    for (let page = startPage; page <= Math.min(endPage, totalPages - 1); page++) {
      const params: any = {};
      
      if (this.filters.traineeId) params.traineeId = this.filters.traineeId;
      if (this.filters.courseId) params.courseId = this.filters.courseId;
      if (this.filters.trainerId) params.trainerId = this.filters.trainerId;
      if (this.filters.enrollmentStatus) params.enrollmentStatus = this.filters.enrollmentStatus;
      if (this.filters.paymentStatus) params.paymentStatus = this.filters.paymentStatus;
      if (this.filters.startDateFrom) params.startDateFrom = this.filters.startDateFrom;
      if (this.filters.startDateTo) params.startDateTo = this.filters.startDateTo;
      if (this.filters.endDateFrom) params.endDateFrom = this.filters.endDateFrom;
      if (this.filters.endDateTo) params.endDateTo = this.filters.endDateTo;
      if (this.filters.isActive !== null) params.isActive = this.filters.isActive;
      if (this.quickSearch) params.quickSearch = this.quickSearch;
      
      params.pageNum = page;
      params.pageSize = this.pageSize;
      
      if (this.sortBy) params.orderBy = this.sortBy;
      if (this.sortDir) params.orderDir = this.sortDir;
      
      try {
        const res = await this.enrollmentService.getAllEnrollmentsByFilter(params).toPromise();
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

    let dataToExport: EnrollmentListItem[] = [];

    if (result.option === 'all') {
      dataToExport = await this.fetchPagesForExport(0, this.getTotalPages() - 1);
    } else if (result.option === 'current') {
      dataToExport = this.allEnrollments;
    } else if (result.option === 'range') {
      dataToExport = await this.fetchPagesForExport(result.startPage, result.endPage);
    }

    if (dataToExport.length === 0) {
      this.notification.showWarning('لا توجد بيانات لتصديرها');
      return;
    }

    const exportData = dataToExport.map((item, index) => ({
      '#': index + 1,
      'المتدرب': this.getTraineeName(item.trainee),
      'الدورة': item.course?.title,
      'المدرب': item.trainer?.title,
      'تاريخ البدء': item.startDate,
      'تاريخ الانتهاء': item.endDate || '-',
      'الحالة': item.isActive ? 'نشط' : 'غير نشط',
      'حالة التسجيل': item.enrollmentStatus?.title,
      'حالة الدفع': item.paymentStatus?.title,
      'المبلغ': item.finalSubscriptionValue
    }));

    this.reportService.exportToExcel(exportData, 'enrollments-list', 'التسجيلات');
    this.notification.showSuccess(`تم تصدير ${exportData.length} سجل بنجاح`);
  }

  async exportToPDF(): Promise<void> {
    const result = await this.showExportPageSelection();
    
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
      dataToPrint = await this.fetchPagesForExport(result.startPage, result.endPage);
    }

    if (dataToPrint.length === 0) {
      this.notification.showWarning('لا توجد بيانات لتصديرها');
      this.isLoading = false;
      return;
    }

    const filterTexts: string[] = [];
    if (this.filters.traineeId) {
      const trainee = this.trainees.find(t => t.id === this.filters.traineeId);
      if (trainee) filterTexts.push(`المتدرب: ${trainee.title}`);
    }
    if (this.filters.courseId) {
      const course = this.courses.find(c => c.id === this.filters.courseId);
      if (course) filterTexts.push(`الدورة: ${course.title}`);
    }
    if (this.filters.trainerId) {
      const trainer = this.trainers.find(t => t.id === this.filters.trainerId);
      if (trainer) filterTexts.push(`المدرب: ${trainer.title}`);
    }
    if (this.filters.enrollmentStatus) {
      const status = this.enrollmentStatuses.find(s => s.id === this.filters.enrollmentStatus);
      if (status) filterTexts.push(`حالة التسجيل: ${status.title}`);
    }
    if (this.filters.paymentStatus) {
      const status = this.paymentStatuses.find(s => s.id === this.filters.paymentStatus);
      if (status) filterTexts.push(`حالة الدفع: ${status.title}`);
    }
    if (this.filters.isActive !== null) {
      filterTexts.push(`الحالة: ${this.filters.isActive ? 'نشط' : 'غير نشط'}`);
    }
    if (this.filters.startDateFrom) filterTexts.push(`من تاريخ البدء: ${this.filters.startDateFrom}`);
    if (this.filters.startDateTo) filterTexts.push(`إلى تاريخ البدء: ${this.filters.startDateTo}`);
    if (this.filters.endDateFrom) filterTexts.push(`من تاريخ الانتهاء: ${this.filters.endDateFrom}`);
    if (this.filters.endDateTo) filterTexts.push(`إلى تاريخ الانتهاء: ${this.filters.endDateTo}`);
    if (this.quickSearch) filterTexts.push(`بحث: ${this.quickSearch}`);

    let tableRows = '';
    dataToPrint.forEach((item: any, index: number) => {
      const activeStyle = item.isActive 
        ? 'background-color: #d1fae5; color: #065f46; font-weight: 600; border-radius: 20px; padding: 4px 12px; display: inline-block;'
        : 'background-color: #fee2e2; color: #991b1b; font-weight: 600; border-radius: 20px; padding: 4px 12px; display: inline-block;';
      
      let enrollmentStatusStyle = '';
      const statusId = item.enrollmentStatus?.id;
      if (statusId === 1) {
        enrollmentStatusStyle = 'background-color: #d1fae5; color: #065f46; font-weight: 600; border-radius: 20px; padding: 4px 12px; display: inline-block;';
      } else if (statusId === 2) {
        enrollmentStatusStyle = 'background-color: #dbeafe; color: #1e40af; font-weight: 600; border-radius: 20px; padding: 4px 12px; display: inline-block;';
      } else if (statusId === 3) {
        enrollmentStatusStyle = 'background-color: #fee2e2; color: #991b1b; font-weight: 600; border-radius: 20px; padding: 4px 12px; display: inline-block;';
      } else {
        enrollmentStatusStyle = 'background-color: #f3f4f6; color: #6b7280; font-weight: 600; border-radius: 20px; padding: 4px 12px; display: inline-block;';
      }
      
      let paymentStatusStyle = '';
      const paymentId = item.paymentStatus?.id;
      if (paymentId === 1) {
        paymentStatusStyle = 'background-color: #d1fae5; color: #065f46; font-weight: 600; border-radius: 20px; padding: 4px 12px; display: inline-block;';
      } else if (paymentId === 2) {
        paymentStatusStyle = 'background-color: #fef3c7; color: #92400e; font-weight: 600; border-radius: 20px; padding: 4px 12px; display: inline-block;';
      } else if (paymentId === 3) {
        paymentStatusStyle = 'background-color: #fee2e2; color: #991b1b; font-weight: 600; border-radius: 20px; padding: 4px 12px; display: inline-block;';
      } else {
        paymentStatusStyle = 'background-color: #f3f4f6; color: #6b7280; font-weight: 600; border-radius: 20px; padding: 4px 12px; display: inline-block;';
      }
      
      const rowBgColor = index % 2 === 0 ? '#ffffff' : '#f8fafc';
      const traineeName = this.getTraineeName(item.trainee);
      
      tableRows += `
        <tr style="background-color: ${rowBgColor};">
          <td style="text-align: center; padding: 10px 12px; border: 1px solid #e2e8f0; font-weight: 600; color: #64748b;">${index + 1}</td>
          <td style="text-align: right; padding: 10px 12px; border: 1px solid #e2e8f0; font-weight: 700; color: #0f3460;">${traineeName}</td>
          <td style="text-align: right; padding: 10px 12px; border: 1px solid #e2e8f0; color: #1e293b;">${item.course?.title || '-'}</td>
          <td style="text-align: right; padding: 10px 12px; border: 1px solid #e2e8f0; color: #1e293b;">${item.trainer?.title || '-'}</td>
          <td style="text-align: center; padding: 10px 12px; border: 1px solid #e2e8f0; color: #1e293b;">${item.startDate || '-'}</td>
          <td style="text-align: center; padding: 10px 12px; border: 1px solid #e2e8f0; color: #1e293b;">${item.endDate || '-'}</td>
          <td style="text-align: center; padding: 10px 12px; border: 1px solid #e2e8f0;">
            <span style="${activeStyle}">${item.isActive ? 'نشط' : 'غير نشط'}</span>
          </td>
          <td style="text-align: center; padding: 10px 12px; border: 1px solid #e2e8f0;">
            <span style="${enrollmentStatusStyle}">${item.enrollmentStatus?.title || '-'}</span>
          </td>
          <td style="text-align: center; padding: 10px 12px; border: 1px solid #e2e8f0;">
            <span style="${paymentStatusStyle}">${item.paymentStatus?.title || '-'}</span>
          </td>
          <td style="text-align: center; padding: 10px 12px; border: 1px solid #e2e8f0; font-weight: 700; color: #0f3460; font-size: 15px;">
            ${(item.finalSubscriptionValue || 0).toLocaleString('ar-EG')} جم
          </td>
        </tr>
      `;
    });

    const printContainer = document.createElement('div');
    printContainer.style.direction = 'rtl';
    printContainer.style.fontFamily = 'Cairo, "Segoe UI", Tahoma, sans-serif';
    printContainer.style.padding = '20px';
    printContainer.style.backgroundColor = '#f0f4f8';
    printContainer.style.maxWidth = '1200px';
    printContainer.style.margin = '0 auto';
    
    printContainer.innerHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>تقرير التسجيلات</title>
        <style>
          * { 
            font-family: 'Cairo', 'Segoe UI', Tahoma, sans-serif; 
            box-sizing: border-box;
          }
          @media print {
            body { 
              margin: 0; 
              padding: 20px; 
              background: #f0f4f8;
            }
            .no-print { display: none; }
            .header { 
              -webkit-print-color-adjust: exact; 
              print-color-adjust: exact;
            }
          }
          .header {
            text-align: center;
            margin-bottom: 25px;
            padding: 30px 20px;
            background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
            color: white;
            border-radius: 16px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
          }
          .header h1 { 
            margin: 0; 
            font-size: 28px; 
            font-weight: 800;
            letter-spacing: -0.5px;
          }
          .header p { 
            margin: 8px 0 0; 
            font-size: 14px; 
            opacity: 0.85;
            font-weight: 300;
          }
          .filters {
            margin-bottom: 20px;
            padding: 14px 20px;
            background: #ffffff;
            border-radius: 12px;
            font-size: 13px;
            color: #1e293b;
            border: 1px solid #e2e8f0;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
          }
          .filters strong {
            color: #0f3460;
            margin-left: 8px;
          }
          .stats {
            display: grid;
            grid-template-columns: repeat(5, 1fr);
            gap: 16px;
            margin-bottom: 24px;
          }
          .stat-item {
            text-align: center;
            padding: 16px 12px;
            background: white;
            border-radius: 14px;
            border: 1px solid #e2e8f0;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
          }
          .stat-value { 
            font-size: 24px; 
            font-weight: 800; 
            color: #0f3460;
            display: block;
          }
          .stat-label { 
            font-size: 13px; 
            color: #64748b; 
            margin-top: 4px;
            font-weight: 500;
          }
          .stat-item.green .stat-value { color: #059669; }
          .stat-item.blue .stat-value { color: #2563eb; }
          .stat-item.amber .stat-value { color: #d97706; }
          .stat-item.purple .stat-value { color: #7c3aed; }
          .stat-item.red .stat-value { color: #dc2626; }
          
          table {
            width: 100%;
            border-collapse: collapse;
            direction: rtl;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
          }
          th {
            background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
            color: white;
            padding: 14px 12px;
            border: none;
            text-align: center;
            font-weight: 700;
            font-size: 13px;
            letter-spacing: 0.3px;
            text-transform: uppercase;
          }
          td {
            padding: 10px 12px;
            border: 1px solid #e2e8f0;
          }
          .footer {
            text-align: center;
            margin-top: 25px;
            padding: 16px;
            font-size: 11px;
            color: #94a3b8;
            background: white;
            border-radius: 12px;
            border: 1px solid #e2e8f0;
          }
          .footer strong {
            color: #0f3460;
          }
          .total-row td {
            font-weight: 700;
            background: #f8fafc;
            border-top: 2px solid #0f3460;
          }
          .total-row .amount {
            color: #0f3460;
            font-size: 16px;
          }
          .no-print {
            text-align: center;
            margin-top: 20px;
            padding: 10px;
          }
          .no-print button {
            padding: 12px 32px;
            background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
            color: white;
            border: none;
            border-radius: 12px;
            cursor: pointer;
            font-size: 16px;
            font-weight: 600;
            transition: all 0.3s;
          }
          .no-print button:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(15, 52, 96, 0.3);
          }
          @media (max-width: 768px) {
            .stats {
              grid-template-columns: repeat(3, 1fr);
            }
            .header h1 { font-size: 22px; }
          }
          @media (max-width: 480px) {
            .stats {
              grid-template-columns: repeat(2, 1fr);
            }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>📋 تقرير التسجيلات</h1>
          <p>تاريخ التقرير: ${new Date().toLocaleDateString('ar-EG')}</p>
          <p style="opacity: 0.7; font-size: 13px;">عدد السجلات: ${dataToPrint.length} تسجيل</p>
        </div>
        
        ${filterTexts.length > 0 ? `<div class="filters"><strong>🔍 الفلاتر المطبقة:</strong> ${filterTexts.join(' | ')}</div>` : ''}
        
        <div class="stats">
          <div class="stat-item purple">
            <span class="stat-value">${dataToPrint.length}</span>
            <span class="stat-label">📋 إجمالي التسجيلات</span>
          </div>
          <div class="stat-item blue">
            <span class="stat-value">${dataToPrint.reduce((sum, item) => sum + (item.finalSubscriptionValue || 0), 0).toLocaleString('ar-EG')} جم</span>
            <span class="stat-label">💰 إجمالي المبالغ</span>
          </div>
          <div class="stat-item amber">
            <span class="stat-value">${dataToPrint.filter(item => item.paymentStatus?.id === 1).length}</span>
            <span class="stat-label">💳 مدفوع</span>
          </div>
          <div class="stat-item green">
            <span class="stat-value">${dataToPrint.filter(item => item.isActive === true).length}</span>
            <span class="stat-label">🟢 نشط</span>
          </div>
          <div class="stat-item red">
            <span class="stat-value">${dataToPrint.filter(item => item.isActive === false).length}</span>
            <span class="stat-label">🔴 غير نشط</span>
          </div>
        </div>
        
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>المتدرب</th>
              <th>الدورة</th>
              <th>المدرب</th>
              <th>تاريخ البدء</th>
              <th>تاريخ الانتهاء</th>
              <th>الحالة</th>
              <th>حالة التسجيل</th>
              <th>حالة الدفع</th>
              <th>المبلغ</th>
            </tr>
          </thead>
          <tbody>
            ${tableRows}
            <tr class="total-row">
              <td colspan="9" style="text-align: left; font-weight: 700; color: #0f3460; font-size: 14px;">
                الإجمالي الكلي
              </td>
              <td style="text-align: center; font-weight: 700; color: #0f3460; font-size: 16px;">
                ${dataToPrint.reduce((sum, item) => sum + (item.finalSubscriptionValue || 0), 0).toLocaleString('ar-EG')} جم
              </td>
            </tr>
          </tbody>
        </table>
        
        <div class="footer">
          <strong>🏛️ نظام إدارة الأكاديمية الأولمبية</strong><br>
          تم التصدير بواسطة النظام الآلي للأكاديمية الأولمبية
        </div>
        
        <div class="no-print">
          <button onclick="window.print();">
            🖨️ طباعة / حفظ كـ PDF
          </button>
        </div>
      </body>
      </html>
    `;

    const printWindow = window.open('', '_blank', 'width=1200,height=900,scrollbars=yes');
    if (printWindow) {
      printWindow.document.write(printContainer.innerHTML);
      printWindow.document.close();
      this.isLoading = false;
      this.notification.showSuccess(`تم فتح التقرير - ${dataToPrint.length} سجل`);
    } else {
      document.body.appendChild(printContainer);
      window.print();
      setTimeout(() => {
        document.body.removeChild(printContainer);
      }, 500);
      this.isLoading = false;
      this.notification.showSuccess(`تم فتح التقرير - ${dataToPrint.length} سجل`);
    }
  }

  getPaymentStatusClass(statusId: number): string {
    const classes: { [key: number]: string } = {
      1: 'paid',
      2: 'partial',
      3: 'unpaid'
    };
    return classes[statusId] || 'unpaid';
  }

  getEnrollmentStatusClass(statusId: number): string {
    const classes: { [key: number]: string } = {
      1: 'active',
      2: 'completed',
      3: 'cancelled'
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