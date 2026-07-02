// course-session-list.component.ts - COMPLETE WITH UPDATED EXPORT METHODS

import { Component, OnInit, OnDestroy, ChangeDetectorRef, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Subject, takeUntil, finalize } from 'rxjs';
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
import { MatSortModule } from '@angular/material/sort';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';

import { CourseSessionService, CourseSessionFilterParams } from '../../../../core/services/course-session.service';
import { CourseService } from '../../../../core/services/course.service';
import { EmployeeService } from '../../../../core/services/employee.service';
import { PlaceService } from '../../../../core/services/place.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { ReportService } from '../../../../core/services/report.service';
import { SearchableSelectComponent } from '../../../../shared/components/searchable-select/searchable-select.component';
import { CourseSessionDetailsModalComponent } from '../course-session-details/course-session-details-modal.component';
import { CourseSessionFormModalComponent } from '../course-session-form/course-session-form-modal.component';
import { ExportPageSelectDialogComponent } from './export-page-select-dialog.component';

import { CourseSessionVTO, SESSION_STATUSES } from '../../../../core/models/employee.model';
import { ErrorVTO } from '../../../../core/models/common.model';

// DAYS OF WEEK CONSTANT - EXPORTED FOR TEMPLATE USE
export const DAYS_OF_WEEK = [
  { value: 'SUNDAY', label: 'الأحد', short: 'أ' },
  { value: 'MONDAY', label: 'الإثنين', short: 'إ' },
  { value: 'TUESDAY', label: 'الثلاثاء', short: 'ث' },
  { value: 'WEDNESDAY', label: 'الأربعاء', short: 'أر' },
  { value: 'THURSDAY', label: 'الخميس', short: 'خ' },
  { value: 'FRIDAY', label: 'الجمعة', short: 'ج' },
  { value: 'SATURDAY', label: 'السبت', short: 'س' }
];

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
export class CourseSessionListComponent implements OnInit, OnDestroy {
  Math = Math;

  // EXPOSE DAYS_OF_WEEK TO TEMPLATE
  DAYS_OF_WEEK = DAYS_OF_WEEK;

  // Table columns
  displayedColumns: string[] = ['course', 'trainers', 'sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  dataSource = new MatTableDataSource<any>([]);
  
  // Data
  allSessions: CourseSessionVTO[] = [];
  groupedData: any[] = [];
  isLoading = false;

  // Pagination
  totalItems = 0;
  pageSize = 25;
  pageSizeOptions: number[] = [5, 10, 25, 50, 100];
  currentPage = 0;

  // Sorting
  sortBy = 'CREATION_DATE';
  sortDir: 'ASC' | 'DESC' = 'ASC';

  // Filters
  searchText = '';
  filters = {
    courseId: null as number | null,
    trainerId: null as number | null,
    placeId: null as number | null,
    status: null as string | null,
    sessionDateFrom: null as any,
    sessionDateTo: null as any,
    sessionDay: null as string | null
  };

  // Filter options
  courseOptions: { value: number | null; label: string }[] = [];
  trainerOptions: { value: number | null; label: string }[] = [];
  placeOptions: { value: number | null; label: string }[] = [];
  statusOptions: { value: string | null; label: string }[] = [];
  dayOptions: { value: string | null; label: string }[] = [];

  // Day order mapping
  private dayOrder: { [key: string]: number } = {
    'SUNDAY': 0, 'MONDAY': 1, 'TUESDAY': 2,
    'WEDNESDAY': 3, 'THURSDAY': 4, 'FRIDAY': 5, 'SATURDAY': 6
  };

  private destroy$ = new Subject<void>();

  constructor(
    private sessionService: CourseSessionService,
    private courseService: CourseService,
    private employeeService: EmployeeService,
    private placeService: PlaceService,
    private notification: NotificationService,
    private reportService: ReportService,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadSelectOptions();
    this.loadLookupData();
    this.loadSessions();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadSelectOptions(): void {
    this.statusOptions = [
      { value: null, label: 'الكل' },
      ...SESSION_STATUSES.map(s => ({ value: String(s.id), label: s.title }))
    ];

    this.dayOptions = [
      { value: null, label: 'الكل' },
      ...DAYS_OF_WEEK.map(day => ({ value: day.value, label: day.label }))
    ];
  }

  private loadLookupData(): void {
    this.courseService.getAllCourses()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          const items = res?.items || [];
          this.courseOptions = [
            { value: null, label: 'الكل' },
            ...items.map((c: any) => ({ value: c.id, label: c.title }))
          ];
        },
        error: (err: ErrorVTO) => this.notification.showError(err)
      });

