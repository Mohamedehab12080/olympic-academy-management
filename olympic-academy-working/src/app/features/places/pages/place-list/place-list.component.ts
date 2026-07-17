import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { PlaceService } from '../../../../core/services/place.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { ReportService } from '../../../../core/services/report.service';
import { PlaceDetailsModalComponent } from '../place-details/place-details-modal.component';
import { PlaceWizardModalComponent } from '../place-wizard/place-wizard-modal.component';

export interface PlaceVTO {
  id: number;
  title: string;
  rentValue?: number;
  remainedValue?: number;
  placeReport?: {
    totalPayed: number;
    totalGained: number;
  };
  address?: string;
  phoneNumber?: string;
  description?: string;
  createdOn: string;
  createdBy: any;
  lastModifiedOn?: string;
  lastModifiedBy?: any;
}

@Component({
  selector: 'app-place-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,  
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatChipsModule,
    MatDialogModule
  ],
  templateUrl: './place-list.component.html',
  styleUrls: ['./place-list.component.css']
})
export class PlaceListComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = [
    'index', 
    'title', 
    'address', 
    'phoneNumber', 
    'rentValue', 
    'remainedValue', 
    'actions'
  ];
  dataSource = new MatTableDataSource<PlaceVTO>([]);
  allPlaces: PlaceVTO[] = [];
  isLoading = false;
  
  quickSearch: string = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private placeService: PlaceService,
    private notification: NotificationService,
    private reportService: ReportService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadPlaces();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadPlaces(): void {
    this.isLoading = true;
    const params: any = {};
    if (this.quickSearch) params.quickSearch = this.quickSearch;

    this.placeService.getAllPlacesByFilter(params).subscribe({
      next: (res: any) => {
        this.allPlaces = res.items || [];
        this.dataSource.data = this.allPlaces;
        this.isLoading = false;
      },
      error: () => {
        this.notification.showError('حدث خطأ في تحميل المواقع');
        this.isLoading = false;
      }
    });
  }

  applyQuickSearch(event: Event): void {
    this.quickSearch = (event.target as HTMLInputElement).value;
    this.loadPlaces();
  }

  resetFilters(): void {
    this.quickSearch = '';
    this.loadPlaces();
    this.notification.showSuccess('تم مسح جميع الفلاتر');
  }

  openNewPlaceModal(): void {
    const dialogRef = this.dialog.open(PlaceWizardModalComponent, {
      data: {},
      width: '600px',
      maxWidth: '90vw'
    });
    
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadPlaces();
      }
    });
  }

