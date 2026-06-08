import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

// Material Imports
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';

import { FinancialService } from '../../../../../../core/services/financial.service';
import { EmployeeService } from '../../../../../../core/services/employee.service';
import { NotificationService } from '../../../../../../core/services/notification.service';
import { ReportService } from '../../../../../../core/services/report.service';
import { SearchableSelectComponent, SelectOption } from '../../../../../../shared/components/searchable-select/searchable-select.component';
import { SALARY_TRANSACTION_TYPES } from '../../../../../../core/models/financial.model';
import { SALARY_TYPES } from '../../../../../../core/models/common.model';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-salary-incentive-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatChipsModule,
    SearchableSelectComponent
  ],
  templateUrl: './salary-incentive-list.component.html',
  styleUrls: ['./salary-incentive-list.component.css']
})
export class SalaryIncentiveListComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['index', 'employee', 'transactionType', 'amount', 'withdrawDate', 'paymentMethod', 'salaryType', 'actions'];
  dataSource = new MatTableDataSource<any>([]);
  isLoading = false;
  transactionTypes = SALARY_TRANSACTION_TYPES;
  salaryTypes = SALARY_TYPES;
  
  employees: any[] = [];
  paymentMethods: any[] = [];
  
  filters = {
    employeeId: null as number | null,
    transactionTypeId: null as number | null,
    paymentMethodId: null as number | null,
    salaryTypeId: null as number | null,
    withdrawDateFrom: null as string | null,
    withdrawDateTo: null as string | null
  };
  
  quickSearch: string = '';
  
  // Options for searchable selects
  employeeOptions: SelectOption[] = [];
  transactionTypeOptions: SelectOption[] = [];
  paymentMethodOptions: SelectOption[] = [];
  salaryTypeOptions: SelectOption[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  // Statistics
  get totalAmount(): number {
    return this.dataSource.data.reduce((sum, item) => sum + (item.amountWithdrawn || 0), 0);
  }

  get salaryTotal(): number {
    return this.dataSource.data.filter(item => item.type?.id === 1).reduce((sum, item) => sum + (item.amountWithdrawn || 0), 0);
  }

  get incentiveTotal(): number {
    return this.dataSource.data.filter(item => item.type?.id === 2).reduce((sum, item) => sum + (item.amountWithdrawn || 0), 0);
  }

  get bonusTotal(): number {
    return this.dataSource.data.filter(item => item.type?.id === 3).reduce((sum, item) => sum + (item.amountWithdrawn || 0), 0);
  }

  get advanceTotal(): number {
    return this.dataSource.data.filter(item => item.type?.id === 4).reduce((sum, item) => sum + (item.amountWithdrawn || 0), 0);
  }

  constructor(
    private financialService: FinancialService,
    private employeeService: EmployeeService,
    private notification: NotificationService,
    private reportService: ReportService,
    private router: Router
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
    this.transactionTypeOptions = [
      { value: null, label: 'الكل' },
      ...this.transactionTypes.map(t => ({ value: t.id, label: t.title }))
    ];
    
    this.salaryTypeOptions = [
      { value: null, label: 'الكل' },
      ...this.salaryTypes.map(s => ({ value: s.id, label: s.title }))
    ];
  }

  loadLookupData() {
    this.employeeService.getAllEmployeesLookup().subscribe({
      next: (res: any) => { 
        this.employees = res.list || [];
        this.employeeOptions = [
          { value: null, label: 'الكل' },
          ...this.employees.map(e => ({ value: e.id, label: e.title }))
        ];
      },
      error: () => { 
        this.notification.showError('حدث خطأ في تحميل الموظفين'); 
      }
    });

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
    
    if (this.filters.employeeId) params.employeeId = this.filters.employeeId;
    if (this.filters.transactionTypeId) params.type = this.filters.transactionTypeId;
    if (this.filters.paymentMethodId) params.paymentMethodId = this.filters.paymentMethodId;
    if (this.filters.salaryTypeId) params.salaryType = this.filters.salaryTypeId;
    if (this.filters.withdrawDateFrom) params.withdrawDateFrom = this.filters.withdrawDateFrom;
    if (this.filters.withdrawDateTo) params.withdrawDateTo = this.filters.withdrawDateTo;
    if (this.quickSearch) params.quickSearch = this.quickSearch;

    this.financialService.getAllSalaryIncentivesByFilter(params).subscribe({
      next: (res: any) => {
        this.dataSource.data = res.items || [];
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

  getTransactionTypeClass(typeId: number): string {
    switch(typeId) {
      case 1: return 'salary';
      case 2: return 'incentive';
      case 3: return 'bonus';
      case 4: return 'advance';
      default: return '';
    }
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
    doc.text(`إجمالي المبالغ: ${this.totalAmount} جم`, 14, yOffset + 18);

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
      startY: yOffset + 30,
      styles: { halign: 'right', fontSize: 9, cellPadding: 2 },
      headStyles: { fillColor: [37, 99, 235], textColor: [255, 255, 255], halign: 'right' },
      alternateRowStyles: { fillColor: [243, 244, 246] }
    });

    doc.save('salary-incentives-report.pdf');
    this.notification.showSuccess('تم تصدير التقرير بنجاح');
  }
}