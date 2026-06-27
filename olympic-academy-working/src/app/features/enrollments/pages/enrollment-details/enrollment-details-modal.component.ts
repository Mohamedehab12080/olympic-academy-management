// enrollment-details-modal.component.ts

import { Component, Inject, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTabsModule } from '@angular/material/tabs';
import { MatChipsModule } from '@angular/material/chips';
import { EnrollmentVTO } from '../../../../core/models/enrollment.model';
import { FileService } from '../../../../core/services/file.service';
import { NotificationService } from '../../../../core/services/notification.service';
import * as JsBarcode from 'jsbarcode';

@Component({
  selector: 'app-enrollment-details-modal',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatTabsModule,
    MatChipsModule
  ],
  template: `
    <div class="modal-container" dir="rtl">
      <!-- Header -->
      <div class="modal-header">
        <div class="header-title">
          <mat-icon>assignment_ind</mat-icon>
          <h2>تفاصيل التسجيل</h2>
        </div>
        <div class="header-actions">
          <button mat-icon-button (click)="printCard()" matTooltip="طباعة البطاقة">
            <mat-icon>print</mat-icon>
          </button>
          <button mat-icon-button mat-dialog-close class="close-btn">
            <mat-icon>close</mat-icon>
          </button>
        </div>
      </div>
      
      <mat-divider></mat-divider>
      
      <!-- Loading -->
      <div class="loading-area" *ngIf="isLoading">
        <mat-spinner diameter="50"></mat-spinner>
        <p>جاري التحميل...</p>
      </div>

      <!-- Main Profile Info -->
      <div class="profile-main" *ngIf="!isLoading && enrollment">
        <div class="profile-image">
          <div class="avatar" *ngIf="!traineeImageUrl; else profileImage">
            <mat-icon>person</mat-icon>
          </div>
          <ng-template #profileImage>
            <img [src]="traineeImageUrl" [alt]="enrollment.trainee?.fullName">
          </ng-template>
        </div>

        <div class="profile-info">
          <h1>{{ enrollment.trainee?.fullName }}</h1>
          <div class="info-badges">
            <mat-chip [color]="enrollment.isActive ? 'primary' : 'warn'" selected>
              {{ enrollment.isActive ? 'نشط' : 'غير نشط' }}
            </mat-chip>
            <mat-chip>
              <mat-icon>badge</mat-icon>
              {{ enrollment.trainee?.nationalId || enrollment.trainee?.id }}
            </mat-chip>
            <mat-chip>
              <mat-icon>receipt</mat-icon>
              رقم التسجيل: {{ enrollment.id }}
            </mat-chip>
            <mat-chip class="status-badge-chip" [class.completed]="enrollment.enrollmentStatus?.id === 2"
                      [class.pending]="enrollment.enrollmentStatus?.id === 1"
                      [class.cancelled]="enrollment.enrollmentStatus?.id === 3">
              <mat-icon>verified</mat-icon>
              {{ enrollment.enrollmentStatus?.title }}
            </mat-chip>
            <mat-chip class="payment-badge-chip" [class.paid]="enrollment.paymentStatus?.id === 2"
                      [class.pending]="enrollment.paymentStatus?.id === 1">
              <mat-icon>payment</mat-icon>
              {{ enrollment.paymentStatus?.title }}
            </mat-chip>
          </div>
        </div>
      </div>
      
      <mat-divider></mat-divider>
      
      <!-- Tabs -->
      <mat-tab-group class="custom-tabs" *ngIf="!isLoading && enrollment">
        <!-- Details Tab -->
        <mat-tab label="تفاصيل التسجيل">
          <div class="tab-content">
            <div class="info-grid">
              <div class="info-item">
                <mat-icon>person</mat-icon>
                <div>
                  <label>المتدرب</label>
                  <p>{{ enrollment.trainee?.fullName }}</p>
                </div>
              </div>

              <div class="info-item">
                <mat-icon>school</mat-icon>
                <div>
                  <label>الدورة</label>
                  <p>{{ enrollment.course?.title }}</p>
                </div>
              </div>

              <div class="info-item">
                <mat-icon>person</mat-icon>
                <div>
                  <label>المدرب</label>
                  <p>{{ enrollment.trainer?.title }}</p>
                </div>
              </div>

              <div class="info-item">
                <mat-icon>event</mat-icon>
                <div>
                  <label>تاريخ البدء</label>
                  <p>{{ enrollment.startDate | date:'dd/MM/yyyy' }}</p>
                </div>
              </div>

              <div class="info-item">
                <mat-icon>event_busy</mat-icon>
                <div>
                  <label>تاريخ الانتهاء</label>
                  <p>{{ enrollment.endDate ? (enrollment.endDate | date:'dd/MM/yyyy') : 'غير محدد' }}</p>
                </div>
              </div>

              <div class="info-item">
                <mat-icon>attach_money</mat-icon>
                <div>
                  <label>القيمة النهائية</label>
                  <p class="amount">{{ enrollment.finalSubscriptionValue | currency:'EGP' }}</p>
                </div>
              </div>

              <div class="info-item">
                <mat-icon>account_balance_wallet</mat-icon>
                <div>
                  <label>المتبقي</label>
                  <p class="remained" *ngIf="enrollment.remainedSubscriptionValue">{{ enrollment.remainedSubscriptionValue | currency:'EGP' }}</p>
                  <p class="paid" *ngIf="!enrollment.remainedSubscriptionValue">مدفوع بالكامل</p>
                </div>
              </div>

              <div class="info-item">
                <mat-icon>verified</mat-icon>
                <div>
                  <label>حالة التسجيل</label>
                  <p>
                    <span class="status-badge" [class.completed]="enrollment.enrollmentStatus?.id === 2"
                          [class.pending]="enrollment.enrollmentStatus?.id === 1"
                          [class.cancelled]="enrollment.enrollmentStatus?.id === 3">
                      {{ enrollment.enrollmentStatus?.title }}
                    </span>
                  </p>
                </div>
              </div>

              <div class="info-item">
                <mat-icon>payment</mat-icon>
                <div>
                  <label>حالة الدفع</label>
                  <p>
                    <span class="payment-badge" [class.paid]="enrollment.paymentStatus?.id === 2"
                          [class.pending]="enrollment.paymentStatus?.id === 1">
                      {{ enrollment.paymentStatus?.title }}
                    </span>
                  </p>
                </div>
              </div>

              <div class="info-item" *ngIf="enrollment.enrollmentType?.title">
                <mat-icon>category</mat-icon>
                <div>
                  <label>نوع التسجيل</label>
                  <p>{{ enrollment.enrollmentType?.title }}</p>
                </div>
              </div>
            </div>

            <!-- Note if exists -->
            <div class="note-container" *ngIf="enrollment.note">
              <mat-icon>note</mat-icon>
              <div>
                <label>ملاحظات</label>
                <p>{{ enrollment.note }}</p>
              </div>
            </div>
          </div>
        </mat-tab>

        <!-- Barcode Tab -->
        <mat-tab label="بطاقة هوية">
          <div class="tab-content barcode-tab">
            <div class="barcode-card">
              <div class="barcode-header">
                <mat-icon>qr_code_scanner</mat-icon>
                <span>بطاقة هوية المتدرب</span>
              </div>
              <div class="barcode-container">
                <canvas #barcodeCanvas class="barcode-canvas" width="350" height="60"></canvas>
                <!-- <div class="barcode-number">{{ enrollment.trainee?.nationalId || enrollment.trainee?.id }}</div> -->
              </div>
              <div class="barcode-info">
                <span>رقم التسجيل: {{ enrollment.id }}</span>
                <span>تاريخ الإصدار: {{ today | date:'dd/MM/yyyy' }}</span>
              </div>
            </div>
          </div>
        </mat-tab>

        <!-- System Info Tab -->
        <mat-tab label="معلومات النظام">
          <div class="tab-content">
            <div class="info-grid">
              <div class="info-item">
                <mat-icon>person_add</mat-icon>
                <div>
                  <label>تم الإنشاء بواسطة</label>
                  <p>{{ enrollment.createdBy?.fullName || '-' }}</p>
                </div>
              </div>
              <div class="info-item">
                <mat-icon>schedule</mat-icon>
                <div>
                  <label>تاريخ الإنشاء</label>
                  <p>{{ enrollment.createdOn | date:'dd/MM/yyyy HH:mm' }}</p>
                </div>
              </div>
              <div class="info-item" *ngIf="enrollment.lastModifiedBy">
                <mat-icon>edit</mat-icon>
                <div>
                  <label>تم التعديل بواسطة</label>
                  <p>{{ enrollment.lastModifiedBy?.fullName || '-' }}</p>
                </div>
              </div>
              <div class="info-item" *ngIf="enrollment.lastModifiedOn">
                <mat-icon>update</mat-icon>
                <div>
                  <label>تاريخ التعديل</label>
                  <p>{{ enrollment.lastModifiedOn | date:'dd/MM/yyyy HH:mm' }}</p>
                </div>
              </div>
            </div>
          </div>
        </mat-tab>
      </mat-tab-group>
      
      <mat-divider></mat-divider>
      
      <!-- Modal Actions -->
      <div class="modal-actions">
        <button mat-raised-button color="accent" (click)="printCard()" matTooltip="طباعة البطاقة">
          <mat-icon>print</mat-icon>
          طباعة البطاقة
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

    <!-- Hidden Thermal Print Template -->
    <div id="thermalPrint" style="display: none;">
      <div class="thermal-card">
        <div class="thermal-header">
          <div class="thermal-title">الأكاديمية الأولمبية</div>
          <div class="thermal-subtitle">بطاقة تسجيل متدرب</div>
        </div>
        <div class="thermal-divider"></div>
        <div class="thermal-photo">
          <img id="thermalPhoto" style="width: 50px; height: 50px; border-radius: 50%;">
        </div>
        <div class="thermal-name" id="thermalName"></div>
        <div class="thermal-id" id="thermalId"></div>
        <div class="thermal-divider"></div>
        <table class="thermal-table" id="thermalTable">
          <tbody id="thermalTableBody"></tbody>
        </table>
        <div class="thermal-divider"></div>
        <div class="thermal-barcode">
          <img id="thermalBarcodeImg">
          <div class="thermal-barcode-number" id="thermalBarcodeNum"></div>
        </div>
        <div class="thermal-footer">
          <div class="thermal-signature">
            <div class="thermal-line"></div>
            <div>توقيع المتدرب</div>
          </div>
          <div class="thermal-signature">
            <div class="thermal-line"></div>
            <div>ختم الأكاديمية</div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .modal-container {
      min-width: 700px;
      max-width: 900px;
      max-height: 90vh;
      direction: rtl;
      background: #f5f7fa;
      border-radius: 24px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      border: 1px solid rgba(226, 232, 240, 0.4);
    }

    /* Header - Navy Theme */
    .modal-header {
      flex-shrink: 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px 24px;
      background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
      color: white;
      position: relative;
      overflow: hidden;
    }

    .modal-header::before {
      content: '';
      position: absolute;
      top: -50%;
      right: -20%;
      width: 200px;
      height: 200px;
      background: rgba(255, 255, 255, 0.03);
      border-radius: 50%;
      pointer-events: none;
    }

    .modal-header::after {
      content: '';
      position: absolute;
      bottom: -40%;
      left: -10%;
      width: 150px;
      height: 150px;
      background: rgba(255, 255, 255, 0.02);
      border-radius: 50%;
      pointer-events: none;
    }

    .header-title {
      display: flex;
      align-items: center;
      gap: 12px;
      z-index: 1;
    }

    .header-title mat-icon {
      font-size: 28px;
      width: 28px;
      height: 28px;
    }

    .modal-header h2 {
      margin: 0;
      font-size: 22px;
      font-weight: 600;
    }

    .header-actions {
      display: flex;
      gap: 8px;
      z-index: 1;
    }

    .close-btn {
      color: white;
      transition: transform 0.2s;
    }

    .close-btn:hover {
      transform: scale(1.1);
      background: rgba(255, 255, 255, 0.12);
    }

    .header-actions button {
      color: white;
      transition: all 0.3s;
    }

    .header-actions button:hover {
      background: rgba(255, 255, 255, 0.12);
      transform: scale(1.05);
    }

    /* Loading */
    .loading-area {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 80px;
      gap: 16px;
    }

    .loading-area mat-spinner {
      color: #0f3460 !important;
    }

    .loading-area p {
      color: #94a3b8;
      font-size: 14px;
      font-weight: 500;
    }

    /* Profile Main */
    .profile-main {
      display: flex;
      gap: 24px;
      padding: 24px;
      background: white;
    }

    .profile-image {
      flex-shrink: 0;
    }

    .avatar {
      width: 100px;
      height: 100px;
      border-radius: 50%;
      background: linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .avatar mat-icon {
      font-size: 50px;
      width: 50px;
      height: 50px;
      color: white;
    }

    .profile-image img {
      width: 100px;
      height: 100px;
      border-radius: 50%;
      object-fit: cover;
    }

    .profile-info {
      flex: 1;
    }

    .profile-info h1 {
      margin: 0 0 12px 0;
      font-size: 24px;
      color: #1f2937;
      font-weight: 700;
    }

    .info-badges {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    /* Chips */
    ::ng-deep .mat-chip {
      font-size: 12px !important;
      padding: 4px 14px !important;
    }

    .status-badge-chip {
      background: #fef3c7 !important;
      color: #92400e !important;
    }

    .status-badge-chip.completed {
      background: #d1fae5 !important;
      color: #065f46 !important;
    }

    .status-badge-chip.cancelled {
      background: #fee2e2 !important;
      color: #991b1b !important;
    }

    .payment-badge-chip {
      background: #e0e7ff !important;
      color: #3730a3 !important;
    }

    .payment-badge-chip.paid {
      background: #d1fae5 !important;
      color: #065f46 !important;
    }

    /* Tabs */
    .custom-tabs {
      flex: 1;
      overflow-y: auto;
    }

    .tab-content {
      padding: 20px;
      max-height: 50vh;
      overflow-y: auto;
    }

    /* Custom Scrollbar */
    .tab-content::-webkit-scrollbar {
      width: 6px;
    }

    .tab-content::-webkit-scrollbar-track {
      background: #f1f5f9;
      border-radius: 10px;
    }

    .tab-content::-webkit-scrollbar-thumb {
      background: linear-gradient(135deg, #0f3460, #1a1a2e);
      border-radius: 10px;
    }

    .tab-content::-webkit-scrollbar-thumb:hover {
      background: linear-gradient(135deg, #1a1a2e, #0f3460);
    }

    /* Info Grid */
    .info-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 16px;
    }

    .info-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 16px;
      background: #f9fafb;
      border-radius: 12px;
      border: 1px solid rgba(226, 232, 240, 0.3);
      transition: all 0.2s;
    }

    .info-item:hover {
      border-color: rgba(15, 52, 96, 0.15);
      background: #f1f5f9;
    }

    .info-item mat-icon {
      color: #0f3460;
      font-size: 24px;
      width: 24px;
      height: 24px;
    }

    .info-item div {
      flex: 1;
    }

    .info-item label {
      display: block;
      font-size: 11px;
      color: #6b7280;
      font-weight: 500;
      margin-bottom: 2px;
    }

    .info-item p {
      margin: 0;
      font-size: 14px;
      color: #1f2937;
      font-weight: 500;
    }

    .info-item .amount {
      color: #10b981;
      font-weight: 600;
    }

    .info-item .remained {
      color: #f59e0b;
      font-weight: 600;
    }

    .info-item .paid {
      color: #10b981;
      font-weight: 600;
    }

    /* Status Badges */
    .status-badge {
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
      display: inline-block;
    }

    .status-badge.completed {
      background: #d1fae5;
      color: #065f46;
    }

    .status-badge.pending {
      background: #fef3c7;
      color: #92400e;
    }

    .status-badge.cancelled {
      background: #fee2e2;
      color: #991b1b;
    }

    .payment-badge {
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
      display: inline-block;
    }

    .payment-badge.paid {
      background: #d1fae5;
      color: #065f46;
    }

    .payment-badge.pending {
      background: #fef3c7;
      color: #92400e;
    }

    /* Note Container */
    .note-container {
      display: flex;
      gap: 12px;
      padding: 12px 16px;
      margin-top: 16px;
      background: #fffbeb;
      border-radius: 12px;
      border: 1px solid rgba(217, 119, 6, 0.15);
    }

    .note-container mat-icon {
      color: #d97706;
      font-size: 20px;
      width: 20px;
      height: 20px;
    }

    .note-container label {
      display: block;
      font-size: 11px;
      color: #92400e;
      font-weight: 500;
      margin-bottom: 2px;
    }

    .note-container p {
      margin: 0;
      font-size: 13px;
      color: #78350f;
    }

    /* Barcode Tab */
    .barcode-tab {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 250px;
    }

    .barcode-card {
      text-align: center;
      background: #f8fafc;
      padding: 30px 40px;
      border-radius: 20px;
      border: 1px solid rgba(226, 232, 240, 0.5);
      width: 100%;
      max-width: 450px;
    }

    .barcode-header {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      margin-bottom: 16px;
    }

    .barcode-header mat-icon {
      color: #0f3460;
      font-size: 28px;
      width: 28px;
      height: 28px;
    }

    .barcode-header span {
      font-size: 16px;
      font-weight: 600;
      color: #1f2937;
    }

    .barcode-container {
      margin: 16px 0;
    }

    .barcode-canvas {
      max-width: 100%;
      height: auto;
    }

    .barcode-number {
      font-size: 14px;
      font-weight: 600;
      color: #0f3460;
      font-family: monospace;
      margin-top: 8px;
      letter-spacing: 1px;
    }

    .barcode-info {
      display: flex;
      justify-content: space-between;
      font-size: 12px;
      color: #6b7280;
      margin-top: 12px;
      padding-top: 12px;
      border-top: 1px solid #e5e7eb;
    }

    /* Modal Actions */
    .modal-actions {
      flex-shrink: 0;
      display: flex;
      gap: 12px;
      justify-content: flex-end;
      padding: 16px 20px;
      background: white;
      border-top: 1px solid #e5e7eb;
    }

    .modal-actions button.mat-raised-button.mat-accent {
      background: linear-gradient(135deg, #0f3460 0%, #1a1a2e 100%) !important;
    }

    .modal-actions button.mat-raised-button.mat-primary {
      background: linear-gradient(135deg, #0f3460 0%, #1a1a2e 100%) !important;
    }

    .modal-actions button.mat-raised-button.mat-warn {
      background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%) !important;
    }

    .modal-actions button.mat-button {
      color: #6b7280;
      font-weight: 500;
    }

    .modal-actions button.mat-button:hover {
      background: #f9fafb;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .modal-container {
        min-width: 90vw;
        max-width: 90vw;
      }

      .profile-main {
        flex-direction: column;
        align-items: center;
        text-align: center;
        padding: 16px;
      }

      .info-badges {
        justify-content: center;
      }

      .info-grid {
        grid-template-columns: 1fr;
      }

      .tab-content {
        padding: 16px;
      }

      .barcode-card {
        padding: 20px;
      }

      .barcode-info {
        flex-direction: column;
        gap: 4px;
        text-align: center;
      }

      .modal-actions {
        flex-wrap: wrap;
        justify-content: center;
      }

      .modal-actions button {
        min-width: 100px;
      }
    }

    @media (max-width: 480px) {
      .modal-header {
        flex-direction: column;
        text-align: center;
        gap: 12px;
        padding: 14px 16px;
      }

      .header-title {
        flex-direction: column;
        text-align: center;
      }

      .header-actions {
        justify-content: center;
      }

      .modal-actions {
        flex-direction: column;
      }

      .modal-actions button {
        width: 100%;
      }
    }

    /* Thermal Print Styles */
    @media print {
      body * {
        visibility: hidden;
      }
      #thermalPrint, #thermalPrint * {
        visibility: visible;
      }
      #thermalPrint {
        display: block !important;
        position: absolute;
        top: 0;
        left: 0;
        width: 57mm;
        margin: 0;
        padding: 0;
      }
      .thermal-card {
        font-family: 'Cairo', 'Segoe UI', sans-serif;
        width: 55mm;
        margin: 0 auto;
        padding: 2mm;
        background: white;
        direction: rtl;
      }
      .thermal-header { text-align: center; margin-bottom: 3mm; }
      .thermal-title { font-size: 14px; font-weight: bold; }
      .thermal-subtitle { font-size: 10px; color: #666; }
      .thermal-divider { border-top: 1px dashed #ccc; margin: 2mm 0; }
      .thermal-photo { text-align: center; margin-bottom: 2mm; }
      .thermal-name { font-size: 12px; font-weight: bold; text-align: center; margin-bottom: 1mm; }
      .thermal-id { font-size: 9px; color: #666; text-align: center; margin-bottom: 2mm; }
      .thermal-table { width: 100%; font-size: 9px; margin-bottom: 2mm; border-collapse: collapse; }
      .thermal-table tr { line-height: 1.4; }
      .thermal-label { text-align: right; padding: 1mm; color: #666; width: 40%; }
      .thermal-value { text-align: left; padding: 1mm; font-weight: 500; width: 60%; }
      .thermal-barcode { text-align: center; margin: 2mm 0; }
      .thermal-barcode img { width: 100%; max-width: 180px; }
      .thermal-barcode-number { font-size: 9px; font-family: monospace; text-align: center; margin-top: 1mm; }
      .thermal-footer { display: flex; justify-content: space-between; gap: 3mm; margin-top: 3mm; }
      .thermal-signature { flex: 1; text-align: center; font-size: 7px; }
      .thermal-line { border-top: 0.5px solid #000; margin-bottom: 1mm; padding-top: 4mm; }
      @page { size: 57mm auto; margin: 0mm; }
    }
  `]
})
export class EnrollmentDetailsModalComponent implements OnInit, OnDestroy, AfterViewInit {
  enrollment: EnrollmentVTO;
  traineeImageUrl: string | null = null;
  private blobUrl: string | null = null;
  isLoading = true;
  today = new Date();

