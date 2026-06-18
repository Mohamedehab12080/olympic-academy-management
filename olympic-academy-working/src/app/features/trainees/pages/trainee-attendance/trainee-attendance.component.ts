// trainee-attendance.component.ts

import { Component, OnInit, ViewChild, Inject, ElementRef, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatDialogModule, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';

import { TraineeAttendanceService } from '../../../../core/services/trainee-attendance.service';
import { CourseService } from '../../../../core/services/course.service';
import { CourseSessionService } from '../../../../core/services/course-session.service';
import { EnrollmentService } from '../../../../core/services/enrollment.service';
import { TraineeService } from '../../../../core/services/trainee.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { ReportService } from '../../../../core/services/report.service';
import { SearchableSelectComponent, SelectOption } from '../../../../shared/components/searchable-select/searchable-select.component';
import { TRAINEE_ATTENDANCE_STATUSES, TraineeAttendanceListItem, TraineeAttendanceVTO } from '../../../../core/models/trainee-attendance.model';
import { TraineeAttendanceDetailsModalComponent } from './trainee-attendance-details/trainee-attendance-details-modal.component';
import { EnrollmentListItem } from '../../../../core/models/enrollment.model';

// ============================================================================
// CONSTANTS
// ============================================================================

const STATUS_ENUM_MAP: { [key: number]: string } = {
  1: 'PRESENT',
  2: 'ABSENT',
  3: 'LATE',
  4: 'EXCUSED'
};

// ============================================================================
// TIME CONVERSION HELPER
// ============================================================================

export function convertTo12HourFormat(timeStr: string | undefined | null): string {
  if (!timeStr) return '-';
  
  // If time already contains AM/PM or Arabic indicators, return as is
  if (timeStr.includes('AM') || timeStr.includes('PM') || timeStr.includes('ص') || timeStr.includes('م')) {
    return timeStr;
  }
  
  try {
    // Handle HH:mm:ss or HH:mm format
    const parts = timeStr.split(':');
    if (parts.length < 2) return timeStr;
    
    let hours = parseInt(parts[0], 10);
    const minutes = parts[1];
    const seconds = parts.length > 2 ? parts[2] : '';
    
    if (isNaN(hours)) return timeStr;
    
    const ampm = hours >= 12 ? 'م' : 'ص';
    const hours12 = hours % 12 || 12;
    const timeStr12 = `${hours12}:${minutes}${seconds ? ':' + seconds : ''} ${ampm}`;
    
    return timeStr12;
  } catch (error) {
    return timeStr;
  }
}

// ============================================================================
// TRAINEE SELECTION DIALOG
// ============================================================================

@Component({
  selector: 'app-trainee-selection-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatListModule
  ],
  template: `
    <h2 mat-dialog-title>اختر المتدرب</h2>
    <mat-dialog-content>
      <p>تم العثور على عدة متدربين. الرجاء اختيار المتدرب المناسب:</p>
      <mat-list>
        <mat-list-item *ngFor="let trainee of data.trainees" (click)="selectTrainee(trainee)" class="trainee-item">
          <mat-icon mat-list-icon>person</mat-icon>
          <div mat-line><strong>{{ trainee.title || trainee.fullName }}</strong></div>
          <div mat-line class="trainee-detail">رقم الهوية: {{ trainee.nationalId }}</div>
          <button mat-raised-button color="primary" (click)="selectTrainee(trainee); $event.stopPropagation()">
            اختر
          </button>
        </mat-list-item>
      </mat-list>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>إلغاء</button>
    </mat-dialog-actions>
  `,
  styles: [`
    .trainee-item {
      cursor: pointer;
      transition: background-color 0.2s;
      border-radius: 8px;
      margin-bottom: 4px;
      display: flex !important;
      justify-content: space-between !important;
      align-items: center !important;
      padding: 8px 12px !important;
    }
    .trainee-item:hover {
      background-color: #f3e8ff;
    }
    .trainee-detail {
      color: #6b7280;
      font-size: 12px;
    }
  `]
})
export class TraineeSelectionDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<TraineeSelectionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { trainees: any[] }
  ) {}

  selectTrainee(trainee: any): void {
    this.dialogRef.close(trainee);
  }
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

@Component({
  selector: 'app-trainee-attendance',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatSelectModule,
    MatTableModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    MatSortModule,
    MatDialogModule,
    MatChipsModule,
    MatTooltipModule,
    MatDividerModule,
    MatListModule,
    SearchableSelectComponent,
    TraineeAttendanceDetailsModalComponent,
    TraineeSelectionDialogComponent
  ],
  templateUrl: './trainee-attendance.component.html',
  styleUrls: ['./trainee-attendance.component.css']
})
export class TraineeAttendanceComponent implements OnInit, AfterViewInit {

  // ==========================================================================
  // PROPERTIES
  // ==========================================================================

  displayedColumns: string[] = ['index', 'traineeName', 'courseTitle', 'sessionTitle', 'sessionDate', 'status', 'checkInTime', 'checkOutTime', 'lateTime', 'actions'];
  dataSource = new MatTableDataSource<TraineeAttendanceListItem>([]);
  isLoading = false;

  // Data stores
  courses: any[] = [];
  sessions: any[] = [];
  trainees: any[] = [];

  // Filters
  selectedCourseId: number | null = null;
  selectedSessionId: number | null = null;
  selectedStatus: number | null = null;
  fromDate: string = '';
  toDate: string = '';

  // Barcode
  barcodeSearch: string = '';
  isBarcodeMode: boolean = false;

  // Options
  attendanceStatuses = TRAINEE_ATTENDANCE_STATUSES;
  courseOptions: SelectOption[] = [];
  sessionOptions: SelectOption[] = [];
  statusOptions: SelectOption[] = [];

  // Form
  attendanceForm: FormGroup;
  editMode = false;
  editId: number | null = null;

  // Stats
  summaryStats = {
    total: 0,
    present: 0,
    absent: 0,
    late: 0,
    excused: 0,
    attendanceRate: 0
  };

  // View children
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('barcodeInput') barcodeInput!: ElementRef<HTMLInputElement>;

  // ==========================================================================
  // CONSTRUCTOR
  // ==========================================================================

