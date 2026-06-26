// trainee-details-modal.component.ts - UPDATED WITH ACADEMIC YEAR AS STRING

import { Component, Inject, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { TraineeVTO, TraineeCertificateVTO, TraineeContactVTO, HealthConditionVTO } from '../../../../core/models/trainee.model';
import { CommonEnrollmentVTO } from '../../../../core/models/common.model';
import { TraineeWizardModalComponent } from './../trainee-wizard/trainee-wizard-modal.component';
import { FileService } from '../../../../core/services/file.service';
import { NotificationService } from '../../../../core/services/notification.service';
import * as JsBarcode from 'jsbarcode';

// Helper mapping for enum names to display titles
const GENDER_MAP: { [key: string]: string } = {
  'MALE': 'ذكر',
  'FEMALE': 'أنثى'
};

const CONTACT_TYPE_MAP: { [key: string]: string } = {
  'EMAIL': 'بريد إلكتروني',
  'PHONE': 'جوال'
};

// Helper to get display title from enum name
function getDisplayTitle(enumName: string | undefined, map: { [key: string]: string }): string {
  if (!enumName) return '-';
  return map[enumName] || enumName;
}

@Component({
  selector: 'app-trainee-details-modal',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatChipsModule,
    MatTabsModule,
    MatTooltipModule,
    MatTableModule
  ],
  template: `
    <div class="modal-container" dir="rtl">
      <!-- Header -->
      <div class="modal-header">
        <div class="header-title">
          <mat-icon>person</mat-icon>
          <h2>ملف المتدرب</h2>
        </div>
        <div class="header-actions">
          <button mat-icon-button (click)="printProfileDocument()" matTooltip="طباعة الملف الكامل">
            <mat-icon>description</mat-icon>
          </button>
          <button mat-icon-button (click)="printTraineeCard()" matTooltip="طباعة البطاقة">
            <mat-icon>credit_card</mat-icon>
          </button>
          <button mat-icon-button mat-dialog-close class="close-btn">
            <mat-icon>close</mat-icon>
          </button>
        </div>
      </div>
      
      <mat-divider></mat-divider>
      
      <!-- Main Profile Info -->
      <div class="profile-main" *ngIf="trainee">
        <div class="profile-image">
          <div class="avatar" *ngIf="!imageUrl; else profileImage">
            <mat-icon>person</mat-icon>
          </div>
          <ng-template #profileImage>
            <img [src]="imageUrl" [alt]="trainee.fullName">
          </ng-template>
        </div>

        <div class="profile-info">
          <h1>{{ trainee.fullName }}</h1>
          <div class="info-badges">
            <mat-chip [color]="trainee.isActive ? 'primary' : 'warn'" selected>
              {{ trainee.isActive ? 'نشط' : 'غير نشط' }}
            </mat-chip>
            <mat-chip>
              <mat-icon>badge</mat-icon>
              {{ trainee.nationalId }}
            </mat-chip>
            <mat-chip *ngIf="trainee.academicYear">
              <mat-icon>school</mat-icon>
              السنة {{ trainee.academicYear }}
            </mat-chip>
            <mat-chip *ngIf="trainee.gender">
              <mat-icon>{{ getGenderDisplay(trainee.gender) === 'ذكر' ? 'male' : 'female' }}</mat-icon>
              {{ getGenderDisplay(trainee.gender) }}
            </mat-chip>
          </div>
        </div>
      </div>
      
      <mat-divider></mat-divider>
      
      <!-- Tabs -->
      <mat-tab-group class="custom-tabs">
        <!-- Personal Info Tab -->
        <mat-tab label="المعلومات الشخصية">
          <div class="tab-content" *ngIf="trainee">
            <div class="info-grid">
              <div class="info-item">
                <mat-icon>person</mat-icon>
                <div>
                  <label>الاسم الكامل</label>
                  <p>{{ trainee.fullName }}</p>
                </div>
              </div>

              <div class="info-item">
                <mat-icon>badge</mat-icon>
                <div>
                  <label>رقم الهوية</label>
                  <p>{{ trainee.nationalId }}</p>
                </div>
              </div>

              <div class="info-item">
                <mat-icon>cake</mat-icon>
                <div>
                  <label>تاريخ الميلاد</label>
                  <p>{{ (trainee.birthDate | date:'dd/MM/yyyy') || '-' }}</p>
                </div>
              </div>

              <div class="info-item">
                <mat-icon>{{ getGenderDisplay(trainee.gender) === 'ذكر' ? 'male' : 'female' }}</mat-icon>
                <div>
                  <label>الجنس</label>
                  <p>{{ getGenderDisplay(trainee.gender) }}</p>
                </div>
              </div>

              <div class="info-item">
                <mat-icon>school</mat-icon>
                <div>
                  <label>السنة الدراسية</label>
                  <p>{{ trainee.academicYear || '-' }}</p>
                </div>
              </div>

              <div class="info-item">
                <mat-icon>location_on</mat-icon>
                <div>
                  <label>العنوان</label>
                  <p>{{ trainee.address || '-' }}</p>
                </div>
              </div>

              <div class="info-item">
                <mat-icon>event</mat-icon>
                <div>
                  <label>تاريخ التسجيل</label>
                  <p>{{ trainee.createdOn | date:'dd/MM/yyyy' }}</p>
                </div>
              </div>

              <div class="info-item">
                <mat-icon>person_add</mat-icon>
                <div>
                  <label>تمت الإضافة بواسطة</label>
                  <p>{{ trainee.createdBy?.fullName || '-' }}</p>
                </div>
              </div>

              <div class="info-item" *ngIf="trainee.lastModifiedOn">
                <mat-icon>update</mat-icon>
                <div>
                  <label>آخر تحديث</label>
                  <p>{{ trainee.lastModifiedOn | date:'dd/MM/yyyy' }}</p>
                </div>
              </div>

              <div class="info-item" *ngIf="trainee.lastModifiedBy">
                <mat-icon>person</mat-icon>
                <div>
                  <label>تم التحديث بواسطة</label>
                  <p>{{ trainee.lastModifiedBy?.fullName || '-' }}</p>
                </div>
              </div>
            </div>
          </div>
        </mat-tab>

        <!-- Contacts Tab -->
        <mat-tab label="جهات الاتصال">
          <div class="tab-content">
            <div class="contacts-list" *ngIf="contacts.length > 0; else noContacts">
              <div class="contact-card" *ngFor="let contact of contacts">
                <mat-icon>{{ getContactIcon(contact.contactType) }}</mat-icon>
                <div class="contact-info">
                  <label>{{ getContactTypeDisplay(contact.contactType) }}</label>
                  <p>{{ contact.contactValue }}</p>
                </div>
              </div>
            </div>
            <ng-template #noContacts>
              <div class="empty-state">
                <mat-icon>contact_phone</mat-icon>
                <p>لا توجد جهات اتصال مسجلة</p>
              </div>
            </ng-template>
          </div>
        </mat-tab>

        <!-- Certificates Tab -->
        <mat-tab label="الشهادات">
          <div class="tab-content">
            <div class="certificates-list" *ngIf="certificates.length > 0; else noCertificates">
              <div class="certificate-card" *ngFor="let cert of certificates">
                <mat-icon>school</mat-icon>
                <div class="certificate-info">
                  <h4>{{ cert.certificateName }}</h4>
                  <p><strong>رقم الشهادة:</strong> {{ cert.certificateNumber || '-' }}</p>
                  <p><strong>الدورة:</strong> {{ cert.course?.title || '-' }}</p>
                  <p><strong>تاريخ الإصدار:</strong> {{ cert.issueDate | date:'dd/MM/yyyy' }}</p>
                  <p><strong>الدرجة:</strong> {{ cert.grade || '-' }}</p>
                </div>
              </div>
            </div>
            <ng-template #noCertificates>
              <div class="empty-state">
                <mat-icon>verified</mat-icon>
                <p>لا توجد شهادات مسجلة</p>
              </div>
            </ng-template>
          </div>
        </mat-tab>

        <!-- Health Conditions Tab -->
        <mat-tab label="الحالات الصحية">
          <div class="tab-content">
            <div class="health-list" *ngIf="healthConditions.length > 0; else noHealth">
              <div class="health-card" *ngFor="let condition of healthConditions">
                <mat-icon>health_and_safety</mat-icon>
                <div class="health-info">
                  <h4>{{ condition.title }}</h4>
                  <p *ngIf="condition.description"><strong>الوصف:</strong> {{ condition.description }}</p>
                  <p *ngIf="condition.medication"><strong>العلاج:</strong> {{ condition.medication }}</p>
                  <p *ngIf="condition.note"><strong>ملاحظات:</strong> {{ condition.note }}</p>
                </div>
              </div>
            </div>
            <ng-template #noHealth>
              <div class="empty-state">
                <mat-icon>favorite</mat-icon>
                <p>لا توجد حالات صحية مسجلة</p>
              </div>
            </ng-template>
          </div>
        </mat-tab>

        <!-- Enrollments Tab -->
        <mat-tab label="التسجيلات">
          <div class="tab-content">
            <div class="table-container" *ngIf="enrollments.length > 0; else noEnrollments">
              <table mat-table [dataSource]="enrollmentsDataSource" class="full-width-table">
                <!-- Course Column -->
                <ng-container matColumnDef="course">
                  <th mat-header-cell *matHeaderCellDef>الدورة</th>
                  <td mat-cell *matCellDef="let enrollment">{{ enrollment.course?.title }}</td>
                </ng-container>

                <!-- Trainer Column -->
                <ng-container matColumnDef="trainer">
                  <th mat-header-cell *matHeaderCellDef>المدرب</th>
                  <td mat-cell *matCellDef="let enrollment">{{ enrollment.trainer?.title }}</td>
                </ng-container>

                <!-- Start Date Column -->
                <ng-container matColumnDef="startDate">
                  <th mat-header-cell *matHeaderCellDef>تاريخ البداية</th>
                  <td mat-cell *matCellDef="let enrollment">{{ enrollment.startDate | date:'dd/MM/yyyy' }}</td>
                </ng-container>

                <!-- End Date Column -->
                <ng-container matColumnDef="endDate">
                  <th mat-header-cell *matHeaderCellDef>تاريخ الانتهاء</th>
                  <td mat-cell *matCellDef="let enrollment">{{ enrollment.endDate ? (enrollment.endDate | date:'dd/MM/yyyy') : '-' }}</td>
                </ng-container>

                <!-- Value Column -->
                <ng-container matColumnDef="value">
                  <th mat-header-cell *matHeaderCellDef>القيمة</th>
                  <td mat-cell *matCellDef="let enrollment">
                    {{ enrollment.finalSubscriptionValue | currency:'EGP' }}
                  </td>
                </ng-container>

                <!-- Remaining Column -->
                <ng-container matColumnDef="remaining">
                  <th mat-header-cell *matHeaderCellDef>المتبقي</th>
                  <td mat-cell *matCellDef="let enrollment">
                    <span [class.zero]="enrollment.remainedSubscriptionValue === 0">
                      {{ enrollment.remainedSubscriptionValue | currency:'EGP' }}
                    </span>
                  </td>
                </ng-container>

                <!-- Status Column -->
                <ng-container matColumnDef="enrollmentStatus">
                  <th mat-header-cell *matHeaderCellDef>حالة التسجيل</th>
                  <td mat-cell *matCellDef="let enrollment">
                    <span class="status-badge" 
                          [class.completed]="enrollment.enrollmentStatus?.id === 2"
                          [class.pending]="enrollment.enrollmentStatus?.id === 1"
                          [class.cancelled]="enrollment.enrollmentStatus?.id === 3">
                      {{ enrollment.enrollmentStatus?.title }}
                    </span>
                  </td>
                </ng-container>

                <!-- Payment Status Column -->
                <ng-container matColumnDef="paymentStatus">
                  <th mat-header-cell *matHeaderCellDef>حالة الدفع</th>
                  <td mat-cell *matCellDef="let enrollment">
                    <span class="payment-badge" 
                          [class.paid]="enrollment.paymentStatus?.id === 2"
                          [class.pending]="enrollment.paymentStatus?.id === 1">
                      {{ enrollment.paymentStatus?.title }}
                    </span>
                  </td>
                </ng-container>

                <tr mat-header-row *matHeaderRowDef="enrollmentsDisplayedColumns"></tr>
                <tr mat-row *matRowDef="let row; columns: enrollmentsDisplayedColumns;" class="enrollment-row"></tr>
              </table>
            </div>
            <ng-template #noEnrollments>
              <div class="empty-state">
                <mat-icon>school</mat-icon>
                <p>لا توجد تسجيلات لهذا المتدرب</p>
              </div>
            </ng-template>
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
              </div>
              <div class="barcode-info">
                <span>رقم الهوية: {{ trainee?.nationalId }}</span>
                <span>تاريخ الإصدار: {{ today | date:'dd/MM/yyyy' }}</span>
              </div>
            </div>
          </div>
        </mat-tab>
      </mat-tab-group>
      
      <mat-divider></mat-divider>
      
      <!-- Modal Actions -->
      <div class="modal-actions">
        <button mat-raised-button color="accent" (click)="printProfileDocument()" matTooltip="طباعة الملف الكامل">
          <mat-icon>description</mat-icon>
          طباعة الملف
        </button>
        <button mat-raised-button color="primary" (click)="printTraineeCard()" matTooltip="طباعة البطاقة">
          <mat-icon>credit_card</mat-icon>
          طباعة البطاقة
        </button>
        <button mat-raised-button color="primary" (click)="editTrainee()">
          <mat-icon>edit</mat-icon>
          تعديل
        </button>
        <button mat-raised-button color="warn" (click)="deleteTrainee()">
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
      min-width: 700px;
      max-width: 900px;
      max-height: 90vh;
      direction: rtl;
      background: #f5f7fa;
      border-radius: 24px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }

    /* Header */
    .modal-header {
      flex-shrink: 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 20px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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

    /* Profile Main */
    .profile-main {
      display: flex;
      gap: 24px;
      padding: 20px;
      background: white;
    }
    .profile-image {
      flex-shrink: 0;
    }
    .avatar {
      width: 100px;
      height: 100px;
      border-radius: 50%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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
      color: #1f2937;
    }
    .info-badges {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    /* Tabs */
    .custom-tabs {
      flex: 1;
      overflow-y: auto;
    }
    .tab-content {
      padding: 16px;
      max-height: 50vh;
      overflow-y: auto;
    }

    /* Info Grid */
    .info-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
    }
    .info-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 10px 12px;
      background: #f9fafb;
      border-radius: 10px;
    }
    .info-item mat-icon {
      color: #667eea;
      font-size: 22px;
      width: 22px;
      height: 22px;
    }
    .info-item div {
      flex: 1;
    }
    .info-item label {
      display: block;
      font-size: 10px;
      color: #6b7280;
      margin-bottom: 2px;
    }
    .info-item p {
      margin: 0;
      font-size: 13px;
      color: #1f2937;
      font-weight: 500;
    }

    /* Lists */
    .contacts-list,
    .certificates-list,
    .health-list {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
    }
    .contact-card,
    .certificate-card,
    .health-card {
      display: flex;
      gap: 12px;
      padding: 12px;
      background: #f9fafb;
      border-radius: 10px;
    }
    .contact-card mat-icon,
    .certificate-card mat-icon,
    .health-card mat-icon {
      color: #667eea;
      font-size: 28px;
      width: 28px;
      height: 28px;
    }
    .contact-info label,
    .certificate-info h4,
    .health-info h4 {
      margin: 0 0 6px 0;
      font-size: 14px;
      font-weight: 600;
      color: #1f2937;
    }
    .contact-info p,
    .certificate-info p,
    .health-info p {
      margin: 2px 0;
      font-size: 11px;
      color: #6b7280;
    }

    /* Enrollments Table */
    .table-container {
      overflow-x: auto;
    }
    .full-width-table {
      width: 100%;
    }
    .full-width-table th {
      background: #f8fafc;
      color: #1e293b;
      font-weight: 600;
      font-size: 12px;
      padding: 10px;
    }
    .full-width-table td {
      padding: 8px;
      font-size: 12px;
    }
    .enrollment-row {
      cursor: default;
    }
    .enrollment-row:hover {
      background: #f8fafc;
    }

    /* Status Badges */
    .status-badge {
      padding: 4px 10px;
      border-radius: 20px;
      font-size: 11px;
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
      padding: 4px 10px;
      border-radius: 20px;
      font-size: 11px;
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

    .zero {
      color: #10b981;
      font-weight: 600;
    }

    /* Empty State */
    .empty-state {
      text-align: center;
      padding: 40px;
      color: #9ca3af;
    }
    .empty-state mat-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      margin-bottom: 12px;
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
      color: #667eea;
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
      color: #667eea;
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
      }
      .info-grid {
        grid-template-columns: 1fr;
      }
      .contacts-list,
      .certificates-list,
      .health-list {
        grid-template-columns: 1fr;
      }
      .info-badges {
        justify-content: center;
      }
      .modal-actions {
        flex-wrap: wrap;
      }
      .barcode-card {
        padding: 20px;
      }
      .barcode-info {
        flex-direction: column;
        gap: 4px;
        text-align: center;
      }
    }
  `]
})
export class TraineeDetailsModalComponent implements OnInit, AfterViewInit, OnDestroy {
  trainee: TraineeVTO;
  contacts: TraineeContactVTO[] = [];
  certificates: TraineeCertificateVTO[] = [];
  healthConditions: HealthConditionVTO[] = [];
  enrollments: CommonEnrollmentVTO[] = [];
  imageUrl: string | null = null;
  private blobUrl: string | null = null;
  today = new Date();
  
