// employee-details-modal.component.ts - UPDATED WITH SAME CARD PRINT AS TRAINEE

import {
  Component,
  Inject,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  AfterViewInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogModule,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { MatTabsModule, MatTabGroup } from '@angular/material/tabs';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import {
  EmployeeVTO,
  EmployeeContactVTO,
  CourseSessionVTO,
  TrainerDepartmentVTO,
  TrainerCourseVTO,
} from '../../../../core/models/employee.model';
import { FileService } from '../../../../core/services/file.service';
import { EmployeeService } from '../../../../core/services/employee.service';
import { NotificationService } from '../../../../core/services/notification.service';
import * as JsBarcode from 'jsbarcode';

@Component({
  selector: 'app-employee-details-modal',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatChipsModule,
    MatTabsModule,
    MatTableModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
  ],
  template: `
    <div class="modal-container" dir="rtl">
      <!-- Header -->
      <div class="modal-header">
        <div class="header-title">
          <mat-icon>person</mat-icon>
          <h2>ملف الموظف</h2>
        </div>
        <div class="header-actions">
          <button
            mat-icon-button
            (click)="printProfileDocument()"
            matTooltip="طباعة الملف الكامل"
          >
            <mat-icon>description</mat-icon>
          </button>
          <button
            mat-icon-button
            (click)="printEmployeeCard()"
            matTooltip="طباعة البطاقة"
          >
            <mat-icon>credit_card</mat-icon>
          </button>
          <button mat-icon-button mat-dialog-close class="close-btn">
            <mat-icon>close</mat-icon>
          </button>
        </div>
      </div>

      <mat-divider></mat-divider>

      <!-- Main Profile Info -->
      <div class="profile-main" *ngIf="employee">
        <div class="profile-image">
          <div class="avatar" *ngIf="!imageUrl; else profileImage">
            <mat-icon>person</mat-icon>
          </div>
          <ng-template #profileImage>
            <img [src]="imageUrl" [alt]="employee.fullName" />
          </ng-template>
        </div>

        <div class="profile-info">
          <h1>{{ employee.fullName }}</h1>
          <div class="info-badges">
            <mat-chip [color]="employee.isActive ? 'primary' : 'warn'" selected>
              {{ employee.isActive ? 'نشط' : 'غير نشط' }}
            </mat-chip>
            <mat-chip color="accent" selected>
              {{ employee.employeeType?.title }}
            </mat-chip>
            <mat-chip>
              <mat-icon>badge</mat-icon>
              {{ employee.nationalId }}
            </mat-chip>
            <mat-chip *ngIf="employee.gender">
              <mat-icon>{{
                employee.gender.title === 'ذكر' ? 'male' : 'female'
              }}</mat-icon>
              {{ employee.gender.title }}
            </mat-chip>
          </div>
        </div>
      </div>

      <mat-divider></mat-divider>

      <!-- Tabs -->
      <mat-tab-group
        class="custom-tabs"
        #tabGroup
        (selectedTabChange)="onTabChange($event)"
      >
        <!-- Personal Info Tab -->
        <mat-tab label="المعلومات الشخصية">
          <div class="tab-content" *ngIf="employee">
            <div class="info-grid">
              <div class="info-item">
                <mat-icon>person</mat-icon>
                <div>
                  <label>الاسم الكامل</label>
                  <p>{{ employee.fullName }}</p>
                </div>
              </div>

              <div class="info-item">
                <mat-icon>badge</mat-icon>
                <div>
                  <label>رقم الهوية</label>
                  <p>{{ employee.nationalId }}</p>
                </div>
              </div>

              <div class="info-item">
                <mat-icon>cake</mat-icon>
                <div>
                  <label>تاريخ الميلاد</label>
                  <p>{{ (employee.birthDate | date: 'dd/MM/yyyy') || '-' }}</p>
                </div>
              </div>

              <div class="info-item">
                <mat-icon>{{
                  employee.gender?.title === 'ذكر' ? 'male' : 'female'
                }}</mat-icon>
                <div>
                  <label>الجنس</label>
                  <p>{{ employee.gender?.title || '-' }}</p>
                </div>
              </div>

              <div class="info-item">
                <mat-icon>business</mat-icon>
                <div>
                  <label>نوع الموظف</label>
                  <p>{{ employee.employeeType?.title }}</p>
                </div>
              </div>

              <div class="info-item">
                <mat-icon>event</mat-icon>
                <div>
                  <label>تاريخ التوظيف</label>
                  <p>{{ employee.hireDate | date: 'dd/MM/yyyy' }}</p>
                </div>
              </div>

              <div class="info-item">
                <mat-icon>event</mat-icon>
                <div>
                  <label>تاريخ التسجيل</label>
                  <p>{{ employee.createdOn | date: 'dd/MM/yyyy' }}</p>
                </div>
              </div>

              <div class="info-item">
                <mat-icon>person_add</mat-icon>
                <div>
                  <label>تمت الإضافة بواسطة</label>
                  <p>{{ employee.createdBy?.fullName || '-' }}</p>
                </div>
              </div>
            </div>
          </div>
        </mat-tab>

        <!-- Financial Info Tab -->
        <mat-tab label="المعلومات المالية">
          <div class="tab-content" *ngIf="employee">
            <div class="financial-cards">
              <div class="financial-card">
                <mat-icon>attach_money</mat-icon>
                <div>
                  <label>الراتب الأساسي</label>
                  <h3>{{ employee.salary | currency: 'EGP' }}</h3>
                </div>
              </div>
              <div class="financial-card warning">
                <mat-icon>account_balance_wallet</mat-icon>
                <div>
                  <label>الراتب المتبقي</label>
                  <h3>{{ employee.remainedSalary | currency: 'EGP' }}</h3>
                </div>
              </div>
              <div class="financial-card info">
                <mat-icon>trending_up</mat-icon>
                <div>
                  <label>نوع الراتب</label>
                  <h3>{{ employee.salaryType?.title || '-' }}</h3>
                </div>
              </div>
            </div>
          </div>
        </mat-tab>

        <!-- Contacts Tab -->
        <mat-tab label="جهات الاتصال">
          <div class="tab-content">
            <div
              class="contacts-list"
              *ngIf="contacts.length > 0; else noContacts"
            >
              <div class="contact-card" *ngFor="let contact of contacts">
                <mat-icon>{{
                  getContactIcon(contact.contactType?.title || '')
                }}</mat-icon>
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

        <!-- Departments Tab - Loaded from API -->
        <mat-tab label="الأقسام">
          <div class="tab-content">
            <div *ngIf="isLoadingDepartments" class="loading-container">
              <mat-spinner diameter="30"></mat-spinner>
              <p>جاري تحميل الأقسام...</p>
            </div>
            <div
              class="departments-list"
              *ngIf="
                !isLoadingDepartments && trainerDepartments.length > 0;
                else noDepartments
              "
            >
              <div
                class="department-card"
                *ngFor="let dept of trainerDepartments"
              >
                <mat-icon>business</mat-icon>
                <div class="department-info">
                  <h4>{{ dept.department?.title }}</h4>
                  <p *ngIf="dept.createdOn">
                    تاريخ الإسناد: {{ dept.createdOn | date: 'dd/MM/yyyy' }}
                  </p>
                </div>
              </div>
            </div>
            <ng-template #noDepartments>
              <div class="empty-state">
                <mat-icon>business</mat-icon>
                <p>لا يوجد أقسام مسندة لهذا المدرب</p>
              </div>
            </ng-template>
          </div>
        </mat-tab>

        <!-- Courses Tab - Loaded from API -->
        <mat-tab
          *ngIf="employee?.employeeType?.id === 1"
          label="الدورات المسندة"
        >
          <div class="tab-content">
            <div *ngIf="isLoadingCourses" class="loading-container">
              <mat-spinner diameter="30"></mat-spinner>
              <p>جاري تحميل الدورات...</p>
            </div>
            <div
              class="courses-list"
              *ngIf="
                !isLoadingCourses && trainerCourses.length > 0;
                else noCourses
              "
            >
              <div class="course-card" *ngFor="let course of trainerCourses">
                <mat-icon>school</mat-icon>
                <div class="course-info">
                  <h4>{{ course.course?.title }}</h4>
                  <p *ngIf="course.createdOn">
                    تاريخ الإسناد: {{ course.createdOn | date: 'dd/MM/yyyy' }}
                  </p>
                </div>
              </div>
            </div>
            <ng-template #noCourses>
              <div class="empty-state">
                <mat-icon>school</mat-icon>
                <p>لا توجد دورات مسندة لهذا المدرب</p>
              </div>
            </ng-template>
          </div>
        </mat-tab>

        <!-- Sessions Tab -->
        <mat-tab label="الجلسات">
          <div class="tab-content">
            <div
              class="table-container"
              *ngIf="sessions.length > 0; else noSessions"
            >
              <table
                mat-table
                [dataSource]="sessionsDataSource"
                class="full-width-table"
              >
                <ng-container matColumnDef="title">
                  <th mat-header-cell *matHeaderCellDef>عنوان الجلسة</th>
                  <td mat-cell *matCellDef="let session">
                    {{ session.title }}
                  </td>
                </ng-container>

                <ng-container matColumnDef="course">
                  <th mat-header-cell *matHeaderCellDef>الدورة</th>
                  <td mat-cell *matCellDef="let session">
                    {{ session.course?.title }}
                  </td>
                </ng-container>

                <ng-container matColumnDef="place">
                  <th mat-header-cell *matHeaderCellDef>المكان</th>
                  <td mat-cell *matCellDef="let session">
                    {{ session.place?.title }}
                  </td>
                </ng-container>

                <ng-container matColumnDef="sessionDate">
                  <th mat-header-cell *matHeaderCellDef>التاريخ</th>
                  <td mat-cell *matCellDef="let session">
                    {{ session.sessionDate | date: 'dd/MM/yyyy' }}
                  </td>
                </ng-container>

                <ng-container matColumnDef="startTime">
                  <th mat-header-cell *matHeaderCellDef>وقت البدء</th>
                  <td mat-cell *matCellDef="let session">
                    {{ session.startTime }}
                  </td>
                </ng-container>

                <ng-container matColumnDef="endTime">
                  <th mat-header-cell *matHeaderCellDef>وقت الانتهاء</th>
                  <td mat-cell *matCellDef="let session">
                    {{ session.endTime }}
                  </td>
                </ng-container>

                <ng-container matColumnDef="status">
                  <th mat-header-cell *matHeaderCellDef>الحالة</th>
                  <td mat-cell *matCellDef="let session">
                    <mat-chip
                      [color]="getSessionStatusColor(session.status?.id)"
                      selected
                    >
                      {{ session.status?.title }}
                    </mat-chip>
                  </td>
                </ng-container>

                <tr
                  mat-header-row
                  *matHeaderRowDef="sessionsDisplayedColumns"
                ></tr>
                <tr
                  mat-row
                  *matRowDef="let row; columns: sessionsDisplayedColumns"
                ></tr>
              </table>
            </div>
            <ng-template #noSessions>
              <div class="empty-state">
                <mat-icon>event</mat-icon>
                <p>لا توجد جلسات مسجلة</p>
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
                <span>بطاقة هوية الموظف</span>
              </div>
              <div class="barcode-container">
                <canvas
                  #barcodeCanvas
                  class="barcode-canvas"
                  width="350"
                  height="60"
                ></canvas>
                <div class="barcode-number">{{ employee?.nationalId }}</div>
              </div>
              <div class="barcode-info">
                <span>رقم الهوية: {{ employee?.nationalId }}</span>
                <span>تاريخ الإصدار: {{ today | date: 'dd/MM/yyyy' }}</span>
              </div>
            </div>
          </div>
        </mat-tab>

        <!-- Creation Info Tab -->
        <mat-tab label="معلومات النظام">
          <div class="tab-content" *ngIf="employee">
            <div class="info-grid">
              <div class="info-item">
                <mat-icon>person_add</mat-icon>
                <div>
                  <label>تم الإنشاء بواسطة</label>
                  <p>{{ employee.createdBy?.fullName || '-' }}</p>
                </div>
              </div>
              <div class="info-item">
                <mat-icon>schedule</mat-icon>
                <div>
                  <label>تاريخ الإنشاء</label>
                  <p>{{ employee.createdOn | date: 'dd/MM/yyyy HH:mm' }}</p>
                </div>
              </div>
              <div class="info-item" *ngIf="employee.lastModifiedBy">
                <mat-icon>edit</mat-icon>
                <div>
                  <label>تم التعديل بواسطة</label>
                  <p>{{ employee.lastModifiedBy?.fullName }}</p>
                </div>
              </div>
              <div class="info-item" *ngIf="employee.lastModifiedOn">
                <mat-icon>update</mat-icon>
                <div>
                  <label>تاريخ التعديل</label>
                  <p>
                    {{ employee.lastModifiedOn | date: 'dd/MM/yyyy HH:mm' }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </mat-tab>
      </mat-tab-group>

      <mat-divider></mat-divider>

      <!-- Modal Actions -->
      <div class="modal-actions">
        <button
          mat-raised-button
          color="accent"
          (click)="printProfileDocument()"
          matTooltip="طباعة الملف الكامل"
        >
          <mat-icon>description</mat-icon>
          طباعة الملف
        </button>
        <button
          mat-raised-button
          color="primary"
          (click)="printEmployeeCard()"
          matTooltip="طباعة البطاقة"
        >
          <mat-icon>credit_card</mat-icon>
          طباعة البطاقة
        </button>
        <button mat-raised-button color="primary" (click)="editEmployee()">
          <mat-icon>edit</mat-icon>
          تعديل الملف
        </button>
        <button mat-raised-button color="warn" (click)="deleteEmployee()">
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
  styles: [
    `
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

      .modal-header {
        flex-shrink: 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 20px 24px;
        background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
        color: white;
      }
      .header-title {
        display: flex;
        align-items: center;
        gap: 12px;
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
      }
      .close-btn {
        color: white;
        transition: transform 0.2s;
      }
      .close-btn:hover {
        transform: scale(1.1);
      }

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
        background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
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
      }
      .info-badges {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
      }

      .custom-tabs {
        flex: 1;
        overflow-y: auto;
      }
      .tab-content {
        padding: 20px;
        max-height: 50vh;
        overflow-y: auto;
      }

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
      }
      .info-item mat-icon {
        color: #f59e0b;
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
        margin-bottom: 2px;
      }
      .info-item p {
        margin: 0;
        font-size: 14px;
        color: #1f2937;
        font-weight: 500;
      }

      .financial-cards {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 16px;
      }
      .financial-card {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 16px;
        background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
        border-radius: 12px;
        color: white;
      }
      .financial-card mat-icon {
        font-size: 32px;
        width: 32px;
        height: 32px;
      }
      .financial-card.warning {
        background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
      }
      .financial-card.info {
        background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
      }
      .financial-card label {
        font-size: 11px;
        opacity: 0.9;
      }
      .financial-card h3 {
        margin: 4px 0 0;
        font-size: 18px;
      }

      .contacts-list,
      .departments-list,
      .courses-list {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 12px;
      }
      .contact-card,
      .department-card,
      .course-card {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px 16px;
        background: #f9fafb;
        border-radius: 12px;
      }
      .contact-card mat-icon,
      .department-card mat-icon,
      .course-card mat-icon {
        color: #f59e0b;
        font-size: 24px;
        width: 24px;
        height: 24px;
      }
      .contact-info label,
      .department-info h4,
      .course-info h4 {
        margin: 0 0 4px 0;
        font-size: 14px;
        font-weight: 600;
        color: #1f2937;
      }
      .contact-info p,
      .department-info p,
      .course-info p {
        margin: 0;
        font-size: 12px;
        color: #6b7280;
      }

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

      .loading-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 12px;
        padding: 40px;
        color: #64748b;
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
        color: #f59e0b;
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
        color: #f59e0b;
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
        padding: 16px 20px;
        background: white;
        border-top: 1px solid #e5e7eb;
      }

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
        .financial-cards {
          grid-template-columns: 1fr;
        }
        .contacts-list,
        .departments-list,
        .courses-list {
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
    `,
  ],
})
export class EmployeeDetailsModalComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  // Employee Data
  employee: EmployeeVTO;
  contacts: EmployeeContactVTO[] = [];
  sessions: CourseSessionVTO[] = [];
  sessionsDataSource = new MatTableDataSource<CourseSessionVTO>([]);
  sessionsDisplayedColumns: string[] = [
    'title',
    'course',
    'place',
    'sessionDate',
    'startTime',
    'endTime',
    'status',
  ];

  // Image
  imageUrl: string | null = null;
  private blobUrl: string | null = null;

  // Trainer Departments
  trainerDepartments: TrainerDepartmentVTO[] = [];
  isLoadingDepartments: boolean = false;
  private departmentsLoaded: boolean = false;

  // Trainer Courses
  trainerCourses: TrainerCourseVTO[] = [];
  isLoadingCourses: boolean = false;
  private coursesLoaded: boolean = false;

  // For card print
  today = new Date();

  @ViewChild('barcodeCanvas') barcodeCanvas!: ElementRef<HTMLCanvasElement>;

  constructor(
    private dialogRef: MatDialogRef<EmployeeDetailsModalComponent>,
    @Inject(MAT_DIALOG_DATA) private data: EmployeeVTO,
    private router: Router,
    private fileService: FileService,
    private employeeService: EmployeeService,
    private notification: NotificationService,
  ) {
    this.employee = data;
    this.contacts = data.contacts || [];
    this.sessions = data.sessions || [];
    this.sessionsDataSource.data = this.sessions;
  }

  ngOnInit(): void {
    this.loadImage();

    if (this.employee.employeeType?.id === 1) {
      console.log('Employee is a trainer, loading departments and courses...');
      this.loadTrainerDepartments();
      this.loadTrainerCourses();
    } else {
      console.log(
        'Employee is not a trainer, skipping departments and courses load',
      );
    }
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

  // ==================== Tab Change Handler ====================
  onTabChange(event: any): void {
    const tabIndex = event.index;
    console.log('Tab changed to index:', tabIndex);

    if (tabIndex === 3 && this.employee.employeeType?.id === 1) {
      console.log('Departments tab selected, loading departments...');
      this.loadTrainerDepartments();
    }

    if (event.tab && event.tab.textLabel === 'الدورات المسندة') {
      console.log('Courses tab selected, loading courses...');
      this.loadTrainerCourses();
    }
  }

  // ==================== Image Loading ====================
  loadImage(): void {
    const fid = this.employee.imageUrl;
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
        },
      });
    } else if (fid) {
      this.imageUrl = fid;
    } else {
      this.imageUrl = null;
    }
  }

  // ==================== Load Trainer Departments ====================
  loadTrainerDepartments(): void {
    if (this.departmentsLoaded) {
      console.log('Departments already loaded, skipping...');
      return;
    }

    if (this.employee.employeeType?.id !== 1) {
      console.log('Employee is not a trainer, skipping departments load');
      return;
    }

    console.log('Loading trainer departments for employee:', this.employee.id);
    this.isLoadingDepartments = true;
    this.employeeService
      .getTrainerDepartments({
        trainerId: this.employee.id,
        pageSize: 100,
      })
      .subscribe({
        next: (result) => {
          console.log('Departments loaded successfully:', result);
          this.trainerDepartments = result.items || [];
          this.departmentsLoaded = true;
          this.isLoadingDepartments = false;
        },
        error: (err) => {
          console.error('Error loading trainer departments:', err);
          this.notification.showError('حدث خطأ في تحميل أقسام المدرب');
          this.isLoadingDepartments = false;
        },
      });
  }

  // ==================== Load Trainer Courses ====================
  loadTrainerCourses(): void {
    if (this.coursesLoaded) {
      console.log('Courses already loaded, skipping...');
      return;
    }

    if (this.employee.employeeType?.id !== 1) {
      console.log('Employee is not a trainer, skipping courses load');
      return;
    }

    console.log('Loading trainer courses for employee:', this.employee.id);
    this.isLoadingCourses = true;
    this.employeeService
      .getTrainerCourses({
        trainerId: this.employee.id,
        pageSize: 100,
      })
      .subscribe({
        next: (result) => {
          console.log('Courses loaded successfully:', result);
          this.trainerCourses = result.items || [];
          this.coursesLoaded = true;
          this.isLoadingCourses = false;
        },
        error: (err) => {
          console.error('Error loading trainer courses:', err);
          this.notification.showError('حدث خطأ في تحميل دورات المدرب');
          this.isLoadingCourses = false;
        },
      });
  }

  // ==================== Helper Functions ====================
  getSessionStatusColor(statusId: number): string {
    const colors: { [key: number]: string } = {
      1: 'primary',
      2: 'accent',
      3: 'primary',
      4: 'warn',
    };
    return colors[statusId] || 'default';
  }

  getContactIcon(contactType: string): string {
    const icons: { [key: string]: string } = {
      جوال: 'phone_android',
      هاتف: 'phone',
      'بريد إلكتروني': 'email',
      واتساب: 'chat',
      فيسبوك: 'facebook',
      تويتر: 'twitter',
      انستجرام: 'instagram',
    };
    return icons[contactType] || 'contact_phone';
  }

  // ==================== Generate Barcode ====================
  generateBarcode(): void {
    if (this.barcodeCanvas?.nativeElement) {
      try {
        (JsBarcode as any)(
          this.barcodeCanvas.nativeElement,
          this.employee?.nationalId?.toString() || '000000',
          {
            format: 'CODE128',
            lineColor: '#000000',
            width: 1.5,
            height: 40,
            displayValue: true,
            fontSize: 10,
            font: 'monospace',
            textAlign: 'center',
            margin: 5,
          },
        );
      } catch (error) {
        console.error('Barcode error:', error);
      }
    }
  }

  // ==================== Actions ====================
  editEmployee(): void {
    this.dialogRef.close();
    this.router.navigate(['/employees', this.employee.id, 'edit']);
  }

  deleteEmployee(): void {
    this.dialogRef.close({ action: 'delete', employee: this.employee });
  }

  printEmployeeCard(): void {
    this.generateBarcode();
    setTimeout(() => {
      const barcodeImage =
        this.barcodeCanvas?.nativeElement?.toDataURL('image/png') || '';
      const printWindow = window.open('', '_blank', 'width=350,height=500');
      if (!printWindow) {
        this.notification.showError('تعذر فتح نافذة الطباعة');
        return;
      }

      const t = this.employee;
      const imagePreviewUrl = this.imageUrl || '';
      const today = new Date().toLocaleDateString('ar-EG');
      const genderDisplay = t.gender?.title || '-';
      const employeeTypeDisplay = t.employeeType?.title || '-';
      const departmentsText =
        this.trainerDepartments
          .map((d: any) => d.department?.title || d.title)
          .join(', ') || '-';
      const salaryDisplay = t.salary?.toLocaleString('ar-EG') || '0';

      // Use the main logo for both header and watermark
      const logoPath = 'assets/images/simpleLogo.jpeg';

      // Conditional photo section - only show if image exists
      const photoSection = imagePreviewUrl
        ? `
      <div class="thermal-photo">
        <img src="${imagePreviewUrl}" alt="${this.escapeHtml(t.fullName)}">
      </div>
    `
        : '';

      printWindow.document.write(`
      <!DOCTYPE html>
      <html dir="rtl">
      <head>
        <meta charset="UTF-8">
        <title>بطاقة هوية موظف</title>
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
            flex-direction: column;
            justify-content: flex-start;
            align-items: center;
            min-height: 100vh;
            padding-bottom: 2mm;
          }
          
          .thermal-card {
            width: 100%;
            max-width: 58mm;
            margin: 0;
            padding: 2.5mm 3mm 3.5mm 3mm;
            background: white;
            position: relative;
            overflow: hidden;
            direction: rtl;
            flex-shrink: 0;
          }
          
          /* ===== ENHANCED WATERMARK - Larger and more visible ===== */
          .card-watermark {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(-25deg) scale(1.8);
            opacity: 0.07;
            pointer-events: none;
            z-index: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;
            height: 100%;
          }
          
          .card-watermark img {
            width: 90px;
            height: auto;
            object-fit: contain;
            opacity: 0.9;
          }
          
          .card-watermark-text {
            position: absolute;
            top: 57%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(-25deg) scale(0.9);
            font-size: 18px;
            font-weight: 900;
            color: #f59e0b;
            letter-spacing: 4px;
            text-transform: uppercase;
            white-space: nowrap;
            opacity: 0.04;
            pointer-events: none;
            z-index: 0;
            text-shadow: 0 2px 8px rgba(245, 158, 11, 0.1);
          }
          
          /* ===== CONTENT - Above watermark ===== */
          .card-content {
            position: relative;
            z-index: 1;
            width: 100%;
          }
          
          /* ===== ENHANCED LOGO SECTION - Larger and more prominent ===== */
          .card-logo-section {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 2.5mm 0 2mm 0;
            margin-bottom: 2mm;
            border-bottom: 2.5px solid #f59e0b;
            justify-content: center;
            background: linear-gradient(to right, transparent, rgba(245, 158, 11, 0.05), transparent);
            border-radius: 2px;
          }
          
          .card-logo-image {
            width: 34px;
            height: 34px;
            object-fit: contain;
            border-radius: 50%;
            background: white;
            padding: 2px;
            border: 2px solid #f59e0b;
            flex-shrink: 0;
            box-shadow: 0 2px 8px rgba(245, 158, 11, 0.2);
          }
          
          .card-logo-text {
            display: flex;
            flex-direction: column;
            line-height: 1.2;
          }
          
          .card-logo-text .academy-name {
            font-size: 11px;
            font-weight: 700;
            color: #1a1a2e;
            letter-spacing: 0.5px;
          }
          
          .card-logo-text .card-type {
            font-size: 7px;
            color: #f59e0b;
            font-weight: 600;
            letter-spacing: 0.5px;
          }
          
          /* Compact Photo */
          .thermal-photo { 
            text-align: center; 
            margin-bottom: 1mm; 
          }
          .thermal-photo img { 
            width: 36px; 
            height: 36px; 
            border-radius: 50%; 
            object-fit: cover;
            border: 2px solid #f59e0b;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
          }
          
          /* Compact Name & ID */
          .thermal-name { 
            font-size: 11px; 
            font-weight: 700; 
            text-align: center; 
            margin-bottom: 0.5mm; 
            color: #1a1a2e;
            line-height: 1.2;
          }
          .thermal-id { 
            font-size: 8px; 
            color: #64748b; 
            text-align: center; 
            margin-bottom: 0.8mm; 
            font-weight: 500;
            letter-spacing: 0.5px;
          }
          
          /* Compact Divider */
          .thermal-divider { 
            border-top: 1px dashed #e5e7eb; 
            margin: 0.8mm 0; 
            opacity: 0.6;
          }
          
          /* Compact Table */
          .thermal-table { 
            width: 100%; 
            font-size: 7px; 
            margin-bottom: 0.8mm; 
            border-collapse: collapse; 
          }
          .thermal-table tr { 
            line-height: 1.3; 
          }
          .thermal-label { 
            text-align: right; 
            padding: 0.3mm 0.5mm; 
            color: #64748b; 
            width: 38%;
            font-weight: 500;
            font-size: 6.5px;
          }
          .thermal-value { 
            text-align: left; 
            padding: 0.3mm 0.5mm; 
            font-weight: 600; 
            width: 62%;
            color: #1e293b;
            font-size: 6.5px;
          }
          .thermal-value.amount { 
            color: #f59e0b; 
            font-weight: 700; 
          }
          .thermal-value.status-active { 
            color: #10b981; 
          }
          .thermal-value.status-inactive { 
            color: #ef4444; 
          }
          
          /* Compact Barcode */
          .thermal-barcode { 
            text-align: center; 
            margin: 0.8mm 0; 
          }
          .thermal-barcode img { 
            width: 100%; 
            max-width: 150px; 
          }
          .thermal-barcode-number { 
            font-size: 8px; 
            font-family: monospace; 
            text-align: center; 
            margin-top: 0.5mm; 
            color: #f59e0b;
            font-weight: 600;
            letter-spacing: 1.5px;
          }
          
          /* Compact Footer */
          .thermal-footer { 
            display: flex; 
            justify-content: space-between; 
            align-items: flex-start;
            gap: 2mm; 
            margin-top: 1.5mm; 
            padding-top: 1.5mm;
            border-top: 2px solid #f59e0b;
            position: relative;
          }
          .thermal-signature { 
            flex: 1; 
            text-align: center; 
            font-size: 5.5px; 
            color: #94a3b8;
          }
          .thermal-line { 
            border-top: 0.5px solid #94a3b8; 
            margin-bottom: 0.3mm; 
            padding-top: 3mm; 
          }
          
          /* ===== COPYRIGHT / DEVELOPMENT CREDIT - Centered at bottom of page ===== */
          .credit-wrapper {
            width: 100%;
            text-align: center;
            padding: 0.5mm 0 0 0;
            margin-top: 0.5mm;
            border-top: 0.5px dashed rgba(26, 26, 46, 0.15);
            flex-shrink: 0;
          }
          
          .credit-text {
            font-size: 4px;
            color: #1a1a2e;
            font-weight: 500;
            opacity: 0.6;
            letter-spacing: 0.3px;
            direction: ltr;
            white-space: nowrap;
          }
          
          .thermal-issue-date {
            text-align: center;
            font-size: 6px;
            color: #94a3b8;
            margin-top: 0.8mm;
            padding-top: 0.5mm;
            border-top: 1px dashed #e5e7eb;
          }
          
          @media print {
            body { 
              margin: 0; 
              padding: 0; 
              background: white; 
              padding-bottom: 1.5mm;
            }
            .thermal-card {
              padding: 2mm 2.5mm 2.5mm 2.5mm;
              border: none !important;
              box-shadow: none !important;
            }
            .card-watermark {
              opacity: 0.08 !important;
            }
            .card-watermark img {
              width: 80px !important;
            }
            .card-watermark-text {
              font-size: 16px !important;
              opacity: 0.05 !important;
            }
            .card-logo-image {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            .credit-text {
              opacity: 0.5 !important;
              color: #000000 !important;
            }
            .credit-wrapper {
              border-top-color: rgba(0, 0, 0, 0.1) !important;
            }
            .no-print { 
              display: none !important; 
            }
          }
          
          @media screen {
            .thermal-card {
              box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
              border: 1px solid #e5e7eb;
              border-radius: 6px;
            }
            .credit-wrapper {
              opacity: 0.8;
            }
          }
        </style>
      </head>
      <body>
        <!-- ===== CARD ===== -->
        <div class="thermal-card">
          <!-- ===== ENHANCED WATERMARK - Larger logo and text ===== -->
          <div class="card-watermark">
            <img src="${logoPath}" alt="الأكاديمية الأولمبية">
          </div>
          <div class="card-watermark-text">الأكاديمية الأولمبية</div>
          
          <!-- ===== CONTENT ===== -->
          <div class="card-content">
            <!-- ===== ENHANCED LOGO AT TOP - Larger and more professional ===== -->
            <div class="card-logo-section">
              <img src="${logoPath}" alt="الأكاديمية الأولمبية" class="card-logo-image">
              <div class="card-logo-text">
                <span class="academy-name">🏛️ الأكاديمية الأولمبية</span>
                <span class="card-type">✦ بطاقة هوية موظف ✦</span>
              </div>
            </div>
            
            <!-- ===== PHOTO - Only shown if image exists ===== -->
            ${photoSection}
            
            <!-- ===== NAME & ID ===== -->
            <div class="thermal-name">${this.escapeHtml(t.fullName) || ''}</div>
            <div class="thermal-id">🆔 ${t.nationalId || ''}</div>
            
            <div class="thermal-divider"></div>
            
            <!-- ===== INFO TABLE ===== -->
            <table class="thermal-table">
              <tr>
                <td class="thermal-label">🧑 النوع</td>
                <td class="thermal-value">${employeeTypeDisplay}</td>
              </tr>
              <tr>
                <td class="thermal-label">👤 الجنس</td>
                <td class="thermal-value">${genderDisplay}</td>
              </tr>
              <tr>
                <td class="thermal-label">📅 التوظيف</td>
                <td class="thermal-value">${t.hireDate ? new Date(t.hireDate).toLocaleDateString('ar-EG') : '-'}</td>
              </tr>
              <tr>
                <td class="thermal-label">🏢 الأقسام</td>
                <td class="thermal-value" style="font-size:6px;">${departmentsText}</td>
              </tr>
              <tr>
                <td class="thermal-label">💰 الراتب</td>
                <td class="thermal-value amount">${salaryDisplay} جم</td>
              </tr>
              <tr>
                <td class="thermal-label">✓ الحالة</td>
                <td class="thermal-value ${t.isActive ? 'status-active' : 'status-inactive'}">${t.isActive ? '✅ نشط' : '⛔ غير نشط'}</td>
              </tr>
            </table>
            
            <div class="thermal-divider"></div>
            
            <!-- ===== BARCODE ===== -->
            <div class="thermal-barcode">
              <img src="${barcodeImage}" alt="Barcode">
              <div class="thermal-barcode-number">${t.nationalId || ''}</div>
            </div>
            
            <!-- ===== FOOTER ===== -->
            <div class="thermal-footer">
              <div class="thermal-signature">
                <div class="thermal-line"></div>
                <div>توقيع الموظف</div>
              </div>
              <div class="thermal-signature">
                <div class="thermal-line"></div>
                <div>ختم الأكاديمية</div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- ===== COPYRIGHT CREDIT - At the very bottom of the page ===== -->
        <div class="credit-wrapper">
          <span class="credit-text">powered by CoreStack Solutions | 01069911181</span>
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

  // ==================== Print Complete Profile (ملف) ====================
  printProfileDocument(): void {
    this.generateBarcode();
    setTimeout(() => {
      const barcodeImage =
        this.barcodeCanvas?.nativeElement?.toDataURL('image/png') || '';
      const printWindow = window.open(
        '',
        '_blank',
        'width=800,height=800,scrollbars=yes',
      );
      if (!printWindow) {
        this.notification.showError('تعذر فتح نافذة الطباعة');
        return;
      }

      const t = this.employee;
      const imagePreviewUrl = this.imageUrl || '';
      const today = new Date().toLocaleDateString('ar-EG');
      const genderDisplay = t.gender?.title || '-';
      const employeeTypeDisplay = t.employeeType?.title || '-';
      const salaryTypeDisplay = t.salaryType?.title || '-';
      const isTrainer = t.employeeType?.id === 1;

      // Departments
      const departmentsList =
        this.trainerDepartments.length > 0
          ? this.trainerDepartments
              .map((d: any) => d.department?.title || d.title)
              .join('، ')
          : 'لا يوجد';

      // Courses
      const coursesList =
        this.trainerCourses.length > 0
          ? this.trainerCourses
              .map((c: any) => c.course?.title || c.title)
              .join('، ')
          : 'لا يوجد';

      // Contacts
      const contactsList =
        this.contacts.length > 0
          ? this.contacts
              .map((c: any) => `${c.contactType?.title}: ${c.contactValue}`)
              .join(' | ')
          : 'لا توجد جهات اتصال';

      // Sessions
      let sessionsHtml = '';
      if (this.sessions.length > 0) {
        sessionsHtml = this.sessions
          .map(
            (s: any) => `
          <tr>
            <td>${this.escapeHtml(s.title) || '-'}</td>
            <td>${s.course?.title || '-'}</td>
            <td>${s.place?.title || '-'}</td>
            <td>${s.sessionDate ? new Date(s.sessionDate).toLocaleDateString('ar-EG') : '-'}</td>
            <td>${s.startTime || '-'}</td>
            <td>${s.endTime || '-'}</td>
            <td>${s.status?.title || '-'}</td>
          </tr>
        `,
          )
          .join('');
      }

      printWindow.document.write(`
        <!DOCTYPE html>
        <html dir="rtl">
        <head>
          <meta charset="UTF-8">
          <title>ملف موظف - ${this.escapeHtml(t.fullName)}</title>
          <style>
            * { font-family: 'Cairo', 'Segoe UI', Tahoma, sans-serif; }
            @media print { body { margin: 0; padding: 15px; } .no-print { display: none; } }
            body { max-width: 900px; margin: 0 auto; padding: 15px; background: white; direction: rtl; }
            .header {
              text-align: center;
              margin-bottom: 15px;
              padding: 15px;
              background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
              color: white;
              border-radius: 8px;
            }
            .header h1 { margin: 0; font-size: 20px; }
            .header p { margin: 5px 0 0; font-size: 11px; opacity: 0.85; }
            .profile-details {
              display: flex;
              justify-content: space-between;
              margin-bottom: 12px;
              padding: 8px 12px;
              background: #f9fafb;
              border-radius: 6px;
              font-size: 11px;
            }
            .photo-section { text-align: center; margin-bottom: 12px; }
            .photo-section img {
              width: 80px;
              height: 80px;
              border-radius: 50%;
              object-fit: cover;
              border: 3px solid #f59e0b;
            }
            .photo-section .placeholder {
              width: 80px;
              height: 80px;
              border-radius: 50%;
              background: #f3f4f6;
              display: inline-flex;
              align-items: center;
              justify-content: center;
              border: 3px solid #f59e0b;
              font-size: 32px;
            }
            .badges { display: flex; gap: 6px; justify-content: center; flex-wrap: wrap; margin-top: 6px; }
            .badge {
              padding: 2px 10px;
              border-radius: 12px;
              font-size: 10px;
              font-weight: 600;
            }
            .badge.active { background: #d1fae5; color: #065f46; }
            .badge.inactive { background: #fee2e2; color: #991b1b; }
            .badge.trainer { background: #dbeafe; color: #1e40af; }
            .badge.manager { background: #fef3c7; color: #92400e; }
            h2 {
              color: #f59e0b;
              border-bottom: 2px solid #f59e0b;
              padding-bottom: 4px;
              margin-top: 16px;
              margin-bottom: 10px;
              font-size: 14px;
            }
            .info-grid {
              display: grid;
              grid-template-columns: repeat(3, 1fr);
              gap: 6px 16px;
              margin-bottom: 10px;
            }
            .info-item {
              display: flex;
              justify-content: space-between;
              padding: 3px 0;
              border-bottom: 1px solid #f1f5f9;
              font-size: 11px;
            }
            .info-item .label { font-weight: 600; color: #475569; }
            .info-item .value { color: #0f172a; font-weight: 500; }
            .info-item .value.amount { color: #f59e0b; font-weight: 700; }
            .full-width { grid-column: span 3; }
            .session-table {
              width: 100%;
              border-collapse: collapse;
              font-size: 10px;
              margin-bottom: 10px;
            }
            .session-table th {
              background: #f8fafc;
              color: #1e293b;
              padding: 4px 6px;
              border: 1px solid #e5e7eb;
              text-align: center;
              font-weight: 600;
            }
            .session-table td {
              padding: 3px 6px;
              border: 1px solid #e5e7eb;
              text-align: center;
            }
            .barcode-section {
              text-align: center;
              margin: 16px 0;
              padding: 12px;
              background: #f9fafb;
              border-radius: 8px;
            }
            .barcode-section img {
              max-width: 250px;
            }
            .barcode-number {
              font-size: 12px;
              font-weight: 600;
              color: #f59e0b;
              font-family: monospace;
              margin-top: 4px;
              letter-spacing: 1px;
            }
            .signature-section {
              display: flex;
              justify-content: space-between;
              gap: 16px;
              margin-top: 20px;
              padding-top: 12px;
              border-top: 1px solid #e5e7eb;
            }
            .signature-box { text-align: center; flex: 1; }
            .signature-line {
              width: 100%;
              border-top: 1px solid #000;
              margin-top: 30px;
              padding-top: 4px;
              font-size: 9px;
            }
            .footer {
              text-align: center;
              margin-top: 16px;
              padding: 8px;
              font-size: 9px;
              color: #94a3b8;
              border-top: 1px solid #e5e7eb;
            }
            @media (max-width: 600px) {
              .info-grid { grid-template-columns: 1fr; }
              .full-width { grid-column: span 1; }
              .signature-section { flex-direction: column; align-items: center; gap: 20px; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>📋 ملف الموظف</h1>
            <p>نظام إدارة الأكاديمية الأولمبية</p>
          </div>
          
          <div class="profile-details">
            <div><strong>رقم الملف:</strong> #${t.id}</div>
            <div><strong>تاريخ الطباعة:</strong> ${today}</div>
          </div>

          <div class="photo-section">
            ${imagePreviewUrl ? `<img src="${imagePreviewUrl}" alt="${t.fullName}">` : '<div class="placeholder">👤</div>'}
            <div style="margin-top:6px;font-size:14px;font-weight:700;">${this.escapeHtml(t.fullName)}</div>
            <div class="badges">
              <span class="badge ${t.isActive ? 'active' : 'inactive'}">${t.isActive ? '✅ نشط' : '⛔ غير نشط'}</span>
              <span class="badge ${t.employeeType?.id === 1 ? 'trainer' : 'manager'}">${employeeTypeDisplay}</span>
              <span class="badge" style="background:#f1f5f9;color:#475569;">${t.nationalId}</span>
              <span class="badge" style="background:#fef3c7;color:#92400e;">${genderDisplay}</span>
            </div>
          </div>

          <h2>📋 المعلومات الشخصية</h2>
          <div class="info-grid">
            <div class="info-item"><span class="label">الاسم الكامل</span><span class="value">${this.escapeHtml(t.fullName) || '-'}</span></div>
            <div class="info-item"><span class="label">رقم الهوية</span><span class="value">${t.nationalId || '-'}</span></div>
            <div class="info-item"><span class="label">تاريخ الميلاد</span><span class="value">${t.birthDate ? new Date(t.birthDate).toLocaleDateString('ar-EG') : '-'}</span></div>
            <div class="info-item"><span class="label">الجنس</span><span class="value">${genderDisplay}</span></div>
            <div class="info-item"><span class="label">نوع الموظف</span><span class="value">${employeeTypeDisplay}</span></div>
            <div class="info-item"><span class="label">تاريخ التوظيف</span><span class="value">${t.hireDate ? new Date(t.hireDate).toLocaleDateString('ar-EG') : '-'}</span></div>
            <div class="info-item"><span class="label">تاريخ التسجيل</span><span class="value">${t.createdOn ? new Date(t.createdOn).toLocaleDateString('ar-EG') : '-'}</span></div>
            <div class="info-item"><span class="label">تمت الإضافة بواسطة</span><span class="value">${t.createdBy?.fullName || '-'}</span></div>
            ${t.lastModifiedOn ? `<div class="info-item"><span class="label">آخر تحديث</span><span class="value">${new Date(t.lastModifiedOn).toLocaleDateString('ar-EG')}</span></div>` : ''}
          </div>

          <h2>💰 المعلومات المالية</h2>
          <div class="info-grid">
            <div class="info-item"><span class="label">الراتب الأساسي</span><span class="value amount">${t.salary?.toLocaleString('ar-EG') || 0} جم</span></div>
            <div class="info-item"><span class="label">الراتب المتبقي</span><span class="value">${t.remainedSalary?.toLocaleString('ar-EG') || 0} جم</span></div>
            <div class="info-item"><span class="label">نوع الراتب</span><span class="value">${salaryTypeDisplay}</span></div>
          </div>

          <h2>🏢 الأقسام</h2>
          <div class="info-grid">
            <div class="info-item full-width"><span class="label">الأقسام المسندة</span><span class="value">${departmentsList}</span></div>
          </div>

          ${
            isTrainer
              ? `
          <h2>📚 الدورات المسندة</h2>
          <div class="info-grid">
            <div class="info-item full-width"><span class="label">الدورات</span><span class="value">${coursesList}</span></div>
          </div>
          `
              : ''
          }

          <h2>📞 جهات الاتصال</h2>
          <div class="info-grid">
            <div class="info-item full-width"><span class="label">جهات الاتصال</span><span class="value">${contactsList}</span></div>
          </div>

          ${
            this.sessions.length > 0
              ? `
          <h2>📅 الجلسات</h2>
          <table class="session-table">
            <thead>
              <tr><th>العنوان</th><th>الدورة</th><th>المكان</th><th>التاريخ</th><th>البدء</th><th>الانتهاء</th><th>الحالة</th></tr>
            </thead>
            <tbody>${sessionsHtml}</tbody>
          </table>
          `
              : ''
          }

          <h2>📱 الباركود</h2>
          <div class="barcode-section">
            <img src="${barcodeImage}" alt="Barcode">
            <div class="barcode-number">${t.nationalId || ''}</div>
          </div>

          <div class="signature-section">
            <div class="signature-box"><div class="signature-line"></div><div>توقيع الموظف</div></div>
            <div class="signature-box"><div class="signature-line"></div><div>توقيع مدير الموارد البشرية</div></div>
            <div class="signature-box"><div class="signature-line"></div><div>ختم الأكاديمية</div></div>
          </div>

          <div class="footer">تم التصدير من نظام إدارة الأكاديمية الأولمبية</div>
          
          <div class="no-print" style="text-align:center;margin-top:12px;">
            <button onclick="window.print();" style="padding:8px 24px;background:linear-gradient(135deg,#f59e0b 0%,#d97706 100%);color:white;border:none;border-radius:6px;cursor:pointer;font-size:12px;">🖨️ طباعة / حفظ كـ PDF</button>
          </div>
        </body>
        </html>
      `);
      printWindow.document.close();
    }, 300);
  }

  // ==================== Utility Function ====================
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
