import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
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
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { EnrollmentService } from '../../../../core/services/enrollment.service';
import { TraineeService } from '../../../../core/services/trainee.service';
import { CourseService } from '../../../../core/services/course.service';
import { EmployeeService } from '../../../../core/services/employee.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { ReportService } from '../../../../core/services/report.service';
import { SearchableSelectComponent, SelectOption } from '../../../../shared/components/searchable-select/searchable-select.component';
import { PAYMENT_STATUSES } from '../../../../core/models/common.model';
import { ENROLLMENT_STATUSES } from '../../../../core/models/enrollment.model';
import { EnrollmentDetailsModalComponent } from './../enrollment-details/enrollment-details-modal.component';
import { EnrollmentWizardModalComponent } from './../enrollment-wizard/enrollment-wizard-modal.component';

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
    SearchableSelectComponent
  ],
  templateUrl: './enrollment-list.component.html',
  styleUrls: ['./enrollment-list.component.css']
})
export class EnrollmentListComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['index', 'trainee', 'course', 'trainer', 'startDate', 'endDate', 'enrollmentStatus', 'paymentStatus', 'amount', 'actions'];
  dataSource = new MatTableDataSource<any>([]);
  isLoading = false;
  
  trainees: any[] = [];
  courses: any[] = [];
  trainers: any[] = [];
  paymentStatuses = PAYMENT_STATUSES;
  enrollmentStatuses = ENROLLMENT_STATUSES;
  
  // Searchable select options
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
    endDateTo: null as string | null
  };
  
  quickSearch: string = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  // Statistics
  get totalAmount(): number {
    return this.dataSource.data.reduce((sum, item) => sum + (item.finalSubscriptionValue || 0), 0);
  }

  get activeEnrollments(): number {
    return this.dataSource.data.filter(item => item.enrollmentStatus?.id === 1).length;
  }

  get completedEnrollments(): number {
    return this.dataSource.data.filter(item => item.enrollmentStatus?.id === 2).length;
  }

  get paidEnrollments(): number {
    return this.dataSource.data.filter(item => item.paymentStatus?.id === 1).length;
  }

  constructor(
    private enrollmentService: EnrollmentService,
    private traineeService: TraineeService,
    private courseService: CourseService,
    private employeeService: EmployeeService,
    private notification: NotificationService,
    private reportService: ReportService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.loadLookupData();
    this.loadEnrollments();
    this.loadSelectOptions();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
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
    // Load trainees using lookup endpoint
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

    // Load courses
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

    // Load trainers
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

  loadEnrollments() {
    this.isLoading = true;
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
    if (this.quickSearch) params.quickSearch = this.quickSearch;

    this.enrollmentService.getAllEnrollmentsByFilter(params).subscribe({
      next: (res: any) => {
        this.dataSource.data = res.items || [];
        if (this.dataSource.paginator) {
          this.dataSource.paginator = this.paginator;
        }
        if (this.dataSource.sort) {
          this.dataSource.sort = this.sort;
        }
        this.isLoading = false;
      },
      error: () => {
        this.notification.showError('حدث خطأ في تحميل البيانات');
        this.isLoading = false;
      }
    });
  }

  applyQuickSearch(event: Event) {
    this.quickSearch = (event.target as HTMLInputElement).value;
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
      endDateTo: null
    };
    this.quickSearch = '';
    this.loadEnrollments();
    this.notification.showSuccess('تم مسح جميع الفلاتر');
  }

  viewEnrollment(id: number): void {
    this.enrollmentService.getEnrollmentById(id).subscribe({
      next: (enrollment) => {
        this.dialog.open(EnrollmentDetailsModalComponent, {
          data: enrollment,
          width: '650px',
          maxWidth: '90vw'
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
      width: '800px',
      maxWidth: '90vw'
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
      width: '800px',
      maxWidth: '90vw'
    });
    
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadEnrollments();
      }
    });
  }

  deleteEnrollment(enrollment: any): void {
    if (confirm(`هل أنت متأكد من حذف تسجيل "${enrollment.trainee?.title}" في دورة "${enrollment.course?.title}"؟`)) {
      this.enrollmentService.deleteEnrollment(enrollment.id).subscribe({
        next: () => {
          this.notification.showSuccess('تم حذف التسجيل بنجاح');
          this.loadEnrollments();
        },
        error: () => this.notification.showError('حدث خطأ في حذف التسجيل')
      });
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

  exportToExcel() {
    if (this.dataSource.data.length === 0) {
      this.notification.showWarning('لا توجد بيانات لتصديرها');
      return;
    }

    const exportData = this.dataSource.data.map((item, index) => ({
      '#': index + 1,
      'المتدرب': item.trainee?.title,
      'الدورة': item.course?.title,
      'المدرب': item.trainer?.title,
      'تاريخ البدء': item.startDate,
      'تاريخ الانتهاء': item.endDate || '-',
      'حالة التسجيل': item.enrollmentStatus?.title,
      'حالة الدفع': item.paymentStatus?.title,
      'المبلغ': item.finalSubscriptionValue
    }));

    this.reportService.exportToExcel(exportData, 'enrollments-list', 'التسجيلات');
    this.notification.showSuccess('تم تصدير البيانات بنجاح');
  }

  exportToPDF() {
    if (this.dataSource.data.length === 0) {
      this.notification.showWarning('لا توجد بيانات لتصديرها');
      return;
    }

    this.isLoading = true;

    // Build filter text
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
    if (this.filters.startDateFrom) filterTexts.push(`من تاريخ البدء: ${this.filters.startDateFrom}`);
    if (this.filters.startDateTo) filterTexts.push(`إلى تاريخ البدء: ${this.filters.startDateTo}`);
    if (this.filters.endDateFrom) filterTexts.push(`من تاريخ الانتهاء: ${this.filters.endDateFrom}`);
    if (this.filters.endDateTo) filterTexts.push(`إلى تاريخ الانتهاء: ${this.filters.endDateTo}`);
    if (this.quickSearch) filterTexts.push(`بحث: ${this.quickSearch}`);

    // Build table rows
    let tableRows = '';
    this.dataSource.data.forEach((item: any, index: number) => {
      const enrollmentStatusClass = this.getEnrollmentStatusClass(item.enrollmentStatus?.id);
      let enrollmentStatusStyle = '';
      if (enrollmentStatusClass === 'active') enrollmentStatusStyle = 'background-color: #d1fae5; color: #065f46;';
      else if (enrollmentStatusClass === 'completed') enrollmentStatusStyle = 'background-color: #dbeafe; color: #1e40af;';
      else if (enrollmentStatusClass === 'cancelled') enrollmentStatusStyle = 'background-color: #fee2e2; color: #991b1b;';
      
      const paymentStatusClass = this.getPaymentStatusClass(item.paymentStatus?.id);
      let paymentStatusStyle = '';
      if (paymentStatusClass === 'paid') paymentStatusStyle = 'background-color: #d1fae5; color: #065f46;';
      else if (paymentStatusClass === 'partial') paymentStatusStyle = 'background-color: #fef3c7; color: #92400e;';
      else if (paymentStatusClass === 'unpaid') paymentStatusStyle = 'background-color: #fee2e2; color: #991b1b;';
      
      tableRows += `
        <tr>
          <td style="text-align: center; padding: 8px; border: 1px solid #ddd;">${index + 1}</td>
          <td style="text-align: right; padding: 8px; border: 1px solid #ddd; font-weight: bold;">${item.trainee?.title || '-'}</td>
          <td style="text-align: right; padding: 8px; border: 1px solid #ddd;">${item.course?.title || '-'}</td>
          <td style="text-align: right; padding: 8px; border: 1px solid #ddd;">${item.trainer?.title || '-'}</td>
          <td style="text-align: center; padding: 8px; border: 1px solid #ddd;">${item.startDate || '-'}</td>
          <td style="text-align: center; padding: 8px; border: 1px solid #ddd;">${item.endDate || '-'}</td>
          <td style="text-align: center; padding: 8px; border: 1px solid #ddd; ${enrollmentStatusStyle}">
            ${item.enrollmentStatus?.title || '-'}
          </td>
          <td style="text-align: center; padding: 8px; border: 1px solid #ddd; ${paymentStatusStyle}">
            ${item.paymentStatus?.title || '-'}
          </td>
          <td style="text-align: right; padding: 8px; border: 1px solid #ddd; font-weight: bold; color: #ec489a;">
            ${(item.finalSubscriptionValue || 0).toLocaleString('ar-EG')} جم
          </td>
        </tr>
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
        <title>تقرير التسجيلات</title>
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
            background: linear-gradient(135deg, #ec489a 0%, #be185d 100%);
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
          }
          .stat-item {
            flex: 1;
            text-align: center;
          }
          .stat-label { font-size: 12px; color: #6b7280; }
          .stat-value { font-size: 20px; font-weight: bold; color: #ec489a; }
          table {
            width: 100%;
            border-collapse: collapse;
            direction: rtl;
          }
          th {
            background: linear-gradient(135deg, #ec489a 0%, #be185d 100%);
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
          <h1>تقرير التسجيلات</h1>
          <p>تاريخ التقرير: ${new Date().toLocaleDateString('ar-EG')}</p>
          <p>عدد السجلات: ${this.dataSource.data.length} تسجيل</p>
        </div>
        ${filterTexts.length > 0 ? `<div class="filters"><strong>الفلاتر المطبقة:</strong> ${filterTexts.join(' | ')}</div>` : ''}
        <div class="stats">
          <div class="stat-item">
            <div class="stat-value">${this.dataSource.data.length}</div>
            <div class="stat-label">إجمالي التسجيلات</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">${this.activeEnrollments}</div>
            <div class="stat-label">تسجيلات نشطة</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">${this.totalAmount.toLocaleString('ar-EG')} جم</div>
            <div class="stat-label">إجمالي المبالغ</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">${this.paidEnrollments}</div>
            <div class="stat-label">مدفوع</div>
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
              <th>حالة التسجيل</th>
              <th>حالة الدفع</th>
              <th>المبلغ</th>
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
          <button onclick="window.print();" style="padding: 10px 20px; background: linear-gradient(135deg, #ec489a 0%, #be185d 100%); color: white; border: none; border-radius: 5px; cursor: pointer;">
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