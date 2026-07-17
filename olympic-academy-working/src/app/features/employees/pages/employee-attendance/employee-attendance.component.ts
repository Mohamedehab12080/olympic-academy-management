// employee-attendance.component.ts - COMPLETE WITH PROPER STATUS HANDLING

import { Component, OnInit, ViewChild, Inject, ChangeDetectorRef, OnDestroy, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatDialogModule, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';

import { EmployeeService } from '../../../../core/services/employee.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { ReportService } from '../../../../core/services/report.service';
import { FileService } from '../../../../core/services/file.service';
import { SearchableSelectComponent, SelectOption } from '../../../../shared/components/searchable-select/searchable-select.component';
import { EmployeeLookupVTO, ATTENDANCE_STATUSES } from '../../../../core/models/employee.model';
import { LookupVTO, LookupResultSet } from '../../../../core/models/common.model';

// ============================================================================
// CONSTANTS
// ============================================================================

// Map status ID to enum string for backend
const STATUS_ENUM_MAP: { [key: number]: string } = {
  1: 'PRESENT',
  2: 'ABSENT',
  3: 'LATE',
  4: 'EXCUSED'
};

// ============================================================================
// TIME CONVERSION HELPER
// ============================================================================

export function convertTo12HourFormat(timeStr: string | undefined | null): string {
  if (!timeStr) return '-';
  if (timeStr.includes('AM') || timeStr.includes('PM') || timeStr.includes('ص') || timeStr.includes('م')) {
    return timeStr;
  }
  
  try {
    const parts = timeStr.split(':');
    if (parts.length < 2) return timeStr;
    
    let hours = parseInt(parts[0], 10);
    const minutes = parts[1];
    const seconds = parts.length > 2 ? parts[2] : '';
    
    if (isNaN(hours)) return timeStr;
    
    const ampm = hours >= 12 ? 'م' : 'ص';
    const hours12 = hours % 12 || 12;
    return `${hours12}:${minutes}${seconds ? ':' + seconds : ''} ${ampm}`;
  } catch (error) {
    return timeStr;
  }
}

// ============================================================================
// ERROR HANDLING HELPER
// ============================================================================

function extractErrorMessage(error: any): string {
  if (error?.error?.messageEn) {
    return error.error.messageEn;
  }
  if (error?.error?.reqBodyErrors && Array.isArray(error.error.reqBodyErrors) && error.error.reqBodyErrors.length > 0) {
    return error.error.reqBodyErrors.join(', ');
  }
  if (error?.error?.code) {
    return error.error.code;
  }
  if (typeof error?.error === 'string') {
    return error.error;
  }
  if (error?.message) {
    return error.message;
  }
  return 'حدث خطأ غير متوقع';
}

// ============================================================================
// EMPLOYEE SELECTION DIALOG
// ============================================================================

@Component({
  selector: 'app-employee-selection-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatListModule
  ],
  template: `
    <h2 mat-dialog-title>اختر الموظف</h2>
    <mat-dialog-content>
      <p>تم العثور على عدة موظفين. الرجاء اختيار الموظف المناسب:</p>
      <mat-list>
        <mat-list-item *ngFor="let employee of data.employees" (click)="selectEmployee(employee)" class="employee-item">
          <mat-icon mat-list-icon>person</mat-icon>
          <div mat-line><strong>{{ employee.fullName }}</strong></div>
          <div mat-line class="employee-detail">رقم الهوية: {{ employee.nationalId }}</div>
          <button mat-raised-button color="primary" (click)="selectEmployee(employee); $event.stopPropagation()">
            اختر
          </button>
        </mat-list-item>
      </mat-list>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>إلغاء</button>
    </mat-dialog-actions>
  `,
  styles: [`
    .employee-item {
      cursor: pointer;
      transition: background-color 0.2s;
      border-radius: 8px;
      margin-bottom: 4px;
      display: flex !important;
      justify-content: space-between !important;
      align-items: center !important;
      padding: 8px 12px !important;
    }
    .employee-item:hover {
      background-color: #ecfeff;
    }
    .employee-detail {
      color: #6b7280;
      font-size: 12px;
    }
  `]
})
export class EmployeeSelectionDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<EmployeeSelectionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { employees: EmployeeLookupVTO[] }
  ) {}

  selectEmployee(employee: EmployeeLookupVTO): void {
    this.dialogRef.close(employee);
  }
}

// ============================================================================
// PAGE SELECTION DIALOG COMPONENT
// ============================================================================

