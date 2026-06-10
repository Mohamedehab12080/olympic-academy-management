import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { TraineeVTO, TraineeCertificateVTO, TraineeContactVTO, HealthConditionVTO } from '../../../../core/models/trainee.model';
import { TraineeWizardModalComponent } from './../trainee-wizard/trainee-wizard-modal.component';

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
    MatTooltipModule
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
          <div class="avatar" *ngIf="!trainee.imageUrl; else profileImage">
            <mat-icon>person</mat-icon>
          </div>
          <ng-template #profileImage>
            <img [src]="trainee.imageUrl" [alt]="trainee.fullName">
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
    }
  `]
})
export class TraineeDetailsModalComponent {
  trainee: TraineeVTO;
  contacts: TraineeContactVTO[] = [];
  certificates: TraineeCertificateVTO[] = [];
  healthConditions: HealthConditionVTO[] = [];

  constructor(
    private dialogRef: MatDialogRef<TraineeDetailsModalComponent>,
    @Inject(MAT_DIALOG_DATA) private data: TraineeVTO,
    private router: Router,
    private dialog: MatDialog
  ) {
    this.trainee = data;
    this.contacts = data.contacts || [];
    this.certificates = data.certificates || [];
    this.healthConditions = data.healthConditions || [];
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
    // Close the current modal first
    this.dialogRef.close();
    
    // Open the wizard modal for editing
    const wizardDialogRef = this.dialog.open(TraineeWizardModalComponent, {
      data: { traineeId: this.trainee.id },
      width: '900px',
      maxWidth: '90vw'
    });
    
    // Reload data when wizard closes
    wizardDialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Refresh the details modal content - this will require re-opening or notifying parent
        // The parent list component will handle the refresh when the modal closes
      }
    });
  }

  deleteTrainee(): void {
    this.dialogRef.close({ action: 'delete', trainee: this.trainee });
  }

  printTraineeDocument(): void {
    this.generatePrintDocument(this.trainee);
  }

  generatePrintDocument(trainee: TraineeVTO): void {
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
        <title>ملف متدرب - ${trainee.fullName}</title>
        <style>
          * { font-family: 'Cairo', 'Segoe UI', Tahoma, sans-serif; }
          @media print { 
            body { margin: 0; padding: 20px; } 
            .no-print { display: none; }
            .signature-line { border-top: 1px solid #000 !important; }
          }
          .profile-container { max-width: 800px; margin: 0 auto; background: white; }
          .header { text-align: center; margin-bottom: 30px; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border-radius: 12px; }
          .header h1 { margin: 0; font-size: 24px; }
          .header p { margin: 10px 0 0 0; font-size: 12px; opacity: 0.9; }
          .profile-details { display: flex; justify-content: space-between; margin-bottom: 20px; padding: 10px; background: #f9fafb; border-radius: 8px; }
          .photo-section { text-align: center; margin-bottom: 20px; }
          .trainee-photo { width: 120px; height: 120px; border-radius: 50%; object-fit: cover; border: 3px solid #667eea; }
          .placeholder-photo { width: 120px; height: 120px; border-radius: 50%; background: #f3f4f6; display: flex; align-items: center; justify-content: center; margin: 0 auto; border: 3px solid #667eea; font-size: 48px; }
          h2 { color: #667eea; border-bottom: 2px solid #667eea; padding-bottom: 8px; margin-top: 24px; margin-bottom: 16px; font-size: 18px; }
          .info-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; margin-bottom: 16px; }
          .info-item { border-bottom: 1px solid #e5e7eb; padding: 8px 0; }
          .info-label { font-weight: 600; color: #374151; font-size: 13px; margin-bottom: 4px; }
          .info-value { color: #1f2937; font-size: 14px; }
          .contacts-list, .certificates-list, .health-list { margin-top: 16px; }
          .contact-item, .certificate-item, .health-item { padding: 8px 0; border-bottom: 1px solid #f3f4f6; }
          .contact-type { font-weight: 600; color: #667eea; min-width: 100px; display: inline-block; }
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
        <div class="profile-container">
          <div class="header">
            <h1>ملف متدرب</h1>
            <p>نظام إدارة الأكاديمية الأولمبية</p>
          </div>
          
          <div class="profile-details">
            <div><strong>رقم الملف:</strong> #${trainee.id}</div>
            <div><strong>تاريخ الطباعة:</strong> ${today}</div>
          </div>
          
          <div class="photo-section">
            ${trainee.imageUrl 
              ? `<img src="${trainee.imageUrl}" class="trainee-photo" alt="صورة المتدرب">`
              : `<div class="placeholder-photo">📷</div>`
            }
          </div>
          
          <h2>📋 المعلومات الشخصية</h2>
          <div class="info-grid">
            <div class="info-item"><div class="info-label">الاسم الكامل</div><div class="info-value">${trainee.fullName || '-'}</div></div>
            <div class="info-item"><div class="info-label">رقم الهوية</div><div class="info-value">${trainee.nationalId || '-'}</div></div>
            <div class="info-item"><div class="info-label">تاريخ الميلاد</div><div class="info-value">${trainee.birthDate ? new Date(trainee.birthDate).toLocaleDateString('ar-EG') : '-'}</div></div>
            <div class="info-item"><div class="info-label">الجنس</div><div class="info-value">${trainee.gender?.title || '-'}</div></div>
            <div class="info-item"><div class="info-label">السنة الدراسية</div><div class="info-value">${trainee.academicYear || '-'}</div></div>
            <div class="info-item"><div class="info-label">العنوان</div><div class="info-value">${trainee.address || '-'}</div></div>
          </div>
          
          <h2>📞 جهات الاتصال</h2>
          <div class="contacts-list">
            ${trainee.contacts?.map((contact: any) => `
              <div class="contact-item">
                <span class="contact-type">${contact.contactType?.title}:</span>
                <span>${contact.contactValue}</span>
              </div>
            `).join('') || '<div>- لا توجد جهات اتصال -</div>'}
          </div>
          
          ${trainee.certificates?.length ? `
          <h2>🎓 الشهادات</h2>
          <div class="certificates-list">
            ${trainee.certificates.map((cert: any) => `
              <div class="certificate-item">
                <div><strong>${cert.certificateName}</strong></div>
                <div>رقم الشهادة: ${cert.certificateNumber || '-'}</div>
                <div>الدورة: ${cert.course?.title || '-'}</div>
                <div>تاريخ الإصدار: ${cert.issueDate || '-'}</div>
                <div>الدرجة: ${cert.grade || '-'}</div>
              </div>
            `).join('')}
          </div>
          ` : ''}
          
          ${trainee.healthConditions?.length ? `
          <h2>🏥 الحالات الصحية</h2>
          <div class="health-list">
            ${trainee.healthConditions.map((condition: any) => `
              <div class="health-item">
                <div><strong>${condition.title}</strong></div>
                ${condition.description ? `<div>الوصف: ${condition.description}</div>` : ''}
                ${condition.medication ? `<div>العلاج: ${condition.medication}</div>` : ''}
                ${condition.note ? `<div>ملاحظات: ${condition.note}</div>` : ''}
              </div>
            `).join('')}
          </div>
          ` : ''}
          
          <div class="signature-section">
            <div class="signature-box">
              <div class="signature-line"></div>
              <div>توقيع المتدرب</div>
              <div class="signature-date">التاريخ: ___ / ___ / _____</div>
            </div>
            <div class="signature-box">
              <div class="signature-line"></div>
              <div>توقيع ولي الأمر</div>
              <div class="signature-date">التاريخ: ___ / ___ / _____</div>
            </div>
            <div class="signature-box">
              <div class="signature-line"></div>
              <div>ختم الأكاديمية</div>
              <div class="signature-date">التاريخ: ___ / ___ / _____</div>
            </div>
          </div>
          
          <div class="footer">
            تم التصدير من نظام إدارة الأكاديمية الأولمبية<br>
            هذا المستند معتمد ويحتوي على جميع بيانات المتدرب
          </div>
        </div>
        <div class="no-print" style="text-align: center; margin-top: 20px; padding: 10px;">
          <button onclick="window.print();" style="padding: 10px 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; border-radius: 5px; cursor: pointer;">
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