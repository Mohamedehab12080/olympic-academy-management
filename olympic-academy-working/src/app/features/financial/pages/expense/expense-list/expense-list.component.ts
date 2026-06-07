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
  selector: 'app-expense-list',
  templateUrl: './expense-list.component.html',
  styleUrls: ['./expense-list.component.css']
})
export class ExpenseListComponent implements OnInit {
  displayedColumns = ['id', 'expenseType', 'amountExpensed', 'expenseDate', 'paymentMethod', 'actions'];
  dataSource = new MatTableDataSource<any>([]);
  isLoading = false;
  expenseTypes: any[] = [];
  paymentMethods: any[] = [];
  
  filters = {
    expenseTypeId: null as number | null,
    paymentMethodId: null as number | null,
    expenseDateFrom: null as string | null,
    expenseDateTo: null as string | null
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
    this.financialService.getAllExpenseTypesLookup().subscribe({
      next: (res: any) => { this.expenseTypes = res.list; },
      error: () => { this.notification.showError('حدث خطأ في تحميل أنواع المصروفات'); }
    });
    this.financialService.getAllPaymentMethodsLookup().subscribe({
      next: (res: any) => { this.paymentMethods = res.list; },
      error: () => { this.notification.showError('حدث خطأ في تحميل طرق الدفع'); }
    });
  }

  loadData() {
    this.isLoading = true;
    const params: any = {};
    if (this.filters.expenseTypeId) params.expenseTypeId = this.filters.expenseTypeId;
    if (this.filters.paymentMethodId) params.paymentMethodId = this.filters.paymentMethodId;
    if (this.filters.expenseDateFrom) params.expenseDateFrom = this.filters.expenseDateFrom;
    if (this.filters.expenseDateTo) params.expenseDateTo = this.filters.expenseDateTo;
    if (this.quickSearch) params.quickSearch = this.quickSearch;

    this.financialService.getAllExpensesByFilter(params).subscribe({
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
      expenseTypeId: null,
      paymentMethodId: null,
      expenseDateFrom: null,
      expenseDateTo: null
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
      'نوع المصروف': item.expenseType?.title,
      'المبلغ': item.amountExpensed,
      'التاريخ': item.expenseDate,
      'طريقة الدفع': item.paymentMethod?.title,
      'ملاحظات': item.note || '-'
    }));
    this.reportService.exportToExcel(exportData, 'expenses-list', 'المصروفات');
    this.notification.showSuccess('تم تصدير البيانات بنجاح');
  }

  exportToPDF() {
    if (this.dataSource.data.length === 0) {
      this.notification.showWarning('لا توجد بيانات لتصديرها');
      return;
    }
    const doc = new jsPDF('l', 'mm', 'a4');
    doc.setFontSize(18);
    doc.text('تقرير المصروفات', doc.internal.pageSize.getWidth() / 2, 15, { align: 'center' });
    doc.setFontSize(10);
    let yOffset = 25;
    if (this.filters.expenseDateFrom) doc.text(`من تاريخ: ${this.filters.expenseDateFrom}`, 14, yOffset);
    if (this.filters.expenseDateTo) doc.text(`إلى تاريخ: ${this.filters.expenseDateTo}`, 14, yOffset + 6);
    doc.text(`تاريخ التقرير: ${new Date().toLocaleDateString('ar-EG')}`, doc.internal.pageSize.getWidth() - 40, 25);
    doc.text(`عدد السجلات: ${this.dataSource.data.length}`, doc.internal.pageSize.getWidth() - 40, 32);
    autoTable(doc, {
      head: [['#', 'نوع المصروف', 'المبلغ', 'التاريخ', 'طريقة الدفع', 'ملاحظات']],
      body: this.dataSource.data.map((item, index) => [
        (index + 1).toString(), item.expenseType?.title || '-',
        `${item.amountExpensed} ريال`, item.expenseDate,
        item.paymentMethod?.title || '-', item.note || '-'
      ]),
      startY: yOffset + 20,
      styles: { halign: 'right', fontSize: 9 },
      headStyles: { fillColor: [37, 99, 235], textColor: [255, 255, 255] }
    });
    doc.save('expenses-report.pdf');
    this.notification.showSuccess('تم تصدير التقرير بنجاح');
  }

  editExpense(id: number) { this.router.navigate(['/financial/expenses', id, 'edit']); }
  deleteExpense(item: any) {
    if (confirm('هل أنت متأكد من حذف هذا المصروف؟')) {
      this.financialService.deleteExpense(item.id).subscribe({
        next: () => { this.notification.showSuccess('تم الحذف'); this.loadData(); },
        error: () => this.notification.showError('حدث خطأ')
      });
    }
  }
}