@Component({
  selector: 'app-employee-export-page-select-dialog',
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
          class="confirm-btn">
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
      background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%);
      color: white;
      position: relative;
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

    .info-value:last-child {
      color: #06b6d4;
    }

    .dialog-header.card-print .info-value:last-child {
      color: #f59e0b;
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
      border-color: #06b6d4;
      background: #ecfeff !important;
      box-shadow: 0 4px 12px rgba(6, 182, 212, 0.15);
    }

    .option-btn.selected mat-icon {
      color: #06b6d4;
    }

    .dialog-header.card-print .option-btn.selected {
      border-color: #f59e0b;
      background: #fffbeb !important;
      box-shadow: 0 4px 12px rgba(245, 158, 11, 0.15);
    }

    .dialog-header.card-print .option-btn.selected mat-icon {
      color: #f59e0b;
    }

    .option-btn:hover:not(.selected) {
      border-color: #cbd5e1;
      background: #f8fafc;
      transform: translateY(-1px);
    }

    .check-icon {
      margin-right: auto;
      color: #06b6d4;
      font-weight: 700;
      font-size: 18px;
    }

    .dialog-header.card-print .check-icon {
      color: #f59e0b;
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

    .range-field ::ng-deep .mat-form-field-outline {
      background: #fafbfc !important;
      border-radius: 8px !important;
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
      color: #06b6d4;
    }

    .dialog-header.card-print .range-info mat-icon {
      color: #f59e0b;
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
      background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%) !important;
      color: white !important;
      box-shadow: 0 4px 16px rgba(6, 182, 212, 0.3) !important;
    }

    .confirm-btn:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(6, 182, 212, 0.4) !important;
    }

    .confirm-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      transform: none !important;
      box-shadow: none !important;
    }

    .dialog-header.card-print .confirm-btn {
      background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%) !important;
      box-shadow: 0 4px 16px rgba(245, 158, 11, 0.3) !important;
    }

    .dialog-header.card-print .confirm-btn:hover:not(:disabled) {
      box-shadow: 0 8px 24px rgba(245, 158, 11, 0.4) !important;
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

    @media (max-width: 400px) {
      .dialog-container {
        min-width: 280px;
      }

      .info-section {
        grid-template-columns: 1fr;
      }

      .info-row:last-child {
        grid-column: span 1;
      }

      .option-btn {
        font-size: 13px;
        padding: 10px 14px;
      }

      .option-btn mat-icon {
        font-size: 18px;
        width: 18px;
        height: 18px;
      }
    }
  `]
})
export class EmployeeExportPageSelectDialogComponent {
  selectedOption: 'all' | 'current' | 'range' = 'all';
  startPage: number = 1;
  endPage: number = 1;
  isCardPrint: boolean = false;
  
  constructor(
    private dialogRef: MatDialogRef<EmployeeExportPageSelectDialogComponent>,
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

// ============================================================================
// ATTENDANCE DIALOG COMPONENT
// ============================================================================

@Component({
  selector: 'app-employee-attendance-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    SearchableSelectComponent,
    EmployeeSelectionDialogComponent
  ],
  template: `
    <div class="dialog-header">
      <div class="dialog-header-content">
        <mat-icon class="header-icon">event_note</mat-icon>
        <h2 mat-dialog-title class="dialog-title">{{ data.title }}</h2>
      </div>
      <button mat-icon-button mat-dialog-close class="dialog-close-btn">
        <mat-icon>close</mat-icon>
      </button>
    </div>

    <mat-divider></mat-divider>

    <mat-dialog-content class="dialog-content">
      <form [formGroup]="data.form" class="dialog-form">

        <!-- Barcode Search for Employee -->
        <div class="barcode-search-container">
          <div class="barcode-search-header">
            <mat-icon class="barcode-icon">qr_code_scanner</mat-icon>
            <span class="barcode-title">بحث بالباركود</span>
            <span class="barcode-hint-text">(مسح الباركود أو إدخال رقم الهوية)</span>
          </div>

          <div class="barcode-search-row">
            <mat-form-field appearance="outline" class="barcode-input-field">
              <mat-label>رقم الباركود</mat-label>
              <input #dialogBarcodeInput
                     matInput
                     [(ngModel)]="barcodeSearch"
                     (keydown)="onDialogBarcodeKeydown($event)"
                     placeholder="أدخل رقم الباركود..."
                     [ngModelOptions]="{ standalone: true }">
              <mat-icon matSuffix>qr_code_scanner</mat-icon>
            </mat-form-field>

            <button mat-raised-button color="primary" (click)="searchEmployeeInDialog()" class="barcode-search-btn" type="button">
              <mat-icon>search</mat-icon>
              بحث
            </button>

            <button mat-icon-button (click)="clearBarcodeSearch()" matTooltip="مسح" class="barcode-clear-btn" type="button">
              <mat-icon>clear</mat-icon>
            </button>
          </div>

          <div class="barcode-hint" *ngIf="barcodeSearchResult">
            <span class="hint-success" *ngIf="barcodeSearchResult.found">
              <mat-icon>check_circle</mat-icon>
              تم العثور على الموظف: <strong>{{ barcodeSearchResult.employeeName }}</strong>
            </span>
            <span class="hint-error" *ngIf="barcodeSearchResult.found === false">
              <mat-icon>error</mat-icon>
              {{ barcodeSearchResult.message }}
            </span>
          </div>
        </div>

        <mat-divider></mat-divider>

        <!-- Employee Selection -->
        <div class="form-field-full">
          <app-searchable-select
            [formControl]="data.form.get('employeeId')"
            label="الموظف *"
            [options]="employeeOptions"
            [required]="true"
            class="full-width-select">
          </app-searchable-select>
        </div>

        <!-- Date -->
        <div class="form-field-full">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>التاريخ *</mat-label>
            <input matInput [matDatepicker]="datePicker" formControlName="attendanceDate">
            <mat-datepicker-toggle matSuffix [for]="datePicker"></mat-datepicker-toggle>
            <mat-datepicker #datePicker></mat-datepicker>
            <mat-icon matPrefix>event</mat-icon>
          </mat-form-field>
        </div>

        <!-- Status -->
        <div class="form-field-full">
          <app-searchable-select
            [formControl]="data.form.get('status')"
            label="حالة الحضور *"
            [options]="statusOptions"
            [required]="true"
            class="full-width-select">
          </app-searchable-select>
        </div>

        <!-- Check In & Check Out -->
        <div class="form-row">
          <mat-form-field appearance="outline" class="form-field-half">
            <mat-label>وقت الدخول</mat-label>
            <input matInput type="time" formControlName="checkInTime" placeholder="HH:MM">
            <mat-icon matPrefix>login</mat-icon>
          </mat-form-field>

          <mat-form-field appearance="outline" class="form-field-half">
            <mat-label>وقت الخروج</mat-label>
            <input matInput type="time" formControlName="checkOutTime" placeholder="HH:MM">
            <mat-icon matPrefix>logout</mat-icon>
          </mat-form-field>
        </div>

        <!-- Late Time -->
        <div class="form-field-full">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>وقت التأخير (دقائق)</mat-label>
            <input matInput type="number" formControlName="lateTime" min="0" placeholder="0">
            <mat-icon matPrefix>timer</mat-icon>
          </mat-form-field>
        </div>

        <!-- Note -->
        <div class="form-field-full">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>ملاحظات</mat-label>
            <textarea matInput formControlName="note" rows="3" placeholder="أدخل أي ملاحظات إضافية..."></textarea>
            <mat-icon matPrefix>note</mat-icon>
          </mat-form-field>
        </div>
      </form>
    </mat-dialog-content>

    <mat-divider></mat-divider>

    <mat-dialog-actions align="end" class="dialog-actions">
      <button mat-button mat-dialog-close class="cancel-btn">
        <mat-icon>close</mat-icon>
        إلغاء
      </button>
      <button mat-raised-button color="primary" 
              [disabled]="!isFormValid()" 
              (click)="save()" 
              class="save-btn">
        <mat-icon>save</mat-icon>
        {{ data.editMode ? 'تحديث' : 'حفظ' }}
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    ::ng-deep .mat-dialog-container {
      padding: 0 !important;
      border-radius: 24px !important;
      overflow: hidden !important;
      box-shadow: 0 24px 48px rgba(0, 0, 0, 0.2) !important;
    }

    .dialog-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px 24px;
      background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%);
      color: white;
      border-radius: 24px 24px 0 0;
      position: relative;
      overflow: hidden;
    }

    .dialog-header::before {
      content: '';
      position: absolute;
      top: -50%;
      right: -50%;
      width: 100%;
      height: 100%;
      background: rgba(255, 255, 255, 0.05);
      border-radius: 50%;
      pointer-events: none;
    }

    .dialog-header-content {
      display: flex;
      align-items: center;
      gap: 14px;
      z-index: 1;
    }

    .header-icon {
      font-size: 28px;
      width: 28px;
      height: 28px;
      background: rgba(255, 255, 255, 0.2);
      padding: 12px;
      border-radius: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      backdrop-filter: blur(4px);
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .dialog-title {
      margin: 0;
      font-size: 22px;
      font-weight: 700;
      letter-spacing: 0.3px;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .dialog-close-btn {
      color: white !important;
      transition: all 0.3s;
      z-index: 1;
      border-radius: 50% !important;
    }

    .dialog-close-btn:hover {
      transform: rotate(90deg) scale(1.1);
      background: rgba(255, 255, 255, 0.15) !important;
    }

    .dialog-content {
      padding: 24px;
      max-height: 70vh;
      overflow-y: auto;
      background: #fafbfc;
    }

    .dialog-content::-webkit-scrollbar {
      width: 6px;
    }

    .dialog-content::-webkit-scrollbar-track {
      background: #f1f5f9;
      border-radius: 10px;
    }

    .dialog-content::-webkit-scrollbar-thumb {
      background: linear-gradient(135deg, #06b6d4, #0891b2);
      border-radius: 10px;
    }

    .dialog-form {
      display: flex;
      flex-direction: column;
      gap: 16px;
      min-width: 400px;
    }

    .barcode-search-container {
      background: linear-gradient(135deg, #ecfeff 0%, #cffafe 100%);
      padding: 16px 20px;
      border-radius: 16px;
      border: 2px solid #a5f3fc;
      transition: all 0.3s;
    }

    .barcode-search-container:focus-within {
      border-color: #06b6d4;
      box-shadow: 0 0 0 4px rgba(6, 182, 212, 0.1);
    }

    .barcode-search-header {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 14px;
    }

    .barcode-icon {
      color: #06b6d4;
      font-size: 24px;
      width: 24px;
      height: 24px;
    }

    .barcode-title {
      font-weight: 700;
      color: #0e7490;
      font-size: 15px;
    }

    .barcode-hint-text {
      font-size: 12px;
      color: #06b6d4;
      opacity: 0.8;
      font-weight: 400;
    }

    .barcode-search-row {
      display: flex;
      gap: 12px;
      align-items: center;
    }

    .barcode-input-field {
      flex: 1;
    }

    .barcode-input-field ::ng-deep .mat-form-field-wrapper {
      margin: 0;
      padding: 0;
    }

    .barcode-input-field ::ng-deep .mat-form-field-flex {
      padding: 0 12px !important;
      background: white !important;
      border-radius: 8px !important;
      border: 1px solid #e5e7eb;
      transition: all 0.3s;
    }

    .barcode-input-field ::ng-deep .mat-form-field-flex:hover {
      border-color: #06b6d4;
    }

    .barcode-input-field ::ng-deep .mat-form-field-flex.mat-focused {
      border-color: #06b6d4;
      box-shadow: 0 0 0 3px rgba(6, 182, 212, 0.15);
    }

    .barcode-input-field ::ng-deep .mat-form-field-infix {
      padding: 8px 0 !important;
      border-top: 0 !important;
    }

    .barcode-input-field ::ng-deep .mat-form-field-outline {
      display: none;
    }

    .barcode-search-btn {
      height: 44px;
      white-space: nowrap;
      background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%) !important;
      color: white !important;
      border-radius: 10px !important;
      font-weight: 600;
      padding: 0 24px;
      transition: all 0.3s !important;
      box-shadow: 0 2px 8px rgba(6, 182, 212, 0.3) !important;
    }

    .barcode-search-btn:hover {
      transform: translateY(-2px) !important;
      box-shadow: 0 6px 20px rgba(6, 182, 212, 0.4) !important;
    }

    .barcode-search-btn mat-icon {
      margin-left: 6px;
    }

    .barcode-clear-btn {
      color: #6b7280 !important;
      transition: all 0.3s;
    }

    .barcode-clear-btn:hover {
      color: #ef4444 !important;
      background: #fee2e2 !important;
      border-radius: 50%;
    }

    .barcode-hint {
      margin-top: 12px;
      font-size: 14px;
      border-radius: 10px;
      animation: slideDown 0.3s ease-out;
    }

    @keyframes slideDown {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .hint-success {
      color: #065f46;
      background: #d1fae5;
      padding: 10px 16px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      gap: 10px;
      border-right: 4px solid #059669;
    }

    .hint-success mat-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
      color: #059669;
    }

    .hint-success strong {
      color: #065f46;
    }

    .hint-error {
      color: #991b1b;
      background: #fee2e2;
      padding: 10px 16px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      gap: 10px;
      border-right: 4px solid #dc2626;
    }

    .hint-error mat-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
      color: #dc2626;
    }

    .form-field-full { width: 100%; }
    .full-width-select { width: 100%; }
    .full-width { width: 100%; }
    .full-width textarea { min-height: 80px; resize: vertical; }
    .form-row { display: flex; gap: 16px; }
    .form-field-half { flex: 1; min-width: 0; }

    .dialog-actions {
      padding: 16px 24px;
      gap: 12px;
      background: white;
      border-radius: 0 0 24px 24px;
      border-top: 1px solid #eef2f6;
    }

    .cancel-btn {
      color: #6b7280 !important;
      font-weight: 500;
      padding: 0 20px;
      transition: all 0.3s;
      border-radius: 10px !important;
      height: 44px;
    }

    .cancel-btn:hover {
      background: #f3f4f6 !important;
      transform: translateY(-1px);
    }

    .cancel-btn mat-icon { margin-left: 6px; }

    .save-btn {
      background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%) !important;
      color: white !important;
      font-weight: 600;
      border-radius: 10px !important;
      padding: 0 28px;
      transition: all 0.3s !important;
      box-shadow: 0 2px 8px rgba(6, 182, 212, 0.3) !important;
      height: 44px;
    }

    .save-btn:hover:not(:disabled) {
      transform: translateY(-2px) !important;
      box-shadow: 0 6px 20px rgba(6, 182, 212, 0.4) !important;
    }

    .save-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      transform: none !important;
      box-shadow: none !important;
    }

    .save-btn mat-icon { margin-left: 6px; }

    @media (max-width: 768px) {
      .dialog-header { padding: 16px 20px; }
      .dialog-title { font-size: 18px; }
      .dialog-content { padding: 16px; max-height: 65vh; }
      .dialog-form { min-width: 100%; gap: 14px; }
      .barcode-search-container { padding: 12px 16px; }
      .barcode-search-row { flex-wrap: wrap; gap: 8px; }
      .barcode-input-field { min-width: 100%; }
      .barcode-search-btn { flex: 1; padding: 0 16px; height: 40px; font-size: 13px; }
      .barcode-hint-text { display: none; }
      .form-row { flex-direction: column; gap: 0; }
      .form-field-half { width: 100%; }
      .dialog-actions { padding: 12px 16px; flex-wrap: wrap; justify-content: center; gap: 8px; }
      .save-btn, .cancel-btn { flex: 1; min-width: 120px; justify-content: center; height: 40px; }
      .save-btn { padding: 0 16px; }
      .cancel-btn { padding: 0 16px; }
    }

    @media (max-width: 480px) {
      .dialog-header { padding: 12px 16px; }
      .dialog-title { font-size: 16px; }
      .dialog-content { padding: 12px; max-height: 60vh; }
      .dialog-form { gap: 12px; }
      .barcode-search-container { padding: 10px 12px; }
      .barcode-search-header { margin-bottom: 10px; }
      .barcode-search-btn { font-size: 12px; padding: 0 12px; }
      .dialog-actions { padding: 10px 12px; gap: 6px; }
      .save-btn, .cancel-btn { min-width: 80px; height: 36px; font-size: 13px; }
    }

    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(20px) scale(0.95); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }

    .dialog-header { animation: fadeInUp 0.3s ease-out; }
    .dialog-content { animation: fadeInUp 0.3s ease-out 0.05s both; }
    .dialog-actions { animation: fadeInUp 0.3s ease-out 0.1s both; }
  `]
})
export class EmployeeAttendanceDialogComponent {
  employeeOptions: SelectOption[] = [];
  statusOptions: SelectOption[] = [];
  
  barcodeSearch: string = '';
  barcodeSearchResult: { found: boolean; employeeName?: string; message?: string } | null = null;
  private allEmployees: EmployeeLookupVTO[] = [];

  // Map for converting ID to enum string
  private readonly STATUS_ENUM_MAP: { [key: number]: string } = {
    1: 'PRESENT',
    2: 'ABSENT',
    3: 'LATE',
    4: 'EXCUSED'
  };

  constructor(
    public dialogRef: MatDialogRef<EmployeeAttendanceDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private employeeService: EmployeeService,
    private notification: NotificationService,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef
  ) {
    this.allEmployees = data.employees || [];
    this.employeeOptions = this.allEmployees.map((e: EmployeeLookupVTO) => ({ 
      value: e.id, 
      label: e.fullName || `موظف #${e.id}` 
    }));

    // Status options - use the lookup data passed from parent
    // The statuses come as LookupVTO with id and title
    const statuses: LookupVTO[] = data.attendanceStatuses || [];
    this.statusOptions = statuses.map((s: LookupVTO) => ({ 
      // Convert ID to enum string for backend
      value: this.STATUS_ENUM_MAP[s.id] || s.id, 
      label: s.title 
    }));
  }

  isFormValid(): boolean {
    const form = this.data.form;
    const employeeId = form.get('employeeId')?.value;
    const status = form.get('status')?.value;
    return !!(employeeId && status);
  }

  searchEmployeeInDialog(): void {
    if (!this.barcodeSearch?.trim()) {
      this.barcodeSearchResult = {
        found: false,
        message: 'الرجاء إدخال رقم الباركود'
      };
      return;
    }

    const searchValue = this.barcodeSearch.trim();

    this.employeeService.getAllEmployeesLookup().subscribe({
      next: (res: EmployeeLookupVTO[]) => {
        const allEmployees = res || [];
        const matchedEmployees = allEmployees.filter((e: EmployeeLookupVTO) => 
          e.nationalId && e.nationalId.includes(searchValue)
        );

        if (matchedEmployees.length === 0) {
          this.setBarcodeSearchResult(false, 'لم يتم العثور على موظف بهذا الرقم');
          this.notification.showError('لم يتم العثور على موظف');
          return;
        }

        const exactMatch = matchedEmployees.find((e: EmployeeLookupVTO) => 
          e.nationalId === searchValue
        );

        if (exactMatch) {
          this.selectEmployeeInDialog(exactMatch);
          this.notification.showSuccess(`تم العثور على الموظف: ${exactMatch.fullName}`);
          return;
        }

        if (matchedEmployees.length > 1) {
          this.showEmployeeSelectionDialog(matchedEmployees);
          return;
        }

        const employee = matchedEmployees[0];
        this.selectEmployeeInDialog(employee);
        this.notification.showSuccess(`تم العثور على الموظف: ${employee.fullName}`);
      },
      error: () => {
        this.setBarcodeSearchResult(false, 'حدث خطأ في البحث عن الموظف');
        this.notification.showError('حدث خطأ في البحث عن الموظف');
      }
    });
  }

  private selectEmployeeInDialog(employee: EmployeeLookupVTO): void {
    this.barcodeSearchResult = {
      found: true,
      employeeName: employee.fullName
    };
    this.data.form.get('employeeId')?.setValue(employee.id);
    this.barcodeSearch = '';
    this.cdr.detectChanges();
  }

  private setBarcodeSearchResult(found: boolean, message: string): void {
    this.barcodeSearchResult = { found, message };
  }

  private showEmployeeSelectionDialog(employees: EmployeeLookupVTO[]): void {
    const selectionDialog = this.dialog.open(EmployeeSelectionDialogComponent, {
      width: '500px',
      maxWidth: '90vw',
      data: { employees }
    });

    selectionDialog.afterClosed().subscribe((selected: EmployeeLookupVTO) => {
      if (selected) {
        this.selectEmployeeInDialog(selected);
        this.notification.showSuccess(`تم اختيار الموظف: ${selected.fullName}`);
      }
    });
  }

  onDialogBarcodeKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.searchEmployeeInDialog();
    }
  }

  clearBarcodeSearch(): void {
    this.barcodeSearch = '';
    this.barcodeSearchResult = null;
  }

  save(): void {
    if (!this.isFormValid()) {
      this.notification.showWarning('الرجاء تعبئة جميع الحقول المطلوبة');
      return;
    }

    const formValue = this.data.form.value;
    
    let employeeId = formValue.employeeId ? Number(formValue.employeeId) : null;
    // Status is already a string enum value (PRESENT, ABSENT, etc.)
    const statusValue = formValue.status;
    
    if (!employeeId) {
      this.data.form.get('employeeId')?.markAsTouched();
      this.notification.showWarning('الرجاء اختيار موظف');
      return;
    }
    
    if (!statusValue) {
      this.data.form.get('status')?.markAsTouched();
      this.notification.showWarning('الرجاء اختيار حالة الحضور');
      return;
    }
    
    const attendanceData = {
      employeeId: employeeId,
      status: statusValue, // Already a string enum
      attendanceDate: formValue.attendanceDate || new Date().toISOString().split('T')[0],
      checkInTime: formValue.checkInTime || null,
      checkOutTime: formValue.checkOutTime || null,
      lateTime: formValue.lateTime ? Number(formValue.lateTime) : null,
      note: formValue.note || null
    };
    
    this.dialogRef.close(attendanceData);
  }
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