  @ViewChild('barcodeCanvas') barcodeCanvas!: ElementRef<HTMLCanvasElement>;

  constructor(
    private dialogRef: MatDialogRef<EnrollmentDetailsModalComponent>,
    @Inject(MAT_DIALOG_DATA) private data: EnrollmentVTO,
    private fileService: FileService,
    private notification: NotificationService
  ) {
    this.enrollment = data;
  }

  ngOnInit(): void {
    this.loadTraineeImage();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.generateBarcode();
      this.isLoading = false;
    }, 300);
  }

  ngOnDestroy(): void {
    if (this.blobUrl) {
      URL.revokeObjectURL(this.blobUrl);
    }
  }

  loadTraineeImage(): void {
    const trainee = this.enrollment.trainee;
    // Check if trainee has imageUrl (FID - 15 or 18 digits)
    if (trainee && trainee.imageUrl && /^\d{15}(\d{3})?$/.test(trainee.imageUrl)) {
      this.fileService.downloadFile(trainee.imageUrl).subscribe({
        next: (blob) => {
          if (this.blobUrl) URL.revokeObjectURL(this.blobUrl);
          this.blobUrl = URL.createObjectURL(blob);
          this.traineeImageUrl = this.blobUrl;
        },
        error: () => this.traineeImageUrl = null
      });
    }
  }

  generateBarcode(): void {
    if (this.barcodeCanvas?.nativeElement) {
      try {
        // Use nationalId if available, otherwise fallback to id
        const barcodeValue = this.enrollment.trainee?.nationalId?.toString() || 
                            this.enrollment.trainee?.id?.toString() || 
                            '000000';
        
        (JsBarcode as any)(this.barcodeCanvas.nativeElement, barcodeValue, {
          format: 'CODE128',
          lineColor: '#000000',
          width: 1.5,
          height: 40,
          displayValue: true,
          fontSize: 10,
          font: 'monospace',
          textAlign: 'center',
          margin: 5
        });
      } catch (error) {
        console.error('Barcode error:', error);
      }
    }
  }

  editEnrollment(): void {
    this.dialogRef.close();
    // Navigate to edit or open wizard
  }

  deleteEnrollment(): void {
    this.dialogRef.close({ action: 'delete', enrollment: this.enrollment });
  }

  printCard(): void {
    this.generateBarcode();
    setTimeout(() => {
      const barcodeImage = this.barcodeCanvas.nativeElement.toDataURL('image/png');
      const printWindow = window.open('', '_blank', 'width=350,height=500,scrollbars=no,menubar=no,toolbar=no,status=no');
      if (!printWindow) {
        this.notification.showError('تعذر فتح نافذة الطباعة');
        return;
      }

      const e = this.enrollment;
      const barcodeValue = e.trainee?.nationalId || e.trainee?.id || '';
      const logoPath = 'assets/images/mainLogo.jpeg';
      
      printWindow.document.write(`
        <!DOCTYPE html>
        <html dir="rtl">
        <head>
          <meta charset="UTF-8">
          <title>بطاقة تسجيل متدرب</title>
          <style>
            @page { 
              size: 58mm auto; 
              margin: 0mm; 
            }
            
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            
            html, body { 
              margin: 0;
              padding: 0;
              background: white;
              width: 58mm;
              min-width: 58mm;
              max-width: 58mm;
              display: flex;
              justify-content: flex-start;
              align-items: flex-start;
              min-height: 100vh;
            }
            
            .thermal-card { 
              width: 100%;
              max-width: 58mm;
              margin: 0;
              padding: 1.5mm 2mm 2mm 2mm;
              background: white;
              position: relative;
              overflow: hidden;
              direction: rtl;
              border: 0.5px solid #e5e7eb;
              border-radius: 4px;
            }
            
            /* ===== WATERMARK - Transparent background ===== */
            .watermark-wrapper {
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              width: 55%;
              height: 55%;
              pointer-events: none;
              z-index: 0;
              overflow: hidden;
              display: flex;
              align-items: center;
              justify-content: center;
            }
            
            .watermark-container {
              display: flex;
              align-items: center;
              justify-content: center;
              width: 100%;
              height: 100%;
              opacity: 0.07;
              transform: rotate(-25deg);
            }
            
            .watermark-container img {
              width: 100%;
              height: 100%;
              object-fit: contain;
              filter: grayscale(0%) sepia(20%) saturate(150%) hue-rotate(220deg);
            }
            
            .watermark-text {
              position: absolute;
              top: 58%;
              left: 50%;
              transform: translate(-50%, -50%) rotate(-25deg);
              font-size: 16px;
              font-weight: 900;
              color: #0f3460;
              letter-spacing: 4px;
              text-transform: uppercase;
              white-space: nowrap;
              opacity: 0.04;
              pointer-events: none;
              z-index: 0;
            }
            
            /* ===== CONTENT - Above watermark ===== */
            .card-content {
              position: relative;
              z-index: 1;
            }
            
            /* ===== LOGO AT TOP - Colored and visible ===== */
            .card-logo-section {
              display: flex;
              align-items: center;
              gap: 8px;
              padding: 4px 0;
              margin-bottom: 4px;
              border-bottom: 2px solid #0f3460;
            }
            
            .card-logo-image {
              width: 36px;
              height: 36px;
              object-fit: contain;
              border-radius: 6px;
              flex-shrink: 0;
              background: white;
              padding: 2px;
            }
            
            .card-logo-text {
              display: flex;
              flex-direction: column;
              flex: 1;
            }
            
            .card-logo-text .academy-name {
              font-size: 11px;
              font-weight: 700;
              color: #0f3460;
              line-height: 1.2;
            }
            
            .card-logo-text .card-title {
              font-size: 7px;
              color: #64748b;
              font-weight: 500;
            }
            
            .thermal-divider { 
              border-top: 1px dashed #d1d5db; 
              margin: 0.5mm 0; 
            }
            
            .thermal-photo { 
              text-align: center; 
              margin-bottom: 0.5mm; 
            }
            .thermal-photo img { 
              width: 30px; 
              height: 30px; 
              border-radius: 50%; 
              object-fit: cover;
              border: 1.5px solid #0f3460;
            }
            .thermal-photo .placeholder-photo {
              width: 30px;
              height: 30px;
              border-radius: 50%;
              background: linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%);
              display: inline-flex;
              align-items: center;
              justify-content: center;
              font-size: 14px;
              color: white;
              border: 1.5px solid #0f3460;
            }
            
            .thermal-name { 
              font-size: 10px; 
              font-weight: 700; 
              text-align: center; 
              margin-bottom: 0.2mm; 
              color: #1a1a2e;
            }
            .thermal-id { 
              font-size: 7px; 
              color: #6b7280; 
              text-align: center; 
              margin-bottom: 0.5mm; 
              font-weight: 500;
            }
            
            .thermal-table { 
              width: 100%; 
              font-size: 6.5px; 
              margin-bottom: 0.5mm; 
              border-collapse: collapse; 
            }
            .thermal-table tr { 
              line-height: 1.2; 
            }
            .thermal-label { 
              text-align: right; 
              padding: 0.2mm 0.5mm; 
              color: #6b7280; 
              width: 35%;
              font-weight: 500;
              font-size: 6px;
            }
            .thermal-value { 
              text-align: left; 
              padding: 0.2mm 0.5mm; 
              font-weight: 600; 
              width: 65%;
              color: #1e293b;
              font-size: 6px;
            }
            .thermal-value.amount { 
              color: #0f3460; 
              font-weight: 700; 
            }
            .thermal-value.remaining { 
              color: #d97706; 
              font-weight: 700; 
            }
            .thermal-value.remaining-zero { 
              color: #10b981; 
              font-weight: 700; 
            }
            
            /* Payment Details Section - Transparent background */
            .payment-details-section {
              background: transparent;
              border-radius: 4px;
              padding: 0.5mm 1.5mm;
              margin: 0.3mm 0;
              border: 1px solid rgba(15, 52, 96, 0.15);
            }
            .payment-details-section .payment-title {
              font-size: 6px;
              font-weight: 700;
              color: #0f3460;
              text-align: center;
              margin-bottom: 0.3mm;
            }
            .payment-details-section .thermal-table {
              margin-bottom: 0;
            }
            .payment-details-section .thermal-table tr:last-child .thermal-value,
            .payment-details-section .thermal-table tr:last-child .thermal-label {
              border-bottom: none;
            }
            .payment-details-section .thermal-table .thermal-label {
              color: #475569;
            }
            
            .thermal-barcode { 
              text-align: center; 
              margin: 0.5mm 0; 
            }
            .thermal-barcode img { 
              width: 100%; 
              max-width: 130px; 
            }
            .thermal-barcode-number { 
              font-size: 6px; 
              font-family: monospace; 
              text-align: center; 
              margin-top: 0.2mm; 
              color: #0f3460;
              font-weight: 600;
              letter-spacing: 1px;
            }
            
            .thermal-footer { 
              display: flex; 
              justify-content: space-between; 
              gap: 1.5mm; 
              margin-top: 0.6mm; 
              padding-top: 0.6mm;
              border-top: 2px solid #0f3460;
            }
            .thermal-signature { 
              flex: 1; 
              text-align: center; 
              font-size: 4.5px; 
              color: #94a3b8;
            }
            .thermal-line { 
              border-top: 0.5px solid #94a3b8; 
              margin-bottom: 0.2mm; 
              padding-top: 2mm; 
            }
            
            .thermal-issue-date {
              text-align: center;
              font-size: 5px;
              color: #94a3b8;
              margin-top: 0.3mm;
              padding-top: 0.3mm;
              border-top: 1px dashed #e5e7eb;
            }
            
            @media print {
              html, body {
                width: 58mm !important;
                min-width: 58mm !important;
                max-width: 58mm !important;
                margin: 0 !important;
                padding: 0 !important;
              }
              .thermal-card {
                padding: 1mm 1.5mm 1.5mm 1.5mm;
                border: none !important;
                box-shadow: none !important;
              }
              .watermark-container {
                opacity: 0.08 !important;
              }
              .watermark-container img {
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
              }
              .watermark-text {
                opacity: 0.05 !important;
              }
              .no-print { 
                display: none !important; 
              }
              .card-logo-image {
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
              }
              .card-logo-section {
                padding: 2px 0 !important;
                margin-bottom: 2px !important;
              }
              .card-logo-image {
                width: 30px !important;
                height: 30px !important;
              }
              .card-logo-text .academy-name {
                font-size: 9px !important;
              }
              .card-logo-text .card-title {
                font-size: 6px !important;
              }
              .thermal-photo img {
                width: 25px !important;
                height: 25px !important;
              }
              .payment-details-section {
                padding: 0.3mm 1mm !important;
                border-color: rgba(15, 52, 96, 0.1) !important;
              }
            }
          </style>
        </head>
        <body>
          <div class="thermal-card">
            <!-- WATERMARK - Transparent background -->
            <div class="watermark-wrapper">
              <div class="watermark-container">
                <img src="${logoPath}" alt="الأكاديمية الأولمبية" onerror="this.style.display='none'">
              </div>
              <div class="watermark-text">الأكاديمية الأولمبية</div>
            </div>
            
            <!-- CONTENT -->
            <div class="card-content">
              <!-- LOGO AT TOP - Colored and visible -->
              <div class="card-logo-section">
                <img src="${logoPath}" alt="الأكاديمية الأولمبية" class="card-logo-image" onerror="this.style.display='none'">
                <div class="card-logo-text">
                  <span class="academy-name">الأكاديمية الأولمبية</span>
                  <span class="card-title">بطاقة تسجيل متدرب</span>
                </div>
              </div>
              
              <div class="thermal-photo">
                ${this.traineeImageUrl ? `<img src="${this.traineeImageUrl}" alt="${e.trainee?.fullName}" onerror="this.style.display='none'">` : '<div class="placeholder-photo">📷</div>'}
              </div>
              
              <div class="thermal-name">${e.trainee?.fullName || ''}</div>
              <div class="thermal-id">رقم التسجيل: ${e?.id || ''}</div>
              
              <div class="thermal-divider"></div>
              
              <!-- Course & Trainer Info -->
              <table class="thermal-table">
                <tr>
                  <td class="thermal-label">📚 الدورة</td>
                  <td class="thermal-value">${(e.course?.title || '').substring(0, 20)}</td>
                </tr>
                <tr>
                  <td class="thermal-label">👨‍🏫 المدرب</td>
                  <td class="thermal-value">${(e.trainer?.title || '').substring(0, 20)}</td>
                </tr>
                <tr>
                  <td class="thermal-label">📅 التسجيل</td>
                  <td class="thermal-value">${new Date(e.startDate).toLocaleDateString('ar-EG')}</td>
                </tr>
                ${e.endDate ? `<tr><td class="thermal-label">📅 الانتهاء</td><td class="thermal-value">${new Date(e.endDate).toLocaleDateString('ar-EG')}</td></tr>` : ''}
              </table>
              
              <div class="thermal-divider"></div>
              
              <!-- Payment Details Section - Transparent -->
              <div class="payment-details-section">
                <div class="payment-title">💳 تفاصيل الدفعة</div>
                <table class="thermal-table">
                  <tr>
                    <td class="thermal-label">💰 القيمة</td>
                    <td class="thermal-value amount">${e.finalSubscriptionValue?.toLocaleString() || 0} جم</td>
                  </tr>
                  ${e.remainedSubscriptionValue !== undefined && e.remainedSubscriptionValue !== null ? `
                  <tr>
                    <td class="thermal-label">💳 المتبقي</td>
                    <td class="thermal-value ${e.remainedSubscriptionValue > 0 ? 'remaining' : 'remaining-zero'}">${e.remainedSubscriptionValue.toLocaleString()} جم</td>
                  </tr>
                  ` : ''}
                  <tr>
                    <td class="thermal-label">✓ الحالة</td>
                    <td class="thermal-value">${e.enrollmentStatus?.title || ''}</td>
                  </tr>
                  <tr>
                    <td class="thermal-label">💵 الدفع</td>
                    <td class="thermal-value">${e.paymentStatus?.title || ''}</td>
                  </tr>
                </table>
              </div>
              
              <div class="thermal-divider"></div>
              
              <div class="thermal-barcode">
                <img src="${barcodeImage}" alt="Barcode">
                <div class="thermal-barcode-number">${e.trainee?.nationalId || e.trainee?.id || ''}</div>
              </div>
              
              <div class="thermal-footer">
                <div class="thermal-signature">
                  <div class="thermal-line"></div>
                  <div>توقيع المتدرب</div>
                </div>
                <div class="thermal-signature">
                  <div class="thermal-line"></div>
                  <div>ختم الأكاديمية</div>
                </div>
              </div>
              
              <div class="thermal-issue-date">📅 تاريخ الإصدار: ${this.today.toLocaleDateString('ar-EG')}</div>
            </div>
          </div>
          
          <script>
            window.onload = function() { 
              setTimeout(function() { 
                window.print(); 
                setTimeout(function() { 
                  window.close(); 
                }, 500); 
              }, 300); 
            };
          <\/script>
        </body>
        </html>
      `);
      printWindow.document.close();
    }, 300);
  }
}