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
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

import { CourseSessionService } from '../../../../core/services/course-session.service';
import { CourseService } from '../../../../core/services/course.service';
import { EmployeeService } from '../../../../core/services/employee.service';
import { PlaceService } from '../../../../core/services/place.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { ReportService } from '../../../../core/services/report.service';
import { SearchableSelectComponent, SelectOption } from '../../../../shared/components/searchable-select/searchable-select.component';
import { SESSION_STATUSES } from '../../../../core/models/employee.model';

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

  viewSession(session: any): void {
    this.router.navigate(['/sessions', session.id]);
  }

  editSession(session: any): void {
    this.router.navigate(['/sessions', session.id, 'edit']);
  }

  deleteSession(session: any): void {
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
      1: 'primary',   // Scheduled
      2: 'accent',    // In Progress
      3: 'primary',   // Completed
      4: 'warn'       // Cancelled
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
      'وقت البدء': session.startTime,
      'وقت الانتهاء': session.endTime,
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

    const doc = new jsPDF('l', 'mm', 'a4');
    
    doc.setFontSize(18);
    doc.text('تقرير جلسات الدورات', doc.internal.pageSize.getWidth() / 2, 15, { align: 'center' });
    
    doc.setFontSize(10);
    let yOffset = 25;
    
    if (this.filters.courseId) {
      const course = this.courses.find(c => c.id === this.filters.courseId);
      if (course) doc.text(`الدورة: ${course.title}`, 14, yOffset);
      yOffset += 6;
    }
    if (this.filters.trainerId) {
      const trainer = this.trainers.find(t => t.id === this.filters.trainerId);
      if (trainer) doc.text(`المدرب: ${trainer.title}`, 14, yOffset);
      yOffset += 6;
    }
    if (this.filters.sessionDateFrom) doc.text(`من تاريخ: ${this.filters.sessionDateFrom}`, 14, yOffset);
    if (this.filters.sessionDateTo) doc.text(`إلى تاريخ: ${this.filters.sessionDateTo}`, 14, yOffset + 6);
    
    doc.text(`تاريخ التقرير: ${new Date().toLocaleDateString('ar-EG')}`, doc.internal.pageSize.getWidth() - 40, 25);
    doc.text(`عدد السجلات: ${this.dataSource.data.length}`, doc.internal.pageSize.getWidth() - 40, 32);

    autoTable(doc, {
      head: [['#', 'عنوان الجلسة', 'الدورة', 'المدرب', 'المكان', 'التاريخ', 'وقت البدء', 'وقت الانتهاء', 'الحالة']],
      body: this.dataSource.data.map((session: any, index: number) => [
        (index + 1).toString(),
        session.title || '-',
        session.course?.title || '-',
        session.trainer?.title || '-',
        session.place?.title || '-',
        session.sessionDate || '-',
        session.startTime || '-',
        session.endTime || '-',
        session.status?.title || '-'
      ]),
      startY: yOffset + 15,
      styles: { halign: 'right', fontSize: 9, cellPadding: 2 },
      headStyles: { fillColor: [37, 99, 235], textColor: [255, 255, 255], halign: 'right' },
      alternateRowStyles: { fillColor: [243, 244, 246] }
    });

    doc.save('course-sessions-report.pdf');
    this.notification.showSuccess('تم تصدير التقرير بنجاح');
  }
}