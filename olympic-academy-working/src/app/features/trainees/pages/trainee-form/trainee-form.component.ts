import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { TraineeService } from '../../../../core/services/trainee.service';
import { CourseService } from '../../../../core/services/course.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { SearchableSelectComponent, SelectOption } from '../../../../shared/components/searchable-select/searchable-select.component';
import { GENDERS, CONTACT_TYPES } from '../../../../core/models/common.model';

@Component({
  selector: 'app-trainee-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule,
    MatTabsModule,
    MatChipsModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    SearchableSelectComponent
  ],
  template: `
    <div class="form-container">
      <mat-card>
        <div class="form-header">
          <button mat-icon-button routerLink="/trainees">
            <mat-icon>arrow_forward</mat-icon>
          </button>
          <h2>{{ isEditMode ? 'تعديل متدرب' : 'إضافة متدرب جديد' }}</h2>
        </div>

        <form [formGroup]="traineeForm" (ngSubmit)="onSubmit()">
          <mat-tab-group>
            <!-- Basic Information Tab -->
            <mat-tab label="المعلومات الأساسية">
              <div class="tab-content">
                <div class="image-upload-section">
                  <div class="image-preview" *ngIf="imagePreview || traineeImageUrl">
                    <img [src]="imagePreview || traineeImageUrl" alt="صورة المتدرب">
                    <button mat-icon-button class="remove-image" (click)="removeImage()" *ngIf="imagePreview || traineeImageUrl">
                      <mat-icon>close</mat-icon>
                    </button>
                  </div>
                  <div class="upload-placeholder" *ngIf="!imagePreview && !traineeImageUrl" (click)="fileInput.click()">
                    <mat-icon>cloud_upload</mat-icon>
                    <p>اضغط لرفع صورة المتدرب</p>
                  </div>
                  <input type="file" #fileInput (change)="onFileSelected($event)" accept="image/*" style="display: none">
                  <button mat-stroked-button type="button" (click)="fileInput.click()" *ngIf="!imagePreview && !traineeImageUrl">
                    <mat-icon>upload</mat-icon> اختيار صورة
                  </button>
                  <button mat-stroked-button type="button" (click)="fileInput.click()" *ngIf="imagePreview || traineeImageUrl">
                    <mat-icon>edit</mat-icon> تغيير الصورة
                  </button>
                </div>

                <div class="form-grid">
                  <mat-form-field appearance="outline">
                    <mat-label>الاسم الكامل *</mat-label>
                    <input matInput formControlName="fullName">
                    <mat-error *ngIf="traineeForm.get('fullName')?.hasError('required')">الاسم مطلوب</mat-error>
                  </mat-form-field>

                  <mat-form-field appearance="outline">
                    <mat-label>رقم الهوية *</mat-label>
                    <input matInput formControlName="nationalId" maxlength="14">
                    <mat-error *ngIf="traineeForm.get('nationalId')?.hasError('required')">رقم الهوية مطلوب</mat-error>
                  </mat-form-field>

                  <mat-form-field appearance="outline">
                    <mat-label>السنة الدراسية</mat-label>
                    <input matInput formControlName="academicYear">
                  </mat-form-field>

                  <mat-form-field appearance="outline">
                    <mat-label>تاريخ الميلاد</mat-label>
                    <input matInput [matDatepicker]="birthPicker" formControlName="birthDate">
                    <mat-datepicker-toggle matSuffix [for]="birthPicker"></mat-datepicker-toggle>
                    <mat-datepicker #birthPicker></mat-datepicker>
                  </mat-form-field>

                  <app-searchable-select
                    [ngModel]="traineeForm.get('gender')?.value"
                    (ngModelChange)="traineeForm.get('gender')?.setValue($event)"
                    label="الجنس"
                    [options]="genderOptions"
                    [ngModelOptions]="{standalone: true}"
                    class="full-width">
                  </app-searchable-select>

                  <mat-form-field appearance="outline">
                    <mat-label>العنوان</mat-label>
                    <input matInput formControlName="address">
                  </mat-form-field>
                </div>
              </div>
            </mat-tab>

            <!-- Contacts Tab -->
            <mat-tab label="جهات الاتصال">
              <div class="tab-content">
                <div formArrayName="contacts">
                  <div *ngFor="let contact of contacts.controls; let i=index" [formGroupName]="i" class="contact-row">
                    <app-searchable-select
                      [ngModel]="contact.get('contactType')?.value"
                      (ngModelChange)="contact.get('contactType')?.setValue($event)"
                      label="النوع"
                      [options]="contactTypeOptions"
                      [ngModelOptions]="{standalone: true}"
                      class="contact-type">
                    </app-searchable-select>

                    <mat-form-field appearance="outline" class="contact-value">
                      <mat-label>القيمة</mat-label>
                      <input matInput formControlName="contactValue">
                    </mat-form-field>

                    <button mat-icon-button color="warn" (click)="removeContact(i)" *ngIf="contacts.length > 1" matTooltip="حذف">
                      <mat-icon>delete</mat-icon>
                    </button>
                  </div>
                  <button mat-stroked-button type="button" (click)="addContact()">
                    <mat-icon>add</mat-icon> إضافة جهة اتصال
                  </button>
                </div>
              </div>
            </mat-tab>

            <!-- Certificates Tab -->
            <mat-tab label="الشهادات">
              <div class="tab-content">
                <div formArrayName="certificates">
                  <div *ngFor="let cert of certificates.controls; let i=index" [formGroupName]="i" class="certificate-row">
                    <mat-form-field appearance="outline" class="cert-name">
                      <mat-label>اسم الشهادة</mat-label>
                      <input matInput formControlName="certificateName">
                    </mat-form-field>

                    <mat-form-field appearance="outline" class="cert-number">
                      <mat-label>رقم الشهادة</mat-label>
                      <input matInput formControlName="certificateNumber">
                    </mat-form-field>

                    <app-searchable-select
                      [ngModel]="cert.get('courseId')?.value"
                      (ngModelChange)="cert.get('courseId')?.setValue($event)"
                      label="الدورة"
                      [options]="courseOptions"
                      [ngModelOptions]="{standalone: true}"
                      class="cert-course">
                    </app-searchable-select>

                    <mat-form-field appearance="outline" class="cert-date">
                      <mat-label>تاريخ الإصدار</mat-label>
                      <input matInput [matDatepicker]="issuePicker" formControlName="issueDate">
                      <mat-datepicker-toggle matSuffix [for]="issuePicker"></mat-datepicker-toggle>
                      <mat-datepicker #issuePicker></mat-datepicker>
                    </mat-form-field>

                    <mat-form-field appearance="outline" class="cert-grade">
                      <mat-label>الدرجة</mat-label>
                      <input matInput formControlName="grade">
                    </mat-form-field>

                    <button mat-icon-button color="warn" (click)="removeCertificate(i)" matTooltip="حذف">
                      <mat-icon>delete</mat-icon>
                    </button>
                  </div>
                  <button mat-stroked-button type="button" (click)="addCertificate()">
                    <mat-icon>add</mat-icon> إضافة شهادة
                  </button>
                </div>
              </div>
            </mat-tab>

            <!-- Health Conditions Tab -->
            <mat-tab label="الحالات الصحية">
              <div class="tab-content">
                <div formArrayName="healthConditions">
                  <div *ngFor="let condition of healthConditions.controls; let i=index" [formGroupName]="i" class="condition-row">
                    <mat-form-field appearance="outline" class="condition-title">
                      <mat-label>العنوان</mat-label>
                      <input matInput formControlName="title">
                    </mat-form-field>

                    <mat-form-field appearance="outline" class="condition-desc">
                      <mat-label>الوصف</mat-label>
                      <input matInput formControlName="description">
                    </mat-form-field>

                    <mat-form-field appearance="outline" class="condition-med">
                      <mat-label>العلاج</mat-label>
                      <input matInput formControlName="medication">
                    </mat-form-field>

                    <mat-form-field appearance="outline" class="condition-note">
                      <mat-label>ملاحظات</mat-label>
                      <input matInput formControlName="note">
                    </mat-form-field>

                    <button mat-icon-button color="warn" (click)="removeHealthCondition(i)" matTooltip="حذف">
                      <mat-icon>delete</mat-icon>
                    </button>
                  </div>
                  <button mat-stroked-button type="button" (click)="addHealthCondition()">
                    <mat-icon>add</mat-icon> إضافة حالة صحية
                  </button>
                </div>
              </div>
            </mat-tab>
          </mat-tab-group>

          <div class="form-actions">
            <button mat-raised-button color="primary" type="submit" [disabled]="traineeForm.invalid || isUploading">
              <mat-icon>save</mat-icon> {{ isEditMode ? 'تحديث' : 'حفظ' }}
            </button>
            <button mat-stroked-button type="button" routerLink="/trainees">
              إلغاء
            </button>
          </div>
        </form>
      </mat-card>
    </div>
  `,
  styles: [`
    .form-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 24px;
    }

    .form-header {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 24px;
    }

    .form-header h2 {
      margin: 0;
      font-size: 24px;
      font-weight: 600;
    }

    .tab-content {
      padding: 24px;
    }

    .image-upload-section {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
      margin-bottom: 24px;
      padding: 20px;
      background: #f9fafb;
      border-radius: 12px;
    }

    .image-preview {
      position: relative;
      width: 150px;
      height: 150px;
      border-radius: 50%;
      overflow: hidden;
      border: 3px solid #2563eb;
    }

    .image-preview img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .remove-image {
      position: absolute;
      top: 5px;
      right: 5px;
      background: rgba(0,0,0,0.5);
      color: white;
    }

    .upload-placeholder {
      width: 150px;
      height: 150px;
      border-radius: 50%;
      background: #e5e7eb;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.3s;
    }

    .upload-placeholder:hover {
      background: #d1d5db;
    }

    .upload-placeholder mat-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      color: #6b7280;
    }

    .upload-placeholder p {
      margin: 8px 0 0;
      font-size: 12px;
      color: #6b7280;
    }

    .form-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 20px;
    }

    .full-width {
      width: 100%;
    }

    .contact-row {
      display: grid;
      grid-template-columns: 200px 1fr auto;
      gap: 16px;
      align-items: center;
      margin-bottom: 16px;
    }

    .contact-type, .contact-value {
      width: 100%;
    }

    .certificate-row {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr 1fr 1fr auto;
      gap: 12px;
      align-items: center;
      margin-bottom: 16px;
    }

    .cert-name, .cert-number, .cert-course, .cert-date, .cert-grade {
      width: 100%;
    }

    .condition-row {
      display: grid;
      grid-template-columns: 1fr 1.5fr 1fr 1.5fr auto;
      gap: 12px;
      align-items: center;
      margin-bottom: 16px;
    }

    .condition-title, .condition-desc, .condition-med, .condition-note {
      width: 100%;
    }

    .form-actions {
      display: flex;
      gap: 16px;
      margin-top: 24px;
      padding: 16px;
      justify-content: flex-end;
      border-top: 1px solid #e5e7eb;
    }

    @media (max-width: 1024px) {
      .certificate-row {
        grid-template-columns: 1fr 1fr;
      }
      .condition-row {
        grid-template-columns: 1fr 1fr;
      }
    }

    @media (max-width: 768px) {
      .form-grid {
        grid-template-columns: 1fr;
      }
      .contact-row {
        grid-template-columns: 1fr;
      }
      .certificate-row {
        grid-template-columns: 1fr;
      }
      .condition-row {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class TraineeFormComponent implements OnInit {
  traineeForm: FormGroup;
  isEditMode = false;
  isUploading = false;
  traineeId?: number;
  
  // Image upload
  selectedImage: File | null = null;
  imagePreview: string | null = null;
  traineeImageUrl: string | null = null;
  
  courses: any[] = [];
  
  // Options for searchable selects
  genderOptions: SelectOption[] = [];
  contactTypeOptions: SelectOption[] = [];
  courseOptions: SelectOption[] = [];

  constructor(
    private fb: FormBuilder,
    private traineeService: TraineeService,
    private courseService: CourseService,
    private notification: NotificationService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.traineeForm = this.fb.group({
      fullName: ['', Validators.required],
      nationalId: ['', Validators.required],
      academicYear: [''],
      birthDate: [''],
      gender: [null],
      address: [''],
      contacts: this.fb.array([]),
      certificates: this.fb.array([]),
      healthConditions: this.fb.array([])
    });
  }

  get contacts() { return this.traineeForm.get('contacts') as FormArray; }
  get certificates() { return this.traineeForm.get('certificates') as FormArray; }
  get healthConditions() { return this.traineeForm.get('healthConditions') as FormArray; }

  addContact() { 
    this.contacts.push(this.fb.group({ 
      contactType: [null], 
      contactValue: [''] 
    })); 
  }
  
  removeContact(index: number) { 
    this.contacts.removeAt(index); 
  }
  
  addCertificate() { 
    this.certificates.push(this.fb.group({ 
      certificateName: [''], 
      certificateNumber: [''], 
      courseId: [null], 
      issueDate: [''], 
      grade: [''] 
    })); 
  }
  
  removeCertificate(index: number) { 
    this.certificates.removeAt(index); 
  }
  
  addHealthCondition() { 
    this.healthConditions.push(this.fb.group({ 
      title: [''], 
      description: [''], 
      medication: [''], 
      note: [''] 
    })); 
  }
  
  removeHealthCondition(index: number) { 
    this.healthConditions.removeAt(index); 
  }

  ngOnInit(): void {
    this.loadSelectOptions();
    this.loadCourses();
    this.addContact(); // Add one empty contact by default
    
    this.traineeId = this.route.snapshot.params['id'];
    if (this.traineeId) { 
      this.isEditMode = true; 
      this.loadTrainee(); 
    }
  }

  loadSelectOptions(): void {
    this.genderOptions = GENDERS.map(g => ({ value: g, label: g.title }));
    this.contactTypeOptions = CONTACT_TYPES.map(c => ({ value: c, label: c.title }));
  }

  loadCourses(): void {
    this.courseService.getAllCourses().subscribe({
      next: (res: any) => {
        this.courses = res.items || [];
        this.courseOptions = this.courses.map(c => ({ value: c.id, label: c.title }));
      },
      error: () => {
        this.notification.showError('حدث خطأ في تحميل الدورات');
      }
    });
  }

  loadTrainee(): void {
    this.traineeService.getTraineeById(this.traineeId!).subscribe({
      next: (t: any) => {
        this.traineeForm.patchValue({
          fullName: t.fullName,
          nationalId: t.nationalId,
          academicYear: t.academicYear,
          birthDate: t.birthDate,
          gender: t.gender,
          address: t.address
        });
        
        // Set trainee image URL
        if (t.imageUrl) {
          this.traineeImageUrl = t.imageUrl;
        }
        
        // Load contacts
        if (t.contacts?.length) {
          while (this.contacts.length) this.contacts.removeAt(0);
          t.contacts.forEach((c: any) => {
            this.contacts.push(this.fb.group({ 
              contactType: [c.contactType], 
              contactValue: [c.contactValue] 
            }));
          });
        }
        
        // Load certificates
        if (t.certificates?.length) {
          while (this.certificates.length) this.certificates.removeAt(0);
          t.certificates.forEach((c: any) => {
            this.certificates.push(this.fb.group({ 
              certificateName: [c.certificateName], 
              certificateNumber: [c.certificateNumber], 
              courseId: [c.course?.id], 
              issueDate: [c.issueDate], 
              grade: [c.grade] 
            }));
          });
        }
        
        // Load health conditions
        if (t.healthConditions?.length) {
          while (this.healthConditions.length) this.healthConditions.removeAt(0);
          t.healthConditions.forEach((h: any) => {
            this.healthConditions.push(this.fb.group({ 
              title: [h.title], 
              description: [h.description], 
              medication: [h.medication], 
              note: [h.note] 
            }));
          });
        }
      },
      error: () => {
        this.notification.showError('حدث خطأ في تحميل بيانات المتدرب');
      }
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      this.selectedImage = input.files[0];
      
      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(this.selectedImage);
    }
  }

  removeImage(): void {
    this.selectedImage = null;
    this.imagePreview = null;
    this.traineeImageUrl = null;
  }

  async uploadImage(): Promise<string | null> {
    if (!this.selectedImage) return this.traineeImageUrl;
    
    this.isUploading = true;
    
    // Create form data for upload
    const formData = new FormData();
    formData.append('file', this.selectedImage);
    
    // Call your upload service (adjust endpoint as needed)
    try {
      // You need to add this method to your TraineeService
      // const response = await this.traineeService.uploadTraineeImage(formData).toPromise();
      // this.isUploading = false;
      // return response?.imageUrl || null;
      
      // For now, return null and handle upload separately
      this.isUploading = false;
      this.notification.showWarning('سيتم رفع الصورة بعد حفظ البيانات');
      return null;
    } catch (error) {
      this.isUploading = false;
      this.notification.showError('حدث خطأ في رفع الصورة');
      return null;
    }
  }

  async onSubmit(): Promise<void> {
    if (this.traineeForm.invalid) {
      this.notification.showWarning('يرجى تعبئة جميع الحقول المطلوبة');
      return;
    }
    
    this.isUploading = true;
    
    // Upload image first if selected
    let imageUrl = this.traineeImageUrl;
    if (this.selectedImage) {
      imageUrl = await this.uploadImage();
    }
    
    const formData = this.traineeForm.value;
    formData.imageUrl = imageUrl;
    
    // Filter out empty contacts
    formData.contacts = formData.contacts.filter((c: any) => c.contactType && c.contactValue);
    
    // Filter out empty certificates
    formData.certificates = formData.certificates.filter((c: any) => c.certificateName);
    
    // Filter out empty health conditions
    formData.healthConditions = formData.healthConditions.filter((h: any) => h.title);
    
    if (this.isEditMode) {
      this.traineeService.updateTrainee(this.traineeId!, formData).subscribe({
        next: () => {
          this.notification.showSuccess('تم تحديث المتدرب بنجاح');
          this.router.navigate(['/trainees']);
          this.isUploading = false;
        },
        error: (err) => {
          this.notification.showError(err.error?.messageEn || 'حدث خطأ في تحديث المتدرب');
          this.isUploading = false;
        }
      });
    } else {
      this.traineeService.createTrainee(formData).subscribe({
        next: (res) => {
          this.notification.showSuccess('تم إضافة المتدرب بنجاح');
          this.router.navigate(['/trainees', res.id]);
          this.isUploading = false;
        },
        error: (err) => {
          this.notification.showError(err.error?.messageEn || 'حدث خطأ في إضافة المتدرب');
          this.isUploading = false;
        }
      });
    }
  }
}