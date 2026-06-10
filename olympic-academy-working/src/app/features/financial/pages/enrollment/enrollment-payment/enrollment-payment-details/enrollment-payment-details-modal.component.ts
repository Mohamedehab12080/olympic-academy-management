import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { EnrollmentPaymentVTO } from '../../../../../../core/models/financial.model';
import { EnrollmentPaymentWizardModalComponent } from '../enrollment-payment-wizard/enrollment-payment-wizard-modal.component';

@Component({
  selector: 'app-enrollment-payment-details-modal',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatChipsModule,
    MatTooltipModule
  ],
  template: `
    <div class="modal-container" dir="rtl">
      <!-- Header -->
      <div class="modal-header">
        <div class="header-title">
          <mat-icon>payments</mat-icon>
          <h2>تفاصيل الدفعة</h2>
        </div>
        <div class="header-actions">
          <button mat-icon-button (click)="printPaymentDocument()" matTooltip="طباعة التفاصيل">
            <mat-icon>print</mat-icon>
          </button>
          <button mat-icon-button mat-dialog-close class="close-btn">
            <mat-icon>close</mat-icon>
          </button>
        </div>
      </div>
      
      <mat-divider></mat-divider>
      
      <div class="modal-content">
        <div class="detail-row">
          <div class="detail-label">رقم الدفعة:</div>
          <div class="detail-value">#{{ payment.id }}</div>
        </div>
        
        <div class="detail-row">
          <div class="detail-label">التسجيل:</div>
          <div class="detail-value">
            <mat-icon>assignment</mat-icon>
            <span>{{ payment.enrollment?.trainee?.title }} - {{ payment.enrollment?.course?.title }}</span>
          </div>
        </div>
        
        <div class="detail-row">
          <div class="detail-label">المتدرب:</div>
          <div class="detail-value">
            <mat-icon>person</mat-icon>
            <span>{{ payment.enrollment?.trainee?.title }}</span>
          </div>
        </div>
        
        <div class="detail-row">
          <div class="detail-label">الدورة:</div>
          <div class="detail-value">
            <mat-icon>school</mat-icon>
            <span>{{ payment.enrollment?.course?.title }}</span>
          </div>
        </div>
        
        <div class="detail-row highlight">
          <div class="detail-label">المبلغ المدفوع:</div>
          <div class="detail-value amount">{{ payment.paidAmount | currency:'EGP' }}</div>
        </div>
        
        <div class="detail-row">
          <div class="detail-label">المبلغ المتبقي:</div>
          <div class="detail-value">{{ payment.remainedValue | currency:'EGP' }}</div>
        </div>
        
        <div class="detail-row">
          <div class="detail-label">قيمة التسجيل:</div>
          <div class="detail-value">{{ payment.enrollmentValue | currency:'EGP' }}</div>
        </div>
        
        <div class="detail-row">
          <div class="detail-label">تاريخ الدفع:</div>
          <div class="detail-value">
            <mat-icon>event</mat-icon>
            <span>{{ payment.paymentDate | date:'dd/MM/yyyy' }}</span>
          </div>
        </div>
        
        <div class="detail-row">
          <div class="detail-label">طريقة الدفع:</div>
          <div class="detail-value">
            <mat-icon>credit_card</mat-icon>
            <span>{{ payment.paymentMethod?.title || '-' }}</span>
          </div>
        </div>
        
        <div class="detail-row">
          <div class="detail-label">حالة الدفع:</div>
          <div class="detail-value">
            <span class="status-badge" [class.paid]="payment.paymentStatus?.id === 2" [class.pending]="payment.paymentStatus?.id === 1">
              {{ payment.paymentStatus?.title }}
            </span>
          </div>
        </div>
        
        <div class="detail-row" *ngIf="payment.note">
          <div class="detail-label">ملاحظات:</div>
          <div class="detail-value note-value">{{ payment.note }}</div>
        </div>
        
        <div class="detail-row" *ngIf="payment.imageUrl">
          <div class="detail-label">المرفق:</div>
          <div class="detail-value">
            <a [href]="payment.imageUrl" target="_blank" class="attachment-link">
              <mat-icon>attach_file</mat-icon>
              عرض المرفق
            </a>
          </div>
        </div>
        
        <mat-divider></mat-divider>
        
        <div class="info-section">
          <h4>معلومات التسجيل</h4>
          <div class="detail-row small">
            <div class="detail-label">حالة التسجيل:</div>
            <div class="detail-value">{{ payment.enrollment?.enrollmentStatus?.title || '-' }}</div>
          </div>
          <div class="detail-row small">
            <div class="detail-label">تاريخ بدء التسجيل:</div>
            <div class="detail-value">{{ payment.enrollment?.startDate | date:'dd/MM/yyyy' }}</div>
          </div>
          <div class="detail-row small" *ngIf="payment.enrollment?.endDate">
            <div class="detail-label">تاريخ انتهاء التسجيل:</div>
            <div class="detail-value">{{ payment.enrollment?.endDate | date:'dd/MM/yyyy' }}</div>
          </div>
        </div>
        
        <mat-divider></mat-divider>
        
        <div class="info-section">
          <h4>معلومات الإنشاء والتعديل</h4>
          <div class="detail-row small">
            <div class="detail-label">تم الإنشاء بواسطة:</div>
            <div class="detail-value">{{ payment.createdBy?.fullName || '-' }}</div>
          </div>
          <div class="detail-row small">
            <div class="detail-label">تاريخ الإنشاء:</div>
            <div class="detail-value">{{ payment.createdOn | date:'dd/MM/yyyy HH:mm' }}</div>
          </div>
          <div class="detail-row small" *ngIf="payment.lastModifiedBy">
            <div class="detail-label">تم التعديل بواسطة:</div>
            <div class="detail-value">{{ payment.lastModifiedBy?.fullName }}</div>
          </div>
          <div class="detail-row small" *ngIf="payment.lastModifiedOn">
            <div class="detail-label">تاريخ التعديل:</div>
            <div class="detail-value">{{ payment.lastModifiedOn | date:'dd/MM/yyyy HH:mm' }}</div>
          </div>
        </div>
      </div>
      
      <mat-divider></mat-divider>
      
      <div class="modal-actions">
        <button mat-raised-button color="accent" (click)="printPaymentDocument()" matTooltip="طباعة التفاصيل">
          <mat-icon>print</mat-icon>
          طباعة
        </button>
        <button mat-raised-button color="primary" (click)="editPayment()">
          <mat-icon>edit</mat-icon>
          تعديل
        </button>
        <button mat-raised-button color="warn" (click)="deletePayment()">
          <mat-icon>delete</mat-icon>
          حذف
        </button>
        <button mat-button mat-dialog-close>
          <mat-icon>close</mat-icon>
          إغلاق
        </button>
      </div>
    </div>
  `,
  styles: [`
    .modal-container {
      min-width: 550px;
      max-width: 650px;
      direction: rtl;
      background: #f5f7fa;
      border-radius: 24px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }
    .modal-header {
      flex-shrink: 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 20px;
      background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
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
    }
    .header-actions {
      display: flex;
      gap: 8px;
    }
    .close-btn {
      color: white;
      transition: transform 0.2s;
    }
    .close-btn:hover {
      transform: scale(1.1);
    }
    .modal-content {
      padding: 20px;
      max-height: 60vh;
      overflow-y: auto;
    }
    .detail-row {
      display: flex;
      margin-bottom: 14px;
      align-items: center;
    }
    .detail-label {
      width: 130px;
      font-weight: 600;
      color: #374151;
    }
    .detail-value {
      flex: 1;
      display: flex;
      align-items: center;
      gap: 8px;
      color: #1f2937;
    }
    .detail-value mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
      color: #6b7280;
    }
    .detail-value.amount {
      font-weight: 700;
      color: #2563eb;
      font-size: 18px;
    }
    .detail-row.highlight {
      background: #eff6ff;
      padding: 8px 12px;
      border-radius: 8px;
      margin: 8px 0;
    }
    .status-badge {
      display: inline-block;
      padding: 4px 14px;
      border-radius: 30px;
      font-size: 12px;
      font-weight: 600;
    }
    .status-badge.paid {
      background: #d1fae5;
      color: #065f46;
    }
    .status-badge.pending {
      background: #fef3c7;
      color: #92400e;
    }
    .note-value {
      background: #f9fafb;
      padding: 8px 12px;
      border-radius: 8px;
      line-height: 1.5;
    }
    .attachment-link {
      display: flex;
      align-items: center;
      gap: 4px;
      color: #2563eb;
      text-decoration: none;
    }
    .attachment-link:hover {
      text-decoration: underline;
    }
    .info-section {
      margin-top: 20px;
      padding: 16px;
      background: #f9fafb;
      border-radius: 12px;
    }
    .info-section h4 {
      margin: 0 0 12px 0;
      font-size: 14px;
      color: #374151;
    }
    .detail-row.small {
      margin-bottom: 8px;
    }
    .detail-row.small .detail-label {
      font-size: 12px;
      color: #6b7280;
    }
    .detail-row.small .detail-value {
      font-size: 12px;
    }
    .modal-actions {
      flex-shrink: 0;
      display: flex;
      gap: 12px;
      justify-content: flex-end;
      padding: 16px 20px;
      background: white;
      border-top: 1px solid #e5e7eb;
    }
    @media (max-width: 600px) {
      .modal-container {
        min-width: 90vw;
        max-width: 90vw;
      }
      .detail-row {
        flex-direction: column;
        align-items: flex-start;
        gap: 4px;
      }
      .detail-label {
        width: 100%;
      }
      .modal-actions {
        flex-wrap: wrap;
      }
    }
  `]
})
export class EnrollmentPaymentDetailsModalComponent {
  payment: EnrollmentPaymentVTO;

