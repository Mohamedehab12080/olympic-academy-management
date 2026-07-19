import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';
import { PlaceService } from '../../../../core/services/place.service';

export interface PlaceReportVTO {
  totalPayed: number;
  totalGained: number;
}

export interface PlaceVTO {
  id: number;
  title: string;
  rentValue?: number;
  remainedValue?: number;
  placeReport?: PlaceReportVTO;
  address?: string;
  phoneNumber?: string;
  description?: string;
  createdOn: string;
  createdBy: any;
  lastModifiedOn?: string;
  lastModifiedBy?: any;
}

@Component({
  selector: 'app-place-details-modal',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    FormsModule
  ],
  template: `
    <div class="modal-container" *ngIf="!loading; else loadingTemplate">
      <!-- Header -->
      <div class="modal-header">
        <div class="header-title">
          <mat-icon>location_on</mat-icon>
          <h2>تفاصيل الموقع</h2>
        </div>
        <button mat-icon-button (click)="onClose()" class="close-btn">
          <mat-icon>close</mat-icon>
        </button>
      </div>
      
      <mat-divider></mat-divider>
      
      <div class="modal-content">
        <!-- Basic Info Section -->
        <div class="info-section">
          <div class="section-header">
            <mat-icon>info</mat-icon>
            <h3>معلومات أساسية</h3>
          </div>
          <div class="info-grid">
            <div class="info-item full-width">
              <span class="label">اسم الموقع:</span>
              <span class="value">{{ placeData?.title }}</span>
            </div>
            <div class="info-item full-width" *ngIf="placeData?.address">
              <span class="label">العنوان:</span>
              <span class="value">{{ placeData?.address }}</span>
            </div>
            <div class="info-item full-width" *ngIf="placeData?.phoneNumber">
              <span class="label">رقم الهاتف:</span>
              <span class="value">{{ placeData?.phoneNumber }}</span>
            </div>
          </div>
        </div>
        
        <!-- Financial Info Section -->
        <div class="info-section">
          <div class="section-header">
            <mat-icon>payments</mat-icon>
            <h3>معلومات مالية</h3>
          </div>
          <div class="info-grid">
            <div class="info-item">
              <span class="label">قيمة الإيجار الشهرية:</span>
              <span class="value price">{{ placeData?.rentValue | number }} جم</span>
            </div>
            <div class="info-item" *ngIf="placeData?.remainedValue !== undefined">
              <span class="label">القيمة المتبقية:</span>
              <span class="value" [class.warning]="(placeData?.remainedValue || 0) > 0">
                {{ placeData?.remainedValue | number }} جم
              </span>
            </div>
          </div>
        </div>

        <!-- Date Filter Section -->
        <div class="info-section financial-report">
          <div class="section-header">
            <mat-icon>filter_alt</mat-icon>
            <h3>تصفية التقرير المالي</h3>
          </div>
          <div class="filter-container">
            <div class="filter-row">
              <div class="filter-group">
                <label>من تاريخ</label>
                <input type="date" 
                       [(ngModel)]="fromDate" 
                       (change)="loadPlaceData()" 
                       class="date-input">
              </div>
              <div class="filter-group">
                <label>إلى تاريخ</label>
                <input type="date" 
                       [(ngModel)]="toDate" 
                       (change)="loadPlaceData()" 
                       class="date-input">
              </div>
              <button mat-stroked-button 
                      (click)="clearDateFilter()" 
                      class="clear-filter-btn"
                      *ngIf="fromDate || toDate">
                <mat-icon>clear</mat-icon>
                مسح الفلتر
              </button>
              <button mat-stroked-button 
                      (click)="refreshReport()" 
                      class="refresh-btn">
                <mat-icon>refresh</mat-icon>
                تحديث
              </button>
            </div>
          </div>
        </div>

        <!-- Financial Report Section -->
        <div class="info-section financial-report" *ngIf="placeData?.placeReport">
          <div class="section-header">
            <mat-icon>assessment</mat-icon>
            <h3>التقرير المالي للموقع</h3>
            <span class="report-date" *ngIf="fromDate || toDate">
              ({{ fromDate || 'من البداية' }} - {{ toDate || 'حتى الآن' }})
            </span>
          </div>
          
          <div class="report-container">
            <div class="report-cards">
              <div class="report-card payed-card">
                <div class="card-icon">
                  <mat-icon>payments</mat-icon>
                </div>
                <div class="card-content">
                  <span class="card-label">إجمالي المدفوعات (الإيجار)</span>
                  <span class="card-value">{{ placeData?.placeReport?.totalPayed | number }} جم</span>
                </div>
              </div>
              
              <div class="report-card gained-card">
                <div class="card-icon">
                  <mat-icon>trending_up</mat-icon>
                </div>
                <div class="card-content">
                  <span class="card-label">إجمالي الإيرادات (الاشتراكات)</span>
                  <span class="card-value">{{ placeData?.placeReport?.totalGained | number }} جم</span>
                </div>
              </div>
              
              <div class="report-card profit-card" 
                   [class.profit-positive]="getProfit() >= 0"
                   [class.profit-negative]="getProfit() < 0">
                <div class="card-icon">
                  <mat-icon>show_chart</mat-icon>
                </div>
                <div class="card-content">
                  <span class="card-label">صافي الربح/الخسارة</span>
                  <span class="card-value">{{ getProfit() | number }} جم</span>
                  <span class="profit-badge" *ngIf="getProfit() >= 0">
                    <mat-icon>arrow_upward</mat-icon> ربح
                  </span>
                  <span class="profit-badge loss" *ngIf="getProfit() < 0">
                    <mat-icon>arrow_downward</mat-icon> خسارة
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Report Loading State -->
        <div class="info-section financial-report" *ngIf="reportLoading">
          <div class="section-header">
            <mat-icon>assessment</mat-icon>
            <h3>التقرير المالي للموقع</h3>
          </div>
          <div class="loading-spinner">
            <mat-spinner diameter="30"></mat-spinner>
            <span>جاري تحميل التقرير المالي...</span>
          </div>
        </div>

        <!-- No Report Message -->
        <div class="info-section financial-report no-report" *ngIf="!reportLoading && !placeData?.placeReport">
          <div class="section-header">
            <mat-icon>assessment</mat-icon>
            <h3>التقرير المالي للموقع</h3>
          </div>
          <div class="no-report-message">
            <mat-icon>info</mat-icon>
            <span>لا توجد بيانات مالية لهذا الموقع</span>
          </div>
        </div>
        
        <!-- Description Section -->
        <div class="info-section" *ngIf="placeData?.description">
          <div class="section-header">
            <mat-icon>description</mat-icon>
            <h3>الوصف</h3>
          </div>
          <div class="description-text">
            {{ placeData?.description }}
          </div>
        </div>
        
        <!-- Additional Info Section -->
        <div class="info-section" *ngIf="placeData?.createdOn">
          <div class="section-header">
            <mat-icon>event</mat-icon>
            <h3>معلومات إضافية</h3>
          </div>
          <div class="info-grid">
            <div class="info-item full-width">
              <span class="label">تاريخ الإنشاء:</span>
              <span class="value">{{ placeData?.createdOn | date:'dd/MM/yyyy' }}</span>
            </div>
            <div class="info-item full-width" *ngIf="placeData?.createdBy?.fullName">
              <span class="label">تم الإنشاء بواسطة:</span>
              <span class="value">{{ placeData?.createdBy?.fullName }}</span>
            </div>
            <div class="info-item full-width" *ngIf="placeData?.lastModifiedOn">
              <span class="label">آخر تعديل:</span>
              <span class="value">{{ placeData?.lastModifiedOn | date:'dd/MM/yyyy' }}</span>
            </div>
          </div>
        </div>
      </div>
      
      <mat-divider></mat-divider>
      
      <div class="modal-actions">
        <button mat-raised-button color="primary" (click)="printDetails()" class="print-btn">
          <mat-icon>print</mat-icon> طباعة التفاصيل
        </button>
        <button mat-stroked-button (click)="onClose()" class="close-btn-action">
          <mat-icon>close</mat-icon> إغلاق
        </button>
      </div>
    </div>

    <!-- Loading Template -->
    <ng-template #loadingTemplate>
      <div class="loading-container">
        <mat-spinner diameter="50"></mat-spinner>
        <p>جاري تحميل البيانات...</p>
      </div>
    </ng-template>
  `,
  styles: [`
    .modal-container {
      background: white;
      border-radius: 24px;
      overflow: hidden;
      min-width: 500px;
      max-width: 650px;
      direction: rtl;
      animation: slideIn 0.3s ease-out;
    }
    
    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateY(-20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px 24px;
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      color: white;
    }
    
    .header-title {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    
    .header-title mat-icon {
      font-size: 24px;
      width: 24px;
      height: 24px;
    }
    
    .modal-header h2 {
      margin: 0;
      font-size: 20px;
      font-weight: 600;
    }
    
    .modal-header .close-btn {
      color: white;
      transition: transform 0.2s;
    }
    
    .modal-header .close-btn:hover {
      transform: rotate(90deg);
      background: rgba(255, 255, 255, 0.1);
    }
    
    .modal-content {
      padding: 20px 24px;
      max-height: 65vh;
      overflow-y: auto;
    }
    
    /* Custom Scrollbar */
    .modal-content::-webkit-scrollbar {
      width: 6px;
    }
    
    .modal-content::-webkit-scrollbar-track {
      background: #f1f1f1;
      border-radius: 3px;
    }
    
    .modal-content::-webkit-scrollbar-thumb {
      background: #cbd5e1;
      border-radius: 3px;
    }
    
    .info-section {
      margin-bottom: 24px;
    }
    
    .info-section:last-child {
      margin-bottom: 0;
    }
    
    .section-header {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 16px;
      padding-bottom: 8px;
      border-bottom: 2px solid #e5e7eb;
    }
    
    .section-header mat-icon {
      color: #10b981;
      font-size: 20px;
      width: 20px;
      height: 20px;
    }
    
    .section-header h3 {
      margin: 0;
      font-size: 16px;
      font-weight: 600;
      color: #1f2937;
    }
    
    .report-date {
      font-size: 12px;
      color: #64748b;
      font-weight: 400;
      margin-right: auto;
    }
    
    .info-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
    }
    
    .info-item {
      display: flex;
      flex-direction: column;
      gap: 4px;
      padding: 8px 0;
      border-bottom: 1px solid #f1f5f9;
    }
    
    .info-item.full-width {
      grid-column: 1 / -1;
    }
    
    .info-item .label {
      font-size: 12px;
      color: #64748b;
      font-weight: 500;
    }
    
    .info-item .value {
      font-size: 14px;
      color: #1f2937;
      font-weight: 500;
    }
    
    .info-item .value.price {
      color: #10b981;
      font-size: 16px;
      font-weight: 700;
    }
    
    .info-item .value.warning {
      color: #f59e0b;
      font-weight: 600;
    }
    
    .description-text {
      padding: 12px;
      background: #f8fafc;
      border-radius: 12px;
      color: #475569;
      font-size: 13px;
      line-height: 1.6;
      border: 1px solid #e2e8f0;
    }
    
    /* Filter Styles */
    .filter-container {
      background: white;
      border-radius: 12px;
      padding: 16px;
      border: 1px solid #e5e7eb;
    }
    
    .filter-row {
      display: flex;
      align-items: flex-end;
      gap: 12px;
      flex-wrap: wrap;
    }
    
    .filter-group {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    
    .filter-group label {
      font-size: 12px;
      color: #64748b;
      font-weight: 500;
    }
    
    .date-input {
      padding: 8px 12px;
      border: 1px solid #d1d5db;
      border-radius: 8px;
      font-size: 13px;
      background: white;
      transition: border-color 0.2s;
      min-width: 140px;
    }
    
    .date-input:focus {
      outline: none;
      border-color: #10b981;
      box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
    }
    
    .clear-filter-btn, .refresh-btn {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 12px;
      padding: 6px 16px;
      height: 38px;
    }
    
    .refresh-btn {
      background: #10b981;
      color: white;
    }
    
    .refresh-btn:hover {
      background: #059669;
    }
    
    /* Financial Report Styles */
    .financial-report {
      background: #f8fafc;
      border-radius: 16px;
      padding: 16px;
      margin-top: 8px;
    }
    
    .financial-report .section-header {
      border-bottom-color: #d1d5db;
    }
    
    .report-cards {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 12px;
    }
    
    .report-card {
      display: flex;
      align-items: center;
      gap: 12px;
      background: white;
      padding: 16px;
      border-radius: 12px;
      border: 1px solid #e5e7eb;
      transition: transform 0.2s, box-shadow 0.2s;
    }
    
    .report-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    }
    
    .card-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      border-radius: 10px;
      background: #f1f5f9;
    }
    
    .card-icon mat-icon {
      font-size: 22px;
      width: 22px;
      height: 22px;
    }
    
    .payed-card .card-icon {
      background: #fef3c7;
      color: #d97706;
    }
    
    .gained-card .card-icon {
      background: #dbeafe;
      color: #2563eb;
    }
    
    .profit-card .card-icon {
      background: #d1fae5;
      color: #059669;
    }
    
    .card-content {
      display: flex;
      flex-direction: column;
      flex: 1;
    }
    
    .card-label {
      font-size: 11px;
      color: #64748b;
      font-weight: 500;
    }
    
    .card-value {
      font-size: 18px;
      font-weight: 700;
      color: #1f2937;
    }
    
    .profit-badge {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      font-size: 11px;
      font-weight: 600;
      color: #059669;
      padding: 2px 8px;
      border-radius: 12px;
      background: #d1fae5;
      margin-top: 4px;
    }
    
    .profit-badge.loss {
      color: #dc2626;
      background: #fee2e2;
    }
    
    .profit-badge mat-icon {
      font-size: 14px;
      width: 14px;
      height: 14px;
    }
    
    .profit-card.profit-positive .card-icon {
      background: #d1fae5;
      color: #059669;
    }
    
    .profit-card.profit-negative .card-icon {
      background: #fee2e2;
      color: #dc2626;
    }
    
    .no-report-message {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 20px;
      background: white;
      border-radius: 12px;
      border: 1px dashed #d1d5db;
      color: #9ca3af;
    }
    
    .no-report-message mat-icon {
      font-size: 24px;
      width: 24px;
      height: 24px;
    }
    
    .loading-spinner {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 16px;
      padding: 20px;
      color: #64748b;
    }
    
    /* Modal Actions */
    .modal-actions {
      display: flex;
      gap: 12px;
      justify-content: flex-end;
      padding: 16px 24px;
      background: #f8fafc;
    }
    
    .modal-actions button {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 20px;
      transition: transform 0.2s;
    }
    
    .modal-actions button:hover {
      transform: translateY(-1px);
    }
    
    .print-btn {
      background: linear-gradient(135deg, #10b981 0%, #059669 100%) !important;
    }
    
    .close-btn-action {
      border-color: #e5e7eb;
    }
    
    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 60px;
      gap: 16px;
      color: #64748b;
      min-width: 400px;
    }
    
    .loading-container p {
      margin: 0;
      font-size: 14px;
    }
    
    /* Responsive Design */
    @media (max-width: 768px) {
      .modal-container {
        min-width: 90vw;
        max-width: 90vw;
      }
      
      .info-grid {
        grid-template-columns: 1fr;
        gap: 8px;
      }
      
      .report-cards {
        grid-template-columns: 1fr;
      }
      
      .filter-row {
        flex-direction: column;
        align-items: stretch;
      }
      
      .filter-group {
        width: 100%;
      }
      
      .date-input {
        width: 100%;
        min-width: unset;
      }
      
      .clear-filter-btn, .refresh-btn {
        width: 100%;
        justify-content: center;
      }
      
      .modal-header {
        padding: 16px 20px;
      }
      
      .modal-header h2 {
        font-size: 18px;
      }
      
      .modal-content {
        padding: 16px 20px;
        max-height: 55vh;
      }
      
      .modal-actions {
        flex-direction: column;
        gap: 10px;
      }
      
      .modal-actions button {
        width: 100%;
        justify-content: center;
      }
    }
    
    @media (max-width: 480px) {
      .modal-container {
        min-width: 95vw;
        max-width: 95vw;
      }
      
      .card-value {
        font-size: 16px;
      }
    }
  `]
})
export class PlaceDetailsModalComponent implements OnInit {
  placeData: PlaceVTO | null = null;
  loading: boolean = true;
  reportLoading: boolean = false;
  
