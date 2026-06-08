import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';

import { TraineeService } from '../../../../core/services/trainee.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { TraineeVTO, TraineeCertificateVTO, TraineeContactVTO, HealthConditionVTO } from '../../../../core/models/trainee.model';

@Component({
  selector: 'app-trainee-profile',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    MatTooltipModule
  ],
  template: `
    <div class="profile-container" *ngIf="!isLoading; else loading">
      <mat-card class="profile-card">
        <!-- Header with actions -->
        <div class="profile-header">
          <div class="header-actions">
            <button mat-raised-button routerLink="/trainees" color="primary">
              <mat-icon>arrow_forward</mat-icon> العودة للقائمة
            </button>
            <button mat-raised-button [routerLink]="['/trainees', traineeId, 'edit']" color="accent">
              <mat-icon>edit</mat-icon> تعديل الملف
            </button>
          </div>
        </div>

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
                رقم الهوية: {{ trainee.nationalId }}
              </mat-chip>
              <mat-chip *ngIf="trainee.academicYear">
                <mat-icon>school</mat-icon>
                السنة {{ trainee.academicYear }}
              </mat-chip>
              <mat-chip *ngIf="trainee.gender">
                <mat-icon>{{ trainee.gender.title === 'ذكر' ? 'male' : 'female' }}</mat-icon>
                {{ trainee.gender.title }}
              </mat-chip>
            </div>
          </div>
        </div>

        <mat-divider></mat-divider>

        <!-- Tabs for different sections -->
        <mat-tab-group>
          <!-- Personal Information Tab -->
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
                    <p>{{ trainee.birthDate | date:'dd/MM/yyyy' }}</p>
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
                    <p>{{ trainee.lastModifiedBy.fullName || '-' }}</p>
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
      </mat-card>
    </div>

    <ng-template #loading>
      <div class="loading-container">
        <mat-spinner diameter="50"></mat-spinner>
        <p>جاري تحميل بيانات المتدرب...</p>
      </div>
    </ng-template>
  `,
  styles: [`
    .profile-container {
      padding: 24px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .profile-card {
      border-radius: 16px;
      overflow: hidden;
    }

    .profile-header {
      padding: 20px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }

    .header-actions {
      display: flex;
      justify-content: space-between;
      gap: 16px;
    }

    .profile-main {
      display: flex;
      gap: 32px;
      padding: 32px;
      background: white;
    }

    .profile-image {
      flex-shrink: 0;
    }

    .avatar {
      width: 150px;
      height: 150px;
      border-radius: 50%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .avatar mat-icon {
      font-size: 80px;
      width: 80px;
      height: 80px;
      color: white;
    }

    .profile-image img {
      width: 150px;
      height: 150px;
      border-radius: 50%;
      object-fit: cover;
    }

    .profile-info {
      flex: 1;
    }

    .profile-info h1 {
      margin: 0 0 16px 0;
      font-size: 28px;
      color: #1f2937;
    }

    .info-badges {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
    }

    .info-badges mat-chip {
      padding: 8px 16px;
    }

    .tab-content {
      padding: 24px;
    }

    .info-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 24px;
    }

    .info-item {
      display: flex;
      align-items: flex-start;
      gap: 16px;
      padding: 16px;
      background: #f9fafb;
      border-radius: 12px;
      transition: transform 0.2s;
    }

    .info-item:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }

    .info-item mat-icon {
      color: #667eea;
      font-size: 32px;
      width: 32px;
      height: 32px;
    }

    .info-item div {
      flex: 1;
    }

    .info-item label {
      display: block;
      font-size: 12px;
      color: #6b7280;
      margin-bottom: 4px;
    }

    .info-item p {
      margin: 0;
      font-size: 16px;
      color: #1f2937;
      font-weight: 500;
    }

    .contacts-list,
    .certificates-list,
    .health-list {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
      gap: 20px;
    }

    .contact-card,
    .certificate-card,
    .health-card {
      display: flex;
      gap: 16px;
      padding: 20px;
      background: #f9fafb;
      border-radius: 12px;
      transition: all 0.2s;
    }

    .contact-card:hover,
    .certificate-card:hover,
    .health-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }

    .contact-card mat-icon,
    .certificate-card mat-icon,
    .health-card mat-icon {
      color: #667eea;
      font-size: 40px;
      width: 40px;
      height: 40px;
    }

    .contact-info,
    .certificate-info,
    .health-info {
      flex: 1;
    }

    .contact-info label,
    .certificate-info h4,
    .health-info h4 {
      margin: 0 0 8px 0;
      font-size: 18px;
      font-weight: 600;
      color: #1f2937;
    }

    .contact-info p,
    .certificate-info p,
    .health-info p {
      margin: 4px 0;
      color: #6b7280;
      font-size: 14px;
    }

    .empty-state {
      text-align: center;
      padding: 60px;
      color: #9ca3af;
    }

    .empty-state mat-icon {
      font-size: 64px;
      width: 64px;
      height: 64px;
      margin-bottom: 16px;
    }

    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 400px;
    }

    .loading-container p {
      margin-top: 20px;
      color: #6b7280;
    }

    @media (max-width: 768px) {
      .profile-main {
        flex-direction: column;
        align-items: center;
        text-align: center;
      }

      .info-badges {
        justify-content: center;
      }

      .info-grid {
        grid-template-columns: 1fr;
      }

      .contacts-list,
      .certificates-list,
      .health-list {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class TraineeProfileComponent implements OnInit {
  traineeId!: number;
  trainee: TraineeVTO | null = null;
  contacts: TraineeContactVTO[] = [];
  certificates: TraineeCertificateVTO[] = [];
  healthConditions: HealthConditionVTO[] = [];
  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private traineeService: TraineeService,
    private notification: NotificationService
  ) {}

  ngOnInit(): void {
    this.traineeId = Number(this.route.snapshot.params['id']);
    this.loadTraineeData();
  }

  loadTraineeData(): void {
    this.isLoading = true;
    
    // Load main trainee data
    this.traineeService.getTraineeById(this.traineeId).subscribe({
      next: (res: TraineeVTO) => {
        this.trainee = res;
        this.contacts = res.contacts || [];
        this.certificates = res.certificates || [];
        this.healthConditions = res.healthConditions || [];
        this.isLoading = false;
      },
      error: () => {
        this.notification.showError('حدث خطأ في تحميل بيانات المتدرب');
        this.isLoading = false;
      }
    });
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
}