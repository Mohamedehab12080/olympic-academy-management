import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

import { FinancialService } from '../../../../../../core/services/financial.service';
import { NotificationService } from '../../../../../../core/services/notification.service';
import { ReportService } from '../../../../../../core/services/report.service';
import { REFUND_STATUSES } from '../../../../../../core/models/financial.model';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-enrollment-refund-list',
  templateUrl: './enrollment-refund-list.component.html',
  styleUrls: ['./enrollment-refund-list.component.css']
})
export class EnrollmentRefundListComponent implements OnInit {
  displayedColumns = ['id', 'enrollment', 'amountRefunded', 'refundDate', 'paymentMethod', 'status', 'actions'];
  dataSource = new MatTableDataSource<any>([]);
  isLoading = false;
  refundStatuses = REFUND_STATUSES;
  
  // قوائم للفلترة
  enrollments: any[] = [];
  paymentMethods: any[] = [];
  
  // معايير الفلترة
  filters = {
    enrollmentId: null as number | null,
    paymentMethodId: null as number | null,
    status: null as number | null,
    refundDateFrom: null as string | null,
    refundDateTo: null as string | null
  };
  
  quickSearch: string = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private financialService: FinancialService,
    private notification: NotificationService,
    private reportService: ReportService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadLookupData();
    this.loadData();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadLookupData() {
    // تحميل التسجيلات للفلترة
    this.financialService.getAllEnrollmentRefundsByFilter().subscribe({
      next: (res: any) => {
        const uniqueEnrollments = new Map();
        res.items.forEach((item: any) => {
          if (item.enrollment && !uniqueEnrollments.has(item.enrollment.id)) {
            uniqueEnrollments.set(item.enrollment.id, item.enrollment);
          }
        });
        this.enrollments = Array.from(uniqueEnrollments.values());
      },
      error: () => { this.notification.showError('حدث خطأ في تحميل التسجيلات'); }
    });

    // تحميل طرق الدفع
    this.financialService.getAllPaymentMethodsLookup().subscribe({
      next: (res: any) => { this.paymentMethods = res.list; },
      error: () => { this.notification.showError('حدث خطأ في تحميل طرق الدفع'); }
    });
  }

  loadData() {
    this.isLoading = true;
    const params: any = {};
    
    if (this.filters.enrollmentId) params.enrollmentId = this.filters.enrollmentId;
    if (this.filters.paymentMethodId) params.paymentMethodId = this.filters.paymentMethodId;
    if (this.filters.status) params.status = this.filters.status;
    if (this.filters.refundDateFrom) params.refundDateFrom = this.filters.refundDateFrom;
    if (this.filters.refundDateTo) params.refundDateTo = this.filters.refundDateTo;
    if (this.quickSearch) params.quickSearch = this.quickSearch;

    this.financialService.getAllEnrollmentRefundsByFilter(params).subscribe({
      next: (res: any) => {
        this.dataSource.data = res.items;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
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
    this.loadData();
  }

  resetFilters() {
    this.filters = {
      enrollmentId: null,
      paymentMethodId: null,
      status: null,
      refundDateFrom: null,
      refundDateTo: null
    };
    this.quickSearch = '';
    this.loadData();
    this.notification.showSuccess('تم مسح جميع الفلاتر');
  }

  exportToExcel() {
    if (this.dataSource.data.length === 0) {
      this.notification.showWarning('لا توجد بيانات لتصديرها');
      return;
    }

    const exportData = this.dataSource.data.map((item, index) => ({
      '#': index + 1,
      'التسجيل': item.enrollment?.title,
      'المبلغ المسترد': item.amountRefunded,
      'تاريخ الاسترداد': item.refundDate,
      'طريقة الدفع': item.paymentMethod?.title,
      'حالة الاسترداد': item.status?.title,
      'ملاحظات': item.note || '-'
    }));

    this.reportService.exportToExcel(exportData, 'enrollment-refunds-list', 'استردادات التسجيلات');
    this.notification.showSuccess('تم تصدير البيانات بنجاح');
  }

  exportToPDF() {
    if (this.dataSource.data.length === 0) {
      this.notification.showWarning('لا توجد بيانات لتصديرها');
      return;
    }

    const doc = new jsPDF('l', 'mm', 'a4');
    
    doc.setFontSize(18);
    doc.text('تقرير استردادات التسجيلات', doc.internal.pageSize.getWidth() / 2, 15, { align: 'center' });
    
    doc.setFontSize(10);
    let yOffset = 25;
    if (this.filters.refundDateFrom) doc.text(`من تاريخ: ${this.filters.refundDateFrom}`, 14, yOffset);
    if (this.filters.refundDateTo) doc.text(`إلى تاريخ: ${this.filters.refundDateTo}`, 14, yOffset + 6);
    if (this.filters.status) {
      const status = this.refundStatuses.find(s => s.id === this.filters.status);
      if (status) doc.text(`حالة الاسترداد: ${status.title}`, 14, yOffset + 12);
    }
    
    doc.text(`تاريخ التقرير: ${new Date().toLocaleDateString('ar-EG')}`, doc.internal.pageSize.getWidth() - 40, 25);
    doc.text(`عدد السجلات: ${this.dataSource.data.length}`, doc.internal.pageSize.getWidth() - 40, 32);

    autoTable(doc, {
      head: [['#', 'التسجيل', 'المبلغ المسترد', 'تاريخ الاسترداد', 'طريقة الدفع', 'حالة الاسترداد', 'ملاحظات']],
      body: this.dataSource.data.map((item, index) => [
        (index + 1).toString(),
        item.enrollment?.title || '-',
        `${item.amountRefunded} جم`,
        item.refundDate,
        item.paymentMethod?.title || '-',
        item.status?.title || '-',
        item.note || '-'
      ]),
      startY: yOffset + 25,
      styles: { halign: 'right', fontSize: 9, cellPadding: 2 },
      headStyles: { fillColor: [37, 99, 235], textColor: [255, 255, 255], halign: 'right' },
      alternateRowStyles: { fillColor: [243, 244, 246] }
    });

    doc.save('enrollment-refunds-report.pdf');
    this.notification.showSuccess('تم تصدير التقرير بنجاح');
  }
      getStatusColor(statusId: number): string {
      switch(statusId) {
        case 2: return '#d1fae5';  // موافق - أخضر
        case 4: return '#dbeafe';  // مكتمل - أزرق
        case 1: return '#fef3c7';  // قيد الانتظار - أصفر
        case 3: return '#fee2e2';  // مرفوض - أحمر
        default: return '#f3f4f6';
      }
    }

    getStatusTextColor(statusId: number): string {
      switch(statusId) {
        case 2: return '#065f46';
        case 4: return '#1e40af';
        case 1: return '#92400e';
        case 3: return '#991b1b';
        default: return '#374151';
      }
    }

  viewRefund(id: number) {
    this.router.navigate(['/financial/enrollment-refunds', id]);
  }

  editRefund(id: number) {
    this.router.navigate(['/financial/enrollment-refunds', id, 'edit']);
  }

  deleteRefund(item: any) {
    if (confirm(`هل أنت متأكد من حذف استرداد التسجيل؟`)) {
      this.financialService.deleteEnrollmentRefund(item.id).subscribe({
        next: () => {
          this.notification.showSuccess('تم الحذف بنجاح');
          this.loadData();
        },
        error: () => this.notification.showError('حدث خطأ في الحذف')
      });
    }
  }
}