  constructor(
    private dialogRef: MatDialogRef<EnrollmentPaymentDetailsModalComponent>,
    @Inject(MAT_DIALOG_DATA) private data: EnrollmentPaymentVTO,
    private dialog: MatDialog
  ) {
    this.payment = data;
  }

  editPayment(): void {
    this.dialogRef.close();
    const wizardDialogRef = this.dialog.open(EnrollmentPaymentWizardModalComponent, {
      data: { paymentId: this.payment.id },
      width: '800px',
      maxWidth: '90vw'
    });
    
    wizardDialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Refresh needed - handled by parent
      }
    });
  }

  deletePayment(): void {
    this.dialogRef.close({ action: 'delete', payment: this.payment });
  }

  printPaymentDocument(): void {
    this.generatePrintDocument();
  }

  generatePrintDocument(): void {
    const printContainer = document.createElement('div');
    printContainer.style.direction = 'rtl';
    printContainer.style.fontFamily = 'Cairo, "Segoe UI", Tahoma, sans-serif';
    printContainer.style.padding = '20px';
    printContainer.style.backgroundColor = 'white';
    printContainer.style.maxWidth = '800px';
    printContainer.style.margin = '0 auto';
    
    const today = new Date().toLocaleDateString('ar-EG');
    const isPaid = this.payment.paymentStatus?.id === 2;
    const statusColor = isPaid ? '#065f46' : '#92400e';
    const statusBg = isPaid ? '#d1fae5' : '#fef3c7';
    
    printContainer.innerHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>إيصال دفع - #${this.payment.id}</title>
        <style>
          * { font-family: 'Cairo', 'Segoe UI', Tahoma, sans-serif; }
          @media print { body { margin: 0; padding: 20px; } .no-print { display: none; } }
          .receipt-container { max-width: 800px; margin: 0 auto; background: white; }
          .header { text-align: center; margin-bottom: 30px; padding: 20px; background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%); color: white; border-radius: 12px; }
          .header h1 { margin: 0; font-size: 24px; }
          .header p { margin: 10px 0 0 0; font-size: 12px; opacity: 0.9; }
          .receipt-details { display: flex; justify-content: space-between; margin-bottom: 20px; padding: 10px; background: #f9fafb; border-radius: 8px; }
          h2 { color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 8px; margin-top: 24px; margin-bottom: 16px; font-size: 18px; }
          .info-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; margin-bottom: 16px; }
          .info-item { border-bottom: 1px solid #e5e7eb; padding: 8px 0; }
          .info-label { font-weight: 600; color: #374151; font-size: 13px; margin-bottom: 4px; }
          .info-value { color: #1f2937; font-size: 14px; }
          .amount-box { background: #eff6ff; padding: 16px; border-radius: 12px; margin: 16px 0; text-align: center; }
          .amount-label { font-size: 14px; color: #6b7280; }
          .amount-value { font-size: 28px; font-weight: bold; color: #2563eb; }
          .signature-section { margin-top: 40px; display: flex; justify-content: space-between; align-items: flex-end; gap: 20px; padding-top: 20px; border-top: 1px solid #e5e7eb; }
          .signature-box { text-align: center; flex: 1; }
          .signature-line { width: 100%; border-top: 1px solid #000; margin-top: 40px; padding-top: 8px; }
          .footer { text-align: center; margin-top: 30px; padding: 16px; font-size: 10px; color: #9ca3af; }
          @media (max-width: 600px) { .info-grid { grid-template-columns: 1fr; } .signature-section { flex-direction: column; align-items: center; } }
        </style>
      </head>
      <body>
        <div class="receipt-container">
          <div class="header">
            <h1>إيصال دفع</h1>
            <p>نظام إدارة الأكاديمية الأولمبية</p>
          </div>
          <div class="receipt-details">
            <div><strong>رقم الإيصال:</strong> #${this.payment.id}</div>
            <div><strong>تاريخ الطباعة:</strong> ${today}</div>
          </div>
          <h2>📋 معلومات التسجيل</h2>
          <div class="info-grid">
            <div class="info-item"><div class="info-label">المتدرب</div><div class="info-value">${this.payment.enrollment?.trainee?.title || '-'}</div></div>
            <div class="info-item"><div class="info-label">الدورة</div><div class="info-value">${this.payment.enrollment?.course?.title || '-'}</div></div>
            <div class="info-item"><div class="info-label">تاريخ التسجيل</div><div class="info-value">${this.payment.enrollment?.startDate || '-'}</div></div>
          </div>
          <h2>💰 تفاصيل الدفع</h2>
          <div class="info-grid">
            <div class="info-item"><div class="info-label">تاريخ الدفع</div><div class="info-value">${this.payment.paymentDate || '-'}</div></div>
            <div class="info-item"><div class="info-label">طريقة الدفع</div><div class="info-value">${this.payment.paymentMethod?.title || '-'}</div></div>
            <div class="info-item"><div class="info-label">حالة الدفع</div><div class="info-value"><span style="background: ${statusBg}; color: ${statusColor}; padding: 4px 12px; border-radius: 20px;">${this.payment.paymentStatus?.title || '-'}</span></div></div>
          </div>
          <div class="amount-box">
            <div class="amount-label">المبلغ المدفوع</div>
            <div class="amount-value">${(this.payment.paidAmount || 0).toLocaleString('ar-EG')} جم</div>
          </div>
          <div class="info-grid">
            <div class="info-item"><div class="info-label">قيمة التسجيل</div><div class="info-value">${(this.payment.enrollmentValue || 0).toLocaleString('ar-EG')} جم</div></div>
            <div class="info-item"><div class="info-label">المبلغ المتبقي</div><div class="info-value">${(this.payment.remainedValue || 0).toLocaleString('ar-EG')} جم</div></div>
          </div>
          ${this.payment.note ? `<h2>📝 ملاحظات</h2><div class="info-item">${this.payment.note}</div>` : ''}
          <div class="signature-section">
            <div class="signature-box"><div class="signature-line"></div><div>توقيع المستلم</div></div>
            <div class="signature-box"><div class="signature-line"></div><div>توقيع المحاسب</div></div>
            <div class="signature-box"><div class="signature-line"></div><div>ختم الأكاديمية</div></div>
          </div>
          <div class="footer">تم التصدير من نظام إدارة الأكاديمية الأولمبية</div>
        </div>
        <div class="no-print" style="text-align: center; margin-top: 20px;">
          <button onclick="window.print();" style="padding: 10px 20px; background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%); color: white; border: none; border-radius: 5px; cursor: pointer;">🖨️ طباعة / حفظ كـ PDF</button>
        </div>
      </body>
      </html>
    `;
    
    const printWindow = window.open('', '_blank', 'width=800,height=800,scrollbars=yes');
    if (printWindow) {
      printWindow.document.write(printContainer.innerHTML);
      printWindow.document.close();
    } else {
      document.body.appendChild(printContainer);
      window.print();
      setTimeout(() => { document.body.removeChild(printContainer); }, 500);
    }
  }
}