viewPlace(place: PlaceVTO): void {
  this.dialog.open(PlaceDetailsModalComponent, {
    data: { placeId: place.id },
    width: '600px',
    maxWidth: '90vw'
  });
}

  editPlace(place: PlaceVTO): void {
    const dialogRef = this.dialog.open(PlaceWizardModalComponent, {
      data: { placeId: place.id },
      width: '600px',
      maxWidth: '90vw'
    });
    
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadPlaces();
      }
    });
  }

  deletePlace(place: PlaceVTO): void {
    if (confirm(`هل أنت متأكد من حذف الموقع "${place.title}"؟`)) {
      this.placeService.deletePlace(place.id).subscribe({
        next: () => {
          this.notification.showSuccess('تم حذف الموقع بنجاح');
          this.loadPlaces();
        },
        error: () => this.notification.showError('حدث خطأ في حذف الموقع')
      });
    }
  }

  /**
   * Get total rent value for all places
   */
  getTotalRentValue(): number {
    return this.dataSource.data.reduce((sum, place) => sum + (place.rentValue || 0), 0);
  }

  /**
   * Get total remained value for all places
   */
  getTotalRemainedValue(): number {
    return this.dataSource.data.reduce((sum, place) => sum + (place.remainedValue || 0), 0);
  }

  /**
   * Export to Excel
   */
  exportToExcel(): void {
    if (this.dataSource.data.length === 0) {
      this.notification.showWarning('لا توجد بيانات لتصديرها');
      return;
    }

    const exportData = this.dataSource.data.map((place: PlaceVTO, index: number) => ({
      '#': index + 1,
      'اسم الموقع': place.title,
      'العنوان': place.address || '-',
      'رقم الهاتف': place.phoneNumber || '-',
      'قيمة الإيجار': place.rentValue || 0,
      'القيمة المتبقية': place.remainedValue || 0
    }));

    this.reportService.exportToExcel(exportData, 'places-list', 'المواقع');
    this.notification.showSuccess('تم تصدير البيانات بنجاح');
  }

  /**
   * Export to PDF
   */
  exportToPDF(): void {
    if (this.dataSource.data.length === 0) {
      this.notification.showWarning('لا توجد بيانات لتصديرها');
      return;
    }

    this.isLoading = true;

    let tableRows = '';
    this.dataSource.data.forEach((place: PlaceVTO, index: number) => {
      tableRows += `
        <tr>
          <td style="text-align: center; padding: 8px; border: 1px solid #ddd;">${index + 1}</td>
          <td style="text-align: right; padding: 8px; border: 1px solid #ddd; font-weight: bold;">${place.title || '-'}</td>
          <td style="text-align: right; padding: 8px; border: 1px solid #ddd;">${place.address || '-'}</td>
          <td style="text-align: center; padding: 8px; border: 1px solid #ddd;">${place.phoneNumber || '-'}</td>
          <td style="text-align: center; padding: 8px; border: 1px solid #ddd;">${(place.rentValue || 0).toLocaleString('ar-EG')} جم</td>
          <td style="text-align: center; padding: 8px; border: 1px solid #ddd; ${(place.remainedValue || 0) > 0 ? 'color: #f59e0b; font-weight: bold;' : ''}">
            ${(place.remainedValue || 0).toLocaleString('ar-EG')} جم
          </td>
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
        <title>تقرير المواقع</title>
        <style>
          * { font-family: 'Cairo', 'Segoe UI', Tahoma, sans-serif; }
          @media print { body { margin: 0; padding: 20px; } .no-print { display: none; } }
          .header { text-align: center; margin-bottom: 20px; padding: 20px; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; border-radius: 8px; }
          .header h1 { margin: 0; font-size: 24px; }
          .header p { margin: 10px 0 0 0; font-size: 12px; }
          .stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 20px; padding: 16px; background: #f9fafb; border-radius: 8px; }
          .stat-item { text-align: center; padding: 8px; background: white; border-radius: 8px; }
          .stat-label { font-size: 11px; color: #6b7280; font-weight: 500; }
          .stat-value { font-size: 18px; font-weight: bold; color: #10b981; margin-top: 4px; }
          table { width: 100%; border-collapse: collapse; direction: rtl; font-size: 12px; }
          th { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 8px 6px; border: 1px solid #ddd; text-align: center; font-weight: bold; font-size: 11px; }
          td { padding: 6px; border: 1px solid #ddd; }
          .footer { text-align: center; margin-top: 20px; padding: 10px; font-size: 10px; color: #666; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>📋 تقرير المواقع</h1>
          <p>تاريخ التقرير: ${new Date().toLocaleDateString('ar-EG')}</p>
          <p>عدد السجلات: ${this.dataSource.data.length} موقع</p>
        </div>
        <div class="stats">
          <div class="stat-item">
            <div class="stat-value">${this.dataSource.data.length}</div>
            <div class="stat-label">عدد المواقع</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">${this.getTotalRentValue().toLocaleString('ar-EG')} جم</div>
            <div class="stat-label">إجمالي الإيجارات</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">${this.getTotalRemainedValue().toLocaleString('ar-EG')} جم</div>
            <div class="stat-label">إجمالي المتبقي</div>
          </div>
        </div>
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>اسم الموقع</th>
              <th>العنوان</th>
              <th>رقم الهاتف</th>
              <th>قيمة الإيجار</th>
              <th>القيمة المتبقية</th>
            </tr>
          </thead>
          <tbody>
            ${tableRows}
          </tbody>
        </table>
        <div class="footer">تم التصدير من نظام إدارة الأكاديمية الأولمبية لعلوم الرياضة</div>
        <div class="no-print" style="text-align: center; margin-top: 20px; padding: 10px;">
          <button onclick="window.print();" style="padding: 10px 20px; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; border: none; border-radius: 5px; cursor: pointer;">🖨️ طباعة / حفظ كـ PDF</button>
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

  printList(): void {
    this.exportToPDF();
  }
}