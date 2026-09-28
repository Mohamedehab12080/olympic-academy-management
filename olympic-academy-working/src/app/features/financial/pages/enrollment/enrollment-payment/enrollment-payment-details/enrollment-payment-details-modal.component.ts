// enrollment-payment-details-modal.component.ts - ENHANCED RECEIPT WITH WATERMARK AND COPYRIGHT

import { Component, Inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  MatDialogRef, 
  MAT_DIALOG_DATA, 
  MatDialogModule, 
  MatDialog 
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Subscription } from 'rxjs';
import { EnrollmentPaymentVTO } from '../../../../../../core/models/financial.model';
import { EnrollmentPaymentWizardModalComponent } from '../enrollment-payment-wizard/enrollment-payment-wizard-modal.component';
import { NotificationService } from '../../../../../../core/services/notification.service';

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
          <button 
            mat-icon-button 
            (click)="printPaymentDocument()" 
            matTooltip="طباعة التفاصيل"
            aria-label="طباعة">
            <mat-icon>print</mat-icon>
          </button>
          <button 
            mat-icon-button 
            mat-dialog-close 
            class="close-btn"
            aria-label="إغلاق">
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
            <span>{{ payment.enrollment?.trainee?.fullName }} - {{ payment.enrollment?.course?.title }}</span>
          </div>
        </div>
        
        <div class="detail-row">
          <div class="detail-label">المتدرب:</div>
          <div class="detail-value">
            <mat-icon>person</mat-icon>
            <span>{{ payment.enrollment?.trainee?.fullName }}</span>
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
        
        <div class="detail-row" [class.highlight-danger]="payment.remainedValue > 0">
          <div class="detail-label">المبلغ المتبقي:</div>
          <div class="detail-value" [class.amount-danger]="payment.remainedValue > 0">
            {{ payment.remainedValue | currency:'EGP' }}
          </div>
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
            <span 
              class="status-badge" 
              [class.paid]="payment.paymentStatus?.id === 2" 
              [class.pending]="payment.paymentStatus?.id === 1"
              [class.failed]="payment.paymentStatus?.id === 3">
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
        <button 
          mat-raised-button 
          color="accent" 
          (click)="printPaymentDocument()" 
          matTooltip="طباعة التفاصيل">
          <mat-icon>print</mat-icon>
          طباعة
        </button>
        <button 
          mat-raised-button 
          color="primary" 
          (click)="editPayment()">
          <mat-icon>edit</mat-icon>
          تعديل
        </button>
        <button 
          mat-raised-button 
          color="warn" 
          (click)="deletePayment()">
          <mat-icon>delete</mat-icon>
          حذف
        </button>
        <button 
          mat-button 
          mat-dialog-close>
          <mat-icon>close</mat-icon>
          إغلاق
        </button>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }
    .modal-container {
      min-width: 550px;
      max-width: 650px;
      direction: rtl;
      background: #f5f7fa;
      border-radius: 24px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      max-height: 90vh;
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
      font-weight: 600;
    }
    .header-actions {
      display: flex;
      gap: 8px;
    }
    .header-actions button {
      color: rgba(255, 255, 255, 0.9);
      transition: all 0.2s ease;
    }
    .header-actions button:hover {
      color: white;
      transform: scale(1.1);
    }
    .close-btn:hover {
      transform: scale(1.1) rotate(90deg);
    }
    .modal-content {
      padding: 20px;
      overflow-y: auto;
      flex: 1;
    }
    .detail-row {
      display: flex;
      margin-bottom: 14px;
      align-items: center;
      padding: 4px 0;
    }
    .detail-row:last-child { margin-bottom: 0; }
    .detail-label {
      width: 130px;
      font-weight: 600;
      color: #374151;
      flex-shrink: 0;
      font-size: 13px;
    }
    .detail-value {
      flex: 1;
      display: flex;
      align-items: center;
      gap: 8px;
      color: #1f2937;
      font-size: 13px;
      word-break: break-word;
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
    .detail-value.amount-danger {
      font-weight: 700;
      color: #dc2626;
      font-size: 16px;
    }
    .detail-row.highlight {
      background: #eff6ff;
      padding: 8px 12px;
      border-radius: 8px;
      margin: 8px 0;
    }
    .detail-row.highlight-danger {
      background: #fef2f2;
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
    .status-badge.paid { background: #d1fae5; color: #065f46; }
    .status-badge.pending { background: #fef3c7; color: #92400e; }
    .status-badge.failed { background: #fee2e2; color: #991b1b; }
    .note-value {
      background: #f9fafb;
      padding: 8px 12px;
      border-radius: 8px;
      line-height: 1.6;
      width: 100%;
    }
    .attachment-link {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      color: #2563eb;
      text-decoration: none;
      font-weight: 500;
    }
    .attachment-link:hover {
      color: #1e40af;
      text-decoration: underline;
    }
    .info-section {
      margin-top: 20px;
      padding: 16px;
      background: #f9fafb;
      border-radius: 12px;
      border: 1px solid #e5e7eb;
    }
    .info-section:first-of-type { margin-top: 0; }
    .info-section h4 {
      margin: 0 0 12px 0;
      font-size: 14px;
      color: #374151;
      font-weight: 600;
    }
    .detail-row.small { margin-bottom: 8px; }
    .detail-row.small .detail-label {
      font-size: 12px;
      color: #6b7280;
      width: 140px;
    }
    .detail-row.small .detail-value { font-size: 12px; }
    .modal-actions {
      flex-shrink: 0;
      display: flex;
      gap: 12px;
      justify-content: flex-end;
      padding: 16px 20px;
      background: white;
      border-top: 1px solid #e5e7eb;
      flex-wrap: wrap;
    }
    .modal-actions button { min-width: 80px; }
    .modal-actions button mat-icon { margin-left: 4px; }
    @media (max-width: 600px) {
      .modal-container {
        min-width: 90vw;
        max-width: 90vw;
        border-radius: 16px;
      }
      .modal-header { padding: 12px 16px; }
      .modal-header h2 { font-size: 16px; }
      .modal-content { padding: 16px; }
      .detail-row {
        flex-direction: column;
        align-items: flex-start;
        gap: 4px;
        margin-bottom: 10px;
      }
      .detail-label { width: 100%; font-size: 12px; }
      .detail-value { font-size: 13px; width: 100%; }
      .detail-row.highlight,
      .detail-row.highlight-danger { padding: 6px 10px; }
      .detail-value.amount { font-size: 16px; }
      .info-section { padding: 12px; margin-top: 16px; }
      .modal-actions { padding: 12px 16px; gap: 8px; }
      .modal-actions button {
        min-width: 60px;
        font-size: 12px;
        padding: 0 12px;
      }
    }
  `]
})
export class EnrollmentPaymentDetailsModalComponent implements OnDestroy {
  payment: EnrollmentPaymentVTO;
  private wizardSubscription?: Subscription;

  constructor(
    private dialogRef: MatDialogRef<EnrollmentPaymentDetailsModalComponent>,
    @Inject(MAT_DIALOG_DATA) private data: EnrollmentPaymentVTO,
    private dialog: MatDialog,
    private notification: NotificationService
  ) {
    this.payment = data;
  }

  ngOnDestroy(): void {
    if (this.wizardSubscription) {
      this.wizardSubscription.unsubscribe();
    }
  }

  editPayment(): void {
    this.dialogRef.close();
    const wizardDialogRef = this.dialog.open(EnrollmentPaymentWizardModalComponent, {
      data: { 
        paymentId: this.payment.id,
        mode: 'edit'
      },
      width: '800px',
      maxWidth: '90vw',
      disableClose: true
    });
    this.wizardSubscription = wizardDialogRef.afterClosed().subscribe((result: any) => {
      if (result && result.action === 'saved') {
        this.dialogRef.close({ action: 'refresh', paymentId: this.payment.id });
      }
    });
  }

  deletePayment(): void {
    this.dialogRef.close({ action: 'delete', payment: this.payment });
  }
  
  printPaymentDocument(): void {
    this.printReceiptWithLogo();
  }

  private printReceiptWithLogo(): void {
    const printWindow = window.open('', '_blank', 'width=350,height=600,scrollbars=no,menubar=no,toolbar=no,status=no');
    if (!printWindow) {
      this.notification.showError('تعذر فتح نافذة الطباعة. يرجى السماح بالنوافذ المنبثقة.');
      return;
    }

    const data = this.prepareReceiptData();
    const html = this.buildEnhancedReceiptHTML(data);
    
    printWindow.document.write(html);
    printWindow.document.close();

    setTimeout(() => {
      try {
        printWindow.focus();
        printWindow.print();
      } catch (error) {
        console.error('Print error:', error);
        this.notification.showError('حدث خطأ أثناء الطباعة');
      }
    }, 1000);
  }

  private buildEnhancedReceiptHTML(data: any): string {
    const logoPath = window.location.origin + '/assets/images/mainLogo.jpeg';
    
    return `
<!DOCTYPE html>
<html dir="rtl">
<head>
<meta charset="UTF-8">
<title>إيصال دفع #${data.id}</title>
<script src="https://cdn.jsdelivr.net/npm/jsbarcode@3.11.6/dist/JsBarcode.all.min.js"><\/script>
<style>
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  @page {
    size: 80mm auto;
    margin: 0mm;
  }

  html, body {
    margin: 0;
    padding: 0;
    background: white;
    width: 80mm;
    min-width: 80mm;
    max-width: 80mm;
  }

  .receipt-wrapper {
    width: 80mm;
    min-width: 80mm;
    max-width: 80mm;
    margin: 0;
    padding: 0;
    background: white;
    position: relative;
    overflow: hidden;
  }

  .receipt {
    width: 80mm;
    min-width: 80mm;
    max-width: 80mm;
    margin: 0;
    padding: 2.5mm 3mm 3mm 3mm;
    background: white;
    font-family: 'Arial', 'Tahoma', sans-serif;
    font-size: 9pt;
    line-height: 1.4;
    color: #000000;
    position: relative;
    overflow: hidden;
  }

  /* ===== WATERMARK - Behind content ===== */
  .receipt-watermark {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) rotate(-25deg) scale(1.6);
    opacity: 0.05;
    pointer-events: none;
    z-index: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
  }
  
  .receipt-watermark img {
    width: 100px;
    height: auto;
    object-fit: contain;
    opacity: 0.9;
  }
  
  .receipt-watermark-text {
    position: absolute;
    top: 56%;
    left: 50%;
    transform: translate(-50%, -50%) rotate(-25deg) scale(0.8);
    font-size: 20px;
    font-weight: 900;
    color: #2563eb;
    letter-spacing: 4px;
    text-transform: uppercase;
    white-space: nowrap;
    opacity: 0.03;
    pointer-events: none;
    z-index: 0;
    text-shadow: 0 2px 8px rgba(37, 99, 235, 0.1);
  }

  /* ===== CONTENT - Above watermark ===== */
  .receipt-content {
    position: relative;
    z-index: 1;
  }

  /* ===== LOGO SECTION ===== */
  .logo-section {
    text-align: center;
    padding: 1mm 0 1mm 0;
    border-bottom: 2.5px solid #2563eb;
    margin-bottom: 2mm;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }
  
  .logo-section img {
    width: 36px;
    height: 36px;
    object-fit: contain;
    border-radius: 50%;
    border: 2px solid #2563eb;
    padding: 2px;
    background: white;
  }
  
  .logo-section .academy-name {
    font-size: 13pt;
    font-weight: 700;
    color: #1a1a2e;
    display: block;
  }
  
  .logo-section .receipt-type {
    font-size: 7pt;
    color: #2563eb;
    font-weight: 600;
    display: block;
    margin-top: -1px;
  }

  .logo-text {
    display: flex;
    flex-direction: column;
    line-height: 1.2;
  }

  /* ===== RECEIPT TITLE ===== */
  .receipt-title {
    text-align: center;
    padding: 0.5mm 0 1.5mm 0;
    border-bottom: 1px dashed #e5e7eb;
    margin-bottom: 2mm;
  }
  .receipt-title h1 {
    font-size: 14pt;
    font-weight: 700;
    color: #1e293b;
    margin: 0;
  }
  .receipt-title .receipt-number {
    font-size: 8pt;
    color: #6b7280;
    margin-top: 0.5mm;
  }

  /* ===== BODY ===== */
  .receipt-body {
    padding: 1mm 0;
  }

  .receipt-section {
    margin-bottom: 2mm;
  }
  .receipt-section:last-child { margin-bottom: 0; }

  .section-title {
    font-size: 8pt;
    font-weight: 600;
    color: #2563eb;
    margin-bottom: 1mm;
    padding-bottom: 0.5mm;
    border-bottom: 0.5pt solid #eef2f6;
  }

  .info-row {
    display: flex;
    justify-content: space-between;
    padding: 0.5mm 0;
    font-size: 8pt;
    border-bottom: 0.3pt dashed #f1f5f9;
  }
  .info-row:last-child { border-bottom: none; }

  .info-row .label {
    color: #6b7280;
    flex-shrink: 0;
  }
  .info-row .value {
    font-weight: 500;
    color: #1e293b;
    text-align: left;
  }
  .info-row .value.highlight {
    color: #059669;
    font-weight: 700;
  }
  .info-row .value.amount {
    font-size: 10pt;
  }
  .info-row .value.danger {
    color: #dc2626;
    font-weight: 700;
  }

  .payment-details {
    background: #f8fafc;
    border-radius: 1mm;
    padding: 1mm 2mm;
    margin-top: 0.5mm;
  }
  .payment-details .info-row {
    border-bottom-color: #e2e8f0;
    padding: 0.3mm 0;
  }
  .payment-details .info-row:last-child { border-bottom: none; }

  .status-badge {
    display: inline-block;
    padding: 0px 2mm;
    border-radius: 3mm;
    font-size: 7pt;
    font-weight: 600;
  }

  .divider-line {
    border: none;
    border-top: 0.5pt dashed #e2e8f0;
    margin: 1mm 0;
  }

  /* ===== BARCODE AT BOTTOM ===== */
  .barcode-section {
    text-align: center;
    padding: 2mm 0 1mm 0;
    border-top: 1px solid #e5e7eb;
    margin-top: 2mm;
  }
  .barcode-container {
    display: inline-block;
    background: white;
    padding: 0.5mm 1mm;
    border: 0.5pt solid #e5e7eb;
    border-radius: 1mm;
  }
  .barcode-container svg {
    max-width: 100%;
    height: 8mm;
    display: block;
  }
  .barcode-container .barcode-label {
    display: block;
    font-size: 5pt;
    color: #6b7280;
    margin-top: 0.5mm;
  }

  .receipt-footer {
    text-align: center;
    padding: 1mm 0 0 0;
    font-size: 6pt;
    color: #94a3b8;
  }

  /* ===== COPYRIGHT CREDIT - Inside receipt at bottom ===== */
  .receipt-credit {
    text-align: center;
    font-size: 4.5px;
    color: #1a1a2e;
    font-weight: 500;
    opacity: 0.6;
    letter-spacing: 0.3px;
    direction: ltr;
    margin-top: 1mm;
    padding-top: 0.5mm;
    border-top: 0.5px dashed rgba(26, 26, 46, 0.15);
  }

  .note-text {
    font-size: 7pt;
    color: #4b5563;
  }

  .print-btn-container {
    text-align: center;
    padding: 2mm 0;
    background: white;
  }
  .print-btn {
    padding: 1mm 4mm;
    background: #2563eb;
    color: white;
    border: none;
    border-radius: 1mm;
    font-size: 8pt;
    font-weight: 600;
    cursor: pointer;
  }

  @media print {
    html, body {
      width: 80mm !important;
      min-width: 80mm !important;
      max-width: 80mm !important;
      margin: 0 !important;
      padding: 0 !important;
    }
    .receipt {
      width: 80mm !important;
      min-width: 80mm !important;
      max-width: 80mm !important;
      margin: 0 !important;
      padding: 2mm 2.5mm 2.5mm 2.5mm !important;
    }
    .print-btn-container {
      display: none !important;
    }
    .receipt-title,
    .status-badge,
    .payment-details,
    .logo-section,
    .receipt-watermark {
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    .logo-section img {
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    .receipt-watermark {
      opacity: 0.06 !important;
    }
    .receipt-watermark img {
      width: 90px !important;
    }
    .receipt-watermark-text {
      font-size: 18px !important;
      opacity: 0.04 !important;
    }
    .receipt-credit {
      opacity: 0.5 !important;
      color: #000000 !important;
    }
  }

  @media (max-width: 60mm) {
    html, body {
      width: 58mm !important;
      min-width: 58mm !important;
      max-width: 58mm !important;
    }
    .receipt {
      width: 58mm !important;
      min-width: 58mm !important;
      max-width: 58mm !important;
      padding: 1.5mm 2mm 2mm 2mm !important;
      font-size: 7pt !important;
    }
    .logo-section img { width: 28px !important; height: 28px !important; }
    .logo-section .academy-name { font-size: 10pt !important; }
    .logo-section .receipt-type { font-size: 5.5pt !important; }
    .receipt-title h1 { font-size: 11pt !important; }
    .receipt-body { padding: 0.5mm 0 !important; }
    .section-title { font-size: 6.5pt !important; }
    .info-row { font-size: 6.5pt !important; padding: 0.3mm 0 !important; }
    .info-row .value.amount { font-size: 8pt !important; }
    .payment-details { padding: 0.5mm 1mm !important; }
    .status-badge { font-size: 5.5pt !important; padding: 0px 1mm !important; }
    .barcode-container svg { height: 6mm !important; }
    .barcode-container .barcode-label { font-size: 3.5pt !important; }
    .note-text { font-size: 5.5pt !important; }
    .receipt-footer { font-size: 4.5pt !important; }
    .receipt-watermark img { width: 70px !important; }
    .receipt-watermark-text { font-size: 14px !important; }
    .receipt-credit { font-size: 3.5px !important; }
  }
</style>
</head>
<body>
<div class="receipt-wrapper">
  <div class="receipt">
    <!-- ===== WATERMARK - Behind content ===== -->
    <div class="receipt-watermark">
      <img src="${logoPath}" alt=" الأكاديمية الأولمبية لعلوم الرياضة">
    </div>
    <div class="receipt-watermark-text"> الأكاديمية الأولمبية لعلوم الرياضة</div>

    <!-- ===== CONTENT ===== -->
    <div class="receipt-content">
      <!-- LOGO AND ACADEMY NAME -->
      <div class="logo-section">
        <img src="${logoPath}" alt=" الأكاديمية الأولمبية لعلوم الرياضة" onerror="this.style.display='none'">
        <div class="logo-text">
          <span class="academy-name">  الأكاديمية الأولمبية لعلوم الرياضة</span>
          <span class="receipt-type">✦ إيصال دفع ✦</span>
        </div>
      </div>

      <!-- RECEIPT TITLE -->
      <div class="receipt-title">
        <h1>إيصال دفع</h1>
        <div class="receipt-number">#${data.id}</div>
      </div>

      <!-- BODY -->
      <div class="receipt-body">
        <!-- Enrollment Info -->
        <div class="receipt-section">
          <div class="section-title">📚 التسجيل</div>
          <div class="info-row">
            <span class="label">المتدرب</span>
            <span class="value">${data.traineeName}</span>
          </div>
          <div class="info-row">
            <span class="label">الدورة</span>
            <span class="value">${data.courseTitle}</span>
          </div>
          <div class="info-row">
            <span class="label">تاريخ الدفع</span>
            <span class="value">${data.paymentDate}</span>
          </div>
          <div class="info-row">
            <span class="label">القيمة الإجمالية</span>
            <span class="value">${this.formatCurrency(data.enrollmentValue)} جم</span>
          </div>
        </div>

        <hr class="divider-line">

        <!-- Payment Details -->
        <div class="receipt-section">
          <div class="section-title">💰 الدفعة</div>
          <div class="payment-details">
            <div class="info-row">
              <span class="label">طريقة الدفع</span>
              <span class="value">${data.paymentMethod}</span>
            </div>
            <div class="info-row">
              <span class="label">المبلغ المدفوع</span>
              <span class="value highlight amount">${this.formatCurrency(data.paidAmount)} جم</span>
            </div>
            <div class="info-row">
              <span class="label">المبلغ المتبقي</span>
              <span class="value ${data.remainedValue === 0 ? 'highlight' : 'danger'}">${this.formatCurrency(data.remainedValue)} جم</span>
            </div>
            <div class="info-row">
              <span class="label">إجمالي المدفوع</span>
              <span class="value highlight">${this.formatCurrency(data.totalPaid)} جم</span>
            </div>
            <div class="info-row" style="border-bottom: none;">
              <span class="label">الحالة</span>
              <span class="value">
                <span class="status-badge" style="background: ${data.statusBg}; color: ${data.statusColor};">
                  ${data.paymentStatus}
                </span>
              </span>
            </div>
          </div>
        </div>

        ${data.note ? `
          <hr class="divider-line">
          <div class="receipt-section">
            <div class="section-title">📝 ملاحظات</div>
            <div class="info-row" style="border-bottom: none;">
              <span class="note-text">${data.note}</span>
            </div>
          </div>
        ` : ''}
      </div>

      <!-- BARCODE AT BOTTOM -->
      <div class="barcode-section">
        <div class="barcode-container">
          <svg id="barcode"></svg>
          <span class="barcode-label">${data.nationalId}</span>
        </div>
      </div>

      <!-- FOOTER -->
      <div class="receipt-footer">
        <div>شكراً لثقتكم بنا</div>
      </div>

      <!-- ===== COPYRIGHT CREDIT - Inside receipt at bottom ===== -->
      <div class="receipt-credit">powered by CoreStack Solutions | 01069911181</div>
    </div>
  </div>

  <!-- PRINT BUTTON -->
  <div class="print-btn-container">
    <button class="print-btn" onclick="window.print();">🖨️ طباعة</button>
  </div>
</div>

<script>
  window.onload = function() {
    setTimeout(function() {
      try {
        JsBarcode('#barcode', '${data.nationalId}', {
          format: 'CODE128',
          lineColor: '#000000',
          width: 1.5,
          height: 30,
          displayValue: false,
          fontSize: 5,
          font: 'monospace',
          textAlign: 'center',
          margin: 1,
          background: '#ffffff'
        });
      } catch(e) {
        console.error('Barcode error:', e);
      }
    }, 300);
  };
<\/script>
</body>
</html>`;
  }

  private prepareReceiptData(): any {
    const isPaid = this.payment.paymentStatus?.id === 2;
    const totalPaid = (this.payment.enrollmentValue || 0) - (this.payment.remainedValue || 0);

    return {
      id: this.payment.id || '0000',
      traineeName: this.payment.enrollment?.trainee?.fullName || 'غير محدد',
      courseTitle: this.payment.enrollment?.course?.title || 'غير محدد',
      paidAmount: this.payment.paidAmount || 0,
      remainedValue: this.payment.remainedValue || 0,
      enrollmentValue: this.payment.enrollmentValue || 0,
      totalPaid: totalPaid,
      paymentMethod: this.payment.paymentMethod?.title || 'غير محدد',
      paymentStatus: this.payment.paymentStatus?.title || 'قيد الانتظار',
      paymentDate: this.formatDate(this.payment.paymentDate),
      isPaid: isPaid,
      statusColor: isPaid ? '#065f46' : '#92400e',
      statusBg: isPaid ? '#d1fae5' : '#fef3c7',
      nationalId: this.payment.enrollment?.trainee?.nationalId || '0000000000',
      note: this.payment.note || '',
      currentDate: this.formatDate(new Date())
    };
  }

  private formatCurrency(amount: number): string {
    if (!amount && amount !== 0) return '0.00';
    return amount.toFixed(2);
  }

  private formatDate(dateValue: any): string {
    if (!dateValue) return '-';
    let dateObj: Date;
    if (typeof dateValue === 'string') {
      dateObj = new Date(dateValue);
    } else if (dateValue instanceof Date) {
      dateObj = dateValue;
    } else {
      return '-';
    }
    if (isNaN(dateObj.getTime())) return '-';
    const day = dateObj.getDate().toString().padStart(2, '0');
    const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
    const year = dateObj.getFullYear();
    return `${day}/${month}/${year}`;
  }
}