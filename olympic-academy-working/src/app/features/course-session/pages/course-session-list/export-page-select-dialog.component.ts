// export-page-select-dialog.component.ts - COMPLETE WORKING VERSION

import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-export-page-select-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDividerModule
  ],
  template: `
    <div class="dialog-container" dir="rtl">
      <div class="dialog-header" [class.card-print]="isCardPrint">
        <div class="header-icon" [class.card-print]="isCardPrint">
          <mat-icon>{{ isCardPrint ? 'credit_card' : 'description' }}</mat-icon>
        </div>
        <div>
          <h2>{{ isCardPrint ? 'طباعة البطاقات' : 'تصدير التقرير' }}</h2>
          <p>{{ isCardPrint ? 'اختر الصفحات التي تريد طباعة بطاقاتها' : 'اختر الصفحات التي تريد تصديرها' }}</p>
        </div>
        <button mat-icon-button (click)="close()" class="close-btn">
          <mat-icon>close</mat-icon>
        </button>
      </div>
      
      <mat-divider></mat-divider>
      
      <div class="dialog-body">
        <div class="info-section">
          <div class="info-row">
            <span class="info-label">إجمالي الصفحات</span>
            <span class="info-value">{{ data.totalPages }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">إجمالي السجلات</span>
            <span class="info-value">{{ data.totalItems }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">حجم الصفحة</span>
            <span class="info-value">{{ data.pageSize }}</span>
          </div>
        </div>

        <div class="selection-section">
          <div class="selection-options">
            <button 
              mat-raised-button 
              [color]="selectedOption === 'all' ? 'primary' : 'default'"
              (click)="selectedOption = 'all'"
              class="option-btn"
              [class.selected]="selectedOption === 'all'">
              <mat-icon>description</mat-icon>
              <span>جميع الصفحات ({{ data.totalPages }})</span>
              <span class="check-icon" *ngIf="selectedOption === 'all'">✓</span>
            </button>
            
            <button 
              mat-raised-button 
              [color]="selectedOption === 'current' ? 'primary' : 'default'"
              (click)="selectedOption = 'current'"
              class="option-btn"
              [class.selected]="selectedOption === 'current'">
              <mat-icon>description</mat-icon>
              <span>الصفحة الحالية فقط ({{ data.currentPage + 1 }})</span>
              <span class="check-icon" *ngIf="selectedOption === 'current'">✓</span>
            </button>
            
            <button 
              mat-raised-button 
              [color]="selectedOption === 'range' ? 'primary' : 'default'"
              (click)="selectedOption = 'range'"
              class="option-btn"
              [class.selected]="selectedOption === 'range'">
              <mat-icon>description</mat-icon>
              <span>نطاق صفحات محدد</span>
              <span class="check-icon" *ngIf="selectedOption === 'range'">✓</span>
            </button>
          </div>

          <div class="range-section" *ngIf="selectedOption === 'range'">
            <div class="range-inputs">
              <mat-form-field appearance="outline" class="range-field">
                <mat-label>من صفحة</mat-label>
                <input 
                  matInput 
                  type="number" 
                  [(ngModel)]="startPage" 
                  [min]="1" 
                  [max]="data.totalPages"
                  placeholder="1">
                <mat-error *ngIf="startPage < 1 || startPage > data.totalPages">أدخل صفحة صالحة (1 - {{ data.totalPages }})</mat-error>
              </mat-form-field>
              
              <mat-form-field appearance="outline" class="range-field">
                <mat-label>إلى صفحة</mat-label>
                <input 
                  matInput 
                  type="number" 
                  [(ngModel)]="endPage" 
                  [min]="1" 
                  [max]="data.totalPages"
                  placeholder="{{ data.totalPages }}">
                <mat-error *ngIf="endPage < 1 || endPage > data.totalPages">أدخل صفحة صالحة (1 - {{ data.totalPages }})</mat-error>
                <mat-error *ngIf="startPage > endPage">يجب أن تكون صفحة البداية أقل من صفحة النهاية</mat-error>
              </mat-form-field>
            </div>
            
            <div class="range-info">
              <mat-icon>info</mat-icon>
              <span>سيتم {{ isCardPrint ? 'طباعة' : 'تصدير' }} {{ getRangeCount() }} صفحة ({{ getRangeRecords() }} سجل)</span>
            </div>
          </div>
        </div>
      </div>
      
      <mat-divider></mat-divider>
      
      <div class="dialog-actions">
        <button mat-button (click)="close()" class="cancel-btn">إلغاء</button>
        <button 
          mat-raised-button 
          color="primary" 
          (click)="confirm()"
          [disabled]="!isValid()"
          class="confirm-btn"
          [class.card-print]="isCardPrint">
          <mat-icon>{{ isCardPrint ? 'print' : 'check' }}</mat-icon>
          <span>{{ isCardPrint ? 'طباعة' : 'تصدير' }}</span>
        </button>
      </div>
    </div>
  `,
  styles: [`
    .dialog-container {
      min-width: 480px;
      max-width: 580px;
      background: white;
      border-radius: 24px;
      overflow: hidden;
      direction: rtl;
      box-shadow: 0 24px 48px rgba(0, 0, 0, 0.2);
    }

    .dialog-header {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 20px 24px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      position: relative;
      transition: all 0.3s ease;
    }

    .dialog-header.card-print {
      background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
    }

    .header-icon {
      width: 48px;
      height: 48px;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      backdrop-filter: blur(4px);
      transition: all 0.3s ease;
    }

    .header-icon.card-print {
      background: rgba(255, 255, 255, 0.25);
    }

    .header-icon mat-icon {
      font-size: 28px;
      width: 28px;
      height: 28px;
    }

    .dialog-header h2 {
      margin: 0;
      font-size: 20px;
      font-weight: 700;
    }

    .dialog-header p {
      margin: 4px 0 0;
      font-size: 13px;
      opacity: 0.9;
    }

    .close-btn {
      color: white !important;
      position: absolute;
      left: 16px;
      top: 50%;
      transform: translateY(-50%);
      background: rgba(255, 255, 255, 0.15) !important;
      transition: all 0.3s;
    }

    .close-btn:hover {
      background: rgba(255, 255, 255, 0.3) !important;
      transform: translateY(-50%) rotate(90deg);
    }

    .dialog-body {
      padding: 24px;
      background: #fafbfc;
    }

    .info-section {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 12px;
      margin-bottom: 24px;
      padding: 16px;
      background: white;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
      border: 1px solid #eef2f6;
    }

    .info-row {
      text-align: center;
      padding: 4px 0;
    }

    .info-label {
      display: block;
      font-size: 11px;
      color: #94a3b8;
      margin-bottom: 4px;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.3px;
    }

    .info-value {
      font-size: 20px;
      font-weight: 700;
      color: #1e293b;
    }

    .selection-section {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .selection-options {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .option-btn {
      width: 100%;
      justify-content: flex-start;
      padding: 12px 20px;
      height: auto;
      border: 2px solid #e5e7eb;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      border-radius: 12px;
      background: white;
      position: relative;
      font-weight: 500;
    }

    .option-btn mat-icon {
      margin-left: 12px;
      color: #94a3b8;
      transition: color 0.3s;
    }

    .option-btn.selected {
      border-color: #667eea;
      background: #f0f4ff !important;
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.15);
    }

    .option-btn.selected mat-icon {
      color: #667eea;
    }

    .option-btn:hover:not(.selected) {
      border-color: #cbd5e1;
      background: #f8fafc;
      transform: translateY(-1px);
    }

    .check-icon {
      margin-right: auto;
      color: #667eea;
      font-weight: 700;
      font-size: 18px;
    }

    .range-section {
      padding: 16px;
      background: white;
      border-radius: 12px;
      border: 1px solid #e5e7eb;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
    }

    .range-inputs {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }

    .range-field {
      width: 100%;
    }

    .range-info {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-top: 12px;
      padding: 10px 14px;
      background: #f1f5f9;
      border-radius: 8px;
      font-size: 13px;
      color: #475569;
    }

    .range-info mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
      color: #667eea;
    }

    .dialog-actions {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      padding: 16px 24px;
      background: white;
      border-top: 1px solid #eef2f6;
    }

    .dialog-actions button {
      min-width: 100px;
      font-weight: 600;
      border-radius: 10px;
      transition: all 0.3s;
    }

    .cancel-btn {
      color: #64748b !important;
    }

    .cancel-btn:hover {
      background: #f1f5f9 !important;
    }

    .confirm-btn {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
      color: white !important;
      box-shadow: 0 4px 16px rgba(102, 126, 234, 0.3) !important;
    }

    .confirm-btn.card-print {
      background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%) !important;
      box-shadow: 0 4px 16px rgba(245, 158, 11, 0.3) !important;
    }

    .confirm-btn:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(102, 126, 234, 0.4) !important;
    }

    .confirm-btn.card-print:hover:not(:disabled) {
      box-shadow: 0 8px 24px rgba(245, 158, 11, 0.4) !important;
    }

    .confirm-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      transform: none !important;
      box-shadow: none !important;
    }

    @media (max-width: 600px) {
      .dialog-container {
        min-width: 320px;
        max-width: 95vw;
      }

      .dialog-header {
        padding: 16px 20px;
        flex-wrap: wrap;
      }

      .header-icon {
        width: 40px;
        height: 40px;
      }

      .header-icon mat-icon {
        font-size: 22px;
        width: 22px;
        height: 22px;
      }

      .dialog-header h2 {
        font-size: 17px;
      }

      .dialog-body {
        padding: 16px;
      }

      .info-section {
        grid-template-columns: 1fr 1fr;
        gap: 8px;
        padding: 12px;
      }

      .info-row:last-child {
        grid-column: span 2;
      }

      .info-value {
        font-size: 17px;
      }

      .range-inputs {
        grid-template-columns: 1fr;
        gap: 8px;
      }

      .dialog-actions {
        flex-direction: column-reverse;
        padding: 12px 16px;
        gap: 8px;
      }

      .dialog-actions button {
        width: 100%;
        min-width: unset;
      }

      .close-btn {
        position: relative;
        left: auto;
        top: auto;
        transform: none;
      }

      .close-btn:hover {
        transform: rotate(90deg);
      }
    }
  `]
})
export class ExportPageSelectDialogComponent {
  selectedOption: 'all' | 'current' | 'range' = 'all';
  startPage: number = 1;
  endPage: number = 1;
  isCardPrint: boolean = false;
  
  constructor(
    private dialogRef: MatDialogRef<ExportPageSelectDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { 
      totalPages: number; 
      totalItems: number; 
      pageSize: number; 
      currentPage: number;
      isCardPrint?: boolean;
    }
  ) {
    this.endPage = data.totalPages;
    this.isCardPrint = data.isCardPrint || false;
  }

  getRangeCount(): number {
    if (this.startPage <= this.endPage) {
      return this.endPage - this.startPage + 1;
    }
    return 0;
  }

  getRangeRecords(): number {
    const count = this.getRangeCount();
    return count * this.data.pageSize;
  }

  isValid(): boolean {
    if (this.selectedOption === 'range') {
      return this.startPage >= 1 && 
             this.endPage <= this.data.totalPages && 
             this.startPage <= this.endPage;
    }
    return true;
  }

  confirm(): void {
    let result: any = { option: this.selectedOption };
    
    if (this.selectedOption === 'range') {
      result.startPage = this.startPage - 1;
      result.endPage = this.endPage - 1;
    }
    
    this.dialogRef.close(result);
  }

  close(): void {
    this.dialogRef.close(null);
  }
}