import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

import { FinancialService } from '../../../../../../core/services/financial.service';
import { EmployeeService } from '../../../../../../core/services/employee.service';
import { NotificationService } from '../../../../../../core/services/notification.service';
import { ReportService } from '../../../../../../core/services/report.service';
import { SALARY_TRANSACTION_TYPES} from '../../../../../../core/models/financial.model';
import {SALARY_TYPES} from '../../../../../../core/models/common.model';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-salary-incentive-list',
  templateUrl: './salary-incentive-list.component.html',
  styleUrls: ['./salary-incentive-list.component.css']
})
export class SalaryIncentiveListComponent implements OnInit {
  displayedColumns = ['id', 'employee', 'transactionType', 'amount', 'withdrawDate', 'paymentMethod', 'salaryType', 'actions'];
  dataSource = new MatTableDataSource<any>([]);
  isLoading = false;
  transactionTypes = SALARY_TRANSACTION_TYPES;
  salaryTypes = SALARY_TYPES;
  
  // قوائم للفلترة
  employees: any[] = [];
  paymentMethods: any[] = [];
  
  // معايير الفلترة
  filters = {
    employeeId: null as number | null,
    transactionTypeId: null as number | null,  // نوع المعاملة (راتب، حافز، مكافأة، سلفة)
    paymentMethodId: null as number | null,
    salaryTypeId: null as number | null,
    withdrawDateFrom: null as string | null,
    withdrawDateTo: null as string | null
  };
  
  quickSearch: string = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private financialService: FinancialService,
    private employeeService: EmployeeService,
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
    // تحميل الموظفين للفلترة
    this.employeeService.getAllEmployeesLookup().subscribe({
      next: (res: any) => { this.employees = res.list; },
      error: () => { this.notification.showError('حدث خطأ في تحميل الموظفين'); }
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
    
    if (this.filters.employeeId) params.employeeId = this.filters.employeeId;
    if (this.filters.transactionTypeId) params.type = this.filters.transactionTypeId;
    if (this.filters.paymentMethodId) params.paymentMethodId = this.filters.paymentMethodId;
    if (this.filters.salaryTypeId) params.salaryType = this.filters.salaryTypeId;
    if (this.filters.withdrawDateFrom) params.withdrawDateFrom = this.filters.withdrawDateFrom;
    if (this.filters.withdrawDateTo) params.withdrawDateTo = this.filters.withdrawDateTo;
    if (this.quickSearch) params.quickSearch = this.quickSearch;

    this.financialService.getAllSalaryIncentivesByFilter(params).subscribe({
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
      employeeId: null,
      transactionTypeId: null,
      paymentMethodId: null,
      salaryTypeId: null,
      withdrawDateFrom: null,
      withdrawDateTo: null
    };
    this.quickSearch = '';
    this.loadData();
    this.notification.showSuccess('تم مسح جميع الفلاتر');
  }

  getTransactionTypeTitle(typeId: number): string {
    const type = this.transactionTypes.find(t => t.id === typeId);
    return type?.title || '-';
  }

  getTransactionTypeClass(typeId: number): string {
    switch(typeId) {
      case 1: return 'salary';
      case 2: return 'incentive';
      case 3: return 'bonus';
      case 4: return 'advance';
      default: return '';
    }
  }

  exportToExcel() {
    if (this.dataSource.data.length === 0) {
      this.notification.showWarning('لا توجد بيانات لتصديرها');
      return;
    }

    const exportData = this.dataSource.data.map((item, index) => ({
      '#': index + 1,
      'الموظف': item.employee?.title,
      'نوع المعاملة': item.type?.title,
      'المبلغ': item.amountWithdrawn,
      'تاريخ الصرف': item.withdrawDate,
      'طريقة الدفع': item.paymentMethod?.title,
      'نوع الراتب': item.salaryType?.title,
      'ملاحظات': item.note || '-'
    }));

    this.reportService.exportToExcel(exportData, 'salary-incentives-list', 'الرواتب والحوافز');
    this.notification.showSuccess('تم تصدير البيانات بنجاح');
  }

  exportToPDF() {
    if (this.dataSource.data.length === 0) {
      this.notification.showWarning('لا توجد بيانات لتصديرها');
      return;
    }

    const doc = new jsPDF('l', 'mm', 'a4');
    
    doc.setFontSize(18);
    doc.text('تقرير الرواتب والحوافز', doc.internal.pageSize.getWidth() / 2, 15, { align: 'center' });
    
    doc.setFontSize(10);
    let yOffset = 25;
    if (this.filters.withdrawDateFrom) doc.text(`من تاريخ: ${this.filters.withdrawDateFrom}`, 14, yOffset);
    if (this.filters.withdrawDateTo) doc.text(`إلى تاريخ: ${this.filters.withdrawDateTo}`, 14, yOffset + 6);
    if (this.filters.transactionTypeId) {
      const type = this.transactionTypes.find(t => t.id === this.filters.transactionTypeId);
      if (type) doc.text(`نوع المعاملة: ${type.title}`, 14, yOffset + 12);
    }
    
    doc.text(`تاريخ التقرير: ${new Date().toLocaleDateString('ar-EG')}`, doc.internal.pageSize.getWidth() - 40, 25);
    doc.text(`عدد السجلات: ${this.dataSource.data.length}`, doc.internal.pageSize.getWidth() - 40, 32);

    autoTable(doc, {
      head: [['#', 'الموظف', 'نوع المعاملة', 'المبلغ', 'تاريخ الصرف', 'طريقة الدفع', 'نوع الراتب', 'ملاحظات']],
      body: this.dataSource.data.map((item, index) => [
        (index + 1).toString(),
        item.employee?.title || '-',
        item.type?.title || '-',
        `${item.amountWithdrawn} جم`,
        item.withdrawDate,
        item.paymentMethod?.title || '-',
        item.salaryType?.title || '-',
        item.note || '-'
      ]),
      startY: yOffset + 25,
      styles: { halign: 'right', fontSize: 9, cellPadding: 2 },
      headStyles: { fillColor: [37, 99, 235], textColor: [255, 255, 255], halign: 'right' },
      alternateRowStyles: { fillColor: [243, 244, 246] }
    });

    doc.save('salary-incentives-report.pdf');
    this.notification.showSuccess('تم تصدير التقرير بنجاح');
  }

  viewTransaction(id: number) {
    this.router.navigate(['/financial/salary-incentives', id]);
  }

  editTransaction(id: number) {
    this.router.navigate(['/financial/salary-incentives', id, 'edit']);
  }

  deleteTransaction(item: any) {
    const typeName = item.type?.title || 'المعاملة';
    if (confirm(`هل أنت متأكد من حذف ${typeName} للموظف "${item.employee?.title}"؟`)) {
      this.financialService.deleteSalaryIncentive(item.id).subscribe({
        next: () => {
          this.notification.showSuccess('تم الحذف بنجاح');
          this.loadData();
        },
        error: () => this.notification.showError('حدث خطأ في الحذف')
      });
    }
  }
}