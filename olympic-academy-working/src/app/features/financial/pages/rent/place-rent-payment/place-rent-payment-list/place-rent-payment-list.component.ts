import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { FinancialService } from '../../../../../../core/services/financial.service';
import { PlaceService } from '../../../../../../core/services/place.service';
import { NotificationService } from '../../../../../../core/services/notification.service';
import { ReportService } from '../../../../../../core/services/report.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-place-rent-payment-list',
  templateUrl: './place-rent-payment-list.component.html',
  styleUrls: ['./place-rent-payment-list.component.css']
})
export class PlaceRentPaymentListComponent implements OnInit {
  displayedColumns = ['id', 'place', 'rentAmount', 'payedAmount', 'remainedAmount', 'paymentDate', 'actions'];
  dataSource = new MatTableDataSource<any>([]);
  isLoading = false;
  places: any[] = [];
  rentTypes: any[] = [];
  
  filters = { placeId: null as number | null, rentTypeId: null as number | null, paymentDateFrom: null as string | null, paymentDateTo: null as string | null };
  quickSearch: string = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private financialService: FinancialService,
    private placeService: PlaceService,
    private notification: NotificationService,
    private reportService: ReportService,
    private router: Router
  ) {}

  ngOnInit() { this.loadPlaces(); this.loadRentTypes(); this.loadData(); }
  ngAfterViewInit() { this.dataSource.paginator = this.paginator; this.dataSource.sort = this.sort; }

  loadPlaces() { this.placeService.getAllPlacesLookup().subscribe((res: any) => this.places = res.list); }
  loadRentTypes() { this.financialService.getAllRentTypesLookup().subscribe((res: any) => this.rentTypes = res.list); }

  loadData() {
    this.isLoading = true;
    const params: any = {};
    if (this.filters.placeId) params.placeId = this.filters.placeId;
    if (this.filters.rentTypeId) params.rentTypeId = this.filters.rentTypeId;
    if (this.filters.paymentDateFrom) params.paymentDateFrom = this.filters.paymentDateFrom;
    if (this.filters.paymentDateTo) params.paymentDateTo = this.filters.paymentDateTo;
    if (this.quickSearch) params.quickSearch = this.quickSearch;
    this.financialService.getAllPlaceRentPaymentsByFilter(params).subscribe({
      next: (res: any) => { this.dataSource.data = res.items; this.dataSource.paginator = this.paginator; this.dataSource.sort = this.sort; this.isLoading = false; },
      error: () => { this.notification.showError('حدث خطأ'); this.isLoading = false; }
    });
  }

  applyQuickSearch(event: Event) { this.quickSearch = (event.target as HTMLInputElement).value; this.loadData(); }
  resetFilters() { this.filters = { placeId: null, rentTypeId: null, paymentDateFrom: null, paymentDateTo: null }; this.quickSearch = ''; this.loadData(); this.notification.showSuccess('تم مسح الفلاتر'); }

  exportToExcel() {
    if (this.dataSource.data.length === 0) { this.notification.showWarning('لا توجد بيانات'); return; }
    const exportData = this.dataSource.data.map((item, index) => ({
      '#': index + 1, 'الموقع': item.place?.title, 'قيمة الإيجار': item.rentAmount,
      'المدفوع': item.payedAmount, 'المتبقي': item.remainedAmount, 'تاريخ الدفع': item.paymentDate
    }));
    this.reportService.exportToExcel(exportData, 'place-rent-payments-list', 'مدفوعات الإيجار');
    this.notification.showSuccess('تم تصدير البيانات');
  }

  exportToPDF() {
    if (this.dataSource.data.length === 0) { this.notification.showWarning('لا توجد بيانات'); return; }
    const doc = new jsPDF('l', 'mm', 'a4');
    doc.setFontSize(18); doc.text('تقرير مدفوعات إيجار المواقع', doc.internal.pageSize.getWidth() / 2, 15, { align: 'center' });
    doc.text(`تاريخ التقرير: ${new Date().toLocaleDateString('ar-EG')}`, doc.internal.pageSize.getWidth() - 40, 25);
    doc.text(`عدد السجلات: ${this.dataSource.data.length}`, doc.internal.pageSize.getWidth() - 40, 32);
    autoTable(doc, {
      head: [['#', 'الموقع', 'قيمة الإيجار', 'المدفوع', 'المتبقي', 'تاريخ الدفع']],
      body: this.dataSource.data.map((item, index) => [
        (index + 1).toString(), item.place?.title || '-', `${item.rentAmount} ريال`,
        `${item.payedAmount} ريال`, `${item.remainedAmount} ريال`, item.paymentDate
      ]),
      startY: 35,
      styles: { halign: 'right', fontSize: 9 },
      headStyles: { fillColor: [37, 99, 235], textColor: [255, 255, 255] }
    });
    doc.save('place-rent-payments-report.pdf');
    this.notification.showSuccess('تم تصدير التقرير');
  }

  editPayment(id: number) { this.router.navigate(['/financial/place-rent-payments', id, 'edit']); }
  deletePayment(item: any) {
    if (confirm('حذف الدفعة؟')) {
      this.financialService.deletePlaceRentPayment(item.id).subscribe({
        next: () => { this.notification.showSuccess('تم الحذف'); this.loadData(); },
        error: () => this.notification.showError('حدث خطأ')
      });
    }
  }
}