// enrollment-list.component.ts

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
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

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
    MatSlideToggleModule,
    SearchableSelectComponent
  ],
  templateUrl: './enrollment-list.component.html',
  styleUrls: ['./enrollment-list.component.css']
})
export class EnrollmentListComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['index', 'trainee', 'course', 'trainer', 'startDate', 'endDate', 'isActive', 'enrollmentStatus', 'paymentStatus', 'amount', 'actions'];
  dataSource = new MatTableDataSource<any>([]);
  isLoading = false;
  
  trainees: any[] = [];
  courses: any[] = [];
  trainers: any[] = [];
  paymentStatuses = PAYMENT_STATUSES;
  enrollmentStatuses = ENROLLMENT_STATUSES;
  
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

  get isActiveCount(): number {
    return this.dataSource.data.filter(item => item.isActive === true).length;
  }

  get isInactiveCount(): number {
    return this.dataSource.data.filter(item => item.isActive === false).length;
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
    if (this.filters.isActive !== null) params.isActive = this.filters.isActive;
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

  toggleActiveFilter(event: any): void {
    this.filters.isActive = event.checked;
    this.loadEnrollments();
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
      endDateTo: null,
      isActive: null
    };
    this.quickSearch = '';
    const toggle = document.querySelector('#activeToggle') as HTMLInputElement;
    if (toggle) {
      toggle.checked = false;
    }
    this.loadEnrollments();
    this.notification.showSuccess('تم مسح جميع الفلاتر');
  }

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

  getActiveStatusClass(isActive: boolean): string {
    return isActive ? 'active-status' : 'inactive-status';
  }

  getActiveStatusText(isActive: boolean): string {
    return isActive ? 'نشط' : 'غير نشط';
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
      'الحالة': item.isActive ? 'نشط' : 'غير نشط',
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
    this.dataSource.data.forEach((item: any, index: number) => {
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
      
      tableRows += `
        <tr style="background-color: ${rowBgColor};">
          <td style="text-align: center; padding: 10px 12px; border: 1px solid #e2e8f0; font-weight: 600; color: #64748b;">${index + 1}</td>
          <td style="text-align: right; padding: 10px 12px; border: 1px solid #e2e8f0; font-weight: 700; color: #0f3460;">${item.trainee?.title || '-'}</td>
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
          <p style="opacity: 0.7; font-size: 13px;">عدد السجلات: ${this.dataSource.data.length} تسجيل</p>
        </div>
        
        ${filterTexts.length > 0 ? `<div class="filters"><strong>🔍 الفلاتر المطبقة:</strong> ${filterTexts.join(' | ')}</div>` : ''}
        
        <div class="stats">
          <div class="stat-item purple">
            <span class="stat-value">${this.dataSource.data.length}</span>
            <span class="stat-label">📋 إجمالي التسجيلات</span>
          </div>
          <div class="stat-item blue">
            <span class="stat-value">${this.totalAmount.toLocaleString('ar-EG')} جم</span>
            <span class="stat-label">💰 إجمالي المبالغ</span>
          </div>
          <div class="stat-item amber">
            <span class="stat-value">${this.paidEnrollments}</span>
            <span class="stat-label">💳 مدفوع</span>
          </div>
          <div class="stat-item green">
            <span class="stat-value">${this.isActiveCount}</span>
            <span class="stat-label">🟢 نشط</span>
          </div>
          <div class="stat-item red">
            <span class="stat-value">${this.isInactiveCount}</span>
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
                ${this.totalAmount.toLocaleString('ar-EG')} جم
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