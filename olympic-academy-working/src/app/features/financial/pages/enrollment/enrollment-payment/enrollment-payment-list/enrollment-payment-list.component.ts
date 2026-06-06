import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

import { FinancialService } from '../../../../../../core/services/financial.service';
import { NotificationService } from '../../../../../../core/services/notification.service';
import { ReportService } from '../../../../../../core/services/report.service';
import { PAYMENT_STATUSES } from '../../../../../../core/models/common.model';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-enrollment-payment-list',
  templateUrl: './enrollment-payment-list.component.html',
  styleUrls: ['./enrollment-payment-list.component.css']
})
export class EnrollmentPaymentListComponent implements OnInit {
  displayedColumns = ['id', 'enrollment', 'paidAmount', 'remainedValue', 'paymentDate', 'paymentMethod', 'paymentStatus', 'actions'];
  dataSource = new MatTableDataSource<any>([]);
  isLoading = false;
  paymentStatuses = PAYMENT_STATUSES;
  
  enrollments: any[] = [];
  paymentMethods: any[] = [];
  
  filters = {
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
    this.financialService.getAllEnrollmentPaymentsByFilter().subscribe({
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
    if (this.filters.paymentStatus) params.paymentStatus = this.filters.paymentStatus;
    if (this.filters.paymentDateFrom) params.paymentDateFrom = this.filters.paymentDateFrom;
    if (this.filters.paymentDateTo) params.paymentDateTo = this.filters.paymentDateTo;
    if (this.quickSearch) params.quickSearch = this.quickSearch;

    this.financialService.getAllEnrollmentPaymentsByFilter(params).subscribe({
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
      paymentStatus: null,
      paymentDateFrom: null,
      paymentDateTo: null
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
      'المبلغ المدفوع': item.paidAmount,
      'المبلغ المتبقي': item.remainedValue,
      'تاريخ الدفع': item.paymentDate,
      'طريقة الدفع': item.paymentMethod?.title,
      'حالة الدفع': item.paymentStatus?.title,
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

    const doc = new jsPDF('l', 'mm', 'a4');
    
    doc.setFontSize(18);
    doc.text('تقرير مدفوعات التسجيلات', doc.internal.pageSize.getWidth() / 2, 15, { align: 'center' });
    
    doc.setFontSize(10);
    let yOffset = 25;
    if (this.filters.paymentDateFrom) doc.text(`من تاريخ: ${this.filters.paymentDateFrom}`, 14, yOffset);
    if (this.filters.paymentDateTo) doc.text(`إلى تاريخ: ${this.filters.paymentDateTo}`, 14, yOffset + 6);
    if (this.filters.paymentStatus) {
      const status = this.paymentStatuses.find(s => s.id === this.filters.paymentStatus);
      if (status) doc.text(`حالة الدفع: ${status.title}`, 14, yOffset + 12);
    }
    
    doc.text(`تاريخ التقرير: ${new Date().toLocaleDateString('ar-EG')}`, doc.internal.pageSize.getWidth() - 40, 25);
    doc.text(`عدد السجلات: ${this.dataSource.data.length}`, doc.internal.pageSize.getWidth() - 40, 32);

    autoTable(doc, {
      head: [['#', 'التسجيل', 'المبلغ المدفوع', 'المبلغ المتبقي', 'تاريخ الدفع', 'طريقة الدفع', 'حالة الدفع', 'ملاحظات']],
      body: this.dataSource.data.map((item, index) => [
        (index + 1).toString(),
        item.enrollment?.title || '-',
        `${item.paidAmount} ريال`,
        `${item.remainedValue} ريال`,
        item.paymentDate,
        item.paymentMethod?.title || '-',
        item.paymentStatus?.title || '-',
        item.note || '-'
      ]),
      startY: yOffset + 25,
      styles: { halign: 'right', fontSize: 9, cellPadding: 2 },
      headStyles: { fillColor: [37, 99, 235], textColor: [255, 255, 255], halign: 'right' },
      alternateRowStyles: { fillColor: [243, 244, 246] }
    });

    doc.save('enrollment-payments-report.pdf');
    this.notification.showSuccess('تم تصدير التقرير بنجاح');
  }

  viewPayment(id: number) {
    this.router.navigate(['/financial/enrollment-payments', id]);
  }

  editPayment(id: number) {
    this.router.navigate(['/financial/enrollment-payments', id, 'edit']);
  }

  deletePayment(item: any) {
    if (confirm(`هل أنت متأكد من حذف دفعة التسجيل؟`)) {
      this.financialService.deleteEnrollmentPayment(item.id).subscribe({
        next: () => {
          this.notification.showSuccess('تم الحذف بنجاح');
          this.loadData();
        },
        error: () => this.notification.showError('حدث خطأ في الحذف')
      });
    }
  }
}