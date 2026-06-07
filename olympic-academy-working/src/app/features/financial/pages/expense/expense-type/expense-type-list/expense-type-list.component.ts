import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { FinancialService } from '../../../../../../core/services/financial.service';
import { NotificationService } from '../../../../../../core/services/notification.service';
import { ReportService } from '../../../../../../core/services/report.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-expense-type-list',
  templateUrl: './expense-type-list.component.html',
  styleUrls: ['./expense-type-list.component.css']
})
export class ExpenseTypeListComponent implements OnInit {
  displayedColumns = ['id', 'title', 'description', 'isActive', 'actions'];
  dataSource = new MatTableDataSource<any>([]);
  isLoading = false;
  quickSearch: string = '';
  showInactive = false;

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
    if (!this.showInactive) params.isActive = true;
    this.financialService.getAllExpenseTypes(params).subscribe({
      next: (res: any) => { this.dataSource.data = res.items; this.dataSource.paginator = this.paginator; this.dataSource.sort = this.sort; this.isLoading = false; },
      error: () => { this.notification.showError('حدث خطأ'); this.isLoading = false; }
    });
  }

  applyQuickSearch(event: Event) { this.quickSearch = (event.target as HTMLInputElement).value; this.loadData(); }
  toggleInactive() { this.showInactive = !this.showInactive; this.loadData(); }

  exportToExcel() {
    if (this.dataSource.data.length === 0) { this.notification.showWarning('لا توجد بيانات'); return; }
    const exportData = this.dataSource.data.map((item, index) => ({ '#': index + 1, 'الاسم': item.title, 'الوصف': item.description || '-', 'الحالة': item.isActive ? 'نشط' : 'غير نشط' }));
    this.reportService.exportToExcel(exportData, 'expense-types-list', 'أنواع المصروفات');
    this.notification.showSuccess('تم تصدير البيانات');
  }

  exportToPDF() {
    if (this.dataSource.data.length === 0) { this.notification.showWarning('لا توجد بيانات'); return; }
    const doc = new jsPDF('l', 'mm', 'a4');
    doc.setFontSize(18); doc.text('أنواع المصروفات', doc.internal.pageSize.getWidth() / 2, 15, { align: 'center' });
    doc.text(`تاريخ التقرير: ${new Date().toLocaleDateString('ar-EG')}`, doc.internal.pageSize.getWidth() - 40, 25);
    doc.text(`عدد السجلات: ${this.dataSource.data.length}`, doc.internal.pageSize.getWidth() - 40, 32);
    autoTable(doc, {
      head: [['#', 'الاسم', 'الوصف', 'الحالة']],
      body: this.dataSource.data.map((item, index) => [(index + 1).toString(), item.title, item.description || '-', item.isActive ? 'نشط' : 'غير نشط']),
      startY: 35,
      styles: { halign: 'right', fontSize: 9 },
      headStyles: { fillColor: [37, 99, 235], textColor: [255, 255, 255] }
    });
    doc.save('expense-types-report.pdf');
    this.notification.showSuccess('تم تصدير التقرير');
  }

  editType(id: number) { this.router.navigate(['/financial/expense-types', id, 'edit']); }
  deleteType(item: any) {
    if (confirm(`حذف "${item.title}"؟`)) {
      this.financialService.deleteExpenseType(item.id).subscribe({
        next: () => { this.notification.showSuccess('تم الحذف'); this.loadData(); },
        error: () => this.notification.showError('حدث خطأ')
      });
    }
  }
}