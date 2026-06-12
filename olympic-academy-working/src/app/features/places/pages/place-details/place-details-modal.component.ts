import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-place-details-modal',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule
  ],
  template: `
    <div class="modal-container">
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
            <div class="info-item">
              <span class="label">اسم الموقع:</span>
              <span class="value">{{ data.title }}</span>
            </div>
            <div class="info-item" *ngIf="data.address">
              <span class="label">العنوان:</span>
              <span class="value">{{ data.address }}</span>
            </div>
            <div class="info-item" *ngIf="data.phoneNumber">
              <span class="label">رقم الهاتف:</span>
              <span class="value">{{ data.phoneNumber }}</span>
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
              <span class="value price">{{ data.rentValue | number }} جم</span>
            </div>
            <div class="info-item" *ngIf="data.remainedValue !== undefined">
              <span class="label">القيمة المتبقية:</span>
              <span class="value" [class.warning]="data.remainedValue > 0">{{ data.remainedValue | number }} جم</span>
            </div>
          </div>
        </div>
        
        <!-- Description Section -->
        <div class="info-section" *ngIf="data.description">
          <div class="section-header">
            <mat-icon>description</mat-icon>
            <h3>الوصف</h3>
          </div>
          <div class="description-text">
            {{ data.description }}
          </div>
        </div>
        
        <!-- Additional Info Section -->
        <div class="info-section" *ngIf="data.createdOn">
          <div class="section-header">
            <mat-icon>event</mat-icon>
            <h3>معلومات إضافية</h3>
          </div>
          <div class="info-grid">
            <div class="info-item">
              <span class="label">تاريخ الإنشاء:</span>
              <span class="value">{{ data.createdOn | date:'dd/MM/yyyy' }}</span>
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
  `,
  styles: [`
    .modal-container {
      background: white;
      border-radius: 24px;
      overflow: hidden;
      min-width: 450px;
      max-width: 550px;
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
      max-height: 60vh;
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
    
    /* Responsive Design */
    @media (max-width: 600px) {
      .modal-container {
        min-width: 90vw;
        max-width: 90vw;
      }
      
      .info-grid {
        grid-template-columns: 1fr;
        gap: 8px;
      }
      
      .modal-header {
        padding: 16px 20px;
      }
      
      .modal-header h2 {
        font-size: 18px;
      }
      
      .modal-content {
        padding: 16px 20px;
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
  `]
})
export class PlaceDetailsModalComponent {
  constructor(
    private dialogRef: MatDialogRef<PlaceDetailsModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onClose(): void {
    this.dialogRef.close();
  }

  printDetails(): void {
    const printWindow = window.open('', '_blank', 'width=700,height=800,scrollbars=yes,toolbar=yes,menubar=yes');
    
    if (!printWindow) {
      return;
    }
    
    const rentValue = this.data.rentValue || 0;
    const remainedValue = this.data.remainedValue || 0;
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>تفاصيل الموقع - ${this.data.title}</title>
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
            max-width: 600px;
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
          .card-title mat-icon {
            font-size: 18px;
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
            <p>نظام إدارة الأكاديمية الأولمبية</p>
          </div>
          
          <div class="info-card">
            <div class="card-title">
              📍 معلومات أساسية
            </div>
            <div class="info-row">
              <span class="label">اسم الموقع:</span>
              <span class="value">${this.data.title}</span>
            </div>
            ${this.data.address ? `<div class="info-row"><span class="label">العنوان:</span><span class="value">${this.data.address}</span></div>` : ''}
            ${this.data.phoneNumber ? `<div class="info-row"><span class="label">رقم الهاتف:</span><span class="value">${this.data.phoneNumber}</span></div>` : ''}
          </div>
          
          <div class="info-card">
            <div class="card-title">
              💰 معلومات مالية
            </div>
            <div class="info-row">
              <span class="label">قيمة الإيجار الشهرية:</span>
              <span class="value price">${rentValue.toLocaleString('ar-EG')} جم</span>
            </div>
            ${this.data.remainedValue !== undefined ? `<div class="info-row"><span class="label">القيمة المتبقية:</span><span class="value ${remainedValue > 0 ? 'warning' : ''}">${remainedValue.toLocaleString('ar-EG')} جم</span></div>` : ''}
          </div>
          
          ${this.data.description ? `
          <div class="info-card">
            <div class="card-title">
              📝 الوصف
            </div>
            <div class="description-text">${this.data.description}</div>
          </div>
          ` : ''}
          
          ${this.data.createdOn ? `
          <div class="info-card">
            <div class="card-title">
              📅 معلومات إضافية
            </div>
            <div class="info-row">
              <span class="label">تاريخ الإنشاء:</span>
              <span class="value">${new Date(this.data.createdOn).toLocaleDateString('ar-EG')}</span>
            </div>
          </div>
          ` : ''}
          
          <div class="footer">
            تم التصدير من نظام إدارة الأكاديمية الأولمبية<br>
            هذا المستند معتمد ويحتوي على جميع بيانات الموقع
          </div>
          
          <div class="print-btn no-print">
            <button onclick="window.print();">🖨️ طباعة / حفظ كـ PDF</button>
          </div>
          <script>
            window.onload = function() {
              setTimeout(function() {
                window.print();
              }, 300);
            };
          </script>
        </div>
      </body>
      </html>
    `);
    printWindow.document.close();
    this.onClose();
  }
}