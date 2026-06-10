import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { FinancialService } from '../../../../../../core/services/financial.service';
import { CourseService } from '../../../../../../core/services/course.service';
import { NotificationService } from '../../../../../../core/services/notification.service';
import { ReportService } from '../../../../../../core/services/report.service';
import { PAYMENT_STATUSES } from '../../../../../../core/models/common.model';
import { SearchableSelectComponent, SelectOption } from '../../../../../../shared/components/searchable-select/searchable-select.component';
import { EnrollmentPaymentDetailsModalComponent } from '../enrollment-payment-details/enrollment-payment-details-modal.component';
import { EnrollmentPaymentWizardModalComponent } from '../enrollment-payment-wizard/enrollment-payment-wizard-modal.component';

@Component({
  selector: 'app-enrollment-payment-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatDialogModule,
    SearchableSelectComponent
  ],
  templateUrl: './enrollment-payment-list.component.html',
  styleUrls: ['./enrollment-payment-list.component.css']
})
export class EnrollmentPaymentListComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['id', 'trainee', 'course', 'paidAmount', 'remainedValue', 'paymentDate', 'paymentMethod', 'paymentStatus', 'actions'];
  dataSource = new MatTableDataSource<any>([]);
  isLoading = false;
  paymentStatuses = PAYMENT_STATUSES;
  
  courses: any[] = [];
  enrollments: any[] = [];
  paymentMethods: any[] = [];
  
  // Options for searchable selects
  courseOptions: SelectOption[] = [];
  enrollmentOptions: SelectOption[] = [];
  paymentMethodOptions: SelectOption[] = [];
  paymentStatusOptions: SelectOption[] = [];
  
  filters = {
    courseId: null as number | null,
    enrollmentId: null as number | null,
    paymentMethodId: null as number | null,
    paymentStatus: null as number | null,
    paymentDateFrom: null as string | null,
    paymentDateTo: null as string | null
  };
  
  quickSearch: string = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private financialService: FinancialService,
    private courseService: CourseService,
    private notification: NotificationService,
    private reportService: ReportService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.loadSelectOptions();
    this.loadLookupData();
    this.loadData();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadSelectOptions(): void {
    this.paymentStatusOptions = [
      { value: null, label: 'الكل' },
      ...this.paymentStatuses.map(s => ({ value: s.id, label: s.title }))
    ];
  }

  loadLookupData() {
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

    // Load payment methods
    this.financialService.getAllPaymentMethodsLookup().subscribe({
      next: (res: any) => { 
        this.paymentMethods = res.list || [];
        this.paymentMethodOptions = [
          { value: null, label: 'الكل' },
          ...this.paymentMethods.map(p => ({ value: p.id, label: p.title }))
        ];
      },
      error: () => { 
        this.notification.showError('حدث خطأ في تحميل طرق الدفع'); 
      }
    });
  }

  loadData() {
    this.isLoading = true;
    const params: any = {};
    
    if (this.filters.courseId) params.courseId = this.filters.courseId;
    if (this.filters.enrollmentId) params.enrollmentId = this.filters.enrollmentId;
    if (this.filters.paymentMethodId) params.paymentMethodId = this.filters.paymentMethodId;
    if (this.filters.paymentStatus) params.paymentStatus = this.filters.paymentStatus;
    if (this.filters.paymentDateFrom) params.paymentDateFrom = this.filters.paymentDateFrom;
    if (this.filters.paymentDateTo) params.paymentDateTo = this.filters.paymentDateTo;
    if (this.quickSearch) params.quickSearch = this.quickSearch;

    this.financialService.getAllEnrollmentPaymentsByFilter(params).subscribe({
      next: (res: any) => {
        this.dataSource.data = res.items || [];
        
        // Extract unique enrollments for filter dropdown
        const uniqueEnrollments = new Map();
        res.items.forEach((item: any) => {
          if (item.enrollment && !uniqueEnrollments.has(item.enrollment.id)) {
            uniqueEnrollments.set(item.enrollment.id, {
              id: item.enrollment.id,
              title: `${item.enrollment.trainee?.title || ''} - ${item.enrollment.course?.title || ''}`,
              traineeTitle: item.enrollment.trainee?.title,
              courseTitle: item.enrollment.course?.title
            });
          }
        });
        this.enrollments = Array.from(uniqueEnrollments.values());
        this.enrollmentOptions = [
          { value: null, label: 'الكل' },
          ...this.enrollments.map(e => ({ value: e.id, label: e.title }))
        ];
        
        if (this.dataSource.paginator) {
          this.dataSource.paginator = this.paginator;
        }
        if (this.dataSource.sort) {
          this.dataSource.sort = this.sort;
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading data:', err);
        this.notification.showError('حدث خطأ في تحميل البيانات');
        this.isLoading = false;
      }
    });
  }

  applyQuickSearch(event: Event) {
    this.quickSearch = (event.target as HTMLInputElement).value;
    this.loadData();
  }

  resetFilters() {
    this.filters = {
      courseId: null,
      enrollmentId: null,
      paymentMethodId: null,
      paymentStatus: null,
      paymentDateFrom: null,
      paymentDateTo: null
    };
    this.quickSearch = '';
    this.loadData();
    this.notification.showSuccess('تم مسح جميع الفلاتر');
  }

  viewPayment(id: number) {
    this.financialService.getEnrollmentPaymentById(id).subscribe({
      next: (payment) => {
        this.dialog.open(EnrollmentPaymentDetailsModalComponent, {
          data: payment,
          width: '650px',
          maxWidth: '90vw'
        });
      },
      error: () => {
        this.notification.showError('حدث خطأ في تحميل بيانات الدفعة');
      }
    });
  }

  openNewPaymentModal() {
    const dialogRef = this.dialog.open(EnrollmentPaymentWizardModalComponent, {
      data: {},
      width: '800px',
      maxWidth: '90vw'
    });
    
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadData();
      }
    });
  }

  editPayment(id: number) {
    const dialogRef = this.dialog.open(EnrollmentPaymentWizardModalComponent, {
      data: { paymentId: id },
      width: '800px',
      maxWidth: '90vw'
    });
    
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadData();
      }
    });
  }

  deletePayment(item: any) {
    if (confirm(`هل أنت متأكد من حذف دفعة التسجيل؟`)) {
      this.financialService.deleteEnrollmentPayment(item.id).subscribe({
        next: () => {
          this.notification.showSuccess('تم الحذف بنجاح');
          this.loadData();
        },
        error: () => {
          this.notification.showError('حدث خطأ في الحذف');
        }
      });
    }
  }

  getPaymentStatusColor(statusId: number): string {
    switch(statusId) {
      case 2: return '#d1fae5';
      case 1: return '#fef3c7';
      default: return '#f3f4f6';
    }
  }

  getPaymentStatusTextColor(statusId: number): string {
    switch(statusId) {
      case 2: return '#065f46';
      case 1: return '#92400e';
      default: return '#374151';
    }
  }

  // Totals Methods
  getTotalPaymentsCount(): number {
    return this.dataSource.data.length;
  }

  getTotalPaidAmount(): number {
    return this.dataSource.data.reduce((sum, payment) => sum + (payment.paidAmount || 0), 0);
  }

  getTotalRemainingAmount(): number {
    return this.dataSource.data.reduce((sum, payment) => sum + (payment.remainedValue || 0), 0);
  }

  getAveragePayment(): number {
    const count = this.getTotalPaymentsCount();
    if (count === 0) return 0;
    return this.getTotalPaidAmount() / count;
  }

  exportToExcel() {
    if (this.dataSource.data.length === 0) {
      this.notification.showWarning('لا توجد بيانات لتصديرها');
      return;
    }

    const exportData = this.dataSource.data.map((item, index) => ({
      '#': index + 1,
      'المتدرب': item.enrollment?.trainee?.title || '-',
      'الدورة': item.enrollment?.course?.title || '-',
      'المبلغ المدفوع': item.paidAmount,
      'المبلغ المتبقي': item.remainedValue,
      'تاريخ الدفع': item.paymentDate,
      'طريقة الدفع': item.paymentMethod?.title || '-',
      'حالة الدفع': item.paymentStatus?.title || '-',
      'ملاحظات': item.note || '-'
    }));

    this.reportService.exportToExcel(exportData, 'enrollment-payments-list', 'مدفوعات التسجيلات');
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
    if (this.filters.courseId) {
      const course = this.courses.find(c => c.id === this.filters.courseId);
      if (course) filterTexts.push(`الدورة: ${course.title}`);
    }
    if (this.filters.enrollmentId) {
      const enrollment = this.enrollments.find(e => e.id === this.filters.enrollmentId);
      if (enrollment) filterTexts.push(`التسجيل: ${enrollment.title}`);
    }
    if (this.filters.paymentMethodId) {
      const paymentMethod = this.paymentMethods.find(p => p.id === this.filters.paymentMethodId);
      if (paymentMethod) filterTexts.push(`طريقة الدفع: ${paymentMethod.title}`);
    }
    if (this.filters.paymentStatus) {
      const status = this.paymentStatuses.find(s => s.id === this.filters.paymentStatus);
      if (status) filterTexts.push(`حالة الدفع: ${status.title}`);
    }
    if (this.filters.paymentDateFrom) filterTexts.push(`من تاريخ: ${this.filters.paymentDateFrom}`);
    if (this.filters.paymentDateTo) filterTexts.push(`إلى تاريخ: ${this.filters.paymentDateTo}`);
    if (this.quickSearch) filterTexts.push(`بحث: ${this.quickSearch}`);

    // Build table rows
    let tableRows = '';
    this.dataSource.data.forEach((item: any, index: number) => {
      const statusColor = this.getPaymentStatusColor(item.paymentStatus?.id);
      const statusTextColor = this.getPaymentStatusTextColor(item.paymentStatus?.id);
      
      tableRows += `
        <tr>
          <td style="text-align: center; padding: 8px; border: 1px solid #ddd;">${index + 1}</td>
          <td style="text-align: right; padding: 8px; border: 1px solid #ddd;">${item.enrollment?.trainee?.title || '-'}</td>
          <td style="text-align: right; padding: 8px; border: 1px solid #ddd;">${item.enrollment?.course?.title || '-'}</td>
          <td style="text-align: right; padding: 8px; border: 1px solid #ddd;">${item.paidAmount} جم</td>
          <td style="text-align: right; padding: 8px; border: 1px solid #ddd;">${item.remainedValue} جم</td>
          <td style="text-align: center; padding: 8px; border: 1px solid #ddd;">${item.paymentDate || '-'}</td>
          <td style="text-align: center; padding: 8px; border: 1px solid #ddd;">${item.paymentMethod?.title || '-'}</td>
          <td style="text-align: center; padding: 8px; border: 1px solid #ddd; background-color: ${statusColor}; color: ${statusTextColor};">
            ${item.paymentStatus?.title || '-'}
          </td>
          <td style="text-align: right; padding: 8px; border: 1px solid #ddd;">${item.note || '-'}</td>
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
        <title>تقرير مدفوعات التسجيلات</title>
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
          }
          .stat-item { flex: 1; text-align: center; }
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
          <h1>تقرير مدفوعات التسجيلات</h1>
          <p>تاريخ التقرير: ${new Date().toLocaleDateString('ar-EG')}</p>
          <p>عدد السجلات: ${this.dataSource.data.length} دفعة</p>
        </div>
        ${filterTexts.length > 0 ? `<div class="filters"><strong>الفلاتر المطبقة:</strong> ${filterTexts.join(' | ')}</div>` : ''}
        <div class="stats">
          <div class="stat-item"><div class="stat-value">${this.dataSource.data.length}</div><div class="stat-label">إجمالي المدفوعات</div></div>
          <div class="stat-item"><div class="stat-value">${this.getTotalPaidAmount().toLocaleString('ar-EG')} جم</div><div class="stat-label">إجمالي المبالغ المدفوعة</div></div>
          <div class="stat-item"><div class="stat-value">${this.getTotalRemainingAmount().toLocaleString('ar-EG')} جم</div><div class="stat-label">إجمالي المبالغ المتبقية</div></div>
        </div>
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>المتدرب</th>
              <th>الدورة</th>
              <th>المبلغ المدفوع</th>
              <th>المبلغ المتبقي</th>
              <th>تاريخ الدفع</th>
              <th>طريقة الدفع</th>
              <th>حالة الدفع</th>
              <th>ملاحظات</th>
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
          <button onclick="window.print();" style="padding: 10px 20px; background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%); color: white; border: none; border-radius: 5px; cursor: pointer;">
            🖨️ طباعة / حفظ كـ PDF
          </button>
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
      setTimeout(() => {
        document.body.removeChild(printContainer);
      }, 500);
      this.isLoading = false;
      this.notification.showSuccess('تم فتح التقرير - يمكنك حفظه كـ PDF من نافذة الطباعة');
    }
  }
}