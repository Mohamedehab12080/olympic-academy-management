// trainee-details-modal.component.ts

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
import * as JsBarcode from 'jsbarcode';

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
          <button mat-icon-button (click)="printTraineeDocument()" matTooltip="طباعة الملف">
            <mat-icon>print</mat-icon>
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
              <mat-icon>{{ trainee.gender?.title === 'ذكر' ? 'male' : 'female' }}</mat-icon>
              {{ trainee.gender?.title }}
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
                <mat-icon>{{ trainee.gender?.title === 'ذكر' ? 'male' : 'female' }}</mat-icon>
                <div>
                  <label>الجنس</label>
                  <p>{{ trainee.gender?.title || '-' }}</p>
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
                <mat-icon>{{ getContactIcon(contact.contactType?.title || '') }}</mat-icon>
                <div class="contact-info">
                  <label>{{ contact.contactType?.title || 'جهة اتصال' }}</label>
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
                <div class="barcode-number">{{ trainee?.nationalId }}</div>
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
        <button mat-raised-button color="accent" (click)="printTraineeDocument()" matTooltip="طباعة الملف">
          <mat-icon>print</mat-icon>
          طباعة
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
    private fileService: FileService
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

  getContactIcon(contactType: string): string {
    const icons: { [key: string]: string } = {
      'جوال': 'phone_android',
      'هاتف': 'phone',
      'بريد إلكتروني': 'email',
      'واتساب': 'chat',
      'فيسبوك': 'facebook',
      'تويتر': 'twitter',
      'انستجرام': 'instagram'
    };
    return icons[contactType] || 'contact_phone';
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

  printTraineeDocument(): void {
    this.generateBarcode();
    setTimeout(() => {
      const barcodeImage = this.barcodeCanvas?.nativeElement?.toDataURL('image/png') || '';
      const printWindow = window.open('', '_blank', 'width=400,height=600');
      if (!printWindow) {
        alert('تعذر فتح نافذة الطباعة');
        return;
      }

      const t = this.trainee;
      const imagePreviewUrl = this.imageUrl || '';
      const today = new Date().toLocaleDateString('ar-EG');

      printWindow.document.write(`
        <!DOCTYPE html><html dir="rtl"><head><meta charset="UTF-8">
        <title>بطاقة هوية متدرب</title>
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
          <div class="thermal-header"><div class="thermal-title">الأكاديمية الأولمبية</div><div class="thermal-subtitle">بطاقة هوية متدرب</div></div>
          <div class="thermal-photo"><img src="${imagePreviewUrl}" onerror="this.style.display='none'"></div>
          <div class="thermal-name">${t.fullName || ''}</div>
          <div class="thermal-id">رقم الهوية: ${t.nationalId || ''}</div>
          <div class="thermal-divider"></div>
          <table class="thermal-table">
            <tr><td class="thermal-label">📅 تاريخ الميلاد</td><td class="thermal-value">${t.birthDate ? new Date(t.birthDate).toLocaleDateString('ar-EG') : '-'}</td></tr>
            <tr><td class="thermal-label">🧑 الجنس</td><td class="thermal-value">${t.gender?.title || '-'}</td></tr>
            <tr><td class="thermal-label">📚 السنة الدراسية</td><td class="thermal-value">${t.academicYear || '-'}</td></tr>
            <tr><td class="thermal-label">📍 العنوان</td><td class="thermal-value">${(t.address || '').substring(0, 25)}</td></tr>
            <tr><td class="thermal-label">✓ الحالة</td><td class="thermal-value">${t.isActive ? 'نشط' : 'غير نشط'}</td></tr>
          </table>
          <div class="thermal-divider"></div>
          <div class="thermal-barcode"><img src="${barcodeImage}"><div class="thermal-barcode-number">${t.nationalId || ''}</div></div>
          <div class="thermal-footer"><div class="thermal-signature"><div class="thermal-line"></div><div>توقيع المتدرب</div></div><div class="thermal-signature"><div class="thermal-line"></div><div>ختم الأكاديمية</div></div></div>
        </div>
        <script>window.onload = function() { setTimeout(function() { window.print(); setTimeout(function() { window.close(); }, 500); }, 300); };<\/script>
        </body></html>
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