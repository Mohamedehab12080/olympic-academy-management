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
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

import { PlaceService } from '../../../../core/services/place.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { ReportService } from '../../../../core/services/report.service';

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
    MatChipsModule
  ],
  templateUrl: './place-list.component.html',
  styleUrls: ['./place-list.component.css']
})
export class PlaceListComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['index', 'title', 'address', 'phoneNumber', 'rentValue', 'remainedValue', 'actions'];
  dataSource = new MatTableDataSource<any>([]);
  allPlaces: any[] = [];
  isLoading = false;
  
  quickSearch: string = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private placeService: PlaceService,
    private notification: NotificationService,
    private reportService: ReportService,
    private router: Router
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

  viewPlace(place: any): void {
    this.router.navigate(['/places', place.id]);
  }

  editPlace(place: any): void {
    this.router.navigate(['/places', place.id, 'edit']);
  }

  deletePlace(place: any): void {
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

  getTotalRentValue(): number {
    return this.dataSource.data.reduce((sum, place) => sum + (place.rentValue || 0), 0);
  }

  getTotalRemainedValue(): number {
    return this.dataSource.data.reduce((sum, place) => sum + (place.remainedValue || 0), 0);
  }

  exportToExcel(): void {
    if (this.dataSource.data.length === 0) {
      this.notification.showWarning('لا توجد بيانات لتصديرها');
      return;
    }

    const exportData = this.dataSource.data.map((place: any, index: number) => ({
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

  exportToPDF(): void {
    if (this.dataSource.data.length === 0) {
      this.notification.showWarning('لا توجد بيانات لتصديرها');
      return;
    }

    const doc = new jsPDF('l', 'mm', 'a4');
    
    doc.setFontSize(18);
    doc.text('تقرير المواقع', doc.internal.pageSize.getWidth() / 2, 15, { align: 'center' });
    
    doc.setFontSize(10);
    doc.text(`تاريخ التقرير: ${new Date().toLocaleDateString('ar-EG')}`, doc.internal.pageSize.getWidth() - 40, 25);
    doc.text(`عدد المواقع: ${this.dataSource.data.length}`, doc.internal.pageSize.getWidth() - 40, 32);
    doc.text(`إجمالي الإيجارات: ${this.getTotalRentValue()} جم`, 14, 25);
    doc.text(`إجمالي المتبقي: ${this.getTotalRemainedValue()} جم`, 14, 32);

    autoTable(doc, {
      head: [['#', 'اسم الموقع', 'العنوان', 'رقم الهاتف', 'قيمة الإيجار', 'القيمة المتبقية']],
      body: this.dataSource.data.map((place: any, index: number) => [
        (index + 1).toString(),
        place.title || '-',
        place.address || '-',
        place.phoneNumber || '-',
        `${place.rentValue || 0} جم`,
        `${place.remainedValue || 0} جم`
      ]),
      startY: 45,
      styles: { halign: 'right', fontSize: 9, cellPadding: 2 },
      headStyles: { fillColor: [37, 99, 235], textColor: [255, 255, 255], halign: 'right' },
      alternateRowStyles: { fillColor: [243, 244, 246] }
    });

    doc.save('places-report.pdf');
    this.notification.showSuccess('تم تصدير التقرير بنجاح');
  }
}