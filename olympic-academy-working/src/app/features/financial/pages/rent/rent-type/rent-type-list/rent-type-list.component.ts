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
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatChipsModule } from '@angular/material/chips';

import { FinancialService } from '../../../../../../core/services/financial.service';
import { NotificationService } from '../../../../../../core/services/notification.service';
import { ReportService } from '../../../../../../core/services/report.service';
import { RentTypeWizardModalComponent } from '../rent-type-wizard/rent-type-wizard-modal.component';

export interface RentTypeVTO {
  id: number;
  title: string;
  effect: boolean;
  description?: string;
  createdOn: string;
  createdBy: any;
}

@Component({
  selector: 'app-rent-type-list',
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
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatDialogModule,
    MatChipsModule
  ],
  templateUrl: './rent-type-list.component.html',
  styleUrls: ['./rent-type-list.component.css']
})
export class RentTypeListComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['index', 'title', 'description', 'effect', 'createdOn', 'actions'];
  dataSource = new MatTableDataSource<RentTypeVTO>([]);
  isLoading = false;
  quickSearch: string = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  // Statistics
  get totalCount(): number {
    return this.dataSource.data.length;
  }

  get incomeCount(): number {
    return this.dataSource.data.filter(item => item.effect === true).length;
  }

  get expenseCount(): number {
    return this.dataSource.data.filter(item => item.effect === false).length;
  }

  constructor(
    private financialService: FinancialService,
    private notification: NotificationService,
    private reportService: ReportService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.loadData();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadData() {
    this.isLoading = true;
    const params: any = {};
    if (this.quickSearch) params.quickSearch = this.quickSearch;
    
    this.financialService.getAllRentTypes(params).subscribe({
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

  applyQuickSearch(event: Event) { 
    this.quickSearch = (event.target as HTMLInputElement).value; 
    this.loadData(); 
  }

  resetFilters() {
    this.quickSearch = '';
    this.loadData();
    this.notification.showSuccess('تم مسح جميع الفلاتر');
  }

  openNewTypeModal() {
    const dialogRef = this.dialog.open(RentTypeWizardModalComponent, {
      data: {},
      width: '600px',
      maxWidth: '90vw'
    });
    
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadData();
      }
    });
  }

  viewType(type: RentTypeVTO) {
    const dialogRef = this.dialog.open(RentTypeWizardModalComponent, {
      data: { typeId: type.id },
      width: '600px',
      maxWidth: '90vw'
    });
    
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadData();
      }
    });
  }

  editType(type: RentTypeVTO) {
    const dialogRef = this.dialog.open(RentTypeWizardModalComponent, {
      data: { typeId: type.id },
      width: '600px',
      maxWidth: '90vw'
    });
    
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadData();
      }
    });
  }

  deleteType(item: RentTypeVTO) {
    if (confirm(`هل أنت متأكد من حذف نوع الإيجار "${item.title}"؟`)) {
      this.financialService.deleteRentType(item.id).subscribe({
        next: () => { 
          this.notification.showSuccess('تم الحذف بنجاح'); 
          this.loadData(); 
        },
        error: () => this.notification.showError('حدث خطأ في الحذف')
      });
    }
  }

  getEffectLabel(effect: boolean): string {
    return effect ? 'مدخل (إيراد)' : 'مخرج (مصروف)';
  }

  getEffectIcon(effect: boolean): string {
    return effect ? 'arrow_upward' : 'arrow_downward';
  }

  getEffectClass(effect: boolean): string {
    return effect ? 'effect-income' : 'effect-expense';
  }

  getEffectColor(effect: boolean): string {
    return effect ? '#10b981' : '#ef4444';
  }

  exportToExcel() {
    if (this.dataSource.data.length === 0) { 
      this.notification.showWarning('لا توجد بيانات لتصديرها'); 
      return; 
    }
    
    const exportData = this.dataSource.data.map((item, index) => ({ 
      '#': index + 1, 
      'الاسم': item.title, 
      'الوصف': item.description || '-',
      'التأثير المالي': this.getEffectLabel(item.effect),
      'تاريخ الإنشاء': item.createdOn 
    }));
    
    this.reportService.exportToExcel(exportData, 'rent-types-list', 'أنواع الإيجار');
    this.notification.showSuccess('تم تصدير البيانات بنجاح');
  }

  exportToPDF() {
    if (this.dataSource.data.length === 0) { 
      this.notification.showWarning('لا توجد بيانات لتصديرها'); 
      return; 
    }
    
    this.isLoading = true;
    
    let tableRows = '';
    this.dataSource.data.forEach((item: RentTypeVTO, index: number) => {
      const effectLabel = this.getEffectLabel(item.effect);
      const effectColor = this.getEffectColor(item.effect);
      const effectIcon = this.getEffectIcon(item.effect);
      
      tableRows += `
        <tr>
          <td style="text-align: center; padding: 8px; border: 1px solid #ddd;">${index + 1}</td>
          <td style="text-align: right; padding: 8px; border: 1px solid #ddd; font-weight: bold;">${item.title}</td>
          <td style="text-align: right; padding: 8px; border: 1px solid #ddd;">${item.description || '-'}</td>
          <td style="text-align: center; padding: 8px; border: 1px solid #ddd;">
            <span style="background: ${effectColor}; color: white; border-radius: 16px; padding: 4px 12px; display: inline-block; font-weight: 600; font-size: 12px;">
              ${effectIcon === 'arrow_upward' ? '↑' : '↓'} ${effectLabel}
            </span>
          </td>
          <td style="text-align: center; padding: 8px; border: 1px solid #ddd;">${item.createdOn || '-'}</td>
        </tr>
      `;
    });

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
        <title>تقرير أنواع الإيجار</title>
        <style>
          * { font-family: 'Cairo', 'Segoe UI', Tahoma, sans-serif; }
          @media print { body { margin: 0; padding: 20px; } .no-print { display: none; } }
          .header { text-align: center; margin-bottom: 20px; padding: 20px; background: linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%); color: white; border-radius: 8px; }
          .header h1 { margin: 0; font-size: 24px; }
          .header p { margin: 10px 0 0 0; font-size: 12px; }
          .stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 20px; padding: 16px; background: #f9fafb; border-radius: 8px; }
          .stat-item { text-align: center; padding: 8px; background: white; border-radius: 8px; }
          .stat-label { font-size: 12px; color: #6b7280; }
          .stat-value { font-size: 20px; font-weight: bold; color: #8b5cf6; }
          .stat-value.income { color: #10b981; }
          .stat-value.expense { color: #ef4444; }
          table { width: 100%; border-collapse: collapse; direction: rtl; }
          th { background: linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%); color: white; padding: 10px; border: 1px solid #ddd; text-align: center; font-weight: bold; }
          td { padding: 8px; border: 1px solid #ddd; }
          .footer { text-align: center; margin-top: 20px; padding: 10px; font-size: 10px; color: #666; }
          .effect-badge { border-radius: 16px; padding: 4px 12px; display: inline-block; font-weight: 600; font-size: 12px; color: white; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>تقرير أنواع الإيجار</h1>
          <p>تاريخ التقرير: ${new Date().toLocaleDateString('ar-EG')}</p>
          <p>عدد السجلات: ${this.dataSource.data.length} نوع</p>
        </div>
        <div class="stats">
          <div class="stat-item">
            <div class="stat-value">${this.dataSource.data.length}</div>
            <div class="stat-label">إجمالي الأنواع</div>
          </div>
          <div class="stat-item">
            <div class="stat-value income">${this.incomeCount}</div>
            <div class="stat-label">مدخل (إيراد)</div>
          </div>
          <div class="stat-item">
            <div class="stat-value expense">${this.expenseCount}</div>
            <div class="stat-label">مخرج (مصروف)</div>
          </div>
        </div>
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>الاسم</th>
              <th>الوصف</th>
              <th>التأثير المالي</th>
              <th>تاريخ الإنشاء</th>
            </tr>
          </thead>
          <tbody>
            ${tableRows}
          </tbody>
        </table>
        <div class="footer">تم التصدير من نظام إدارة الأكاديمية الأولمبية لعلوم الرياضة</div>
        <div class="no-print" style="text-align: center; margin-top: 20px; padding: 10px;">
          <button onclick="window.print();" style="padding: 10px 20px; background: linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%); color: white; border: none; border-radius: 5px; cursor: pointer;">🖨️ طباعة / حفظ كـ PDF</button>
        </div>
      </body>
      </html>
    `;

    const printWindow = window.open('', '_blank', 'width=1000,height=800,scrollbars=yes');
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

  printList(): void {
    this.exportToPDF();
  }
}