import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
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
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';

import { CourseSessionService } from '../../../../core/services/course-session.service';
import { CourseService } from '../../../../core/services/course.service';
import { EmployeeService } from '../../../../core/services/employee.service';
import { PlaceService } from '../../../../core/services/place.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { ReportService } from '../../../../core/services/report.service';
import { SearchableSelectComponent, SelectOption } from '../../../../shared/components/searchable-select/searchable-select.component';
import { SESSION_STATUSES, CourseSessionVTO } from '../../../../core/models/employee.model';
import { CourseSessionDetailsModalComponent } from './../course-session-details/course-session-details-modal.component';
import { CourseSessionFormModalComponent } from './../course-session-form/course-session-form-modal.component';

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
    SearchableSelectComponent
  ],
  templateUrl: './course-session-list.component.html',
  styleUrls: ['./course-session-list.component.css']
})
export class CourseSessionListComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['index', 'title', 'course', 'trainer', 'place', 'sessionDate', 'startTime', 'endTime', 'status', 'actions'];
  dataSource = new MatTableDataSource<any>([]);
  allSessions: any[] = [];
  isLoading = false;

  courses: any[] = [];
  trainers: any[] = [];
  places: any[] = [];
  sessionStatuses = SESSION_STATUSES;

  filters = {
    courseId: null as number | null,
    trainerId: null as number | null,
    placeId: null as number | null,
    status: null as number | null,
    sessionDateFrom: null as string | null,
    sessionDateTo: null as string | null
  };

  quickSearch: string = '';

  // Options for searchable selects
  courseOptions: SelectOption[] = [];
  trainerOptions: SelectOption[] = [];
  placeOptions: SelectOption[] = [];
  statusOptions: SelectOption[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private sessionService: CourseSessionService,
    private courseService: CourseService,
    private employeeService: EmployeeService,
    private placeService: PlaceService,
    private notification: NotificationService,
    private reportService: ReportService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadSelectOptions();
    this.loadLookupData();
    this.loadSessions();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadSelectOptions(): void {
    this.statusOptions = [
      { value: null, label: 'الكل' },
      ...this.sessionStatuses.map(s => ({ value: s.id, label: s.title }))
    ];
  }

  loadLookupData(): void {
    // Load courses
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

    // Load trainers
    this.employeeService.getAllTrainersLookup().subscribe({
      next: (res: any) => {
        this.trainers = res.list || [];
        this.trainerOptions = [
          { value: null, label: 'الكل' },
          ...this.trainers.map(t => ({ value: t.id, label: t.title }))
        ];
      },
      error: () => this.notification.showError('حدث خطأ في تحميل المدربين')
    });

    // Load places
    this.placeService.getAllPlacesLookup().subscribe({
      next: (res: any) => {
        this.places = res.list || [];
        this.placeOptions = [
          { value: null, label: 'الكل' },
          ...this.places.map(p => ({ value: p.id, label: p.title }))
        ];
      },
      error: () => this.notification.showError('حدث خطأ في تحميل الأماكن')
    });
  }

  loadSessions(): void {
    this.isLoading = true;
    const params: any = {};
    
    if (this.filters.courseId) params.courseId = this.filters.courseId;
    if (this.filters.trainerId) params.trainerId = this.filters.trainerId;
    if (this.filters.placeId) params.placeId = this.filters.placeId;
    if (this.filters.status) params.status = this.filters.status;
    if (this.filters.sessionDateFrom) params.sessionDateFrom = this.filters.sessionDateFrom;
    if (this.filters.sessionDateTo) params.sessionDateTo = this.filters.sessionDateTo;
    if (this.quickSearch) params.quickSearch = this.quickSearch;

    this.sessionService.getAllSessionsByFilter(params).subscribe({
      next: (res: any) => {
        this.allSessions = res.items || [];
        this.dataSource.data = this.allSessions;
        this.isLoading = false;
      },
      error: () => {
        this.notification.showError('حدث خطأ في تحميل الجلسات');
        this.isLoading = false;
      }
    });
  }

  applyQuickSearch(event: Event): void {
    this.quickSearch = (event.target as HTMLInputElement).value;
    this.loadSessions();
  }

  resetFilters(): void {
    this.filters = {
      courseId: null,
      trainerId: null,
      placeId: null,
      status: null,
      sessionDateFrom: null,
      sessionDateTo: null
    };
    this.quickSearch = '';
    this.loadSessions();
    this.notification.showSuccess('تم مسح جميع الفلاتر');
  }

  // Helper method to format time to 12-hour format with AM/PM
  formatTime(time: string): string {
    if (!time) return '-';
    
    // If time is already in HH:mm format (24-hour)
    const [hours, minutes] = time.split(':');
    let hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'م' : 'ص';
    hour = hour % 12;
    hour = hour ? hour : 12; // Convert 0 to 12
    const hourStr = hour.toString().padStart(2, '0');
    return `${hourStr}:${minutes} ${ampm}`;
  }

  // Open Add Modal
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

  // Open Edit Modal
  editSession(session: any): void {
    // Fetch full session details including all fields
    this.sessionService.getCourseSessionById(session.course.id, session.id).subscribe({
      next: (fullSession: CourseSessionVTO) => {
        const dialogRef = this.dialog.open(CourseSessionFormModalComponent, {
          width: '800px',
          maxWidth: '90vw',
          disableClose: true,
          data: {
            mode: 'edit',
            session: fullSession,
            courseId: session.course.id,
            sessionId: session.id
          }
        });

        dialogRef.afterClosed().subscribe(result => {
          if (result === 'updated') {
            this.loadSessions();
          }
        });
      },
      error: () => {
        this.notification.showError('حدث خطأ في تحميل بيانات الجلسة');
      }
    });
  }

  viewSessionDetails(session: any): void {
    // Fetch full session details including createdBy, lastModifiedBy
    this.sessionService.getCourseSessionById(session.course.id, session.id).subscribe({
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
            // Open edit modal when user clicks Edit from details
            this.openEditModalFromDetails(result.session);
          }
        });
      },
      error: () => {
        this.notification.showError('حدث خطأ في تحميل تفاصيل الجلسة');
      }
    });
  }

  // Add this new method to handle edit from details modal
  openEditModalFromDetails(session: any): void {
    // Fetch full session details including all fields
    this.sessionService.getCourseSessionById(session.course.id, session.id).subscribe({
      next: (fullSession: CourseSessionVTO) => {
        const dialogRef = this.dialog.open(CourseSessionFormModalComponent, {
          width: '800px',
          maxWidth: '90vw',
          disableClose: true,
          data: {
            mode: 'edit',
            session: fullSession,
            courseId: session.course.id,
            sessionId: session.id
          }
        });

        dialogRef.afterClosed().subscribe(result => {
          if (result === 'updated') {
            this.loadSessions();
          }
        });
      },
      error: () => {
        this.notification.showError('حدث خطأ في تحميل بيانات الجلسة');
      }
    });
  }

  confirmAndDelete(session: any): void {
    if (confirm(`هل أنت متأكد من حذف الجلسة "${session.title}"؟`)) {
      this.sessionService.deleteCourseSession(session.course.id, session.id).subscribe({
        next: () => {
          this.notification.showSuccess('تم حذف الجلسة بنجاح');
          this.loadSessions();
        },
        error: () => this.notification.showError('حدث خطأ في حذف الجلسة')
      });
    }
  }

  deleteSession(session: any): void {
    this.confirmAndDelete(session);
  }

  getStatusCount(statusId: number): number {
    return this.dataSource.data.filter(s => s.status?.id === statusId).length;
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

  exportToExcel(): void {
    if (this.dataSource.data.length === 0) {
      this.notification.showWarning('لا توجد بيانات لتصديرها');
      return;
    }

    const exportData = this.dataSource.data.map((session: any, index: number) => ({
      '#': index + 1,
      'عنوان الجلسة': session.title,
      'الدورة': session.course?.title,
      'المدرب': session.trainer?.title,
      'المكان': session.place?.title,
      'التاريخ': session.sessionDate,
      'وقت البدء': this.formatTime(session.startTime),
      'وقت الانتهاء': this.formatTime(session.endTime),
      'الحالة': session.status?.title,
      'ملاحظات': session.note || '-'
    }));

    this.reportService.exportToExcel(exportData, 'course-sessions', 'جلسات الدورات');
    this.notification.showSuccess('تم تصدير البيانات بنجاح');
  }

  exportToPDF(): void {
    if (this.dataSource.data.length === 0) {
      this.notification.showWarning('لا توجد بيانات لتصديرها');
      return;
    }

    this.isLoading = true;

    // Build filter text
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
      const status = this.sessionStatuses.find(s => s.id === this.filters.status);
      if (status) filterTexts.push(`الحالة: ${status.title}`);
    }
    if (this.filters.sessionDateFrom) filterTexts.push(`من تاريخ: ${this.filters.sessionDateFrom}`);
    if (this.filters.sessionDateTo) filterTexts.push(`إلى تاريخ: ${this.filters.sessionDateTo}`);
    if (this.quickSearch) filterTexts.push(`بحث: ${this.quickSearch}`);

    // Build table rows
    let tableRows = '';
    this.dataSource.data.forEach((session: any, index: number) => {
      const statusClass = this.getStatusClass(session.status?.id);
      let statusStyle = '';
      if (statusClass === 'status-scheduled') statusStyle = 'background-color: #dbeafe; color: #1e40af;';
      else if (statusClass === 'status-in-progress') statusStyle = 'background-color: #fed7aa; color: #92400e;';
      else if (statusClass === 'status-completed') statusStyle = 'background-color: #d1fae5; color: #065f46;';
      else if (statusClass === 'status-cancelled') statusStyle = 'background-color: #fee2e2; color: #991b1b;';
      
      tableRows += `
        <tr>
          <td style="text-align: center; padding: 8px; border: 1px solid #ddd;">${index + 1}</td>
          <td style="text-align: right; padding: 8px; border: 1px solid #ddd; font-weight: bold;">${session.title || '-'}</td>
          <td style="text-align: right; padding: 8px; border: 1px solid #ddd;">${session.course?.title || '-'}</td>
          <td style="text-align: right; padding: 8px; border: 1px solid #ddd;">${session.trainer?.title || '-'}</td>
          <td style="text-align: right; padding: 8px; border: 1px solid #ddd;">${session.place?.title || '-'}</td>
          <td style="text-align: center; padding: 8px; border: 1px solid #ddd;">${session.sessionDate || '-'}</td>
          <td style="text-align: center; padding: 8px; border: 1px solid #ddd;">${this.formatTime(session.startTime)}</td>
          <td style="text-align: center; padding: 8px; border: 1px solid #ddd;">${this.formatTime(session.endTime)}</td>
          <td style="text-align: center; padding: 8px; border: 1px solid #ddd; ${statusStyle}">
            ${session.status?.title || '-'}
          </td>
        </td>
      `;
    });

    // Create print container
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
        <title>تقرير جلسات الدورات</title>
        <style>
          * { font-family: 'Cairo', 'Segoe UI', Tahoma, sans-serif; }
          @media print {
            body { margin: 0; padding: 20px; }
            .no-print { display: none; }
          }
          .header {
            text-align: center;
            margin-bottom: 20px;
            padding: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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
          table {
            width: 100%;
            border-collapse: collapse;
            direction: rtl;
          }
          th {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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
          <h1>تقرير جلسات الدورات</h1>
          <p>تاريخ التقرير: ${new Date().toLocaleDateString('ar-EG')}</p>
          <p>عدد السجلات: ${this.dataSource.data.length} جلسة</p>
        </div>
        ${filterTexts.length > 0 ? `<div class="filters"><strong>الفلاتر المطبقة:</strong> ${filterTexts.join(' | ')}</div>` : ''}
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>عنوان الجلسة</th>
              <th>الدورة</th>
              <th>المدرب</th>
              <th>المكان</th>
              <th>التاريخ</th>
              <th>وقت البدء</th>
              <th>وقت الانتهاء</th>
              <th>الحالة</th>
            </tr>
          </thead>
          <tbody>
            ${tableRows}
          </tbody>
        </table>
        <div class="footer">
          تم التصدير من نظام إدارة الأكاديمية الأولمبية
        </div>
        <div class="no-print" style="text-align: center; margin-top: 20px; padding: 10px;">
          <button onclick="window.print();" style="padding: 10px 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; border-radius: 5px; cursor: pointer;">
            🖨️ طباعة / حفظ كـ PDF
          </button>
        </div>
      </body>
      </html>
    `;

    // Open in new window for printing
    const printWindow = window.open('', '_blank', 'width=1200,height=800,scrollbars=yes');
    if (printWindow) {
      printWindow.document.write(printContainer.innerHTML);
      printWindow.document.close();
      this.isLoading = false;
      this.notification.showSuccess('تم فتح التقرير - يمكنك طباعته أو حفظه كـ PDF');
    } else {
      // Fallback
      document.body.appendChild(printContainer);
      window.print();
      setTimeout(() => {
        document.body.removeChild(printContainer);
      }, 500);
      this.isLoading = false;
      this.notification.showSuccess('تم فتح التقرير - يمكنك حفظه كـ PDF من نافذة الطباعة');
    }
  }
}