@Component({
  selector: 'app-employee-attendance',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatSelectModule,
    MatTableModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    MatSortModule,
    MatDialogModule,
    MatChipsModule,
    MatTooltipModule,
    MatDividerModule,
    MatListModule,
    SearchableSelectComponent,
    EmployeeExportPageSelectDialogComponent,
    EmployeeSelectionDialogComponent,
    EmployeeAttendanceDialogComponent
  ],
  templateUrl: './employee-attendance.component.html',
  styleUrls: ['./employee-attendance.component.css']
})
export class EmployeeAttendanceComponent implements OnInit, OnDestroy {
  
  // ==========================================================================
  // PUBLIC PROPERTIES
  // ==========================================================================

  Math = Math;
  
  displayedColumns: string[] = ['index', 'employee', 'attendanceDate', 'status', 'checkInTime', 'checkOutTime', 'lateTime', 'note', 'actions'];
  dataSource = new MatTableDataSource<any>([]);
  allAttendances: any[] = [];
  isLoading = false;
  
  // Image cache
  imageUrls: Map<number, string> = new Map();
  
  // Pagination
  totalItems: number = 0;
  pageSize: number = 25;
  pageSizeOptions: number[] = [5, 10, 25, 50, 100];
  currentPage: number = 0;
  
  // Sorting
  sortBy: string = 'CREATION_DATE';
  sortDir: string = 'DESC';
  