    this.employeeService.getAllTrainersLookup()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          const items = res?.list || [];
          this.trainerOptions = [
            { value: null, label: 'الكل' },
            ...items.map((t: any) => ({ value: t.id, label: t.title }))
          ];
        },
        error: (err: ErrorVTO) => this.notification.showError(err)
      });

    this.placeService.getAllPlacesLookup()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          const items = res?.list || [];
          this.placeOptions = [
            { value: null, label: 'الكل' },
            ...items.map((p: any) => ({ value: p.id, label: p.title }))
          ];
        },
        error: (err: ErrorVTO) => this.notification.showError(err)
      });
  }

  private formatDateForBackend(date: any): string | null {
    if (!date) return null;
    if (typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date)) return date;
    try {
      const d = new Date(date);
      if (isNaN(d.getTime())) return null;
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    } catch {
      return null;
    }
  }

  private buildFilterParams(pageNum: number): CourseSessionFilterParams {
    const params: CourseSessionFilterParams = {
      pageNum,
      pageSize: this.pageSize,
      orderBy: this.sortBy,
      orderDir: this.sortDir
    };

    if (this.searchText) params.quickSearch = this.searchText;
    if (this.filters.courseId) params.courseId = this.filters.courseId;
    if (this.filters.trainerId) params.trainerId = this.filters.trainerId;
    if (this.filters.placeId) params.placeId = this.filters.placeId;
    if (this.filters.status) params.status = this.filters.status;
    if (this.filters.sessionDay) params.sessionDay = this.filters.sessionDay;

    const dateFrom = this.formatDateForBackend(this.filters.sessionDateFrom);
    if (dateFrom) params.sessionDateFrom = dateFrom;
    const dateTo = this.formatDateForBackend(this.filters.sessionDateTo);
    if (dateTo) params.sessionDateTo = dateTo;

    return params;
  }

  getTotalPages(): number {
    return Math.ceil(this.totalItems / this.pageSize);
  }

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
    if (this.currentPage < this.getTotalPages() - 1) {
      this.currentPage++;
      this.loadSessions();
    }
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
    this.loadSessions();
  }

  // ============= DATA PROCESSING =============
  private processSessions(sessions: CourseSessionVTO[]): void {
    // Group by course
    const courseMap = new Map<number, any>();
    
    sessions.forEach(session => {
      const courseId = session.course?.id || 0;
      if (!courseMap.has(courseId)) {
        courseMap.set(courseId, {
          courseId: courseId,
          courseTitle: session.course?.title || 'غير محدد',
          sessions: [],
          trainers: new Set()
        });
      }
      
      const group = courseMap.get(courseId);
      group.sessions.push(session);
      
      // Collect all trainers
      if (session.trainers && session.trainers.length > 0) {
        session.trainers.forEach((t: any) => {
          group.trainers.add(JSON.stringify(t));
        });
      }
    });

    // Build grouped data for table
    this.groupedData = Array.from(courseMap.values()).map(group => {
      const trainers = Array.from(group.trainers).map((t: any) => JSON.parse(t));
      
      // Group sessions by day
      const dayMap: { [key: string]: any[] } = {};
      DAYS_OF_WEEK.forEach(day => {
        dayMap[day.value] = group.sessions.filter((s: any) => s.sessionDay === day.value);
      });

      return {
        courseId: group.courseId,
        courseTitle: group.courseTitle,
        trainers: trainers,
        totalSessions: group.sessions.length,
        ...dayMap
      };
    });

    this.dataSource.data = this.groupedData;
    this.cdr.detectChanges();
  }

  loadSessions(): void {
    this.isLoading = true;
    const params = this.buildFilterParams(this.currentPage);

    this.sessionService.getAllSessionsByFilter(params)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => {
          this.isLoading = false;
          this.cdr.detectChanges();
        })
      )
      .subscribe({
        next: (res: any) => {
          this.allSessions = res?.items || [];
          this.totalItems = res?.total || 0;
          this.processSessions(this.allSessions);
        },
        error: (err: ErrorVTO) => {
          if (err?.code === 'INVALID_DATE_RANGE_FROM_AFTER_TO') {
            this.notification.showError('تاريخ البداية لا يمكن أن يكون بعد تاريخ النهاية');
          } else {
            this.notification.showError(err);
          }
        }
      });
  }

  onSortChange(sort: any): void {
    if (sort.active && sort.direction) {
      this.sortBy = sort.active;
      this.sortDir = sort.direction.toUpperCase();
    } else {
      this.sortBy = 'COURSE_TITLE';
      this.sortDir = 'ASC';
    }
    this.currentPage = 0;
    this.loadSessions();
  }

  // Filter handlers
  onSearchChange(): void {
    this.currentPage = 0;
    this.loadSessions();
  }

  onCourseFilterChange(): void {
    this.currentPage = 0;
    this.loadSessions();
  }

  onTrainerFilterChange(): void {
    this.currentPage = 0;
    this.loadSessions();
  }

  onPlaceFilterChange(): void {
    this.currentPage = 0;
    this.loadSessions();
  }

  onStatusFilterChange(): void {
    this.currentPage = 0;
    this.loadSessions();
  }

  onDayFilterChange(): void {
    this.currentPage = 0;
    this.loadSessions();
  }

  onDateFromChange(): void {
    this.currentPage = 0;
    this.loadSessions();
  }

  onDateToChange(): void {
    this.currentPage = 0;
    this.loadSessions();
  }

  resetFilters(): void {
    this.searchText = '';
    this.filters = {
      courseId: null,
      trainerId: null,
      placeId: null,
      status: null,
      sessionDateFrom: null,
      sessionDateTo: null,
      sessionDay: null
    };
    this.currentPage = 0;
    this.loadSessions();
    this.notification.showSuccess('تم مسح جميع الفلاتر');
  }

  // ============= HELPER METHODS =============

  getStatusCount(statusId: number): number {
    return this.allSessions?.filter(s => s.status?.id === statusId).length || 0;
  }

  getTrainerNames(trainers: any[]): string {
    if (!trainers || trainers.length === 0) return '-';
    return trainers.map(t => t.title || t.name || `مدرب ${t.id}`).join('، ');
  }

  getDayLabel(dayEnum: string): string {
    if (!dayEnum) return '-';
    const found = DAYS_OF_WEEK.find(d => d.value === dayEnum);
    return found ? found.label : dayEnum;
  }

  getStatusLabel(statusId: number): string {
    const status = SESSION_STATUSES.find(s => s.id === statusId);
    return status?.title || 'غير محدد';
  }

  getStatusClass(statusId: number): string {
    const classes: Record<number, string> = {
      1: 'status-scheduled',
      2: 'status-in-progress',
      3: 'status-completed',
      4: 'status-cancelled'
    };
    return classes[statusId] || '';
  }

  getStatusIcon(statusId: number): string {
    const icons: Record<number, string> = {
      1: 'schedule',
      2: 'play_circle',
      3: 'check_circle',
      4: 'cancel'
    };
    return icons[statusId] || 'help';
  }

  formatTime(time: string): string {
    if (!time) return '-';
    const [hours, minutes] = time.split(':');
    let hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'م' : 'ص';
    hour = hour % 12 || 12;
    return `${String(hour).padStart(2, '0')}:${minutes} ${ampm}`;
  }

  formatTimeRange(start: string, end: string): string {
    if (!start && !end) return '-';
    if (!start) return this.formatTime(end);
    if (!end) return this.formatTime(start);
    return `${this.formatTime(start)} - ${this.formatTime(end)}`;
  }

  getDaySlots(row: any, dayValue: string): any[] {
    return row[dayValue] || [];
  }

  getSlotTrainers(slots: any[]): any[] {
    if (!slots || slots.length === 0) return [];
    const trainers: any[] = [];
    slots.forEach(slot => {
      if (slot.trainers && slot.trainers.length > 0) {
        slot.trainers.forEach((t: any) => {
          if (!trainers.find(t2 => t2.id === t.id)) {
            trainers.push(t);
          }
        });
      }
    });
    return trainers;
  }

  getTrainerAvatarName(trainer: any): string {
    if (!trainer) return 'م';
    return (trainer.title || trainer.name || trainer.fullName || 'مدرب').charAt(0);
  }

  getTrainerTooltip(trainer: any): string {
    if (!trainer) return '';
    return trainer.title || trainer.name || trainer.fullName || `مدرب ${trainer.id}`;
  }

  trackByCourseId(_index: number, item: any): number {
    return item.courseId;
  }

  // ============= CRUD OPERATIONS =============

  openAddModal(): void {
    const dialogRef = this.dialog.open(CourseSessionFormModalComponent, {
      width: '800px',
      maxWidth: '90vw',
      disableClose: true,
      data: { mode: 'add' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'saved') {
        this.loadSessions();
      }
    });
  }

  viewSessionDetails(session: any): void {
    const fullSession = this.allSessions.find(s => s.id === session.id);
    if (!fullSession) {
      this.notification.showError('لم يتم العثور على بيانات الجلسة');
      return;
    }

    const dialogRef = this.dialog.open(CourseSessionDetailsModalComponent, {
      data: fullSession,
      width: '650px',
      maxWidth: '90vw'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result?.action === 'delete') {
        this.confirmDelete(result.session);
      } else if (result?.action === 'edit') {
        this.openEditModal(result.session);
      }
    });
  }

  editSession(session: any): void {
    const fullSession = this.allSessions.find(s => s.id === session.id);
    if (fullSession) {
      this.openEditModal(fullSession);
    } else {
      this.notification.showError('لم يتم العثور على بيانات الجلسة');
    }
  }

  private openEditModal(session: CourseSessionVTO): void {
    const dialogRef = this.dialog.open(CourseSessionFormModalComponent, {
      width: '800px',
      maxWidth: '90vw',
      disableClose: true,
      data: {
        mode: 'edit',
        session,
        sessionId: session.course?.id
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'updated') {
        this.loadSessions();
      }
    });
  }

  deleteSession(session: any): void {
    const fullSession = this.allSessions.find(s => s.id === session.id);
    if (fullSession) {
      this.confirmDelete(fullSession);
    } else {
      this.notification.showError('لم يتم العثور على بيانات الجلسة');
    }
  }

  private confirmDelete(session: CourseSessionVTO): void {
    const title = session.title || `جلسة #${session.id}`;
    if (!confirm(`هل أنت متأكد من حذف الجلسة "${title}"؟`)) return;

    this.sessionService.deleteCourseSession(session.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.notification.showSuccess('تم حذف الجلسة بنجاح');
          this.loadSessions();
        },
        error: (err: ErrorVTO) => this.notification.showError(err)
      });
  }

  // ==========================================================================
  // EXPORT FUNCTIONS WITH PAGE SELECTION - UPDATED
  // ==========================================================================

  /**
   * Show page selection dialog for export or print
   * @param isCardPrint - Whether this is for printing cards (true) or exporting (false)
   */
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
          isCardPrint: isCardPrint  // Pass the mode to dialog
        }
      });

      dialogRef.afterClosed().subscribe(result => {
        resolve(result);
      });
    });
  }

  private async fetchPagesForExport(startPage: number, endPage: number): Promise<CourseSessionVTO[]> {
    const allData: CourseSessionVTO[] = [];
    const totalPages = this.getTotalPages();

    for (let page = startPage; page <= Math.min(endPage, totalPages - 1); page++) {
      const params = this.buildFilterParams(page);
      try {
        const res = await this.sessionService.getAllSessionsByFilter(params).toPromise();
        if (res?.items) {
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
    const result = await this.showExportPageSelection(false);  // false = export mode
    
    if (!result) {
      return;
    }

    let dataToExport: CourseSessionVTO[] = [];

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

    const exportData = dataToExport.map((session, index) => ({
      '#': index + 1,
      'الدورة': session.course?.title || 'غير محدد',
      'المدربون': this.getTrainerNames(session.trainers || []),
      'اليوم': this.getDayLabel(session.sessionDay || ''),
      'الوقت': this.formatTimeRange(session.startTime || '', session.endTime || ''),
      'الحالة': this.getStatusLabel(session.status?.id || 0),
      'المكان': session.place?.title || 'غير محدد',
      'الملاحظات': session.note || ''
    }));

    this.reportService.exportToExcel(exportData, 'course-sessions', 'جلسات الدورات');
    this.notification.showSuccess(`تم تصدير ${exportData.length} جلسة بنجاح`);
  }

  /**
   * Generate HTML for PDF export with professional layout
   */
  private generatePDFHTML(sessions: CourseSessionVTO[], filterTexts: string[]): string {
    const totalSessions = sessions.length;
    const scheduled = sessions.filter(s => s.status?.id === 1).length;
    const inProgress = sessions.filter(s => s.status?.id === 2).length;
    const completed = sessions.filter(s => s.status?.id === 3).length;
    const cancelled = sessions.filter(s => s.status?.id === 4).length;
    const uniqueCourses = new Set(sessions.map(s => s.course?.id)).size;
    const uniqueTrainers = new Set();
    sessions.forEach(s => {
      if (s.trainers) {
        s.trainers.forEach((t: any) => uniqueTrainers.add(t.id));
      }
    });

    // Split data into pages (20 rows per page for landscape)
    const rowsPerPage = 20;
    const pages: CourseSessionVTO[][] = [];
    for (let i = 0; i < sessions.length; i += rowsPerPage) {
      pages.push(sessions.slice(i, i + rowsPerPage));
    }

    let allPagesHTML = '';

    pages.forEach((pageData: CourseSessionVTO[], pageIndex: number) => {
      let tableRows = '';
      pageData.forEach((session: CourseSessionVTO, index: number) => {
        const globalIndex = (pageIndex * rowsPerPage) + index + 1;
        
        const statusColors: Record<number, string> = {
          1: 'background: #dbeafe; color: #1e40af; border-radius: 16px; padding: 3px 12px; display: inline-block; font-weight: 600; font-size: 11px;',
          2: 'background: #fed7aa; color: #92400e; border-radius: 16px; padding: 3px 12px; display: inline-block; font-weight: 600; font-size: 11px;',
          3: 'background: #d1fae5; color: #065f46; border-radius: 16px; padding: 3px 12px; display: inline-block; font-weight: 600; font-size: 11px;',
          4: 'background: #fee2e2; color: #991b1b; border-radius: 16px; padding: 3px 12px; display: inline-block; font-weight: 600; font-size: 11px;'
        };
        const statusStyle = statusColors[session.status?.id || 0] || 'background: #e5e7eb; color: #374151; border-radius: 16px; padding: 3px 12px; display: inline-block; font-weight: 600; font-size: 11px;';
        
        const dayLabel = this.getDayLabel(session.sessionDay || '');
        const timeRange = this.formatTimeRange(session.startTime || '', session.endTime || '');
        const trainersText = this.getTrainerNames(session.trainers || []);
        const placeText = session.place?.title || '-';
        
        tableRows += `
          <tr>
            <td style="text-align: center; padding: 4px 3px; border: 1px solid rgba(229, 231, 235, 0.3); font-size: 9px; background: transparent;">${globalIndex}</td>
            <td style="text-align: right; padding: 4px 3px; border: 1px solid rgba(229, 231, 235, 0.3); font-weight: 600; font-size: 9px; background: transparent;">${this.escapeHtml(session.course?.title || '-')}</td>
            <td style="text-align: right; padding: 4px 3px; border: 1px solid rgba(229, 231, 235, 0.3); font-size: 9px; background: transparent;">${this.escapeHtml(trainersText)}</td>
            <td style="text-align: center; padding: 4px 3px; border: 1px solid rgba(229, 231, 235, 0.3); font-size: 9px; background: transparent;">${dayLabel}</td>
            <td style="text-align: center; padding: 4px 3px; border: 1px solid rgba(229, 231, 235, 0.3); font-size: 9px; background: transparent;">${timeRange}</td>
            <td style="text-align: center; padding: 4px 3px; border: 1px solid rgba(229, 231, 235, 0.3); font-size: 9px; background: transparent;"><span style="${statusStyle}">${this.getStatusLabel(session.status?.id || 0)}</span></td>
            <td style="text-align: right; padding: 4px 3px; border: 1px solid rgba(229, 231, 235, 0.3); font-size: 9px; background: transparent;">${this.escapeHtml(placeText)}</td>
          </tr>
        `;
      });

      allPagesHTML += `
        <div class="page-container">
          <div class="watermark-wrapper">
            <div class="watermark-container">
              <img src="assets/images/simpleLogoSvg.svg" alt="الأكاديمية الأولمبية">
            </div>
            <div class="watermark-text">الأكاديمية الأولمبية</div>
          </div>
          
          <div class="content">
            <div class="header">
              <h1>📋 تقرير جلسات الدورات</h1>
              <p>${new Date().toLocaleDateString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
              <p style="font-size: 10px; opacity: 0.8;">صفحة ${pageIndex + 1} من ${pages.length}</p>
            </div>
            
            ${filterTexts.length > 0 && pageIndex === 0 ? `<div class="filters"><strong>🔍 الفلاتر:</strong> ${filterTexts.join(' | ')}</div>` : ''}
            
            ${pageIndex === 0 ? `
            <div class="totals-grid">
              <div class="total-card total-all">
                <span class="total-icon">📅</span>
                <span class="total-value">${totalSessions}</span>
                <span class="total-label">إجمالي الجلسات</span>
              </div>
              <div class="total-card total-courses">
                <span class="total-icon">📚</span>
                <span class="total-value">${uniqueCourses}</span>
                <span class="total-label">دورات</span>
              </div>
              <div class="total-card total-trainers">
                <span class="total-icon">👨‍🏫</span>
                <span class="total-value">${uniqueTrainers.size}</span>
                <span class="total-label">مدربين</span>
              </div>
              <div class="total-card total-scheduled">
                <span class="total-icon">⏰</span>
                <span class="total-value">${scheduled}</span>
                <span class="total-label">مجدول</span>
              </div>
              <div class="total-card total-completed">
                <span class="total-icon">✅</span>
                <span class="total-value">${completed}</span>
                <span class="total-label">مكتمل</span>
              </div>
            </div>
            ` : ''}
            
            <table>
              <thead>
                <tr>
                  <th style="width: 5%;">#</th>
                  <th style="width: 20%;">الدورة</th>
                  <th style="width: 22%;">المدربون</th>
                  <th style="width: 12%;">اليوم</th>
                  <th style="width: 15%;">الوقت</th>
                  <th style="width: 14%;">الحالة</th>
                  <th style="width: 12%;">المكان</th>
                </tr>
              </thead>
              <tbody>
                ${tableRows}
              </tbody>
            </table>
            
            <div class="footer">
              الأكاديمية الأولمبية &copy; ${new Date().getFullYear()} - ${totalSessions} جلسة
            </div>
          </div>
        </div>
      `;
    });

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>تقرير جلسات الدورات</title>
        <style>
          * { font-family: 'Cairo', 'Segoe UI', Tahoma, sans-serif; margin: 0; padding: 0; box-sizing: border-box; }
          html, body { width: 100%; min-height: 100vh; background: white; margin: 0; padding: 0; }
          @page { size: A4 landscape; margin: 8mm; }
          
          .page-container { position: relative; width: 100%; min-height: 100vh; page-break-after: always; background: white; overflow: hidden; }
          .page-container:last-child { page-break-after: auto; }
          
          .watermark-wrapper { position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 0; overflow: hidden; }
          .watermark-container { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(-25deg); width: 60%; height: 60%; display: flex; align-items: center; justify-content: center; opacity: 0.10; }
          .watermark-container img { width: 100%; height: 100%; object-fit: contain; filter: grayscale(0%) sepia(20%) saturate(150%) hue-rotate(220deg); }
          .watermark-text { position: absolute; top: 56%; left: 50%; transform: translate(-50%, -50%) rotate(-25deg); font-size: 50px; font-weight: 900; color: #667eea; letter-spacing: 6px; text-transform: uppercase; white-space: nowrap; opacity: 0.05; text-shadow: 0 4px 20px rgba(102, 126, 234, 0.15); }
          
          .content { position: relative; z-index: 1; padding: 12px; background: transparent; min-height: 100vh; }
          
          @media print {
            .no-print { display: none !important; }
            .page-container { min-height: 100vh !important; page-break-after: always !important; }
            .watermark-container { opacity: 0.12 !important; width: 65% !important; height: 65% !important; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
            .watermark-container img { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
            .watermark-text { opacity: 0.06 !important; font-size: 55px !important; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
            .header { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
            th { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
            .totals-grid { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
            .total-card { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
            td { background: transparent !important; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
            tr { background: transparent !important; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
            tbody { background: transparent !important; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
          }
          
          .header { text-align: center; margin-bottom: 10px; padding: 10px 16px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border-radius: 8px; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
          .header h1 { margin: 0; font-size: 18px; font-weight: 700; letter-spacing: 1px; }
          .header p { margin: 2px 0 0 0; font-size: 11px; opacity: 0.9; }
          
          .filters { margin-bottom: 8px; padding: 6px 12px; background: rgba(248, 250, 252, 0.8); border-radius: 6px; font-size: 10px; border: 1px solid rgba(229, 231, 235, 0.5); }
          .filters strong { color: #1e293b; }
          
          .totals-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 5px; margin-bottom: 8px; }
          .total-card { background: rgba(255, 255, 255, 0.9); border-radius: 6px; padding: 5px 8px; text-align: center; border: 1px solid rgba(229, 231, 235, 0.5); display: flex; align-items: center; justify-content: center; gap: 4px; min-height: 30px; backdrop-filter: blur(4px); -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
          .total-card .total-icon { font-size: 13px; flex-shrink: 0; }
          .total-card .total-value { font-size: 14px; font-weight: 700; color: #1e293b; line-height: 1.2; }
          .total-card .total-label { font-size: 9px; color: #64748b; margin-right: 2px; font-weight: 500; }
          
          .total-card.total-all { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
          .total-card.total-all .total-value { color: white; }
          .total-card.total-all .total-label { color: rgba(255, 255, 255, 0.85); }
          .total-card.total-courses .total-value { color: #2563eb; }
          .total-card.total-trainers .total-value { color: #92400e; }
          .total-card.total-scheduled .total-value { color: #2563eb; }
          .total-card.total-completed .total-value { color: #059669; }
          
          table { width: 100%; border-collapse: collapse; direction: rtl; margin-top: 4px; font-size: 10px; background: transparent; }
          th { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 5px 4px; border: 1px solid #764ba2; text-align: center; font-weight: 700; font-size: 10px; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
          td { padding: 4px 4px; border: 1px solid rgba(229, 231, 235, 0.3); font-size: 10px; background: transparent !important; }
          tr { background: transparent !important; }
          tbody { background: transparent !important; }
          tr:nth-child(even) td { background: rgba(250, 251, 252, 0.5) !important; }
          
          .footer { text-align: center; margin-top: 8px; padding: 5px; font-size: 8px; color: rgba(148, 163, 184, 0.8); border-top: 1px solid rgba(229, 231, 235, 0.3); }
          
          @media (max-width: 768px) {
            .watermark-container { width: 80% !important; height: 80% !important; }
            .watermark-text { font-size: 30px !important; }
            .totals-grid { grid-template-columns: repeat(3, 1fr); gap: 4px; }
            .total-card { padding: 4px 6px; min-height: 26px; }
            .total-card .total-value { font-size: 12px; }
            table { font-size: 9px; }
            th, td { padding: 3px 2px; }
            .header h1 { font-size: 15px; }
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
  }

  /**
   * Escape HTML to prevent XSS
   */
  private escapeHtml(str: string | null | undefined): string {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  async exportToPDF(): Promise<void> {
    const result = await this.showExportPageSelection(false);  // false = export mode
    
    if (!result) {
      return;
    }

    this.isLoading = true;

    let dataToPrint: CourseSessionVTO[] = [];

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

    // Build filter texts for display
    const filterTexts: string[] = [];
    if (this.filters.courseId) {
      const course = this.courseOptions.find(c => c.value === this.filters.courseId);
      if (course) filterTexts.push(`الدورة: ${course.label}`);
    }
    if (this.filters.trainerId) {
      const trainer = this.trainerOptions.find(t => t.value === this.filters.trainerId);
      if (trainer) filterTexts.push(`المدرب: ${trainer.label}`);
    }
    if (this.filters.placeId) {
      const place = this.placeOptions.find(p => p.value === this.filters.placeId);
      if (place) filterTexts.push(`المكان: ${place.label}`);
    }
    if (this.filters.status) {
      const status = this.statusOptions.find(s => s.value === this.filters.status);
      if (status) filterTexts.push(`الحالة: ${status.label}`);
    }
    if (this.filters.sessionDay) {
      const day = this.dayOptions.find(d => d.value === this.filters.sessionDay);
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
    if (this.searchText) filterTexts.push(`بحث: ${this.searchText}`);

    // Generate HTML and open in new window
    const htmlContent = this.generatePDFHTML(dataToPrint, filterTexts);
    
    const printWindow = window.open('', '_blank', 'width=1100,height=850,scrollbars=yes');
    if (printWindow) {
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      this.isLoading = false;
      this.notification.showSuccess(`تم فتح التقرير - ${dataToPrint.length} جلسة`);
    } else {
      // Fallback: create a temporary element
      const container = document.createElement('div');
      container.innerHTML = htmlContent;
      document.body.appendChild(container);
      window.print();
      setTimeout(() => {
        if (document.body.contains(container)) {
          document.body.removeChild(container);
        }
      }, 500);
      this.isLoading = false;
      this.notification.showSuccess(`تم فتح التقرير - ${dataToPrint.length} جلسة`);
    }
  }
}