  constructor(
    private traineeAttendanceService: TraineeAttendanceService,
    private courseService: CourseService,
    private courseSessionService: CourseSessionService,
    private enrollmentService: EnrollmentService,
    private traineeService: TraineeService,
    private notification: NotificationService,
    private reportService: ReportService,
    private dialog: MatDialog,
    private fb: FormBuilder
  ) {
    this.attendanceForm = this.fb.group({
      traineeId: [null, Validators.required],
      courseSessionId: [null, Validators.required],
      status: [null, Validators.required],
      attendanceDate: [new Date().toISOString().split('T')[0]],
      checkInTime: [''],
      checkOutTime: [''],
      lateTime: [null],
      note: ['']
    });
  }

  // ==========================================================================
  // LIFECYCLE HOOKS
  // ==========================================================================

  ngOnInit(): void {
    this.loadSelectOptions();
    this.loadCourses();
    this.loadTrainees();
    this.loadAttendances();
  }

  ngAfterViewInit(): void {
    if (this.barcodeInput) {
      this.barcodeInput.nativeElement.focus();
    }
  }

  // ==========================================================================
  // TIME CONVERSION HELPER (public for template use)
  // ==========================================================================

  convertTo12HourFormat(timeStr: string | undefined | null): string {
    return convertTo12HourFormat(timeStr);
  }

  // ==========================================================================
  // INITIALIZATION METHODS
  // ==========================================================================

  private loadSelectOptions(): void {
    this.statusOptions = [
      { value: null, label: 'الكل' },
      ...this.attendanceStatuses.map(s => ({ value: s.id, label: s.title }))
    ];
  }

  private loadCourses(): void {
    this.courseService.getAllCourses().subscribe({
      next: (res: any) => {
        this.courses = res.items || [];
        this.courseOptions = [
          { value: null, label: 'الكل' },
          ...this.courses.map(c => ({ value: c.id, label: c.title }))
        ];
      },
      error: () => this.notification.showError('حدث خطأ في تحميل الدورات')
    });
  }

  private loadTrainees(): void {
    this.enrollmentService.getAllEnrollmentsByFilter().subscribe({
      next: (res: any) => {
        const uniqueTrainees = new Map();
        const items: EnrollmentListItem[] = res.items || [];
        items.forEach((e: EnrollmentListItem) => {
          if (e.trainee && !uniqueTrainees.has(e.trainee.id)) {
            uniqueTrainees.set(e.trainee.id, e.trainee);
          }
        });
        this.trainees = Array.from(uniqueTrainees.values());
      },
      error: () => this.notification.showError('حدث خطأ في تحميل المتدربين')
    });
  }

  // ==========================================================================
  // BARCODE SEARCH
  // ==========================================================================

  searchTraineeByBarcode(): void {
    if (!this.barcodeSearch?.trim()) {
      this.notification.showWarning('الرجاء إدخال رقم الباركود');
      return;
    }

    this.isLoading = true;
    const searchValue = this.barcodeSearch.trim();

    this.traineeService.getAllTraineesByFilter({ quickSearch: searchValue }).subscribe({
      next: (res: any) => {
        const foundTrainees = res.items || [];
        this.isLoading = false;

        if (foundTrainees.length === 0) {
          this.notification.showError('لم يتم العثور على متدرب بهذا الرقم');
          return;
        }

        // Find exact match by national ID
        const exactMatch = foundTrainees.find((t: any) => t.nationalId === searchValue);

        if (exactMatch) {
          this.openAttendanceDialogWithTrainee(exactMatch);
          this.clearBarcodeSearch();
          this.notification.showSuccess(`تم العثور على المتدرب: ${exactMatch.title || exactMatch.fullName}`);
          return;
        }

        // Multiple matches - show selection dialog
        if (foundTrainees.length > 1) {
          this.showTraineeSelectionDialog(foundTrainees);
          this.clearBarcodeSearch();
          return;
        }

        // Single match
        const trainee = foundTrainees[0];
        this.openAttendanceDialogWithTrainee(trainee);
        this.clearBarcodeSearch();
        this.notification.showSuccess(`تم العثور على المتدرب: ${trainee.title || trainee.fullName}`);
      },
      error: () => {
        this.isLoading = false;
        this.notification.showError('حدث خطأ في البحث عن المتدرب');
      }
    });
  }

  private showTraineeSelectionDialog(trainees: any[]): void {
    const dialogRef = this.dialog.open(TraineeSelectionDialogComponent, {
      width: '500px',
      maxWidth: '90vw',
      data: { trainees }
    });

    dialogRef.afterClosed().subscribe((selected: any) => {
      if (selected) {
        this.openAttendanceDialogWithTrainee(selected);
        this.notification.showSuccess(`تم اختيار المتدرب: ${selected.title || selected.fullName}`);
      }
    });
  }

  private clearBarcodeSearch(): void {
    this.barcodeSearch = '';
    this.isBarcodeMode = false;
  }

  onBarcodeKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.searchTraineeByBarcode();
    }
  }

  toggleBarcodeMode(): void {
    this.isBarcodeMode = !this.isBarcodeMode;
    if (this.isBarcodeMode) {
      setTimeout(() => this.barcodeInput?.nativeElement.focus(), 100);
    } else {
      this.barcodeSearch = '';
    }
  }

  // ==========================================================================
  // SESSION LOADING
  // ==========================================================================

  loadTraineeSessions(traineeId: number): void {
    this.isLoading = true;

    this.enrollmentService.getAllEnrollmentsByFilter({ traineeId }).subscribe({
      next: (res: any) => {
        const items: EnrollmentListItem[] = res.items || [];

        if (items.length === 0) {
          this.setEmptySessions('هذا المتدرب غير مسجل في أي دورة');
          return;
        }

        const courseIds = items
          .map((e: EnrollmentListItem) => e.course?.id)
          .filter((id: any) => id && id > 0);

        if (courseIds.length === 0) {
          this.setEmptySessions('لا توجد دورات صالحة لهذا المتدرب');
          return;
        }

        this.loadSessionsForCourses(courseIds);
      },
      error: () => {
        this.notification.showError('حدث خطأ في تحميل تسجيلات المتدرب');
        this.isLoading = false;
        this.updateDialogSessions();
      }
    });
  }

  private loadSessionsForCourses(courseIds: number[]): void {
    let allSessions: any[] = [];
    let completed = 0;

    courseIds.forEach((courseId: number) => {
      this.courseSessionService.getAllCourseSessionsByFilter(courseId).subscribe({
        next: (res: any) => {
          const sessions = res.items || [];
          allSessions = [...allSessions, ...sessions];
          completed++;

          if (completed === courseIds.length) {
            this.setSessions(allSessions);
          }
        },
        error: () => {
          completed++;
          if (completed === courseIds.length) {
            this.setSessions(allSessions);
          }
        }
      });
    });
  }

  private setSessions(sessions: any[]): void {
    this.sessions = sessions;
    this.sessionOptions = this.sessions.map((s: any) => ({
      value: s.id,
      label: `${s.title} - ${s.sessionDate ? new Date(s.sessionDate).toLocaleDateString('ar-EG') : ''}`
    }));
    this.isLoading = false;
    this.updateDialogSessions();

    if (this.sessions.length === 0) {
      this.notification.showWarning('لا توجد جلسات متاحة لهذا المتدرب');
    }
  }

  private setEmptySessions(message: string): void {
    this.sessions = [];
    this.sessionOptions = [];
    this.isLoading = false;
    this.notification.showWarning(message);
    this.updateDialogSessions();
  }

  private updateDialogSessions(): void {
    const openDialogs = this.dialog.openDialogs;
    if (openDialogs?.length) {
      const dialogComponent = openDialogs[0].componentInstance as TraineeAttendanceDialogComponent;
      if (dialogComponent?.updateSessions) {
        dialogComponent.updateSessions([...this.sessions], [...this.sessionOptions]);
      }
    }
  }

  // ==========================================================================
  // DIALOG MANAGEMENT
  // ==========================================================================

  openAttendanceDialog(attendanceId?: number): void {
    this.editMode = !!attendanceId;
    this.editId = attendanceId || null;

    if (this.editMode && attendanceId) {
      this.traineeAttendanceService.getAttendanceById(attendanceId).subscribe({
        next: (res: any) => {
          const statusEnumName = STATUS_ENUM_MAP[res.status?.id] || res.status;
          this.attendanceForm.patchValue({
            traineeId: res.trainee?.id,
            courseSessionId: res.session?.id,
            status: statusEnumName,
            attendanceDate: res.attendanceDate,
            checkInTime: res.checkInTime ? convertTo12HourFormat(res.checkInTime) : '',
            checkOutTime: res.checkOutTime ? convertTo12HourFormat(res.checkOutTime) : '',
            lateTime: res.lateTime,
            note: res.note
          });

          if (res.trainee?.id) {
            this.loadTraineeSessionsForEdit(res.trainee.id);
          } else {
            this.openDialog();
          }
        },
        error: () => this.notification.showError('حدث خطأ في تحميل البيانات')
      });
      return;
    }

    this.attendanceForm.reset({
      traineeId: null,
      courseSessionId: null,
      status: null,
      attendanceDate: new Date().toISOString().split('T')[0],
      checkInTime: '',
      checkOutTime: '',
      lateTime: null,
      note: ''
    });
    this.sessions = [];
    this.sessionOptions = [];
    this.openDialog();
  }

  openAttendanceDialogWithTrainee(trainee: any): void {
    this.editMode = false;
    this.editId = null;

    this.attendanceForm.reset({
      traineeId: trainee.id,
      courseSessionId: null,
      status: null,
      attendanceDate: new Date().toISOString().split('T')[0],
      checkInTime: '',
      checkOutTime: '',
      lateTime: null,
      note: ''
    });

    this.sessions = [];
    this.sessionOptions = [];
    this.openDialog();
    this.loadTraineeSessions(trainee.id);
  }

  private loadTraineeSessionsForEdit(traineeId: number): void {
    this.enrollmentService.getAllEnrollmentsByFilter({ traineeId }).subscribe({
      next: (res: any) => {
        const items: EnrollmentListItem[] = res.items || [];
        const courseIds = items
          .map((e: EnrollmentListItem) => e.course?.id)
          .filter((id: any) => id && id > 0);

        if (courseIds.length === 0) {
          this.sessions = [];
          this.sessionOptions = [];
          this.openDialog();
          return;
        }

        let allSessions: any[] = [];
        let completed = 0;

        courseIds.forEach((courseId: number) => {
          this.courseSessionService.getAllCourseSessionsByFilter(courseId).subscribe({
            next: (res2: any) => {
              const sessions = res2.items || [];
              allSessions = [...allSessions, ...sessions];
              completed++;

              if (completed === courseIds.length) {
                this.sessions = allSessions;
                this.sessionOptions = this.sessions.map((s: any) => ({
                  value: s.id,
                  label: `${s.title} - ${s.sessionDate ? new Date(s.sessionDate).toLocaleDateString('ar-EG') : ''}`
                }));
                this.updateDialogSessions();
                this.openDialog();
              }
            },
            error: () => {
              completed++;
              if (completed === courseIds.length) {
                this.sessions = allSessions;
                this.sessionOptions = this.sessions.map((s: any) => ({
                  value: s.id,
                  label: `${s.title} - ${s.sessionDate ? new Date(s.sessionDate).toLocaleDateString('ar-EG') : ''}`
                }));
                this.updateDialogSessions();
                this.openDialog();
              }
            }
          });
        });
      },
      error: () => {
        this.sessions = [];
        this.sessionOptions = [];
        this.openDialog();
      }
    });
  }

  private openDialog(): void {
    const dialogRef = this.dialog.open(TraineeAttendanceDialogComponent, {
      width: '700px',
      maxWidth: '95vw',
      disableClose: true,
      data: {
        form: this.attendanceForm,
        trainees: this.trainees,
        sessions: this.sessions,
        sessionOptions: this.sessionOptions,
        attendanceStatuses: this.attendanceStatuses,
        editMode: this.editMode,
        title: this.editMode ? 'تعديل سجل حضور' : 'تسجيل حضور جديد',
        loadSessionsFn: (traineeId: number) => this.loadTraineeSessions(traineeId)
      }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        const serviceCall = this.editMode
          ? this.traineeAttendanceService.updateAttendance(this.editId!, result)
          : this.traineeAttendanceService.createAttendance(result);

        serviceCall.subscribe({
          next: () => {
            this.notification.showSuccess(
              this.editMode ? 'تم تحديث سجل الحضور بنجاح' : 'تم إضافة سجل الحضور بنجاح'
            );
            this.loadAttendances();
          },
          error: (err) => this.notification.showError(err.error?.messageEn || 'حدث خطأ في حفظ سجل الحضور')
        });
      }
    });
  }

  // ==========================================================================
  // ATTENDANCE CRUD
  // ==========================================================================

  loadAttendances(): void {
    this.isLoading = true;
    const params: any = {};

    if (this.selectedSessionId) params.courseSessionId = this.selectedSessionId;
    if (this.selectedStatus) params.status = this.selectedStatus;
    if (this.fromDate) params.fromDate = this.fromDate;
    if (this.toDate) params.toDate = this.toDate;

    this.traineeAttendanceService.getAllAttendances(params).subscribe({
      next: (res: any) => {
        this.dataSource.data = res.items || [];
        if (this.dataSource.paginator) this.dataSource.paginator = this.paginator;
        if (this.dataSource.sort) this.dataSource.sort = this.sort;
        this.calculateSummary();
        this.isLoading = false;
      },
      error: () => {
        this.notification.showError('حدث خطأ في تحميل بيانات الحضور');
        this.isLoading = false;
      }
    });
  }

  private calculateSummary(): void {
    const data = this.dataSource.data;
    const total = data.length;
    const present = data.filter(a => a.status?.id === 1).length;

    this.summaryStats = {
      total,
      present,
      absent: data.filter(a => a.status?.id === 2).length,
      late: data.filter(a => a.status?.id === 3).length,
      excused: data.filter(a => a.status?.id === 4).length,
      attendanceRate: total > 0 ? Math.round((present / total) * 100) : 0
    };
  }

  viewAttendance(id: number): void {
    this.traineeAttendanceService.getAttendanceById(id).subscribe({
      next: (attendance: TraineeAttendanceVTO) => {
        // Convert times to 12-hour format before passing to modal
        const formattedAttendance = {
          ...attendance,
          checkInTime: convertTo12HourFormat(attendance.checkInTime),
          checkOutTime: convertTo12HourFormat(attendance.checkOutTime)
        };
        this.dialog.open(TraineeAttendanceDetailsModalComponent, {
          data: formattedAttendance,
          width: '650px',
          maxWidth: '90vw'
        });
      },
      error: () => this.notification.showError('حدث خطأ في تحميل بيانات سجل الحضور')
    });
  }

  deleteAttendance(id: number): void {
    if (confirm('هل أنت متأكد من حذف سجل الحضور؟')) {
      this.traineeAttendanceService.deleteAttendance(id).subscribe({
        next: () => {
          this.notification.showSuccess('تم حذف سجل الحضور بنجاح');
          this.loadAttendances();
        },
        error: () => this.notification.showError('حدث خطأ في حذف سجل الحضور')
      });
    }
  }

  // ==========================================================================
  // FILTERS
  // ==========================================================================

  onCourseChange(): void {
    if (this.selectedCourseId) {
      this.courseSessionService.getAllCourseSessionsByFilter(this.selectedCourseId).subscribe({
        next: (res: any) => {
          this.sessions = res.items || [];
          this.sessionOptions = [
            { value: null, label: 'الكل' },
            ...this.sessions.map(s => ({
              value: s.id,
              label: `${s.title} - ${s.sessionDate ? new Date(s.sessionDate).toLocaleDateString('ar-EG') : ''}`
            }))
          ];
          this.updateDialogSessions();
        },
        error: () => this.notification.showError('حدث خطأ في تحميل الجلسات')
      });
    } else {
      this.sessions = [];
      this.sessionOptions = [{ value: null, label: 'الكل' }];
      this.selectedSessionId = null;
      this.loadAttendances();
      this.updateDialogSessions();
    }
  }

  resetFilters(): void {
    this.selectedCourseId = null;
    this.selectedSessionId = null;
    this.selectedStatus = null;
    this.fromDate = '';
    this.toDate = '';
    this.sessions = [];
    this.sessionOptions = [{ value: null, label: 'الكل' }];
    this.barcodeSearch = '';
    this.isBarcodeMode = false;
    this.loadAttendances();
    this.updateDialogSessions();
    this.notification.showSuccess('تم مسح جميع الفلاتر');
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) this.dataSource.paginator.firstPage();
  }

  // ==========================================================================
  // EXPORTS
  // ==========================================================================

  exportToExcel(): void {
    if (this.dataSource.data.length === 0) {
      this.notification.showWarning('لا توجد بيانات لتصديرها');
      return;
    }

    const exportData = this.dataSource.data.map((item, index) => ({
      '#': index + 1,
      'المتدرب': item.traineeName,
      'الدورة': item.courseTitle,
      'الجلسة': item.sessionTitle,
      'تاريخ الجلسة': item.sessionDate,
      'حالة الحضور': item.status?.title,
      'وقت الدخول': convertTo12HourFormat(item.checkInTime) || '-',
      'وقت الخروج': convertTo12HourFormat(item.checkOutTime) || '-',
      'وقت التأخير': item.lateTime ? `${item.lateTime} دقيقة` : '-'
    }));

    this.reportService.exportToExcel(exportData, 'trainee-attendance', 'سجلات الحضور');
    this.notification.showSuccess('تم تصدير البيانات بنجاح');
  }

  exportToPDF(): void {
    if (this.dataSource.data.length === 0) {
      this.notification.showWarning('لا توجد بيانات لتصديرها');
      return;
    }

    this.isLoading = true;

    const filterTexts: string[] = [];
    if (this.selectedCourseId) {
      const course = this.courses.find(c => c.id === this.selectedCourseId);
      if (course) filterTexts.push(`الدورة: ${course.title}`);
    }
    if (this.selectedSessionId) {
      const session = this.sessions.find(s => s.id === this.selectedSessionId);
      if (session) filterTexts.push(`الجلسة: ${session.title}`);
    }
    if (this.selectedStatus) {
      const status = this.attendanceStatuses.find(s => s.id === this.selectedStatus);
      if (status) filterTexts.push(`حالة الحضور: ${status.title}`);
    }
    if (this.fromDate) filterTexts.push(`من تاريخ: ${this.fromDate}`);
    if (this.toDate) filterTexts.push(`إلى تاريخ: ${this.toDate}`);

    let tableRows = '';
    this.dataSource.data.forEach((item: TraineeAttendanceListItem, index: number) => {
      const statusClass = this.getStatusClass(item.status?.id);
      const statusStyles: { [key: string]: string } = {
        present: 'background-color: #d1fae5; color: #065f46;',
        absent: 'background-color: #fee2e2; color: #991b1b;',
        late: 'background-color: #fef3c7; color: #92400e;',
        excused: 'background-color: #dbeafe; color: #1e40af;'
      };
      const statusStyle = statusStyles[statusClass] || '';

      const checkInFormatted = convertTo12HourFormat(item.checkInTime);
      const checkOutFormatted = convertTo12HourFormat(item.checkOutTime);

      tableRows += `
        <tr style="background-color: ${index % 2 === 0 ? '#ffffff' : '#f8fafc'};">
          <td style="text-align: center; padding: 8px; border: 1px solid #ddd;">${index + 1}</td>
          <td style="text-align: right; padding: 8px; border: 1px solid #ddd; font-weight: bold;">${item.traineeName || '-'}</td>
          <td style="text-align: right; padding: 8px; border: 1px solid #ddd;">${item.courseTitle || '-'}</td>
          <td style="text-align: right; padding: 8px; border: 1px solid #ddd;">${item.sessionTitle || '-'}</td>
          <td style="text-align: center; padding: 8px; border: 1px solid #ddd;">${item.sessionDate || '-'}</td>
          <td style="text-align: center; padding: 8px; border: 1px solid #ddd; ${statusStyle}">
            ${item.status?.title || '-'}
          </td>
          <td style="text-align: center; padding: 8px; border: 1px solid #ddd;">${checkInFormatted}</td>
          <td style="text-align: center; padding: 8px; border: 1px solid #ddd;">${checkOutFormatted}</td>
          <td style="text-align: center; padding: 8px; border: 1px solid #ddd;">${item.lateTime ? item.lateTime + ' دقيقة' : '-'}</td>
        </tr>
      `;
    });

    const printContainer = document.createElement('div');
    printContainer.style.direction = 'rtl';
    printContainer.style.fontFamily = 'Cairo, "Segoe UI", Tahoma, sans-serif';
    printContainer.style.padding = '20px';
    printContainer.style.backgroundColor = 'white';
    printContainer.style.maxWidth = '1200px';
    printContainer.style.margin = '0 auto';

    printContainer.innerHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>تقرير حضور المتدربين</title>
        <style>
          * { font-family: 'Cairo', 'Segoe UI', Tahoma, sans-serif; box-sizing: border-box; }
          @media print {
            body { margin: 0; padding: 20px; background: #f0f4f8; }
            .no-print { display: none; }
            .header { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          }
          .header {
            text-align: center;
            margin-bottom: 25px;
            padding: 30px 20px;
            background: linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%);
            color: white;
            border-radius: 16px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.15);
          }
          .header h1 { margin: 0; font-size: 28px; font-weight: 800; }
          .header p { margin: 8px 0 0; font-size: 14px; opacity: 0.85; }
          .filters {
            margin-bottom: 20px;
            padding: 14px 20px;
            background: #ffffff;
            border-radius: 12px;
            font-size: 13px;
            color: #1e293b;
            border: 1px solid #e2e8f0;
          }
          .filters strong { color: #0f3460; margin-left: 8px; }
          .stats {
            display: grid;
            grid-template-columns: repeat(6, 1fr);
            gap: 16px;
            margin-bottom: 24px;
          }
          .stat-item {
            text-align: center;
            padding: 16px 12px;
            background: white;
            border-radius: 14px;
            border: 1px solid #e2e8f0;
            box-shadow: 0 2px 8px rgba(0,0,0,0.04);
          }
          .stat-value { font-size: 24px; font-weight: 800; color: #8b5cf6; display: block; }
          .stat-label { font-size: 13px; color: #64748b; margin-top: 4px; font-weight: 500; }
          .stat-value.present { color: #10b981; }
          .stat-value.absent { color: #ef4444; }
          .stat-value.late { color: #f59e0b; }
          .stat-value.excused { color: #3b82f6; }
          table {
            width: 100%;
            border-collapse: collapse;
            direction: rtl;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 2px 12px rgba(0,0,0,0.06);
          }
          th {
            background: linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%);
            color: white;
            padding: 14px 12px;
            border: none;
            text-align: center;
            font-weight: 700;
            font-size: 13px;
            text-transform: uppercase;
            letter-spacing: 0.3px;
          }
          td { padding: 10px 12px; border: 1px solid #e2e8f0; }
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
          .footer strong { color: #0f3460; }
          .total-row td {
            font-weight: 700;
            background: #f8fafc;
            border-top: 2px solid #8b5cf6;
          }
          .no-print {
            text-align: center;
            margin-top: 20px;
            padding: 10px;
          }
          .no-print button {
            padding: 12px 32px;
            background: linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%);
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
            box-shadow: 0 8px 25px rgba(139,92,246,0.3);
          }
          @media (max-width: 768px) {
            .stats { grid-template-columns: repeat(3, 1fr); }
          }
          @media (max-width: 480px) {
            .stats { grid-template-columns: repeat(2, 1fr); }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>📋 تقرير حضور المتدربين</h1>
          <p>تاريخ التقرير: ${new Date().toLocaleDateString('ar-EG')}</p>
          <p style="opacity:0.7; font-size:13px;">عدد السجلات: ${this.dataSource.data.length} سجل</p>
        </div>
        ${filterTexts.length ? `<div class="filters"><strong>🔍 الفلاتر المطبقة:</strong> ${filterTexts.join(' | ')}</div>` : ''}
        <div class="stats">
          <div class="stat-item"><span class="stat-value">${this.summaryStats.total}</span><span class="stat-label">📋 إجمالي السجلات</span></div>
          <div class="stat-item"><span class="stat-value present">${this.summaryStats.present}</span><span class="stat-label">✅ حاضر</span></div>
          <div class="stat-item"><span class="stat-value absent">${this.summaryStats.absent}</span><span class="stat-label">❌ غائب</span></div>
          <div class="stat-item"><span class="stat-value late">${this.summaryStats.late}</span><span class="stat-label">⏰ متأخر</span></div>
          <div class="stat-item"><span class="stat-value excused">${this.summaryStats.excused}</span><span class="stat-label">📝 معتذر</span></div>
          <div class="stat-item"><span class="stat-value">${this.summaryStats.attendanceRate}%</span><span class="stat-label">📊 نسبة الحضور</span></div>
        </div>
        <table>
          <thead>
            <tr>
              <th>#</th><th>المتدرب</th><th>الدورة</th><th>الجلسة</th>
              <th>تاريخ الجلسة</th><th>الحالة</th><th>وقت الدخول</th>
              <th>وقت الخروج</th><th>وقت التأخير</th>
            </tr>
          </thead>
          <tbody>
            ${tableRows}
            <tr class="total-row">
              <td colspan="9" style="text-align:center; font-weight:700; color:#8b5cf6; font-size:14px;">
                إجمالي عدد السجلات: ${this.dataSource.data.length}
              </td>
            </tr>
          </tbody>
        </table>
        <div class="footer">
          <strong>🏛️ نظام إدارة الأكاديمية الأولمبية</strong><br>
          تم التصدير بواسطة النظام الآلي للأكاديمية الأولمبية
        </div>
        <div class="no-print">
          <button onclick="window.print();">🖨️ طباعة / حفظ كـ PDF</button>
        </div>
      </body>
      </html>
    `;

    const printWindow = window.open('', '_blank', 'width=1200,height=900,scrollbars=yes');
    if (printWindow) {
      printWindow.document.write(printContainer.innerHTML);
      printWindow.document.close();
      this.isLoading = false;
      this.notification.showSuccess('تم فتح التقرير - يمكنك طباعته أو حفظه كـ PDF');
    } else {
      document.body.appendChild(printContainer);
      window.print();
      setTimeout(() => document.body.removeChild(printContainer), 500);
      this.isLoading = false;
      this.notification.showSuccess('تم فتح التقرير - يمكنك حفظه كـ PDF من نافذة الطباعة');
    }
  }

  getStatusClass(statusId: number): string {
    const classes: { [key: number]: string } = {
      1: 'present',
      2: 'absent',
      3: 'late',
      4: 'excused'
    };
    return classes[statusId] || '';
  }
}

// ============================================================================
// ATTENDANCE DIALOG COMPONENT
// ============================================================================

@Component({
  selector: 'app-trainee-attendance-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    SearchableSelectComponent,
    TraineeSelectionDialogComponent
  ],
  template: `
    <div class="dialog-header">
      <div class="dialog-header-content">
        <mat-icon class="header-icon">event_note</mat-icon>
        <h2 mat-dialog-title class="dialog-title">{{ data.title }}</h2>
      </div>
      <button mat-icon-button mat-dialog-close class="dialog-close-btn">
        <mat-icon>close</mat-icon>
      </button>
    </div>

    <mat-divider></mat-divider>

    <mat-dialog-content class="dialog-content">
      <form [formGroup]="data.form" class="dialog-form">

        <!-- Barcode Search -->
        <div class="barcode-search-container">
          <div class="barcode-search-header">
            <mat-icon class="barcode-icon">qr_code_scanner</mat-icon>
            <span class="barcode-title">بحث بالباركود</span>
            <span class="barcode-hint-text">(مسح الباركود أو إدخال رقم الهوية)</span>
          </div>

          <div class="barcode-search-row">
            <mat-form-field appearance="outline" class="barcode-input-field">
              <mat-label>رقم الباركود</mat-label>
              <input #dialogBarcodeInput
                     matInput
                     [(ngModel)]="barcodeSearch"
                     (keydown)="onDialogBarcodeKeydown($event)"
                     placeholder="أدخل رقم الباركود..."
                     [ngModelOptions]="{ standalone: true }">
              <mat-icon matSuffix>qr_code_scanner</mat-icon>
            </mat-form-field>

            <button mat-raised-button color="primary" (click)="searchTraineeInDialog()" class="barcode-search-btn" type="button">
              <mat-icon>search</mat-icon>
              بحث
            </button>

            <button mat-icon-button (click)="clearBarcodeSearch()" matTooltip="مسح" class="barcode-clear-btn" type="button">
              <mat-icon>clear</mat-icon>
            </button>
          </div>

          <div class="barcode-hint" *ngIf="barcodeSearchResult">
            <span class="hint-success" *ngIf="barcodeSearchResult.found">
              <mat-icon>check_circle</mat-icon>
              تم العثور على المتدرب: <strong>{{ barcodeSearchResult.traineeName }}</strong>
            </span>
            <span class="hint-error" *ngIf="barcodeSearchResult.found === false">
              <mat-icon>error</mat-icon>
              {{ barcodeSearchResult.message }}
            </span>
          </div>
        </div>

        <mat-divider></mat-divider>

        <!-- Form Fields -->
        <div class="form-fields-grid">
          <!-- Trainee -->
          <div class="form-field-full">
            <app-searchable-select
              [ngModel]="data.form.get('traineeId')?.value"
              (ngModelChange)="onTraineeChange($event)"
              label="المتدرب *"
              [options]="traineeOptions"
              [required]="true"
              [ngModelOptions]="{ standalone: true }"
              class="full-width-select">
            </app-searchable-select>
          </div>

          <!-- Session -->
          <div class="form-field-full">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>الجلسة *</mat-label>
              <mat-select
                [formControl]="data.form.get('courseSessionId')"
                [disabled]="isLoadingSessions || sessionOptions.length === 0">
                <mat-option *ngFor="let option of sessionOptions" [value]="option.value">
                  {{ option.label }}
                </mat-option>
              </mat-select>
              <mat-icon matSuffix>event</mat-icon>
            </mat-form-field>

            <div *ngIf="isLoadingSessions" class="sessions-loading">
              <mat-spinner diameter="20"></mat-spinner>
              <span>جاري تحميل الجلسات...</span>
            </div>

            <div *ngIf="!isLoadingSessions && sessionOptions.length === 0 && data.form.get('traineeId')?.value" class="no-sessions-message">
              <mat-icon>info</mat-icon>
              <span>لا توجد جلسات متاحة لهذا المتدرب</span>
            </div>
          </div>

          <!-- Status -->
          <div class="form-field-full">
            <app-searchable-select
              [ngModel]="data.form.get('status')?.value"
              (ngModelChange)="data.form.get('status')?.setValue($event)"
              label="حالة الحضور *"
              [options]="statusOptions"
              [required]="true"
              [ngModelOptions]="{ standalone: true }"
              class="full-width-select">
            </app-searchable-select>
          </div>

          <!-- Date & Late Time -->
          <div class="form-row">
            <mat-form-field appearance="outline" class="form-field-half">
              <mat-label>تاريخ الحضور</mat-label>
              <input matInput [matDatepicker]="datePicker" formControlName="attendanceDate">
              <mat-datepicker-toggle matSuffix [for]="datePicker"></mat-datepicker-toggle>
              <mat-datepicker #datePicker></mat-datepicker>
              <mat-icon matPrefix>event</mat-icon>
            </mat-form-field>

            <mat-form-field appearance="outline" class="form-field-half">
              <mat-label>وقت التأخير (دقائق)</mat-label>
              <input matInput type="number" formControlName="lateTime" min="0" placeholder="0">
              <mat-icon matPrefix>timer</mat-icon>
            </mat-form-field>
          </div>

          <!-- Check In & Check Out -->
          <div class="form-row">
            <mat-form-field appearance="outline" class="form-field-half">
              <mat-label>وقت الدخول</mat-label>
              <input matInput type="time" formControlName="checkInTime">
              <mat-icon matPrefix>login</mat-icon>
            </mat-form-field>

            <mat-form-field appearance="outline" class="form-field-half">
              <mat-label>وقت الخروج</mat-label>
              <input matInput type="time" formControlName="checkOutTime">
              <mat-icon matPrefix>logout</mat-icon>
            </mat-form-field>
          </div>

          <!-- Note -->
          <div class="form-field-full">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>ملاحظات</mat-label>
              <textarea matInput formControlName="note" rows="3" placeholder="أدخل أي ملاحظات إضافية..."></textarea>
              <mat-icon matPrefix>note</mat-icon>
            </mat-form-field>
          </div>
        </div>

      </form>
    </mat-dialog-content>

    <mat-divider></mat-divider>

    <mat-dialog-actions align="end" class="dialog-actions">
      <button mat-button mat-dialog-close class="cancel-btn">
        <mat-icon>close</mat-icon>
        إلغاء
      </button>
      <button mat-raised-button color="primary" [disabled]="data.form.invalid || isLoadingSessions" (click)="save()" class="save-btn">
        <mat-icon>save</mat-icon>
        {{ data.editMode ? 'تحديث' : 'حفظ' }}
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .dialog-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px 24px;
      background: linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%);
      color: white;
      border-radius: 24px 24px 0 0;
    }
    .dialog-header-content {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .header-icon {
      font-size: 28px;
      width: 28px;
      height: 28px;
    }
    .dialog-title {
      margin: 0;
      font-size: 22px;
      font-weight: 700;
    }
    .dialog-close-btn {
      color: white;
      transition: transform 0.2s;
    }
    .dialog-close-btn:hover {
      transform: scale(1.1);
      background: rgba(255, 255, 255, 0.15);
    }
    .dialog-content {
      padding: 24px;
      max-height: 70vh;
      overflow-y: auto;
    }
    .dialog-content::-webkit-scrollbar {
      width: 6px;
    }
    .dialog-content::-webkit-scrollbar-track {
      background: #f1f5f9;
      border-radius: 10px;
    }
    .dialog-content::-webkit-scrollbar-thumb {
      background: linear-gradient(135deg, #8b5cf6, #6d28d9);
      border-radius: 10px;
    }
    .dialog-form {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    /* Barcode Search */
    .barcode-search-container {
      background: linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%);
      padding: 16px 20px;
      border-radius: 16px;
      border: 2px solid #e5d5ff;
    }
    .barcode-search-header {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 12px;
    }
    .barcode-icon {
      color: #8b5cf6;
      font-size: 24px;
      width: 24px;
      height: 24px;
    }
    .barcode-title {
      font-weight: 600;
      color: #4c1d95;
      font-size: 15px;
    }
    .barcode-hint-text {
      font-size: 12px;
      color: #7c3aed;
      opacity: 0.8;
    }
    .barcode-search-row {
      display: flex;
      gap: 12px;
      align-items: center;
    }
    .barcode-input-field {
      flex: 1;
    }
    .barcode-input-field .mat-form-field-wrapper {
      margin: 0;
      padding: 0;
    }
    .barcode-input-field .mat-form-field-flex {
      padding: 0 12px !important;
      background: white !important;
      border-radius: 8px !important;
    }
    .barcode-input-field .mat-form-field-infix {
      padding: 8px 0 !important;
      border-top: 0 !important;
    }
    .barcode-search-btn {
      height: 44px;
      white-space: nowrap;
      background: linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%) !important;
      color: white !important;
      border-radius: 10px !important;
      font-weight: 600;
      padding: 0 24px;
    }
    .barcode-search-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 16px rgba(139, 92, 246, 0.4);
    }
    .barcode-clear-btn {
      color: #6b7280 !important;
    }
    .barcode-clear-btn:hover {
      color: #ef4444 !important;
      background: #fee2e2 !important;
    }
    .barcode-hint {
      margin-top: 10px;
      font-size: 14px;
      border-radius: 10px;
    }
    .hint-success {
      color: #065f46;
      background: #d1fae5;
      padding: 8px 14px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .hint-success mat-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
      color: #059669;
    }
    .hint-error {
      color: #991b1b;
      background: #fee2e2;
      padding: 8px 14px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .hint-error mat-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
      color: #dc2626;
    }

    /* Form Fields */
    .form-fields-grid {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    .form-field-full {
      width: 100%;
    }
    .full-width-select {
      width: 100%;
    }
    .form-row {
      display: flex;
      gap: 16px;
    }
    .form-field-half {
      flex: 1;
      min-width: 0;
    }
    .full-width {
      width: 100%;
    }
    .full-width textarea {
      min-height: 80px;
    }

    /* Sessions Loading */
    .sessions-loading {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #6b7280;
      font-size: 13px;
      margin-top: 8px;
      padding: 8px 12px;
      background: #f3e8ff;
      border-radius: 8px;
    }
    .sessions-loading mat-spinner {
      margin: 0;
    }
    .no-sessions-message {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #f59e0b;
      font-size: 13px;
      margin-top: 8px;
      padding: 8px 12px;
      background: #fffbeb;
      border-radius: 8px;
      border: 1px solid #fef3c7;
    }
    .no-sessions-message mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
    }

    /* Dialog Actions */
    .dialog-actions {
      padding: 16px 24px;
      gap: 12px;
    }
    .cancel-btn {
      color: #6b7280 !important;
      font-weight: 500;
    }
    .cancel-btn:hover {
      background: #f3f4f6 !important;
    }
    .save-btn {
      background: linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%) !important;
      color: white !important;
      font-weight: 600;
      border-radius: 10px !important;
      padding: 0 28px;
    }
    .save-btn:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 4px 16px rgba(139, 92, 246, 0.4);
    }
    .save-btn:disabled {
      opacity: 0.6;
    }

    @media (max-width: 600px) {
      .dialog-content {
        padding: 16px;
      }
      .barcode-search-row {
        flex-wrap: wrap;
      }
      .barcode-input-field {
        min-width: 100%;
      }
      .barcode-search-btn {
        flex: 1;
      }
      .barcode-hint-text {
        display: none;
      }
      .form-row {
        flex-direction: column;
        gap: 0;
      }
      .form-field-half {
        width: 100%;
      }
      .dialog-header {
        padding: 16px 20px;
      }
      .dialog-title {
        font-size: 18px;
      }
      .dialog-actions {
        flex-wrap: wrap;
        justify-content: center;
      }
      .save-btn,
      .cancel-btn {
        flex: 1;
        min-width: 120px;
      }
    }
  `]
})
export class TraineeAttendanceDialogComponent implements OnInit {

  // ==========================================================================
  // PROPERTIES
  // ==========================================================================

  traineeOptions: SelectOption[] = [];
  sessionOptions: SelectOption[] = [];
  statusOptions: SelectOption[] = [];
  isLoadingSessions: boolean = false;

  barcodeSearch: string = '';
  barcodeSearchResult: { found: boolean; traineeName?: string; message?: string } | null = null;
  private allTrainees: any[] = [];

  private readonly STATUS_ENUM_MAP: { [key: number]: string } = {
    1: 'PRESENT',
    2: 'ABSENT',
    3: 'LATE',
    4: 'EXCUSED'
  };

  // ==========================================================================
  // CONSTRUCTOR
  // ==========================================================================

  constructor(
    public dialogRef: MatDialogRef<TraineeAttendanceDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private traineeService: TraineeService,
    private notification: NotificationService,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef
  ) {
    this.allTrainees = data.trainees || [];
    this.traineeOptions = this.allTrainees.map((t: any) => ({
      value: t.id,
      label: t.title || t.fullName
    }));

    this.sessionOptions = data.sessionOptions || [];

    this.statusOptions = (data.attendanceStatuses || []).map((s: any) => ({
      value: this.STATUS_ENUM_MAP[s.id] || s.id,
      label: s.title
    }));
  }

  // ==========================================================================
  // LIFECYCLE HOOKS
  // ==========================================================================

  ngOnInit(): void {
    this.data.form.get('traineeId')?.valueChanges.subscribe((traineeId: number) => {
      if (traineeId && this.data.loadSessionsFn) {
        this.isLoadingSessions = true;
        this.sessionOptions = [];
        this.data.form.get('courseSessionId')?.setValue(null);
        this.cdr.detectChanges();
        this.data.loadSessionsFn(traineeId);
      }
    });
  }

  // ==========================================================================
  // SESSION MANAGEMENT
  // ==========================================================================

  updateSessions(sessions: any[], sessionOptions: SelectOption[]): void {
    this.isLoadingSessions = false;
    this.sessionOptions = [...sessionOptions];
    this.cdr.detectChanges();

    const currentSessionId = this.data.form.get('courseSessionId')?.value;
    if (currentSessionId && !sessions.find(s => s.id === currentSessionId)) {
      this.data.form.get('courseSessionId')?.setValue(null);
    }
  }

  // ==========================================================================
  // BARCODE SEARCH
  // ==========================================================================

  searchTraineeInDialog(): void {
    if (!this.barcodeSearch?.trim()) {
      this.barcodeSearchResult = {
        found: false,
        message: 'الرجاء إدخال رقم الباركود'
      };
      return;
    }

    const searchValue = this.barcodeSearch.trim();

    this.traineeService.getAllTraineesByFilter({ quickSearch: searchValue }).subscribe({
      next: (res: any) => {
        const foundTrainees = res.items || [];

        if (foundTrainees.length === 0) {
          this.setBarcodeSearchResult(false, 'لم يتم العثور على متدرب بهذا الرقم');
          this.notification.showError('لم يتم العثور على متدرب');
          return;
        }

        // Exact match by national ID
        const exactMatch = foundTrainees.find((t: any) => t.nationalId === searchValue);

        if (exactMatch) {
          this.selectTraineeInDialog(exactMatch);
          this.notification.showSuccess(`تم العثور على المتدرب: ${exactMatch.title || exactMatch.fullName}`);
          return;
        }

        // Multiple matches
        if (foundTrainees.length > 1) {
          this.showTraineeSelectionDialog(foundTrainees);
          return;
        }

        // Single match
        const trainee = foundTrainees[0];
        this.selectTraineeInDialog(trainee);
        this.notification.showSuccess(`تم العثور على المتدرب: ${trainee.title || trainee.fullName}`);
      },
      error: () => {
        this.setBarcodeSearchResult(false, 'حدث خطأ في البحث عن المتدرب');
        this.notification.showError('حدث خطأ في البحث عن المتدرب');
      }
    });
  }

  private selectTraineeInDialog(trainee: any): void {
    this.barcodeSearchResult = {
      found: true,
      traineeName: trainee.title || trainee.fullName
    };
    this.data.form.get('traineeId')?.setValue(trainee.id);
    this.barcodeSearch = '';
  }

  private setBarcodeSearchResult(found: boolean, message: string): void {
    this.barcodeSearchResult = { found, message };
  }

  private showTraineeSelectionDialog(trainees: any[]): void {
    const selectionDialog = this.dialog.open(TraineeSelectionDialogComponent, {
      width: '500px',
      maxWidth: '90vw',
      data: { trainees }
    });

    selectionDialog.afterClosed().subscribe((selected: any) => {
      if (selected) {
        this.selectTraineeInDialog(selected);
        this.notification.showSuccess(`تم اختيار المتدرب: ${selected.title || selected.fullName}`);
      }
    });
  }

  onDialogBarcodeKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.searchTraineeInDialog();
    }
  }

  clearBarcodeSearch(): void {
    this.barcodeSearch = '';
    this.barcodeSearchResult = null;
  }

  onTraineeChange(traineeId: number): void {
    this.data.form.get('traineeId')?.setValue(traineeId);
    if (traineeId && this.data.loadSessionsFn) {
      this.isLoadingSessions = true;
      this.sessionOptions = [];
      this.data.form.get('courseSessionId')?.setValue(null);
      this.cdr.detectChanges();
      this.data.loadSessionsFn(traineeId);
    }
  }

  // ==========================================================================
  // SAVE
  // ==========================================================================

  save(): void {
    if (this.data.form.valid) {
      const formValue = this.data.form.value;

      // Map status ID to enum name
      let statusValue = formValue.status;
      if (typeof statusValue === 'number') {
        statusValue = this.STATUS_ENUM_MAP[statusValue] || statusValue;
      }

      const attendanceData = {
        traineeId: formValue.traineeId,
        courseSessionId: formValue.courseSessionId,
        status: statusValue,
        attendanceDate: formValue.attendanceDate,
        checkInTime: formValue.checkInTime || null,
        checkOutTime: formValue.checkOutTime || null,
        lateTime: formValue.lateTime || null,
        note: formValue.note || null
      };

      console.log('Saving attendance data:', attendanceData);
      this.dialogRef.close(attendanceData);
    }
  }
}