  // Data & Filters
  employees: EmployeeLookupVTO[] = [];
  
  // Date filters (optional - only sent when user selects them)
  attendanceDateFrom: string = '';
  attendanceDateTo: string = '';
  
  // Status is now a string enum value
  selectedStatus: string | null = null;
  selectedEmployeeId: number | null = null;
  quickSearch: string = '';
  
  // Barcode filter
  barcodeSearch: string = '';
  employeeNationalId: string = '';
  isBarcodeMode: boolean = false;
  
  // Options
  statusOptions: SelectOption[] = [];
  employeeOptions: SelectOption[] = [];
  attendanceStatuses: LookupVTO[] = [];
  
  // Form
  attendanceForm: FormGroup;
  editMode = false;
  editId: number | null = null;
  
  // Stats
  summaryStats = {
    total: 0,
    present: 0,
    absent: 0,
    late: 0,
    excused: 0,
    attendanceRate: 0
  };

  // Map for converting ID to enum string
  private readonly STATUS_ENUM_MAP: { [key: number]: string } = {
    1: 'PRESENT',
    2: 'ABSENT',
    3: 'LATE',
    4: 'EXCUSED'
  };

  // ==========================================================================
  // VIEW CHILDREN
  // ==========================================================================

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('barcodeInput') barcodeInput!: ElementRef<HTMLInputElement>;

  // ==========================================================================
  // CONSTRUCTOR
  // ==========================================================================

