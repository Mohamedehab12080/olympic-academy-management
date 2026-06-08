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
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

import { CourseService } from '../../../../core/services/course.service';
import { EnrollmentService } from '../../../../core/services/enrollment.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { ReportService } from '../../../../core/services/report.service';
import { SearchableSelectComponent, SelectOption } from '../../../../shared/components/searchable-select/searchable-select.component';
import { COURSE_TYPES } from '../../../../core/models/course.model';

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
    SearchableSelectComponent
  ],
  templateUrl: './course-list.component.html',
  styleUrls: ['./course-list.component.css']
})
export class CourseListComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['index', 'title', 'department', 'courseType', 'duration', 'price', 'enrollmentsCount', 'totalRevenue', 'status', 'actions'];
  dataSource = new MatTableDataSource<any>([]);
  allCourses: any[] = [];
  isLoading = false;

  // Filters
  filters = {
    quickSearch: '',
    courseTypeId: null as number | null,
    isActive: null as boolean | null,
    startDateFrom: null as string | null,
    startDateTo: null as string | null,
    endDateFrom: null as string | null,
    endDateTo: null as string | null
  };

  // Options for searchable selects
  courseTypeOptions: SelectOption[] = [];
  statusOptions: SelectOption[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  get qualCount(): number {
    return this.allCourses.filter(c => c.courseType?.id === 1).length;
  }

  get trainCount(): number {
    return this.allCourses.filter(c => c.courseType?.id === 2).length;
  }

  get totalRevenue(): number {
    return this.allCourses.reduce((sum, c) => sum + (c.totalRevenue || 0), 0);
  }

  constructor(
    private courseService: CourseService,
    private enrollmentService: EnrollmentService,
    private notification: NotificationService,
    private reportService: ReportService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadSelectOptions();
    this.loadCourses();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadSelectOptions(): void {
    this.courseTypeOptions = [
      { value: null, label: 'الكل' },
      ...COURSE_TYPES.map(t => ({ value: t.id, label: t.title }))
    ];

    this.statusOptions = [
      { value: null, label: 'الكل' },
      { value: true, label: 'نشط' },
      { value: false, label: 'غير نشط' }
    ];
  }

  loadCourses(): void {
    this.isLoading = true;
    
    const params: any = {};
    if (this.filters.quickSearch) params.quickSearch = this.filters.quickSearch;
    if (this.filters.courseTypeId) params.courseType = this.filters.courseTypeId;
    if (this.filters.isActive !== null) params.isActive = this.filters.isActive;
    if (this.filters.startDateFrom) params.startDateFrom = this.filters.startDateFrom;
    if (this.filters.startDateTo) params.startDateTo = this.filters.startDateTo;
    if (this.filters.endDateFrom) params.endDateFrom = this.filters.endDateFrom;
    if (this.filters.endDateTo) params.endDateTo = this.filters.endDateTo;

    this.courseService.getAllCourses(params).subscribe({
      next: (res: any) => {
        this.allCourses = res.items || [];
        
        this.allCourses.forEach(course => {
          this.enrollmentService.getAllEnrollmentsByFilter({ courseId: course.id }).subscribe({
            next: (enrollments: any) => {
              course.enrollmentsCount = enrollments.items?.length || 0;
              course.totalRevenue = enrollments.items?.reduce((sum: number, e: any) => sum + (e.finalSubscriptionValue || 0), 0) || 0;
              this.dataSource.data = [...this.allCourses];
            },
            error: () => {
              course.enrollmentsCount = 0;
              course.totalRevenue = 0;
            }
          });
        });
        
        this.dataSource.data = this.allCourses;
        this.isLoading = false;
      },
      error: () => {
        this.notification.showError('حدث خطأ في تحميل الدورات');
        this.isLoading = false;
      }
    });
  }

  resetFilters(): void {
    this.filters = {
      quickSearch: '',
      courseTypeId: null,
      isActive: null,
      startDateFrom: null,
      startDateTo: null,
      endDateFrom: null,
      endDateTo: null
    };
    this.loadCourses();
    this.notification.showSuccess('تم مسح جميع الفلاتر');
  }

  viewCourse(id: number): void {
    this.router.navigate(['/courses', id]);
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

  exportToExcel(): void {
    if (this.dataSource.data.length === 0) {
      this.notification.showWarning('لا توجد بيانات لتصديرها');
      return;
    }

    const exportData = this.dataSource.data.map((course: any, index: number) => ({
      '#': index + 1,
      'اسم الدورة': course.title,
      'القسم': course.department?.title || '-',
      'النوع': course.courseType?.title || '-',
      'المدة': `${course.duration || 0} ساعة`,
      'السعر': course.price || 0,
      'عدد المسجلين': course.enrollmentsCount || 0,
      'الإيرادات': course.totalRevenue || 0,
      'الحالة': course.isActive ? 'نشط' : 'غير نشط'
    }));

    this.reportService.exportToExcel(exportData, 'courses-list', 'الدورات');
    this.notification.showSuccess('تم تصدير التقرير بنجاح');
  }

  exportToPDF(): void {
    if (this.dataSource.data.length === 0) {
      this.notification.showWarning('لا توجد بيانات لتصديرها');
      return;
    }

    const doc = new jsPDF('l', 'mm', 'a4');
    
    doc.setFontSize(18);
    doc.text('قائمة الدورات', doc.internal.pageSize.getWidth() / 2, 20, { align: 'center' });
    
    autoTable(doc, {
      head: [['#', 'اسم الدورة', 'القسم', 'النوع', 'المدة', 'السعر', 'عدد المسجلين', 'الإيرادات', 'الحالة']],
      body: this.dataSource.data.map((course: any, index: number) => [
        (index + 1).toString(),
        course.title || '-',
        course.department?.title || '-',
        course.courseType?.title || '-',
        `${course.duration || 0} ساعة`,
        `${course.price || 0} جم`,
        (course.enrollmentsCount || 0).toString(),
        `${course.totalRevenue || 0} جم`,
        course.isActive ? 'نشط' : 'غير نشط'
      ]),
      startY: 35,
      styles: { halign: 'right', fontSize: 9, cellPadding: 2 },
      headStyles: { fillColor: [37, 99, 235], textColor: [255, 255, 255], halign: 'right' },
      alternateRowStyles: { fillColor: [243, 244, 246] }
    });

    doc.save('courses-list.pdf');
    this.notification.showSuccess('تم تصدير التقرير بنجاح');
  }
}