  enrollmentsDataSource = new MatTableDataSource<CommonEnrollmentVTO>([]);
  enrollmentsDisplayedColumns: string[] = ['course', 'trainer', 'startDate', 'endDate', 'value', 'remaining', 'enrollmentStatus', 'paymentStatus'];

  @ViewChild('barcodeCanvas') barcodeCanvas!: ElementRef<HTMLCanvasElement>;

  constructor(
    private dialogRef: MatDialogRef<TraineeDetailsModalComponent>,
    @Inject(MAT_DIALOG_DATA) private data: TraineeVTO,
    private router: Router,
    private dialog: MatDialog,
    private fileService: FileService,
    private notification: NotificationService
  ) {
    this.trainee = data;
    this.contacts = data.contacts || [];
    this.certificates = data.certificates || [];
    this.healthConditions = data.healthConditions || [];
    this.enrollments = data.enrollments || [];
    this.enrollmentsDataSource.data = this.enrollments;
  }

  ngOnInit(): void {
    this.loadImage();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.generateBarcode();
    }, 300);
  }

  ngOnDestroy(): void {
    if (this.blobUrl) {
      URL.revokeObjectURL(this.blobUrl);
    }
  }

  // Helper methods to display enum values
  getGenderDisplay(gender: any): string {
    if (!gender) return '-';
    if (typeof gender === 'object' && gender.title) {
      return gender.title;
    }
    if (typeof gender === 'string') {
      return getDisplayTitle(gender, GENDER_MAP);
    }
    return '-';
  }

  getAcademicYearDisplay(academicYear: any): string {
    if (!academicYear) return '-';
    // If it's a string, return it directly
    if (typeof academicYear === 'string') {
      return academicYear;
    }
    // If it's an object with title, return the title
    if (typeof academicYear === 'object' && academicYear.title) {
      return academicYear.title;
    }
    return '-';
  }

  getContactTypeDisplay(contactType: any): string {
    if (!contactType) return 'جهة اتصال';
    if (typeof contactType === 'object' && contactType.title) {
      return contactType.title;
    }
    if (typeof contactType === 'string') {
      return getDisplayTitle(contactType, CONTACT_TYPE_MAP);
    }
    return 'جهة اتصال';
  }

  loadImage(): void {
    const fid = this.trainee.imageUrl;
    if (fid && /^\d{15}(\d{3})?$/.test(fid)) {
      this.fileService.downloadFile(fid).subscribe({
        next: (blob) => {
          if (this.blobUrl) {
            URL.revokeObjectURL(this.blobUrl);
          }
          this.blobUrl = URL.createObjectURL(blob);
          this.imageUrl = this.blobUrl;
        },
        error: (error) => {
          console.error('Failed to load image:', error);
          this.imageUrl = null;
        }
      });
    } else if (fid) {
      this.imageUrl = fid;
    } else {
      this.imageUrl = null;
    }
  }

  generateBarcode(): void {
    if (this.barcodeCanvas?.nativeElement) {
      try {
        (JsBarcode as any)(this.barcodeCanvas.nativeElement, this.trainee?.nationalId?.toString() || '000000', {
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

  getContactIcon(contactType: any): string {
    const type = typeof contactType === 'string' ? contactType : contactType?.title || '';
    const icons: { [key: string]: string } = {
      'جوال': 'phone_android',
      'هاتف': 'phone',
      'بريد إلكتروني': 'email',
      'EMAIL': 'email',
      'PHONE': 'phone_android',
      'واتساب': 'chat',
      'فيسبوك': 'facebook',
      'تويتر': 'twitter',
      'انستجرام': 'instagram'
    };
    return icons[type] || 'contact_phone';
  }

  editTrainee(): void {
    this.dialogRef.close();
    const wizardDialogRef = this.dialog.open(TraineeWizardModalComponent, {
      data: { traineeId: this.trainee.id },
      width: '900px',
      maxWidth: '90vw'
    });
    
    wizardDialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Parent will handle refresh
      }
    });
  }

  deleteTrainee(): void {
    this.dialogRef.close({ action: 'delete', trainee: this.trainee });
  }

  /**
   * Print the small thermal card (بطاقة) - Fixed version
   */
  printTraineeCard(): void {
    // Generate barcode first
    this.generateBarcode();
    
    setTimeout(() => {
      // Get barcode as data URL
      let barcodeImage = '';
      try {
        barcodeImage = this.barcodeCanvas?.nativeElement?.toDataURL('image/png') || '';
      } catch (e) {
        console.error('Error generating barcode image:', e);
        barcodeImage = '';
      }
      
      const printWindow = window.open('', '_blank', 'width=350,height=500');
      if (!printWindow) {
        this.notification.showError('تعذر فتح نافذة الطباعة');
        return;
      }

      const t = this.trainee;
      const imagePreviewUrl = this.imageUrl || '';
      const today = new Date().toLocaleDateString('ar-EG');
      const genderDisplay = this.getGenderDisplay(t.gender);
      const academicYearDisplay = this.getAcademicYearDisplay(t.academicYear);

      // Create a placeholder for the watermark using SVG or base64
      const watermarkSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120">
        <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="24" font-weight="900" fill="#667eea" opacity="0.15" transform="rotate(-25, 60, 60)">الأكاديمية</text>
        <text x="50%" y="55%" dominant-baseline="middle" text-anchor="middle" font-size="20" font-weight="900" fill="#667eea" opacity="0.12" transform="rotate(-25, 60, 60)">الأولمبية</text>
      </svg>`;
      
      const watermarkDataUrl = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(watermarkSvg);

      printWindow.document.write(`
        <!DOCTYPE html>
        <html dir="rtl">
        <head>
          <meta charset="UTF-8">
          <title>بطاقة هوية متدرب</title>
          <style>
            @page { 
              size: 58mm auto; 
              margin: 0mm; 
            }
            
            * { 
              font-family: 'Cairo', 'Segoe UI', Tahoma, sans-serif; 
              box-sizing: border-box;
              margin: 0;
              padding: 0;
            }
            
            body { 
              width: 58mm; 
              margin: 0; 
              padding: 0; 
              background: white;
              display: flex;
              justify-content: center;
              align-items: center;
              min-height: 100vh;
            }
            
            .thermal-card {
              width: 100%;
              max-width: 56mm;
              margin: 0;
              padding: 2mm 2.5mm 3mm 2.5mm;
              background: white;
              position: relative;
              overflow: hidden;
              direction: rtl;
              border: 0.5px solid #e5e7eb;
              border-radius: 4px;
            }
            
            /* ===== WATERMARK - Behind content ===== */
            .card-watermark {
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%) rotate(-25deg) scale(1.8);
              opacity: 0.08;
              pointer-events: none;
              z-index: 0;
              display: flex;
              align-items: center;
              justify-content: center;
              width: 100%;
              height: 100%;
            }
            
            .card-watermark img {
              width: 100px;
              height: auto;
              opacity: 0.7;
            }
            
            .card-watermark-text {
              position: absolute;
              top: 56%;
              left: 50%;
              transform: translate(-50%, -50%) rotate(-25deg) scale(1);
              font-size: 18px;
              font-weight: 900;
              color: #667eea;
              letter-spacing: 4px;
              text-transform: uppercase;
              white-space: nowrap;
              opacity: 0.05;
              pointer-events: none;
              z-index: 0;
            }
            
            /* ===== CONTENT - Above watermark ===== */
            .card-content {
              position: relative;
              z-index: 1;
              width: 100%;
            }
            
            .thermal-header { 
              text-align: center; 
              margin-bottom: 0.8mm; 
              padding-bottom: 0.8mm;
              border-bottom: 2px solid #667eea;
            }
            .thermal-title { 
              font-size: 11px; 
              font-weight: 700; 
              color: #1a1a2e;
              letter-spacing: 1px;
            }
            .thermal-subtitle { 
              font-size: 7px; 
              color: #667eea; 
              font-weight: 600;
            }
            
            .thermal-divider { 
              border-top: 1px dashed #d1d5db; 
              margin: 0.6mm 0; 
            }
            
            .thermal-photo { 
              text-align: center; 
              margin-bottom: 0.6mm; 
            }
            .thermal-photo img { 
              width: 30px; 
              height: 30px; 
              border-radius: 50%; 
              object-fit: cover;
              border: 1.5px solid #667eea;
            }
            .thermal-photo .placeholder-photo {
              width: 30px;
              height: 30px;
              border-radius: 50%;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              display: inline-flex;
              align-items: center;
              justify-content: center;
              font-size: 14px;
              color: white;
              border: 1.5px solid #667eea;
            }
            
            .thermal-name { 
              font-size: 10px; 
              font-weight: 700; 
              text-align: center; 
              margin-bottom: 0.2mm; 
              color: #1a1a2e;
              line-height: 1.2;
            }
            .thermal-id { 
              font-size: 7px; 
              color: #6b7280; 
              text-align: center; 
              margin-bottom: 0.6mm; 
              font-weight: 500;
            }
            
            .thermal-table { 
              width: 100%; 
              font-size: 6.5px; 
              margin-bottom: 0.6mm; 
              border-collapse: collapse; 
            }
            .thermal-table tr { 
              line-height: 1.3; 
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
            .thermal-value.status-active { 
              color: #10b981; 
            }
            .thermal-value.status-inactive { 
              color: #ef4444; 
            }
            
            .thermal-barcode { 
              text-align: center; 
              margin: 0.6mm 0; 
            }
            .thermal-barcode img { 
              width: 100%; 
              max-width: 130px; 
              height: auto;
            }
            .thermal-barcode-number { 
              font-size: 6.5px; 
              font-family: monospace; 
              text-align: center; 
              margin-top: 0.2mm; 
              color: #667eea;
              font-weight: 600;
              letter-spacing: 1px;
            }
            
            .thermal-footer { 
              display: flex; 
              justify-content: space-between; 
              gap: 1.5mm; 
              margin-top: 0.8mm; 
              padding-top: 0.8mm;
              border-top: 2px solid #667eea;
            }
            .thermal-signature { 
              flex: 1; 
              text-align: center; 
              font-size: 4.5px; 
              color: #9ca3af;
            }
            .thermal-line { 
              border-top: 0.5px solid #9ca3af; 
              margin-bottom: 0.2mm; 
              padding-top: 2.5mm; 
            }
            
            .thermal-issue-date {
              text-align: center;
              font-size: 5px;
              color: #9ca3af;
              margin-top: 0.4mm;
              padding-top: 0.3mm;
              border-top: 1px dashed #e5e7eb;
            }
            
            @media print {
              body { 
                margin: 0; 
                padding: 0; 
                background: white; 
                display: flex;
                justify-content: center;
                align-items: center;
              }
              .thermal-card {
                padding: 1.5mm 2mm 2mm 2mm;
                border: none !important;
                box-shadow: none !important;
              }
              .card-watermark {
                opacity: 0.10 !important;
                transform: translate(-50%, -50%) rotate(-25deg) scale(2) !important;
              }
              .card-watermark img {
                width: 120px !important;
              }
              .card-watermark-text {
                font-size: 20px !important;
                opacity: 0.06 !important;
              }
              .no-print { 
                display: none !important; 
              }
            }
          </style>
        </head>
        <body>
          <div class="thermal-card">
            <!-- Watermark -->
            <div class="card-watermark">
              <img src="assets/images/simpleLogo.jpeg" alt="الأكاديمية الأولمبية" onerror="this.style.display='none'">
            </div>
            <div class="card-watermark-text">الأكاديمية الأولمبية</div>
            
            <!-- Content -->
            <div class="card-content">
              <div class="thermal-header">
                <div class="thermal-title">🏛️ الأكاديمية الأولمبية</div>
                <div class="thermal-subtitle">بطاقة هوية متدرب</div>
              </div>
              
              <div class="thermal-photo">
                ${imagePreviewUrl ? `<img src="${imagePreviewUrl}" alt="${this.escapeHtml(t.fullName)}" onerror="this.style.display='none'">` : '<div class="placeholder-photo">📷</div>'}
              </div>
              
              <div class="thermal-name">${this.escapeHtml(t.fullName) || ''}</div>
              <div class="thermal-id">🆔 ${t.nationalId || ''}</div>
              
              <div class="thermal-divider"></div>
              
              <table class="thermal-table">
                <tr>
                  <td class="thermal-label">📅 الميلاد</td>
                  <td class="thermal-value">${t.birthDate ? new Date(t.birthDate).toLocaleDateString('ar-EG') : '-'}</td>
                </tr>
                <tr>
                  <td class="thermal-label">🧑 الجنس</td>
                  <td class="thermal-value">${genderDisplay}</td>
                </tr>
                <tr>
                  <td class="thermal-label">📚 السنة</td>
                  <td class="thermal-value">${academicYearDisplay}</td>
                </tr>
                <tr>
                  <td class="thermal-label">📍 العنوان</td>
                  <td class="thermal-value" style="font-size:5.5px;">${(t.address || '').substring(0, 25)}</td>
                </tr>
                <tr>
                  <td class="thermal-label">✓ الحالة</td>
                  <td class="thermal-value ${t.isActive ? 'status-active' : 'status-inactive'}">${t.isActive ? '✅ نشط' : '⛔ غير نشط'}</td>
                </tr>
              </table>
              
              <div class="thermal-divider"></div>
              
              <div class="thermal-barcode">
                <img src="${barcodeImage}" alt="Barcode" onerror="this.style.display='none'">
                <div class="thermal-barcode-number">${t.nationalId || ''}</div>
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
              
              <div class="thermal-issue-date">📅 تاريخ الإصدار: ${today}</div>
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
    }, 400);
  }

  /**
   * Print the complete profile document (ملف) with all sections
   */
  printProfileDocument(): void {
    this.generateBarcode();
    setTimeout(() => {
      const barcodeImage = this.barcodeCanvas?.nativeElement?.toDataURL('image/png') || '';
      const printWindow = window.open('', '_blank', 'width=800,height=800,scrollbars=yes');
      if (!printWindow) {
        this.notification.showError('تعذر فتح نافذة الطباعة');
        return;
      }

      const t = this.trainee;
      const imagePreviewUrl = this.imageUrl || '';
      const today = new Date().toLocaleDateString('ar-EG');
      const genderDisplay = this.getGenderDisplay(t.gender);
      const academicYearDisplay = this.getAcademicYearDisplay(t.academicYear);

      // Build contacts HTML
      let contactsHtml = '';
      if (this.contacts.length > 0) {
        contactsHtml = `
          <h2>📞 جهات الاتصال</h2>
          <div class="info-grid">
            ${this.contacts.map(c => `
              <div class="info-item">
                <div class="info-label">${this.getContactTypeDisplay(c.contactType)}</div>
                <div class="info-value">${c.contactValue}</div>
              </div>
            `).join('')}
          </div>
        `;
      } else {
        contactsHtml = `
          <h2>📞 جهات الاتصال</h2>
          <div class="info-item full-width" style="text-align: center; color: #9ca3af;">لا توجد جهات اتصال مسجلة</div>
        `;
      }

      // Build certificates HTML
      let certificatesHtml = '';
      if (this.certificates.length > 0) {
        certificatesHtml = `
          <h2>🎓 الشهادات</h2>
          <div class="info-grid">
            ${this.certificates.map(c => `
              <div class="info-item">
                <div class="info-label">${c.certificateName}</div>
                <div class="info-value">
                  رقم: ${c.certificateNumber || '-'}<br>
                  الدورة: ${c.course?.title || '-'}<br>
                  تاريخ الإصدار: ${c.issueDate ? new Date(c.issueDate).toLocaleDateString('ar-EG') : '-'}<br>
                  الدرجة: ${c.grade || '-'}
                </div>
              </div>
            `).join('')}
          </div>
        `;
      } else {
        certificatesHtml = `
          <h2>🎓 الشهادات</h2>
          <div class="info-item full-width" style="text-align: center; color: #9ca3af;">لا توجد شهادات مسجلة</div>
        `;
      }

      // Build health conditions HTML
      let healthHtml = '';
      if (this.healthConditions.length > 0) {
        healthHtml = `
          <h2>🏥 الحالات الصحية</h2>
          <div class="info-grid">
            ${this.healthConditions.map(h => `
              <div class="info-item">
                <div class="info-label">${h.title}</div>
                <div class="info-value">
                  ${h.description ? `الوصف: ${h.description}` : ''}
                  ${h.medication ? `<br>العلاج: ${h.medication}` : ''}
                  ${h.note ? `<br>ملاحظات: ${h.note}` : ''}
                </div>
              </div>
            `).join('')}
          </div>
        `;
      } else {
        healthHtml = `
          <h2>🏥 الحالات الصحية</h2>
          <div class="info-item full-width" style="text-align: center; color: #9ca3af;">لا توجد حالات صحية مسجلة</div>
        `;
      }

      // Build enrollments HTML
      let enrollmentsHtml = '';
      if (this.enrollments.length > 0) {
        enrollmentsHtml = `
          <h2>📋 التسجيلات</h2>
          <table class="data-table">
            <thead>
              <tr>
                <th>الدورة</th>
                <th>المدرب</th>
                <th>تاريخ البداية</th>
                <th>تاريخ الانتهاء</th>
                <th>القيمة</th>
                <th>المتبقي</th>
                <th>حالة التسجيل</th>
                <th>حالة الدفع</th>
              </tr>
            </thead>
            <tbody>
              ${this.enrollments.map(e => `
                <tr>
                  <td>${e.course?.title || '-'}</td>
                  <td>${e.trainer?.title || '-'}</td>
                  <td>${e.startDate ? new Date(e.startDate).toLocaleDateString('ar-EG') : '-'}</td>
                  <td>${e.endDate ? new Date(e.endDate).toLocaleDateString('ar-EG') : '-'}</td>
                  <td>${e.finalSubscriptionValue?.toLocaleString('ar-EG') || '0'} جم</td>
                  <td>${e.remainedSubscriptionValue?.toLocaleString('ar-EG') || '0'} جم</td>
                  <td>${e.enrollmentStatus?.title || '-'}</td>
                  <td>${e.paymentStatus?.title || '-'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        `;
      } else {
        enrollmentsHtml = `
          <h2>📋 التسجيلات</h2>
          <div class="info-item full-width" style="text-align: center; color: #9ca3af;">لا توجد تسجيلات لهذا المتدرب</div>
        `;
      }

      printWindow.document.write(`
        <!DOCTYPE html>
        <html dir="rtl">
        <head>
          <meta charset="UTF-8">
          <title>ملف متدرب - ${this.escapeHtml(t.fullName)}</title>
          <style>
            * { font-family: 'Cairo', 'Segoe UI', Tahoma, sans-serif; }
            @media print { 
              body { margin: 0; padding: 20px; } 
              .no-print { display: none; } 
            }
            body { 
              max-width: 800px; 
              margin: 0 auto; 
              padding: 20px; 
              background: white; 
              direction: rtl;
            }
            .profile-container { background: white; }
            .header {
              text-align: center;
              margin-bottom: 20px;
              padding: 20px;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              border-radius: 12px;
            }
            .header h1 { margin: 0; font-size: 24px; }
            .header p { margin: 10px 0 0 0; font-size: 12px; opacity: 0.9; }
            .profile-details {
              display: flex;
              justify-content: space-between;
              margin-bottom: 20px;
              padding: 10px;
              background: #f9fafb;
              border-radius: 8px;
              font-size: 13px;
            }
            .photo-section { 
              text-align: center; 
              margin-bottom: 20px;
            }
            .photo-section img {
              width: 120px;
              height: 120px;
              border-radius: 50%;
              object-fit: cover;
              border: 3px solid #667eea;
            }
            .photo-section .placeholder {
              width: 120px;
              height: 120px;
              border-radius: 50%;
              background: #f3f4f6;
              display: flex;
              align-items: center;
              justify-content: center;
              margin: 0 auto;
              border: 3px solid #667eea;
              font-size: 48px;
            }
            h2 {
              color: #667eea;
              border-bottom: 2px solid #667eea;
              padding-bottom: 8px;
              margin-top: 24px;
              margin-bottom: 16px;
              font-size: 18px;
            }
            .info-grid {
              display: grid;
              grid-template-columns: repeat(2, 1fr);
              gap: 12px;
              margin-bottom: 16px;
            }
            .info-item {
              padding: 8px 12px;
              background: #f9fafb;
              border-radius: 8px;
              border-bottom: 1px solid #e5e7eb;
            }
            .info-item.full-width {
              grid-column: span 2;
            }
            .info-label { 
              font-weight: 600; 
              color: #374151; 
              font-size: 11px; 
              margin-bottom: 2px;
            }
            .info-value { 
              color: #1f2937; 
              font-size: 13px; 
              font-weight: 500;
            }
            .data-table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 16px;
              font-size: 12px;
            }
            .data-table th {
              background: #f8fafc;
              color: #1e293b;
              font-weight: 600;
              padding: 8px;
              border: 1px solid #e2e8f0;
              text-align: center;
            }
            .data-table td {
              padding: 6px 8px;
              border: 1px solid #e2e8f0;
              text-align: center;
            }
            .barcode-section {
              text-align: center;
              margin: 20px 0;
              padding: 16px;
              background: #f9fafb;
              border-radius: 8px;
            }
            .barcode-section img {
              max-width: 300px;
            }
            .barcode-number {
              font-size: 14px;
              font-weight: 600;
              color: #667eea;
              font-family: monospace;
              margin-top: 4px;
              letter-spacing: 1px;
            }
            .signature-section {
              margin-top: 40px;
              display: flex;
              justify-content: space-between;
              gap: 20px;
              padding-top: 20px;
              border-top: 1px solid #e5e7eb;
            }
            .signature-box { text-align: center; flex: 1; }
            .signature-line {
              width: 100%;
              border-top: 1px solid #000;
              margin-top: 40px;
              padding-top: 8px;
            }
            .footer {
              text-align: center;
              margin-top: 30px;
              padding: 16px;
              font-size: 10px;
              color: #9ca3af;
            }
            .watermark {
              position: fixed;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              opacity: 0.05;
              font-size: 80px;
              white-space: nowrap;
              pointer-events: none;
            }
            @media print { .watermark { display: none; } }
            @media (max-width: 600px) { 
              .info-grid { grid-template-columns: 1fr; }
              .info-item.full-width { grid-column: span 1; }
              .signature-section { flex-direction: column; align-items: center; gap: 30px; }
            }
          </style>
        </head>
        <body>
          <div class="watermark">الأكاديمية الأولمبية</div>
          <div class="profile-container">
            <div class="header">
              <h1>ملف المتدرب</h1>
              <p>نظام إدارة الأكاديمية الأولمبية</p>
            </div>
            
            <div class="profile-details">
              <div><strong>رقم الملف:</strong> #${t.id}</div>
              <div><strong>تاريخ الطباعة:</strong> ${today}</div>
            </div>

            <div class="photo-section">
              ${imagePreviewUrl ? `<img src="${imagePreviewUrl}" alt="${t.fullName}">` : '<div class="placeholder">📷</div>'}
              <h2 style="border-bottom: none; margin-top: 8px;">${t.fullName}</h2>
              <div style="display: flex; gap: 8px; justify-content: center; flex-wrap: wrap;">
                <span style="padding: 4px 12px; background: #d1fae5; color: #065f46; border-radius: 20px; font-size: 12px; font-weight: 600;">${t.isActive ? 'نشط' : 'غير نشط'}</span>
                <span style="padding: 4px 12px; background: #dbeafe; color: #1e40af; border-radius: 20px; font-size: 12px; font-weight: 600;">${t.nationalId}</span>
                <span style="padding: 4px 12px; background: #fef3c7; color: #92400e; border-radius: 20px; font-size: 12px; font-weight: 600;">${genderDisplay}</span>
                ${t.academicYear ? `<span style="padding: 4px 12px; background: #f3e8ff; color: #6b21a8; border-radius: 20px; font-size: 12px; font-weight: 600;">السنة ${academicYearDisplay}</span>` : ''}
              </div>
            </div>

            <h2>📋 المعلومات الشخصية</h2>
            <div class="info-grid">
              <div class="info-item"><div class="info-label">الاسم الكامل</div><div class="info-value">${t.fullName || '-'}</div></div>
              <div class="info-item"><div class="info-label">رقم الهوية</div><div class="info-value">${t.nationalId || '-'}</div></div>
              <div class="info-item"><div class="info-label">تاريخ الميلاد</div><div class="info-value">${t.birthDate ? new Date(t.birthDate).toLocaleDateString('ar-EG') : '-'}</div></div>
              <div class="info-item"><div class="info-label">الجنس</div><div class="info-value">${genderDisplay}</div></div>
              <div class="info-item"><div class="info-label">السنة الدراسية</div><div class="info-value">${academicYearDisplay}</div></div>
              <div class="info-item"><div class="info-label">العنوان</div><div class="info-value">${t.address || '-'}</div></div>
              <div class="info-item"><div class="info-label">تاريخ التسجيل</div><div class="info-value">${t.createdOn ? new Date(t.createdOn).toLocaleDateString('ar-EG') : '-'}</div></div>
              <div class="info-item"><div class="info-label">تمت الإضافة بواسطة</div><div class="info-value">${t.createdBy?.fullName || '-'}</div></div>
              ${t.lastModifiedOn ? `<div class="info-item"><div class="info-label">آخر تحديث</div><div class="info-value">${new Date(t.lastModifiedOn).toLocaleDateString('ar-EG')}</div></div>` : ''}
              ${t.lastModifiedBy ? `<div class="info-item"><div class="info-label">تم التحديث بواسطة</div><div class="info-value">${t.lastModifiedBy?.fullName || '-'}</div></div>` : ''}
            </div>

            ${contactsHtml}
            ${certificatesHtml}
            ${healthHtml}
            ${enrollmentsHtml}

            <!-- Barcode Section -->
            <h2>📱 الباركود</h2>
            <div class="barcode-section">
              <img src="${barcodeImage}" alt="Barcode">
            </div>

            <div class="signature-section">
              <div class="signature-box"><div class="signature-line"></div><div>توقيع المتدرب</div></div>
              <div class="signature-box"><div class="signature-line"></div><div>توقيع ولي الأمر</div></div>
              <div class="signature-box"><div class="signature-line"></div><div>ختم الأكاديمية</div></div>
            </div>

            <div class="footer">تم التصدير من نظام إدارة الأكاديمية الأولمبية</div>
          </div>
          <div class="no-print" style="text-align: center; margin-top: 20px;">
            <button onclick="window.print();" style="padding: 10px 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; border-radius: 5px; cursor: pointer;">🖨️ طباعة / حفظ كـ PDF</button>
          </div>
        </body>
        </html>
      `);
      printWindow.document.close();
    }, 300);
  }

  private escapeHtml(str: string | null | undefined): string {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }
}