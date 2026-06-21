// course-list.component.ts

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
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { CourseService } from '../../../../core/services/course.service';
import { EnrollmentService } from '../../../../core/services/enrollment.service';
import { CourseSessionService } from '../../../../core/services/course-session.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { ReportService } from '../../../../core/services/report.service';
import { SearchableSelectComponent, SelectOption } from '../../../../shared/components/searchable-select/searchable-select.component';
import { CourseWizardModalComponent } from '../course-wizard/course-wizard-modal.component';
import { CourseDetailsModalComponent } from '../course-details/course-details-modal.component';

// Helper to map backend LookupVTO to display title
interface CourseTypeLookup {
  id: number;
  title: string;     // Arabic title "تأهيل" أو "تدريب"
  value: string;     // Enum constant "QUALIFICATION" or "TRAINING"
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

  filters = {
    quickSearch: '',
    courseType: null as string | null,
    isActive: null as boolean | null,
    startDateFrom: null as Date | null,  // Changed to Date type
    startDateTo: null as Date | null,    // Changed to Date type
    endDateFrom: null as Date | null,    // Changed to Date type
    endDateTo: null as Date | null       // Changed to Date type
  };

  courseTypeOptions: SelectOption[] = [];
  statusOptions: SelectOption[] = [];
  courseTypes: CourseTypeLookup[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
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

  constructor(
    private courseService: CourseService,
    private enrollmentService: EnrollmentService,
    private courseSessionService: CourseSessionService,
    private notification: NotificationService,
    private reportService: ReportService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadCourseTypes();
    this.loadSelectOptions();
    this.loadCourses();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  /**
   * Format a Date object to YYYY-MM-DD string for API
   */
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
        
        console.log('Course types loaded:', this.courseTypes);
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

  loadCourses(): void {
    this.isLoading = true;
    
    const params: any = {};
    if (this.filters.quickSearch) params.quickSearch = this.filters.quickSearch;
    if (this.filters.courseType) params.courseType = this.filters.courseType;
    if (this.filters.isActive !== null) params.isActive = this.filters.isActive;
    
    // Format dates before sending to API
    if (this.filters.startDateFrom) params.startDateFrom = this.formatDateForAPI(this.filters.startDateFrom);
    if (this.filters.startDateTo) params.startDateTo = this.formatDateForAPI(this.filters.startDateTo);
    if (this.filters.endDateFrom) params.endDateFrom = this.formatDateForAPI(this.filters.endDateFrom);
    if (this.filters.endDateTo) params.endDateTo = this.formatDateForAPI(this.filters.endDateTo);

    console.log('Sending params to API:', params);

    this.courseService.getAllCourses(params).subscribe({
      next: (res: any) => {
        this.allCourses = res.items || [];
        this.dataSource.data = [...this.allCourses];
        this.isLoading = false;
        console.log('Courses loaded:', this.allCourses);
      },
      error: (err) => {
        console.error('Error loading courses:', err);
        this.notification.showError('حدث خطأ في تحميل الدورات');
        this.isLoading = false;
      }
    });
  }

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
    this.loadCourses();
    this.notification.showSuccess('تم مسح جميع الفلاتر');
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

  exportToExcel(): void {
    if (this.dataSource.data.length === 0) {
      this.notification.showWarning('لا توجد بيانات لتصديرها');
      return;
    }

    const exportData = this.dataSource.data.map((course: any, index: number) => ({
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
    this.notification.showSuccess('تم تصدير التقرير بنجاح');
  }

  exportToPDF(): void {
    if (this.dataSource.data.length === 0) {
      this.notification.showWarning('لا توجد بيانات لتصديرها');
      return;
    }

    this.isLoading = true;

    const filterTexts: string[] = [];
    if (this.filters.quickSearch) filterTexts.push(`بحث: ${this.filters.quickSearch}`);
    if (this.filters.courseType) {
      const courseType = this.courseTypes.find(t => t.value === this.filters.courseType);
      if (courseType) filterTexts.push(`نوع الدورة: ${courseType.title}`);
    }
    if (this.filters.isActive !== null) {
      filterTexts.push(`الحالة: ${this.filters.isActive ? 'نشط' : 'غير نشط'}`);
    }

    let tableRows = '';
    this.dataSource.data.forEach((course: any, index: number) => {
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
          <p>عدد السجلات: ${this.dataSource.data.length} دورة</p>
        </div>
        ${filterTexts.length > 0 ? `<div class="filters"><strong>الفلاتر المطبقة:</strong> ${filterTexts.join(' | ')}</div>` : ''}
        <div class="stats">
          <div class="stat-item"><div class="stat-value">${this.allCourses.length}</div><div class="stat-label">إجمالي الدورات</div></div>
          <div class="stat-item"><div class="stat-value">${this.qualCount}</div><div class="stat-label">دورات تأهيل</div></div>
          <div class="stat-item"><div class="stat-value">${this.trainCount}</div><div class="stat-label">دورات تدريب</div></div>
          <div class="stat-item"><div class="stat-value">${this.totalRevenue.toLocaleString('ar-EG')} جم</div><div class="stat-label">إجمالي الإيرادات</div></div>
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
        <div class="footer">تم التصدير من نظام إدارة الأكاديمية الأولمبية</div>
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
      this.notification.showSuccess('تم فتح التقرير - يمكنك طباعته أو حفظه كـ PDF');
    } else {
      document.body.appendChild(printContainer);
      window.print();
      setTimeout(() => { document.body.removeChild(printContainer); }, 500);
      this.isLoading = false;
      this.notification.showSuccess('تم فتح التقرير - يمكنك حفظه كـ PDF من نافذة الطباعة');
    }
  }
}