  constructor(
    private employeeService: EmployeeService,
    private notification: NotificationService,
    private reportService: ReportService,
    private fileService: FileService,
    private dialog: MatDialog,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {
    this.attendanceForm = this.fb.group({
      employeeId: [null, Validators.required],
      status: [null, Validators.required],
      attendanceDate: [new Date().toISOString().split('T')[0]],
      checkInTime: [''],
      checkOutTime: [''],
      lateTime: [null],
      note: ['']
    });
  }

  // ==========================================================================
  // LIFECYCLE HOOKS
  // ==========================================================================

  ngOnInit(): void {
    this.loadSelectOptions();
    this.loadEmployees();
    this.loadAttendanceStatuses();
    this.loadAttendances();
  }

  ngOnDestroy(): void {
    this.imageUrls.forEach(url => {
      if (url && url.startsWith('blob:')) {
        URL.revokeObjectURL(url);
      }
    });
    this.imageUrls.clear();
  }

  // ==========================================================================
  // HELPER METHODS
  // ==========================================================================

  getTotalPages(): number {
    return Math.ceil(this.totalItems / this.pageSize);
  }

  convertTo12HourFormat(timeStr: string | undefined | null): string {
    return convertTo12HourFormat(timeStr);
  }

  formatDateForAPI(dateStr: string): string {
    if (!dateStr) return '';
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return dateStr;
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    } catch {
      return dateStr;
    }
  }

  formatTimeForInput(timeStr: string | undefined | null): string {
    if (!timeStr) return '';
    if (/^\d{2}:\d{2}$/.test(timeStr)) {
      return timeStr;
    }
    try {
      const parts = timeStr.split(':');
      if (parts.length >= 2) {
        let hours = parseInt(parts[0], 10);
        const minutes = parts[1].substring(0, 2);
        if (!isNaN(hours) && hours >= 0 && hours <= 23) {
          return `${hours.toString().padStart(2, '0')}:${minutes}`;
        }
      }
      const date = new Date(timeStr);
      if (!isNaN(date.getTime())) {
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
      }
      return timeStr;
    } catch {
      return timeStr;
    }
  }

  // ==========================================================================
  // DATA LOADING
  // ==========================================================================

  loadSelectOptions(): void {
    // Status options - will be populated from lookup
    this.statusOptions = [
      { value: null, label: 'الكل' }
    ];
  }

  loadEmployees(): void {
    this.employeeService.getAllEmployeesLookup().subscribe({
      next: (res: EmployeeLookupVTO[]) => {
        this.employees = res || [];
        this.employeeOptions = [
          { value: null, label: 'الكل' },
          ...this.employees.map((e: EmployeeLookupVTO) => ({ 
            value: e.id, 
            label: e.fullName || `موظف #${e.id}` 
          }))
        ];
        console.log('✅ Employees loaded:', this.employees.length);
      },
      error: (err) => {
        console.error('❌ Error loading employees:', err);
        this.notification.showError(extractErrorMessage(err));
      }
    });
  }

  /**
   * Load attendance statuses from lookup endpoint
   */
  loadAttendanceStatuses(): void {
    this.employeeService.getAllEmployeeAttendanceStatusLookup().subscribe({
      next: (res: LookupResultSet) => {
        this.attendanceStatuses = res.list || [];
        // Build status options with string enum values
        this.statusOptions = [
          { value: null, label: 'الكل' },
          ...this.attendanceStatuses.map((s: LookupVTO) => ({ 
            value: this.STATUS_ENUM_MAP[s.id] || s.id, // Convert ID to enum string
            label: s.title 
          }))
        ];
        console.log('✅ Attendance statuses loaded:', this.attendanceStatuses.length);
      },
      error: (err) => {
        console.error('❌ Error loading attendance statuses:', err);
        this.notification.showError(extractErrorMessage(err));
      }
    });
  }

