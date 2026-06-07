import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { FinancialService } from '../../../../../core/services/financial.service';
import { NotificationService } from '../../../../../core/services/notification.service';
import { ReportService } from '../../../../../core/services/report.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-payment-method-list',
  templateUrl: './payment-method-list.component.html',
  styleUrls: ['./payment-method-list.component.css']
})
export class PaymentMethodListComponent implements OnInit {
  displayedColumns = ['id', 'title', 'actions'];
  dataSource = new MatTableDataSource<any>([]);
  isLoading = false;
  quickSearch: string = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private financialService: FinancialService,
    private notification: NotificationService,
    private reportService: ReportService,
    private router: Router
  ) {}

  ngOnInit() { this.loadData(); }
  ngAfterViewInit() { this.dataSource.paginator = this.paginator; this.dataSource.sort = this.sort; }

  loadData() {
    this.isLoading = true;
    const params: any = {};
    if (this.quickSearch) params.quickSearch = this.quickSearch;
    this.financialService.getAllPaymentMethods(params).subscribe({
      next: (res: any) => { this.dataSource.data = res.items; this.dataSource.paginator = this.paginator; this.dataSource.sort = this.sort; this.isLoading = false; },
      error: () => { this.notification.showError('حدث خطأ'); this.isLoading = false; }
    });
  }

  applyQuickSearch(event: Event) { this.quickSearch = (event.target as HTMLInputElement).value; this.loadData(); }

  exportToExcel() {
    if (this.dataSource.data.length === 0) { this.notification.showWarning('لا توجد بيانات'); return; }
    const exportData = this.dataSource.data.map((item, index) => ({ '#': index + 1, 'الاسم': item.title }));
    this.reportService.exportToExcel(exportData, 'payment-methods-list', 'طرق الدفع');
    this.notification.showSuccess('تم تصدير البيانات');
  }

  exportToPDF() {
    if (this.dataSource.data.length === 0) { this.notification.showWarning('لا توجد بيانات'); return; }
    const doc = new jsPDF('p', 'mm', 'a4');
    doc.setFontSize(18); doc.text('طرق الدفع', doc.internal.pageSize.getWidth() / 2, 15, { align: 'center' });
    doc.text(`تاريخ التقرير: ${new Date().toLocaleDateString('ar-EG')}`, 14, 25);
    doc.text(`عدد السجلات: ${this.dataSource.data.length}`, 14, 32);
    autoTable(doc, {
      head: [['#', 'الاسم']],
      body: this.dataSource.data.map((item, index) => [(index + 1).toString(), item.title]),
      startY: 40,
      styles: { halign: 'right', fontSize: 10 },
      headStyles: { fillColor: [37, 99, 235], textColor: [255, 255, 255] }
    });
    doc.save('payment-methods-report.pdf');
    this.notification.showSuccess('تم تصدير التقرير');
  }

  editMethod(id: number) { this.router.navigate(['/financial/payment-methods', id, 'edit']); }
  deleteMethod(item: any) {
    if (confirm(`حذف "${item.title}"؟`)) {
      this.financialService.deletePaymentMethod(item.id).subscribe({
        next: () => { this.notification.showSuccess('تم الحذف'); this.loadData(); },
        error: () => this.notification.showError('حدث خطأ')
      });
    }
  }
}