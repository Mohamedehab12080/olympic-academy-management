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
          <div>
            <h2>تفاصيل التسجيل</h2>
            <p>رقم التسجيل: #{{ enrollment?.id }}</p>
          </div>
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

      <!-- Content -->
      <div class="modal-body" *ngIf="!isLoading && enrollment">
        <!-- Profile -->
        <div class="profile-main">
          <div class="profile-image">
            <div class="avatar" *ngIf="!traineeImageUrl; else profileImage">
              <mat-icon>person</mat-icon>
            </div>
            <ng-template #profileImage>
              <img [src]="traineeImageUrl" [alt]="enrollment.trainee?.title">
            </ng-template>
          </div>

          <div class="profile-info">
            <h1>{{ enrollment.trainee?.title }}</h1>
            <div class="info-badges">
              <mat-chip [color]="enrollment.isActive ? 'primary' : 'warn'" selected>
                {{ enrollment.isActive ? 'نشط' : 'غير نشط' }}
              </mat-chip>
              <mat-chip>
                <mat-icon>badge</mat-icon>
                {{ enrollment.trainee?.id }}
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
        <mat-tab-group>
          <!-- Details Tab -->
          <mat-tab label="تفاصيل التسجيل">
            <div class="tab-content">
              <div class="info-grid">
                <div class="info-item">
                  <mat-icon>person</mat-icon>
                  <div>
                    <label>المتدرب</label>
                    <p>{{ enrollment.trainee?.title }}</p>
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
                  <div class="barcode-number">{{ enrollment.trainee?.id }}</div>
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
      </div>
      
      <mat-divider></mat-divider>
      
      <!-- Actions -->
      <div class="modal-actions">
        <button mat-raised-button color="accent" (click)="printCard()">
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
      min-width: 850px;
      max-width: 95vw;
      max-height: 85vh;
      width: auto;
      direction: rtl;
      background: #f5f7fa;
      border-radius: 24px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      border: 1px solid rgba(226, 232, 240, 0.4);
    }

    .modal-header {
      flex-shrink: 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 18px 24px;
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
      gap: 14px;
      z-index: 1;
    }

    .header-title mat-icon {
      font-size: 28px;
      width: 28px;
      height: 28px;
    }

    .header-title h2 {
      margin: 0;
      font-size: 20px;
      font-weight: 700;
    }

    .header-title p {
      margin: 2px 0 0;
      font-size: 12px;
      opacity: 0.8;
      font-weight: 300;
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

    .loading-area {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 80px;
      gap: 16px;
      flex: 1;
    }

    .loading-area mat-spinner {
      color: #0f3460 !important;
    }

    .loading-area p {
      color: #94a3b8;
      font-size: 14px;
      font-weight: 500;
    }

    .modal-body {
      flex: 1;
      overflow-y: auto;
      overflow-x: hidden;
      padding: 0;
      max-height: calc(85vh - 180px);
    }

    .modal-body::-webkit-scrollbar {
      width: 6px;
    }

    .modal-body::-webkit-scrollbar-track {
      background: #f1f5f9;
      border-radius: 10px;
    }

    .modal-body::-webkit-scrollbar-thumb {
      background: linear-gradient(135deg, #0f3460, #1a1a2e);
      border-radius: 10px;
    }

    .modal-body::-webkit-scrollbar-thumb:hover {
      background: linear-gradient(135deg, #1a1a2e, #0f3460);
    }

    .profile-main {
      display: flex;
      gap: 24px;
      padding: 20px 24px;
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
      font-size: 22px;
      color: #0f172a;
      font-weight: 700;
    }

    .info-badges {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    ::ng-deep .mat-mdc-chip {
      font-size: 12px !important;
      padding: 4px 14px !important;
      height: auto !important;
      min-height: 32px !important;
    }

    ::ng-deep .mat-mdc-chip .mat-icon {
      font-size: 16px !important;
      width: 16px !important;
      height: 16px !important;
      margin-left: 4px !important;
    }

    .status-badge-chip {
      --mdc-chip-container-color: #fef3c7 !important;
      color: #92400e !important;
    }

    .status-badge-chip.completed {
      --mdc-chip-container-color: #d1fae5 !important;
      color: #065f46 !important;
    }

    .status-badge-chip.cancelled {
      --mdc-chip-container-color: #fee2e2 !important;
      color: #991b1b !important;
    }

    .payment-badge-chip {
      --mdc-chip-container-color: #e0e7ff !important;
      color: #3730a3 !important;
    }

    .payment-badge-chip.paid {
      --mdc-chip-container-color: #d1fae5 !important;
      color: #065f46 !important;
    }

    .tab-content {
      padding: 20px 24px;
    }

    .info-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 12px;
    }

    .info-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 10px 14px;
      background: #f8fafc;
      border-radius: 12px;
      border: 1px solid rgba(226, 232, 240, 0.3);
      transition: all 0.2s;
      min-height: 60px;
    }

    .info-item:hover {
      border-color: rgba(15, 52, 96, 0.15);
      background: #f1f5f9;
    }

    .info-item mat-icon {
      color: #0f3460;
      font-size: 22px;
      width: 22px;
      height: 22px;
      flex-shrink: 0;
    }

    .info-item div {
      flex: 1;
      min-width: 0;
    }

    .info-item label {
      display: block;
      font-size: 10px;
      color: #64748b;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.3px;
    }

    .info-item p {
      margin: 2px 0 0;
      font-size: 14px;
      color: #0f172a;
      font-weight: 600;
      word-break: break-word;
    }

    .info-item .amount {
      color: #059669;
    }

    .info-item .remained {
      color: #d97706;
    }

    .info-item .paid {
      color: #059669;
    }

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
      flex-shrink: 0;
    }

    .note-container label {
      display: block;
      font-size: 10px;
      color: #92400e;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.3px;
    }

    .note-container p {
      margin: 2px 0 0;
      font-size: 13px;
      color: #78350f;
      word-break: break-word;
    }

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
      color: #0f172a;
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
      color: #64748b;
      margin-top: 12px;
      padding-top: 12px;
      border-top: 1px solid #e2e8f0;
    }

    .modal-actions {
      flex-shrink: 0;
      display: flex;
      gap: 12px;
      justify-content: flex-end;
      padding: 16px 24px;
      background: white;
      border-top: 2px solid #e2e8f0;
      flex-wrap: wrap;
      min-height: 76px;
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
      color: #64748b;
      font-weight: 500;
    }

    .modal-actions button.mat-button:hover {
      background: #f1f5f9;
    }

    @media (max-width: 1024px) {
      .info-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (max-width: 768px) {
      .modal-container {
        min-width: 90vw;
        max-width: 95vw;
        max-height: 85vh;
        width: 90vw;
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
        padding: 12px 16px;
      }

      .modal-actions button {
        min-width: 100px;
        flex: 1;
      }

      .modal-body {
        max-height: calc(85vh - 200px);
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
        (JsBarcode as any)(this.barcodeCanvas.nativeElement, this.enrollment.trainee?.id?.toString() || '000000', {
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
  }

  deleteEnrollment(): void {
    this.dialogRef.close({ action: 'delete', enrollment: this.enrollment });
  }

  printCard(): void {
    this.generateBarcode();
    setTimeout(() => {
      const barcodeImage = this.barcodeCanvas.nativeElement.toDataURL('image/png');
      const printWindow = window.open('', '_blank', 'width=400,height=600');
      if (!printWindow) {
        this.notification.showError('تعذر فتح نافذة الطباعة');
        return;
      }

      const e = this.enrollment;
      printWindow.document.write(`
        <!DOCTYPE html><html dir="rtl"><head><meta charset="UTF-8">
        <title>بطاقة تسجيل متدرب</title>
        <style>
          @page { size: 57mm auto; margin: 0mm; }
          body { font-family: 'Cairo', sans-serif; width: 57mm; margin: 0; padding: 2mm; background: white; }
          .thermal-card { width: 55mm; margin: 0 auto; direction: rtl; }
          .thermal-header { text-align: center; margin-bottom: 3mm; }
          .thermal-title { font-size: 14px; font-weight: bold; }
          .thermal-subtitle { font-size: 10px; color: #666; }
          .thermal-divider { border-top: 1px dashed #ccc; margin: 2mm 0; }
          .thermal-photo { text-align: center; margin-bottom: 2mm; }
          .thermal-photo img { width: 45px; height: 45px; border-radius: 50%; object-fit: cover; }
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
        </style>
        </head>
        <body>
        <div class="thermal-card">
          <div class="thermal-header"><div class="thermal-title">الأكاديمية الأولمبية</div><div class="thermal-subtitle">بطاقة تسجيل متدرب</div></div>
          <div class="thermal-photo"><img src="${this.traineeImageUrl || ''}" onerror="this.style.display='none'"></div>
          <div class="thermal-name">${e.trainee?.title || ''}</div>
          <div class="thermal-id">رقم التسجيل: ${e?.id || ''}</div>
          <div class="thermal-divider"></div>
          <table class="thermal-table">
            <tr><td class="thermal-label">📚 الدورة</td><td class="thermal-value">${(e.course?.title || '').substring(0, 25)}</td></tr>
            <tr><td class="thermal-label">👨‍🏫 المدرب</td><td class="thermal-value">${(e.trainer?.title || '').substring(0, 25)}</td></tr>
            <tr><td class="thermal-label">📅 التسجيل</td><td class="thermal-value">${new Date(e.startDate).toLocaleDateString('ar-EG')}</td></tr>
            ${e.endDate ? `<tr><td class="thermal-label">📅 الانتهاء</td><td class="thermal-value">${new Date(e.endDate).toLocaleDateString('ar-EG')}</td></tr>` : ''}
            <tr><td class="thermal-label">💰 القيمة</td><td class="thermal-value">${e.finalSubscriptionValue?.toLocaleString()} جم</td></tr>
            ${e.remainedSubscriptionValue ? `<tr><td class="thermal-label">💳 المتبقي</td><td class="thermal-value">${e.remainedSubscriptionValue?.toLocaleString()} جم</td></tr>` : ''}
            <tr><td class="thermal-label">✓ الحالة</td><td class="thermal-value">${e.enrollmentStatus?.title || ''}</td></tr>
            <tr><td class="thermal-label">💵 الدفع</td><td class="thermal-value">${e.paymentStatus?.title || ''}</td></tr>
          </table>
          <div class="thermal-divider"></div>
          <div class="thermal-barcode"><img src="${barcodeImage}"><div class="thermal-barcode-number">${e.trainee?.id || ''}</div></div>
          <div class="thermal-footer"><div class="thermal-signature"><div class="thermal-line"></div><div>توقيع المتدرب</div></div><div class="thermal-signature"><div class="thermal-line"></div><div>ختم الأكاديمية</div></div></div>
        </div>
        <script>window.onload = function() { setTimeout(function() { window.print(); setTimeout(function() { window.close(); }, 500); }, 300); };<\/script>
        </body></html>
      `);
      printWindow.document.close();
    }, 300);
  }
}