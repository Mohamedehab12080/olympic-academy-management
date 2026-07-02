import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
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

const DAYS_OF_WEEK: readonly { value: string; label: string }[] = [
  { value: 'SUNDAY', label: 'الأحد' },
  { value: 'MONDAY', label: 'الإثنين' },
  { value: 'TUESDAY', label: 'الثلاثاء' },
  { value: 'WEDNESDAY', label: 'الأربعاء' },
  { value: 'THURSDAY', label: 'الخميس' },
  { value: 'FRIDAY', label: 'الجمعة' },
  { value: 'SATURDAY', label: 'السبت' }
];

interface GroupedSession {
  courseId: number;
  courseTitle: string;
  sessions: CourseSessionVTO[];
  trainerCount: number;
  totalSessions: number;
  sessionDays: string[];
  startTime: string;
  endTime: string;
  statuses: { id: number; count: number }[];
}

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

  displayedColumns: string[] = ['index', 'courseTitle', 'trainers', 'sessionDays', 'time', 'statuses', 'sessionsCount', 'actions'];
  dataSource = new MatTableDataSource<GroupedSession>([]);
  allSessions: CourseSessionVTO[] = [];
  groupedSessions: GroupedSession[] = [];
  isLoading = false;

  totalItems = 0;
  pageSize = 25;
  pageSizeOptions: number[] = [5, 10, 25, 50, 100];
  currentPage = 0;

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

  // Options
  courseOptions: { value: number | null; label: string }[] = [];
  trainerOptions: { value: number | null; label: string }[] = [];
  placeOptions: { value: number | null; label: string }[] = [];
  statusOptions: { value: string | null; label: string }[] = [];
  dayOptions: { value: string | null; label: string }[] = [];

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

  private groupSessionsByCourse(sessions: CourseSessionVTO[]): GroupedSession[] {
    const groupedMap = new Map<number, GroupedSession>();

    sessions.forEach(session => {
      const courseId = session.course?.id;
      if (!courseId) return;

      if (!groupedMap.has(courseId)) {
        groupedMap.set(courseId, {
          courseId,
          courseTitle: session.course?.title || 'غير محدد',
          sessions: [],
          trainerCount: 0,
          totalSessions: 0,
          sessionDays: [],
          startTime: session.startTime || '',
          endTime: session.endTime || '',
          statuses: []
        });
      }

      const group = groupedMap.get(courseId)!;
      group.sessions.push(session);

      const uniqueTrainers = new Set(
        group.sessions.flatMap(s => (s.trainer || []).map(t => t.id))
      );
      group.trainerCount = uniqueTrainers.size;

      const days = new Set(group.sessions.map(s => s.sessionDay).filter(Boolean));
      group.sessionDays = Array.from(days) as string[];

      if (!group.startTime) group.startTime = session.startTime || '';
      if (!group.endTime) group.endTime = session.endTime || '';

      const statusMap = new Map<number, number>();
      group.sessions.forEach(s => {
        const statusId = s.status?.id || 0;
        statusMap.set(statusId, (statusMap.get(statusId) || 0) + 1);
      });
      group.statuses = Array.from(statusMap.entries()).map(([id, count]) => ({ id, count }));

      group.totalSessions = group.sessions.length;
    });

    return Array.from(groupedMap.values());
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
          this.groupedSessions = this.groupSessionsByCourse(this.allSessions);
          this.dataSource.data = this.groupedSessions;
          this.cdr.detectChanges();
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

  // Filter change handlers — bindings only assign via [(ngModel)] in the
  // template; these handlers just react and re-fetch.
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

  // Helper methods used from the template — kept as plain methods so the
  // template never needs inline arrow functions (Angular templates don't
  // support `=>` syntax).
  getGroupTrainers(group: GroupedSession): any[] {
    return group.sessions.flatMap(s => s.trainer || []);
  }

  getTrainerNames(trainers: any[]): string {
    if (!trainers || !Array.isArray(trainers) || trainers.length === 0) return '-';
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

  formatTime(time: string): string {
    if (!time) return '-';
    const [hours, minutes] = time.split(':');
    let hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'م' : 'ص';
    hour = hour % 12 || 12;
    return `${String(hour).padStart(2, '0')}:${minutes} ${ampm}`;
  }

  getStatusCount(statusId: number): number {
    return this.allSessions.filter(s => s.status?.id === statusId).length;
  }

  trackByCourseId(_index: number, group: GroupedSession): number {
    return group.courseId;
  }

  // CRUD Operations
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
    const fullSession = this.findSession(session.id);
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
    const fullSession = this.findSession(session.id);
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
    const fullSession = this.findSession(session.id);
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

  private findSession(sessionId: number): CourseSessionVTO | null {
    for (const group of this.groupedSessions) {
      const found = group.sessions.find(s => s.id === sessionId);
      if (found) return found;
    }
    return this.allSessions.find(s => s.id === sessionId) || null;
  }

  // Export functions
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
          totalPages,
          totalItems: this.totalItems,
          pageSize: this.pageSize,
          currentPage: this.currentPage
        }
      });

      dialogRef.afterClosed().subscribe(result => resolve(result));
    });
  }

  private async fetchPagesForExport(startPage: number, endPage: number): Promise<CourseSessionVTO[]> {
    const allData: CourseSessionVTO[] = [];
    const totalPages = this.getTotalPages();

    for (let page = startPage; page <= Math.min(endPage, totalPages - 1); page++) {
      const params = this.buildFilterParams(page);
      try {
        const res = await this.sessionService.getAllSessionsByFilter(params).toPromise();
        console.log(res);
        if (res?.items) {
          allData.push(...res.items);
        }
      } catch (error) {
        this.notification.showError(`حدث خطأ في تحميل الصفحة ${page + 1}`);
      }
    }

    return allData;
  }

  private buildExportRows(grouped: GroupedSession[]) {
    return grouped.map((group, index) => ({
      '#': index + 1,
      'الدورة': group.courseTitle,
      'المدربون': this.getTrainerNames(this.getGroupTrainers(group)),
      'الأيام': group.sessionDays.map(d => this.getDayLabel(d)).join(' - '),
      'وقت البدء': this.formatTime(group.startTime),
      'وقت الانتهاء': this.formatTime(group.endTime),
      'الحالات': group.statuses.map(s => `${this.getStatusLabel(s.id)} (${s.count})`).join(' - '),
      'عدد الجلسات': group.totalSessions,
      'عدد المدربين': group.trainerCount
    }));
  }

  async exportToExcel(): Promise<void> {
    const result = await this.showExportPageSelection();
    if (!result) return;

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

    const grouped = this.groupSessionsByCourse(dataToExport);
    const exportData = this.buildExportRows(grouped);

    this.reportService.exportToExcel(exportData, 'course-sessions-grouped', 'جلسات الدورات (مجمعة)');
    this.notification.showSuccess(`تم تصدير ${exportData.length} مجموعة بنجاح`);
  }

  async exportToPDF(): Promise<void> {
    const result = await this.showExportPageSelection();
    if (!result) return;

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

    const groupedData = this.groupSessionsByCourse(dataToPrint);
    this.reportService.exportToExcel(
      groupedData.map((group, index) => ({
        '#': index + 1,
        'الدورة': group.courseTitle,
        'المدربون': this.getTrainerNames(this.getGroupTrainers(group)),
        'الأيام': group.sessionDays.map(d => this.getDayLabel(d)).join(' - '),
        'الوقت': `${this.formatTime(group.startTime)} - ${this.formatTime(group.endTime)}`,
        'الحالات': group.statuses.map(s => `${this.getStatusLabel(s.id)} (${s.count})`).join(' - '),
        'عدد الجلسات': group.totalSessions
      })),
      'course-sessions-pdf',
      'تقرير جلسات الدورات'
    );

    this.isLoading = false;
    this.notification.showSuccess(`تم تصدير ${groupedData.length} مجموعة بنجاح`);
  }
}
