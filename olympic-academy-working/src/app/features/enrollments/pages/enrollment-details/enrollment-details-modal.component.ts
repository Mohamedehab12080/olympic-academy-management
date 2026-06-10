import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { EnrollmentVTO } from '../../../../core/models/enrollment.model';

@Component({
  selector: 'app-enrollment-details-modal',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatTooltipModule
  ],
  template: `
    <div class="modal-container" dir="rtl">
      <div class="modal-header">
        <div class="header-title">
          <h2>تفاصيل التسجيل</h2>
        </div>
        <div class="header-actions">
          <button mat-icon-button (click)="printEnrollmentDocument()" matTooltip="طباعة التفاصيل">
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
          <div class="detail-label">رقم التسجيل:</div>
          <div class="detail-value">#{{ enrollment.id }}</div>
        </div>
        
        <div class="detail-row">
          <div class="detail-label">المتدرب:</div>
          <div class="detail-value">
            <mat-icon>person</mat-icon>
            <span>{{ enrollment.trainee?.title }}</span>
          </div>
        </div>
        
        <div class="detail-row">
          <div class="detail-label">الدورة:</div>
          <div class="detail-value">
            <span class="badge course-badge">{{ enrollment.course?.title }}</span>
          </div>
        </div>
        
        <div class="detail-row">
          <div class="detail-label">المدرب:</div>
          <div class="detail-value">
            <mat-icon>school</mat-icon>
            <span>{{ enrollment.trainer?.title }}</span>
          </div>
        </div>
        
        <div class="detail-row">
          <div class="detail-label">نوع التسجيل:</div>
          <div class="detail-value">{{ enrollment.enrollmentType?.title || '-' }}</div>
        </div>
        
        <div class="detail-row">
          <div class="detail-label">تاريخ البدء:</div>
          <div class="detail-value">
            <mat-icon>event</mat-icon>
            <span>{{ enrollment.startDate | date:'dd/MM/yyyy' }}</span>
          </div>
        </div>
        
        <div class="detail-row" *ngIf="enrollment.endDate">
          <div class="detail-label">تاريخ الانتهاء:</div>
          <div class="detail-value">
            <mat-icon>event</mat-icon>
            <span>{{ enrollment.endDate | date:'dd/MM/yyyy' }}</span>
          </div>
        </div>
        
        <div class="detail-row">
          <div class="detail-label">حالة التسجيل:</div>
          <div class="detail-value">
            <span class="status-badge" [ngClass]="getEnrollmentStatusClass(enrollment.enrollmentStatus?.id ?? 0)">
              {{ enrollment.enrollmentStatus?.title }}
            </span>
          </div>
        </div>
        
        <div class="detail-row">
          <div class="detail-label">حالة الدفع:</div>
          <div class="detail-value">
            <span class="payment-badge" [ngClass]="getPaymentStatusClass(enrollment.paymentStatus?.id ?? 0)">
              {{ enrollment.paymentStatus?.title }}
            </span>
          </div>
        </div>
        
        <div class="detail-row">
          <div class="detail-label">قيمة الاشتراك:</div>
          <div class="detail-value amount">{{ enrollment.subscriptionValue | currency:'EGP' }}</div>
        </div>
        
        <div class="detail-row" *ngIf="enrollment.discountAmount">
          <div class="detail-label">قيمة الخصم:</div>
          <div class="detail-value">{{ enrollment.discountAmount | currency:'EGP' }}</div>
        </div>
        
        <div class="detail-row" *ngIf="enrollment.discountPercentage">
          <div class="detail-label">نسبة الخصم:</div>
          <div class="detail-value">{{ enrollment.discountPercentage }}%</div>
        </div>
        
        <div class="detail-row highlight">
          <div class="detail-label">المبلغ النهائي:</div>
          <div class="detail-value final-amount">{{ enrollment.finalSubscriptionValue | currency:'EGP' }}</div>
        </div>
        
        <div class="detail-row" *ngIf="enrollment.remainedSubscriptionValue">
          <div class="detail-label">المبلغ المتبقي:</div>
          <div class="detail-value">{{ enrollment.remainedSubscriptionValue | currency:'EGP' }}</div>
        </div>
        
        <div class="detail-row" *ngIf="enrollment.note">
          <div class="detail-label">ملاحظات:</div>
          <div class="detail-value note-value">{{ enrollment.note }}</div>
        </div>
        
        <mat-divider></mat-divider>
        
        <div class="info-section">
          <h4>معلومات الإنشاء والتعديل</h4>
          <div class="detail-row small">
            <div class="detail-label">تم الإنشاء بواسطة:</div>
            <div class="detail-value">{{ enrollment.createdBy?.fullName || '-' }}</div>
          </div>
          <div class="detail-row small">
            <div class="detail-label">تاريخ الإنشاء:</div>
            <div class="detail-value">{{ enrollment.createdOn | date:'dd/MM/yyyy HH:mm' }}</div>
          </div>
          <div class="detail-row small" *ngIf="enrollment.lastModifiedBy">
            <div class="detail-label">تم التعديل بواسطة:</div>
            <div class="detail-value">{{ enrollment.lastModifiedBy?.fullName }}</div>
          </div>
          <div class="detail-row small" *ngIf="enrollment.lastModifiedOn">
            <div class="detail-label">تاريخ التعديل:</div>
            <div class="detail-value">{{ enrollment.lastModifiedOn | date:'dd/MM/yyyy HH:mm' }}</div>
          </div>
        </div>
      </div>
      
      <mat-divider></mat-divider>
      
      <div class="modal-actions">
        <button mat-raised-button color="accent" (click)="printEnrollmentDocument()" matTooltip="طباعة التفاصيل">
          <mat-icon>print</mat-icon>
          طباعة
        </button>
        <button mat-raised-button color="primary" (click)="editEnrollment()">
          <mat-icon>edit</mat-icon>
          تعديل
        </button>
        <button mat-raised-button color="warn" (click)="deleteEnrollment()">
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
      background: linear-gradient(135deg, #ec489a 0%, #be185d 100%);
      color: white;
    }
    .header-title h2 {
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
      font-weight: 600;
      color: #3b82f6;
    }
    .detail-value.final-amount {
      font-weight: 700;
      font-size: 16px;
      color: #ec489a;
    }
    .detail-row.highlight {
      background: #fce7f3;
      padding: 8px 12px;
      border-radius: 8px;
      margin: 8px 0;
    }
    .badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 500;
    }
    .course-badge {
      background: #e0e7ff;
      color: #4338ca;
    }
    .status-badge {
      display: inline-block;
      padding: 4px 14px;
      border-radius: 30px;
      font-size: 12px;
      font-weight: 600;
    }
    .status-badge.active {
      background: #d1fae5;
      color: #065f46;
    }
    .status-badge.completed {
      background: #dbeafe;
      color: #1e40af;
    }
    .status-badge.cancelled {
      background: #fee2e2;
      color: #991b1b;
    }
    .payment-badge {
      display: inline-block;
      padding: 4px 14px;
      border-radius: 30px;
      font-size: 12px;
      font-weight: 600;
    }
    .payment-badge.paid {
      background: #d1fae5;
      color: #065f46;
    }
    .payment-badge.partial {
      background: #fef3c7;
      color: #92400e;
    }
    .payment-badge.unpaid {
      background: #fee2e2;
      color: #991b1b;
    }
    .note-value {
      background: #f9fafb;
      padding: 8px 12px;
      border-radius: 8px;
      line-height: 1.5;
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
export class EnrollmentDetailsModalComponent {
  constructor(
    private dialogRef: MatDialogRef<EnrollmentDetailsModalComponent>,
    @Inject(MAT_DIALOG_DATA) public enrollment: EnrollmentVTO,
    private router: Router
  ) {}

  getEnrollmentStatusClass(statusId: number): string {
    const classes: { [key: number]: string } = {
      1: 'active',
      2: 'completed',
      3: 'cancelled'
    };
    return classes[statusId] || '';
  }

  getPaymentStatusClass(statusId: number): string {
    const classes: { [key: number]: string } = {
      1: 'paid',
      2: 'partial',
      3: 'unpaid'
    };
    return classes[statusId] || 'unpaid';
  }

  editEnrollment(): void {
    this.dialogRef.close();
    this.router.navigate(['/enrollments', this.enrollment.id, 'edit']);
  }

  deleteEnrollment(): void {
    this.dialogRef.close({ action: 'delete', enrollment: this.enrollment });
  }

  printEnrollmentDocument(): void {
    this.generatePrintDocument(this.enrollment);
  }

  generatePrintDocument(enrollment: EnrollmentVTO): void {
    const printContainer = document.createElement('div');
    printContainer.style.direction = 'rtl';
    printContainer.style.fontFamily = 'Cairo, "Segoe UI", Tahoma, sans-serif';
    printContainer.style.padding = '20px';
    printContainer.style.backgroundColor = 'white';
    printContainer.style.maxWidth = '800px';
    printContainer.style.margin = '0 auto';
    
    const today = new Date().toLocaleDateString('ar-EG');
    
    printContainer.innerHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>طلب تسجيل - ${enrollment.trainee?.title}</title>
        <style>
          * { font-family: 'Cairo', 'Segoe UI', Tahoma, sans-serif; }
          @media print { 
            body { margin: 0; padding: 20px; } 
            .no-print { display: none; }
            .signature-line { border-top: 1px solid #000 !important; }
          }
          .application-container { max-width: 800px; margin: 0 auto; background: white; }
          .header { text-align: center; margin-bottom: 30px; padding: 20px; background: linear-gradient(135deg, #ec489a 0%, #be185d 100%); color: white; border-radius: 12px; }
          .header h1 { margin: 0; font-size: 24px; }
          .header p { margin: 10px 0 0 0; font-size: 12px; opacity: 0.9; }
          .application-details { display: flex; justify-content: space-between; margin-bottom: 20px; padding: 10px; background: #f9fafb; border-radius: 8px; }
          h2 { color: #ec489a; border-bottom: 2px solid #ec489a; padding-bottom: 8px; margin-top: 24px; margin-bottom: 16px; font-size: 18px; }
          .info-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; margin-bottom: 16px; }
          .info-item { border-bottom: 1px solid #e5e7eb; padding: 8px 0; }
          .info-label { font-weight: 600; color: #374151; font-size: 13px; margin-bottom: 4px; }
          .info-value { color: #1f2937; font-size: 14px; }
          .info-value.amount { font-weight: 700; color: #ec489a; }
          .full-width { grid-column: span 2; }
          .payment-details { margin: 16px 0; padding: 16px; background: #fce7f3; border-radius: 12px; }
          .payment-row { display: flex; justify-content: space-between; margin-bottom: 8px; }
          .payment-label { font-weight: 600; color: #374151; }
          .payment-value { font-weight: 700; color: #ec489a; }
          .signature-section { margin-top: 40px; display: flex; justify-content: space-between; align-items: flex-end; gap: 20px; padding-top: 20px; border-top: 1px solid #e5e7eb; }
          .signature-box { text-align: center; flex: 1; }
          .signature-line { width: 100%; border-top: 1px solid #000; margin-top: 40px; padding-top: 8px; }
          .signature-date { font-size: 10px; color: #6b7280; margin-top: 8px; }
          .footer { text-align: center; margin-top: 30px; padding: 16px; font-size: 10px; color: #9ca3af; border-top: 1px solid #e5e7eb; }
          @media (max-width: 600px) { 
            .info-grid { grid-template-columns: 1fr; } 
            .signature-section { flex-direction: column; align-items: center; gap: 30px; }
            .signature-box { width: 100%; }
          }
        </style>
      </head>
      <body>
        <div class="application-container">
          <div class="header">
            <h1>طلب تسجيل في دورة تدريبية</h1>
            <p>نظام إدارة الأكاديمية الأولمبية</p>
          </div>
          
          <div class="application-details">
            <div><strong>رقم الطلب:</strong> #${enrollment.id}</div>
            <div><strong>تاريخ الطلب:</strong> ${today}</div>
          </div>
          
          <h2>📋 معلومات المتدرب</h2>
          <div class="info-grid">
            <div class="info-item"><div class="info-label">الاسم الكامل</div><div class="info-value">${enrollment.trainee?.title || '-'}</div></div>
            <div class="info-item"><div class="info-label">المدرب</div><div class="info-value">${enrollment.trainer?.title || '-'}</div></div>
          </div>
          
          <h2>📚 معلومات الدورة</h2>
          <div class="info-grid">
            <div class="info-item full-width"><div class="info-label">اسم الدورة</div><div class="info-value">${enrollment.course?.title || '-'}</div></div>
            <div class="info-item"><div class="info-label">نوع التسجيل</div><div class="info-value">${enrollment.enrollmentType?.title || '-'}</div></div>
            <div class="info-item"><div class="info-label">تاريخ البدء</div><div class="info-value">${enrollment.startDate || '-'}</div></div>
            <div class="info-item"><div class="info-label">تاريخ الانتهاء</div><div class="info-value">${enrollment.endDate || '-'}</div></div>
            <div class="info-item"><div class="info-label">حالة التسجيل</div><div class="info-value">${enrollment.enrollmentStatus?.title || '-'}</div></div>
            <div class="info-item"><div class="info-label">حالة الدفع</div><div class="info-value">${enrollment.paymentStatus?.title || '-'}</div></div>
          </div>
          
          <h2>💰 تفاصيل الدفع</h2>
          <div class="payment-details">
            <div class="payment-row"><span class="payment-label">قيمة الاشتراك:</span><span class="payment-value">${enrollment.subscriptionValue?.toLocaleString('ar-EG') || 0} جم</span></div>
            ${enrollment.discountAmount ? `<div class="payment-row"><span class="payment-label">قيمة الخصم:</span><span class="payment-value">${enrollment.discountAmount.toLocaleString('ar-EG')} جم</span></div>` : ''}
            ${enrollment.discountPercentage ? `<div class="payment-row"><span class="payment-label">نسبة الخصم:</span><span class="payment-value">${enrollment.discountPercentage}%</span></div>` : ''}
            <div class="payment-row"><span class="payment-label">المبلغ النهائي:</span><span class="payment-value">${enrollment.finalSubscriptionValue?.toLocaleString('ar-EG') || 0} جم</span></div>
            ${enrollment.remainedSubscriptionValue ? `<div class="payment-row"><span class="payment-label">المبلغ المتبقي:</span><span class="payment-value">${enrollment.remainedSubscriptionValue.toLocaleString('ar-EG')} جم</span></div>` : ''}
          </div>
          
          ${enrollment.note ? `
          <h2>📝 ملاحظات</h2>
          <div class="info-item full-width">${enrollment.note}</div>
          ` : ''}
          
          <div class="signature-section">
            <div class="signature-box">
              <div class="signature-line"></div>
              <div>توقيع المتدرب</div>
              <div class="signature-date">التاريخ: ___ / ___ / _____</div>
            </div>
            <div class="signature-box">
              <div class="signature-line"></div>
              <div>توقيع المدرب</div>
              <div class="signature-date">التاريخ: ___ / ___ / _____</div>
            </div>
            <div class="signature-box">
              <div class="signature-line"></div>
              <div>ختم الأكاديمية</div>
              <div class="signature-date">التاريخ: ___ / ___ / _____</div>
            </div>
          </div>
          
          <div class="footer">
            تم التصدير من نظام إدارة الأکاديمية الأولمبية<br>
            هذا المستند معتمد ويحتوي على جميع بيانات التسجيل
          </div>
        </div>
        <div class="no-print" style="text-align: center; margin-top: 20px; padding: 10px;">
          <button onclick="window.print();" style="padding: 10px 20px; background: linear-gradient(135deg, #ec489a 0%, #be185d 100%); color: white; border: none; border-radius: 5px; cursor: pointer;">
            🖨️ طباعة / حفظ كـ PDF
          </button>
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