  /**
   * Load attendances - sends status as string enum value
   */
  loadAttendances(): void {
    this.isLoading = true;
    const params: any = {
      pageNum: this.currentPage,
      pageSize: this.pageSize
    };
    
    // Apply filters (only if they have values)
    if (this.quickSearch?.trim()) {
      params.quickSearch = this.quickSearch.trim();
    }
    
    if (this.selectedEmployeeId) {
      params.employeeId = this.selectedEmployeeId;
    }
    
    if (this.employeeNationalId?.trim()) {
      params.employeeNationalId = this.employeeNationalId.trim();
    }
    
    // Status is now a string enum value (PRESENT, ABSENT, etc.)
    if (this.selectedStatus) {
      params.status = this.selectedStatus;
    }
    
    // Only send date filters if user has selected them
    if (this.attendanceDateFrom) {
      params.attendanceDateFrom = this.formatDateForAPI(this.attendanceDateFrom);
    }
    
    if (this.attendanceDateTo) {
      params.attendanceDateTo = this.formatDateForAPI(this.attendanceDateTo);
    }
    
    if (this.sortBy) params.orderBy = this.sortBy;
    if (this.sortDir) params.orderDir = this.sortDir;

    console.log('📊 Load attendances params:', JSON.stringify(params, null, 2));

    this.employeeService.getAllEmployeesAttendances(params).subscribe({
      next: (res: any) => {
        console.log('📊 Load attendances results:', res);
        this.allAttendances = res.items || [];
        this.totalItems = res.total || 0;
        this.dataSource.data = this.allAttendances;
        this.loadAllImages();
        this.calculateSummary();
        this.isLoading = false;
        
        if (this.paginator) {
          this.paginator.length = this.totalItems;
          this.paginator.pageIndex = this.currentPage;
          this.paginator.pageSize = this.pageSize;
        }
        
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('❌ Load attendances error:', err);
        this.notification.showError(extractErrorMessage(err));
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  // ==========================================================================
  // IMAGE LOADING
  // ==========================================================================

  loadAllImages(): void {
    this.imageUrls.forEach(url => {
      if (url && url.startsWith('blob:')) {
        URL.revokeObjectURL(url);
      }
    });
    this.imageUrls.clear();

    this.allAttendances.forEach(attendance => {
      if (attendance.employee?.imageUrl) {
        this.loadImage(attendance.employee.id, attendance.employee.imageUrl);
      }
    });
  }

  loadImage(employeeId: number, imageUrl: string): void {
    if (!imageUrl) {
      this.imageUrls.set(employeeId, '');
      return;
    }

    if (/^\d{15}(\d{3})?$/.test(imageUrl)) {
      this.fileService.downloadFile(imageUrl).subscribe({
        next: (blob) => {
          const existingUrl = this.imageUrls.get(employeeId);
          if (existingUrl && existingUrl.startsWith('blob:')) {
            URL.revokeObjectURL(existingUrl);
          }
          const blobUrl = URL.createObjectURL(blob);
          this.imageUrls.set(employeeId, blobUrl);
          this.cdr.detectChanges();
        },
        error: () => {
          this.imageUrls.set(employeeId, '');
          this.cdr.detectChanges();
        }
      });
    } else {
      this.imageUrls.set(employeeId, imageUrl);
    }
  }

  getImageUrl(employeeId: number): string | null {
    const url = this.imageUrls.get(employeeId);
    return url && url.startsWith('blob:') ? url : (url || null);
  }

  // ==========================================================================
  // STATISTICS
  // ==========================================================================

  calculateSummary(): void {
    const data = this.allAttendances;
    const present = data.filter(a => a.status === 'PRESENT' || a.status?.id === 1).length;
    const absent = data.filter(a => a.status === 'ABSENT' || a.status?.id === 2).length;
    const late = data.filter(a => a.status === 'LATE' || a.status?.id === 3).length;
    const excused = data.filter(a => a.status === 'EXCUSED' || a.status?.id === 4).length;
    const total = data.length;
    
    this.summaryStats = {
      total: total,
      present: present,
      absent: absent,
      late: late,
      excused: excused,
      attendanceRate: total > 0 ? Math.round(((present + late) / total) * 100) : 0
    };
  }

  // ==========================================================================
  // BARCODE SEARCH - FILTER BY NATIONAL ID
  // ==========================================================================

  searchEmployeeByBarcode(): void {
    if (!this.barcodeSearch?.trim()) {
      this.notification.showWarning('الرجاء إدخال رقم الباركود');
      return;
    }

    const searchValue = this.barcodeSearch.trim();
    this.isLoading = true;

    // First verify employee exists
    this.employeeService.getAllEmployeesLookup().subscribe({
      next: (employees: EmployeeLookupVTO[]) => {
        const foundEmployee = employees.find(e => e.nationalId === searchValue);
        
        if (!foundEmployee) {
          this.notification.showError(`لم يتم العثور على موظف برقم: ${searchValue}`);
          this.isLoading = false;
          return;
        }

        // Set the employeeNationalId filter and reload
        this.employeeNationalId = searchValue;
        this.selectedEmployeeId = null;
        this.currentPage = 0;
        this.loadAttendances();
        
        this.notification.showSuccess(`تم البحث عن سجلات حضور للموظف: ${foundEmployee.fullName}`);
        this.clearBarcodeSearch();
      },
      error: () => {
        this.notification.showError('حدث خطأ في البحث عن الموظف');
        this.isLoading = false;
      }
    });
  }

  clearBarcodeFilter(): void {
    this.employeeNationalId = '';
    this.barcodeSearch = '';
    this.isBarcodeMode = false;
    this.currentPage = 0;
    this.loadAttendances();
    this.notification.showSuccess('تم عرض جميع سجلات الحضور');
  }

  private clearBarcodeSearch(): void {
    this.barcodeSearch = '';
    this.isBarcodeMode = false;
  }

  onBarcodeKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.searchEmployeeByBarcode();
    }
  }

  toggleBarcodeMode(): void {
    this.isBarcodeMode = !this.isBarcodeMode;
    if (this.isBarcodeMode) {
      setTimeout(() => this.barcodeInput?.nativeElement.focus(), 100);
    } else {
      this.barcodeSearch = '';
    }
  }

  // ==========================================================================
  // PAGINATION
  // ==========================================================================

  onPageChange(event: any): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadAttendances();
  }

  // ==========================================================================
  // DIALOG MANAGEMENT - FIXED EDIT
  // ==========================================================================

  openAttendanceDialog(attendanceId?: number): void {
    this.editMode = !!attendanceId;
    this.editId = attendanceId || null;

    if (this.editMode && attendanceId) {
      const attendance = this.allAttendances.find(a => a.id === attendanceId);
      
      if (!attendance) {
        this.notification.showError('لم يتم العثور على سجل الحضور');
        return;
      }
      
      const employeeId = attendance.employee?.id;
      
      if (!employeeId) {
        this.notification.showError('لم يتم العثور على الموظف');
        return;
      }
      
      this.employeeService.getEmployeeAttendance(employeeId, attendanceId).subscribe({
        next: (res: any) => {
          console.log('📊 Attendance data for edit:', res);
          
          // Format the data for the form
          const checkInTime = res.checkInTime ? this.formatTimeForInput(res.checkInTime) : '';
          const checkOutTime = res.checkOutTime ? this.formatTimeForInput(res.checkOutTime) : '';
          const attendanceDate = res.attendanceDate || new Date().toISOString().split('T')[0];
          
          // Convert status ID to enum string if needed
          let statusValue = res.status;
          if (typeof statusValue === 'number') {
            statusValue = this.STATUS_ENUM_MAP[statusValue] || statusValue;
          }
          
          // Patch the form with the loaded data
          this.attendanceForm.patchValue({
            employeeId: employeeId,
            status: statusValue || null,
            attendanceDate: attendanceDate,
            checkInTime: checkInTime,
            checkOutTime: checkOutTime,
            lateTime: res.lateTime || null,
            note: res.note || ''
          });
          
          this.openDialog();
        },
        error: (err) => {
          console.error('❌ Error loading attendance for edit:', err);
          this.notification.showError(extractErrorMessage(err));
        }
      });
    } else {
      this.attendanceForm.reset({
        employeeId: null,
        status: null,
        attendanceDate: new Date().toISOString().split('T')[0],
        checkInTime: '',
        checkOutTime: '',
        lateTime: null,
        note: ''
      });
      this.openDialog();
    }
  }

  private openDialog(): void {
    const dialogRef = this.dialog.open(EmployeeAttendanceDialogComponent, {
      width: '650px',
      maxWidth: '95vw',
      disableClose: true,
      data: {
        form: this.attendanceForm,
        employees: this.employees,
        attendanceStatuses: this.attendanceStatuses,
        editMode: this.editMode,
        selectedDate: this.attendanceForm.get('attendanceDate')?.value || new Date().toISOString().split('T')[0],
        title: this.editMode ? 'تعديل سجل حضور' : 'تسجيل حضور جديد'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const employeeId = result.employeeId ? Number(result.employeeId) : null;
        
        if (!employeeId) {
          this.notification.showError('الرجاء اختيار موظف');
          return;
        }
        
        if (this.editMode && this.editId) {
          this.employeeService.updateEmployeeAttendance(employeeId, this.editId, result).subscribe({
            next: () => {
              this.notification.showSuccess('تم تحديث سجل الحضور بنجاح');
              this.loadAttendances();
            },
            error: (err) => {
              console.error('❌ Update error:', err);
              this.notification.showError(extractErrorMessage(err));
            }
          });
        } else {
          this.employeeService.createEmployeeAttendance(employeeId, result).subscribe({
            next: () => {
              this.notification.showSuccess('تم إضافة سجل الحضور بنجاح');
              this.loadAttendances();
            },
            error: (err) => {
              console.error('❌ Create error:', err);
              this.notification.showError(extractErrorMessage(err));
            }
          });
        }
      }
    });
  }

  // ==========================================================================
  // DELETE ATTENDANCE
  // ==========================================================================

  deleteAttendance(attendance: any): void {
    const employeeId = attendance.employee?.id;
    const attendanceId = attendance.id;
    
    if (!employeeId || !attendanceId) {
      this.notification.showError('لم يتم العثور على سجل الحضور');
      return;
    }
    
    if (confirm('هل أنت متأكد من حذف سجل الحضور؟')) {
      this.employeeService.deleteEmployeeAttendance(employeeId, attendanceId).subscribe({
        next: () => {
          this.notification.showSuccess('تم حذف سجل الحضور بنجاح');
          this.loadAttendances();
        },
        error: (err) => {
          this.notification.showError(extractErrorMessage(err));
        }
      });
    }
  }

  // ==========================================================================
  // FILTERS
  // ==========================================================================

  resetFilters(): void {
    this.selectedStatus = null;
    this.selectedEmployeeId = null;
    this.attendanceDateFrom = '';
    this.attendanceDateTo = '';
    this.quickSearch = '';
    this.employeeNationalId = '';
    this.barcodeSearch = '';
    this.isBarcodeMode = false;
    this.currentPage = 0;
    this.loadAttendances();
    this.notification.showSuccess('تم مسح جميع الفلاتر');
  }

  refreshData(): void {
    this.loadAttendances();
    this.notification.showSuccess('تم تحديث البيانات');
  }

  // ==========================================================================
  // EXPORT FUNCTIONS
  // ==========================================================================

  private showExportPageSelection(isCardPrint: boolean = false): Promise<any> {
    return new Promise((resolve) => {
      const totalPages = this.getTotalPages();
      
      if (totalPages <= 1) {
        resolve({ option: 'all' });
        return;
      }

      const dialogRef = this.dialog.open(EmployeeExportPageSelectDialogComponent, {
        width: '580px',
        maxWidth: '95vw',
        disableClose: true,
        data: {
          totalPages: totalPages,
          totalItems: this.totalItems,
          pageSize: this.pageSize,
          currentPage: this.currentPage,
          isCardPrint: isCardPrint
        }
      });

      dialogRef.afterClosed().subscribe(result => {
        resolve(result);
      });
    });
  }

  private async fetchPagesForExport(startPage: number, endPage: number): Promise<any[]> {
    const allData: any[] = [];
    const totalPages = this.getTotalPages();
    
    for (let page = startPage; page <= Math.min(endPage, totalPages - 1); page++) {
      const params: any = {
        pageNum: page,
        pageSize: this.pageSize
      };
      
      if (this.quickSearch?.trim()) params.quickSearch = this.quickSearch.trim();
      if (this.selectedEmployeeId) params.employeeId = this.selectedEmployeeId;
      if (this.employeeNationalId?.trim()) params.employeeNationalId = this.employeeNationalId.trim();
      if (this.selectedStatus) params.status = this.selectedStatus;
      if (this.attendanceDateFrom) params.attendanceDateFrom = this.formatDateForAPI(this.attendanceDateFrom);
      if (this.attendanceDateTo) params.attendanceDateTo = this.formatDateForAPI(this.attendanceDateTo);
      
      if (this.sortBy) params.orderBy = this.sortBy;
      if (this.sortDir) params.orderDir = this.sortDir;

      try {
        const res = await this.employeeService.getAllEmployeesAttendances(params).toPromise();
        if (res && res.items) {
          allData.push(...res.items);
        }
      } catch (error) {
        console.error(`Error fetching page ${page}:`, error);
        this.notification.showError(`حدث خطأ في تحميل الصفحة ${page + 1}`);
      }
    }

    return allData;
  }

  async exportToExcel(): Promise<void> {
    const result = await this.showExportPageSelection(false);
    
    if (!result) {
      return;
    }

    let dataToExport: any[] = [];

    if (result.option === 'all') {
      dataToExport = await this.fetchPagesForExport(0, this.getTotalPages() - 1);
    } else if (result.option === 'current') {
      dataToExport = this.allAttendances;
    } else if (result.option === 'range') {
      dataToExport = await this.fetchPagesForExport(result.startPage, result.endPage);
    }

    if (dataToExport.length === 0) {
      this.notification.showWarning('لا توجد بيانات لتصديرها');
      return;
    }

    const exportData = dataToExport.map((item, index) => ({
      '#': index + 1,
      'رقم الهوية': item.employee?.nationalId || '-',
      'الموظف': item.employee?.fullName || '-',
      'التاريخ': item.attendanceDate ? new Date(item.attendanceDate).toLocaleDateString('ar-EG') : '-',
      'حالة الحضور': item.status?.title || item.status || '-',
      'وقت الدخول': convertTo12HourFormat(item.checkInTime),
      'وقت الخروج': convertTo12HourFormat(item.checkOutTime),
      'وقت التأخير': item.lateTime ? `${item.lateTime} دقيقة` : '-',
      'ملاحظات': item.note || '-'
    }));

    this.reportService.exportToExcel(exportData, `employee-attendance`, 'حضور الموظفين');
    this.notification.showSuccess(`تم تصدير ${exportData.length} سجل بنجاح`);
  }

async exportToPDF(): Promise<void> {
  const result = await this.showExportPageSelection(false);
  
  if (!result) {
    return;
  }

  this.isLoading = true;

  let dataToPrint: any[] = [];

  if (result.option === 'all') {
    dataToPrint = await this.fetchPagesForExport(0, this.getTotalPages() - 1);
  } else if (result.option === 'current') {
    dataToPrint = this.allAttendances;
  } else if (result.option === 'range') {
    dataToPrint = await this.fetchPagesForExport(result.startPage, result.endPage);
  }

  if (dataToPrint.length === 0) {
    this.notification.showWarning('لا توجد بيانات لتصديرها');
    this.isLoading = false;
    return;
  }

  const filterTexts: string[] = [];
  if (this.selectedEmployeeId) {
    const employee = this.employees.find(e => e.id === this.selectedEmployeeId);
    if (employee) filterTexts.push(`الموظف: ${employee.fullName}`);
  }
  if (this.employeeNationalId) {
    filterTexts.push(`رقم الهوية: ${this.employeeNationalId}`);
  }
  if (this.selectedStatus) {
    const status = this.attendanceStatuses.find(s => 
      this.STATUS_ENUM_MAP[s.id] === this.selectedStatus
    );
    if (status) filterTexts.push(`حالة الحضور: ${status.title}`);
  }
  if (this.attendanceDateFrom) filterTexts.push(`من تاريخ: ${this.attendanceDateFrom}`);
  if (this.attendanceDateTo) filterTexts.push(`إلى تاريخ: ${this.attendanceDateTo}`);

  const total = dataToPrint.length;
  const present = dataToPrint.filter(a => a.status === 'PRESENT' || a.status?.id === 1).length;
  const absent = dataToPrint.filter(a => a.status === 'ABSENT' || a.status?.id === 2).length;
  const late = dataToPrint.filter(a => a.status === 'LATE' || a.status?.id === 3).length;
  const excused = dataToPrint.filter(a => a.status === 'EXCUSED' || a.status?.id === 4).length;
  const attendanceRate = total > 0 ? Math.round(((present + late) / total) * 100) : 0;

  let tableRows = '';
  dataToPrint.forEach((item: any, index: number) => {
    const checkInFormatted = convertTo12HourFormat(item.checkInTime);
    const checkOutFormatted = convertTo12HourFormat(item.checkOutTime);
    
    // Get status style
    const statusKey = typeof item.status === 'string' ? item.status : item.status?.id;
    let statusStyle = '';
    if (statusKey === 'PRESENT' || statusKey === 1) {
      statusStyle = 'background-color: #d1fae5; color: #065f46;';
    } else if (statusKey === 'ABSENT' || statusKey === 2) {
      statusStyle = 'background-color: #fee2e2; color: #991b1b;';
    } else if (statusKey === 'LATE' || statusKey === 3) {
      statusStyle = 'background-color: #fef3c7; color: #92400e;';
    } else if (statusKey === 'EXCUSED' || statusKey === 4) {
      statusStyle = 'background-color: #dbeafe; color: #1e40af;';
    }
    
    const statusTitle = item.status?.title || item.status || '-';

    tableRows += `
      <tr style="background-color: ${index % 2 === 0 ? '#ffffff' : '#f8fafc'};">
        <td style="text-align: center; padding: 8px; border: 1px solid #ddd;">${index + 1}</td>
        <td style="text-align: center; padding: 8px; border: 1px solid #ddd;">${item.employee?.nationalId || '-'}</td>
        <td style="text-align: right; padding: 8px; border: 1px solid #ddd; font-weight: bold;">${item.employee?.fullName || '-'}</td>
        <td style="text-align: center; padding: 8px; border: 1px solid #ddd;">${item.attendanceDate ? new Date(item.attendanceDate).toLocaleDateString('ar-EG') : '-'}</td>
        <td style="text-align: center; padding: 8px; border: 1px solid #ddd; ${statusStyle}">
          ${statusTitle}
        </td>
        <td style="text-align: center; padding: 8px; border: 1px solid #ddd;">${checkInFormatted}</td>
        <td style="text-align: center; padding: 8px; border: 1px solid #ddd;">${checkOutFormatted}</td>
        <td style="text-align: center; padding: 8px; border: 1px solid #ddd;">${item.lateTime ? item.lateTime + ' دقيقة' : '-'}</td>
        <td style="text-align: right; padding: 8px; border: 1px solid #ddd;">${item.note || '-'}</td>
      </tr>
    `;
  });

  const printContainer = document.createElement('div');
  printContainer.style.direction = 'rtl';
  printContainer.style.fontFamily = 'Cairo, "Segoe UI", Tahoma, sans-serif';
  printContainer.style.padding = '20px';
  printContainer.style.backgroundColor = 'white';
  printContainer.style.maxWidth = '1200px';
  printContainer.style.margin = '0 auto';

  printContainer.innerHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>تقرير حضور الموظفين</title>
      <style>
        * { font-family: 'Cairo', 'Segoe UI', Tahoma, sans-serif; box-sizing: border-box; }
        @media print {
          body { margin: 0; padding: 20px; background: #f0f4f8; }
          .no-print { display: none; }
          .header { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        }
        .header {
          text-align: center;
          margin-bottom: 25px;
          padding: 30px 20px;
          background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%);
          color: white;
          border-radius: 16px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.15);
        }
        .header h1 { margin: 0; font-size: 28px; font-weight: 800; }
        .header p { margin: 8px 0 0; font-size: 14px; opacity: 0.85; }
        .filters {
          margin-bottom: 20px;
          padding: 14px 20px;
          background: #ffffff;
          border-radius: 12px;
          font-size: 13px;
          color: #1e293b;
          border: 1px solid #e2e8f0;
        }
        .filters strong { color: #0f3460; margin-left: 8px; }
        .stats {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: 16px;
          margin-bottom: 24px;
        }
        .stat-item {
          text-align: center;
          padding: 16px 12px;
          background: white;
          border-radius: 14px;
          border: 1px solid #e2e8f0;
          box-shadow: 0 2px 8px rgba(0,0,0,0.04);
        }
        .stat-value { font-size: 24px; font-weight: 800; color: #06b6d4; display: block; }
        .stat-label { font-size: 13px; color: #64748b; margin-top: 4px; font-weight: 500; }
        .stat-value.present { color: #10b981; }
        .stat-value.absent { color: #ef4444; }
        .stat-value.late { color: #f59e0b; }
        .stat-value.excused { color: #3b82f6; }
        table {
          width: 100%;
          border-collapse: collapse;
          direction: rtl;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 2px 12px rgba(0,0,0,0.06);
        }
        th {
          background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%);
          color: white;
          padding: 14px 12px;
          border: none;
          text-align: center;
          font-weight: 700;
          font-size: 13px;
          text-transform: uppercase;
          letter-spacing: 0.3px;
        }
        td { padding: 10px 12px; border: 1px solid #e2e8f0; }
        .footer {
          text-align: center;
          margin-top: 25px;
          padding: 16px;
          font-size: 11px;
          color: #94a3b8;
          background: white;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
        }
        .footer strong { color: #0f3460; }
        .total-row td {
          font-weight: 700;
          background: #f8fafc;
          border-top: 2px solid #06b6d4;
        }
        .no-print {
          text-align: center;
          margin-top: 20px;
          padding: 10px;
        }
        .no-print button {
          padding: 12px 32px;
          background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%);
          color: white;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          font-size: 16px;
          font-weight: 600;
          transition: all 0.3s;
        }
        .no-print button:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(6, 182, 212, 0.3);
        }
        @media (max-width: 768px) {
          .stats { grid-template-columns: repeat(3, 1fr); }
        }
        @media (max-width: 480px) {
          .stats { grid-template-columns: repeat(2, 1fr); }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>📋 تقرير حضور الموظفين</h1>
        <p>تاريخ التقرير: ${new Date().toLocaleDateString('ar-EG')}</p>
        <p style="opacity:0.7; font-size:13px;">عدد السجلات: ${dataToPrint.length} سجل</p>
      </div>
      ${filterTexts.length ? `<div class="filters"><strong>🔍 الفلاتر المطبقة:</strong> ${filterTexts.join(' | ')}</div>` : ''}
      <div class="stats">
        <div class="stat-item"><span class="stat-value">${total}</span><span class="stat-label">👥 إجمالي الموظفين</span></div>
        <div class="stat-item"><span class="stat-value present">${present}</span><span class="stat-label">✅ حاضر</span></div>
        <div class="stat-item"><span class="stat-value absent">${absent}</span><span class="stat-label">❌ غائب</span></div>
        <div class="stat-item"><span class="stat-value late">${late}</span><span class="stat-label">⏰ متأخر</span></div>
        <div class="stat-item"><span class="stat-value excused">${excused}</span><span class="stat-label">📝 معتذر</span></div>
        <div class="stat-item"><span class="stat-value">${attendanceRate}%</span><span class="stat-label">📊 نسبة الحضور</span></div>
      </div>
      <table>
        <thead>
          <tr>
            <th>#</th><th>رقم الهوية</th><th>الموظف</th><th>التاريخ</th>
            <th>الحالة</th><th>وقت الدخول</th>
            <th>وقت الخروج</th><th>وقت التأخير</th><th>ملاحظات</th>
          </tr>
        </thead>
        <tbody>
          ${tableRows}
          <tr class="total-row">
            <td colspan="9" style="text-align:center; font-weight:700; color:#06b6d4; font-size:14px;">
              إجمالي عدد السجلات: ${dataToPrint.length}
            </td>
          </tr>
        </tbody>
      </table>
      <div class="footer">
        <strong>🏛️ نظام إدارة  الأكاديمية الأولمبية لعلوم الرياضة</strong><br>
        تم التصدير بواسطة النظام الآلي للأكاديمية الأولمبية
      </div>
      <div class="no-print">
        <button onclick="window.print();">🖨️ طباعة / حفظ كـ PDF</button>
      </div>
    </body>
    </html>
  `;

  const printWindow = window.open('', '_blank', 'width=1200,height=900,scrollbars=yes');
  if (printWindow) {
    printWindow.document.write(printContainer.innerHTML);
    printWindow.document.close();
    this.isLoading = false;
    this.notification.showSuccess(`تم فتح التقرير - ${dataToPrint.length} سجل`);
  } else {
    document.body.appendChild(printContainer);
    window.print();
    setTimeout(() => { document.body.removeChild(printContainer); }, 500);
    this.isLoading = false;
    this.notification.showSuccess(`تم فتح التقرير - ${dataToPrint.length} سجل`);
  }
}

  // ==========================================================================
  // HELPER METHODS
  // ==========================================================================

  getStatusStyle(status: any): string {
    const statusMap: { [key: string]: string } = {
      'PRESENT': 'background-color: #d1fae5; color: #065f46;',
      'ABSENT': 'background-color: #fee2e2; color: #991b1b;',
      'LATE': 'background-color: #fef3c7; color: #92400e;',
      'EXCUSED': 'background-color: #dbeafe; color: #1e40af;'
    };
    const statusKey = typeof status === 'string' ? status : status?.id;
    return statusMap[statusKey] || '';
  }

  getStatusClass(status: any): string {
    const classes: { [key: string]: string } = {
      'PRESENT': 'present',
      'ABSENT': 'absent',
      'LATE': 'late',
      'EXCUSED': 'excused'
    };
    const statusKey = typeof status === 'string' ? status : status?.id;
    return classes[statusKey] || '';
  }
}