  // Date filters
  fromDate: string | null = null;
  toDate: string | null = null;

  constructor(
    private dialogRef: MatDialogRef<PlaceDetailsModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { placeId: number },
    private placeService: PlaceService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadPlaceData();
  }

  /**
   * Load place data from backend with optional date filters
   */
  loadPlaceData(): void {
    if (!this.data?.placeId) {
      this.snackBar.open('معرف الموقع غير صالح', 'إغلاق', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom'
      });
      this.loading = false;
      return;
    }

    this.reportLoading = true;
    this.loading = true;

    const params: any = {};
    
    // Add date filters if provided
    if (this.fromDate) {
      params.createdOnFrom = this.fromDate;
    }
    if (this.toDate) {
      params.createdOnTo = this.toDate;
    }

    this.placeService.getPlaceById(this.data.placeId, params).subscribe({
      next: (response: PlaceVTO) => {
        this.placeData = response;
        this.loading = false;
        this.reportLoading = false;
      },
      error: (error) => {
        console.error('Error loading place details:', error);
        this.snackBar.open('حدث خطأ أثناء تحميل بيانات الموقع', 'إغلاق', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom'
        });
        this.loading = false;
        this.reportLoading = false;
      }
    });
  }

  /**
   * Clear date filters and reload data
   */
  clearDateFilter(): void {
    this.fromDate = null;
    this.toDate = null;
    this.loadPlaceData();
  }

  /**
   * Refresh report with current filters
   */
  refreshReport(): void {
    this.loadPlaceData();
  }

  onClose(): void {
    this.dialogRef.close();
  }

  /**
   * Calculate profit/loss
   */
  getProfit(): number {
    if (this.placeData?.placeReport) {
      return this.placeData.placeReport.totalGained - this.placeData.placeReport.totalPayed;
    }
    return 0;
  }

  /**
   * Print place details with financial report
   */
  printDetails(): void {
    if (!this.placeData) {
      this.snackBar.open('لا توجد بيانات للطباعة', 'إغلاق', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom'
      });
      return;
    }

    const printWindow = window.open('', '_blank', 'width=700,height=800,scrollbars=yes,toolbar=yes,menubar=yes');
    
    if (!printWindow) {
      this.snackBar.open('تعذر فتح نافذة الطباعة. يرجى السماح بالنوافذ المنبثقة.', 'إغلاق', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom'
      });
      return;
    }
    
    const data = this.placeData;
    const rentValue = data.rentValue || 0;
    const remainedValue = data.remainedValue || 0;
    const totalPayed = data.placeReport?.totalPayed || 0;
    const totalGained = data.placeReport?.totalGained || 0;
    const profit = totalGained - totalPayed;
    const hasReport = !!data.placeReport;
    const dateRange = this.fromDate || this.toDate ? 
      ` (${this.fromDate || 'من البداية'} - ${this.toDate || 'حتى الآن'})` : '';
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>تفاصيل الموقع - ${data.title}</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Cairo', 'Segoe UI', Tahoma, sans-serif;
          }
          @page {
            size: A4 portrait;
            margin: 15mm;
          }
          @media print {
            body {
              margin: 0;
              padding: 0;
            }
            .no-print {
              display: none;
            }
          }
          body {
            background: white;
            padding: 20px;
            direction: rtl;
          }
          .container {
            max-width: 700px;
            margin: 0 auto;
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
            padding: 20px;
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            color: white;
            border-radius: 12px;
          }
          .header h1 {
            margin: 0;
            font-size: 22px;
          }
          .header p {
            margin: 8px 0 0 0;
            font-size: 11px;
            opacity: 0.9;
          }
          .info-card {
            margin-bottom: 20px;
            border: 1px solid #e5e7eb;
            border-radius: 12px;
            overflow: hidden;
          }
          .card-title {
            background: #f8fafc;
            padding: 12px 16px;
            font-weight: 600;
            color: #1f2937;
            border-bottom: 1px solid #e5e7eb;
            display: flex;
            align-items: center;
            gap: 8px;
          }
          .card-title .icon {
            font-size: 18px;
          }
          .card-title .filter-info {
            font-size: 11px;
            color: #64748b;
            font-weight: 400;
            margin-right: auto;
          }
          .info-row {
            display: flex;
            justify-content: space-between;
            padding: 12px 16px;
            border-bottom: 1px solid #f1f5f9;
          }
          .info-row:last-child {
            border-bottom: none;
          }
          .label {
            font-size: 13px;
            color: #64748b;
          }
          .value {
            font-size: 14px;
            font-weight: 500;
            color: #1f2937;
          }
          .value.price {
            color: #10b981;
            font-size: 16px;
            font-weight: 700;
          }
          .value.warning {
            color: #f59e0b;
          }
          .description-text {
            padding: 16px;
            color: #475569;
            font-size: 13px;
            line-height: 1.6;
          }
          .report-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 12px;
            padding: 16px;
          }
          .report-item {
            text-align: center;
            padding: 12px;
            border-radius: 8px;
            border: 1px solid #e5e7eb;
          }
          .report-item .label {
            font-size: 11px;
            color: #64748b;
          }
          .report-item .value {
            font-size: 18px;
            font-weight: 700;
            color: #1f2937;
            margin-top: 4px;
            display: block;
          }
          .report-item.payed .value {
            color: #d97706;
          }
          .report-item.gained .value {
            color: #2563eb;
          }
          .report-item.profit .value {
            color: #059669;
          }
          .report-item.profit.loss .value {
            color: #dc2626;
          }
          .no-report-message {
            padding: 20px;
            text-align: center;
            color: #9ca3af;
            font-size: 14px;
          }
          .footer {
            text-align: center;
            margin-top: 30px;
            padding: 16px;
            font-size: 10px;
            color: #9ca3af;
            border-top: 1px solid #e5e7eb;
          }
          .print-btn {
            text-align: center;
            margin-top: 20px;
            padding: 10px;
          }
          .print-btn button {
            padding: 8px 20px;
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 12px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>تفاصيل الموقع</h1>
            <p>نظام إدارة الأكاديمية الأولمبية لعلوم الرياضة</p>
            <p style="font-size: 10px; margin-top: 4px;">تاريخ الطباعة: ${new Date().toLocaleDateString('ar-EG')}</p>
          </div>
          
          <div class="info-card">
            <div class="card-title">
              <span class="icon">📍</span> معلومات أساسية
            </div>
            <div class="info-row">
              <span class="label">اسم الموقع:</span>
              <span class="value">${data.title}</span>
            </div>
            ${data.address ? `<div class="info-row"><span class="label">العنوان:</span><span class="value">${data.address}</span></div>` : ''}
            ${data.phoneNumber ? `<div class="info-row"><span class="label">رقم الهاتف:</span><span class="value">${data.phoneNumber}</span></div>` : ''}
          </div>
          
          <div class="info-card">
            <div class="card-title">
              <span class="icon">💰</span> معلومات مالية
            </div>
            <div class="info-row">
              <span class="label">قيمة الإيجار الشهرية:</span>
              <span class="value price">${rentValue.toLocaleString('ar-EG')} جم</span>
            </div>
            ${data.remainedValue !== undefined ? `<div class="info-row"><span class="label">القيمة المتبقية:</span><span class="value ${remainedValue > 0 ? 'warning' : ''}">${remainedValue.toLocaleString('ar-EG')} جم</span></div>` : ''}
          </div>
          
          <div class="info-card">
            <div class="card-title">
              <span class="icon">📊</span> التقرير المالي للموقع
              <span class="filter-info">${dateRange}</span>
            </div>
            ${hasReport ? `
            <div class="report-grid">
              <div class="report-item payed">
                <span class="label">إجمالي المدفوعات</span>
                <span class="value">${totalPayed.toLocaleString('ar-EG')} جم</span>
              </div>
              <div class="report-item gained">
                <span class="label">إجمالي الإيرادات</span>
                <span class="value">${totalGained.toLocaleString('ar-EG')} جم</span>
              </div>
              <div class="report-item profit ${profit < 0 ? 'loss' : ''}">
                <span class="label">صافي الربح/الخسارة</span>
                <span class="value">${profit.toLocaleString('ar-EG')} جم</span>
              </div>
            </div>
            ` : `
            <div class="no-report-message">
              <span>لا توجد بيانات مالية لهذا الموقع</span>
            </div>
            `}
          </div>
          
          ${data.description ? `
          <div class="info-card">
            <div class="card-title">
              <span class="icon">📝</span> الوصف
            </div>
            <div class="description-text">${data.description}</div>
          </div>
          ` : ''}
          
          ${data.createdOn ? `
          <div class="info-card">
            <div class="card-title">
              <span class="icon">📅</span> معلومات إضافية
            </div>
            <div class="info-row">
              <span class="label">تاريخ الإنشاء:</span>
              <span class="value">${new Date(data.createdOn).toLocaleDateString('ar-EG')}</span>
            </div>
            ${data.createdBy?.fullName ? `<div class="info-row"><span class="label">تم الإنشاء بواسطة:</span><span class="value">${data.createdBy.fullName}</span></div>` : ''}
          </div>
          ` : ''}
          
          <div class="footer">
            تم التصدير من نظام إدارة الأكاديمية الأولمبية لعلوم الرياضة<br>
              هذا المستند معتمد ويحتوي على جميع بيانات الموقع
          </div>
          
          <div class="print-btn no-print">
            <button onclick="window.print();">🖨️ طباعة / حفظ كـ PDF</button>
          </div>
          <script>
            window.onload = function() {
              setTimeout(function() {
                window.print();
              }, 500);
            };
          </script>
        </div>
      </body>
      </html>
    `);
    printWindow.document.close();
  }
}