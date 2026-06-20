// employees.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

// Material Imports
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDividerModule } from '@angular/material/divider';
import { MatCheckboxModule } from '@angular/material/checkbox';

// Components - Employee
import { EmployeeListComponent } from './pages/employee-list/employee-list.component';
import { EmployeeAttendanceComponent } from './pages/employee-attendance/employee-attendance.component';
import { EmployeeWizardModalComponent } from './pages/employee-form/employee-wizard-modal.component';

// Components - Trainer Assignments
import { TrainerDepartmentsListComponent } from './pages/trainers/trainer-departments-list/trainer-departments-list.component';
import { TrainerCoursesListComponent } from './pages/trainers/trainer-course-list/trainer-course-list.component';
import { AssignDepartmentWizardModalComponent } from './pages/trainers/assign-department-wizard/assign-department-wizard-modal.component';
import { AssignCourseWizardModalComponent } from './pages/trainers/assign-course-wizard/assign-course-wizard-modal.component';

const routes: Routes = [
  { 
    path: '', 
    component: EmployeeListComponent 
  },
  { 
    path: 'attendance', 
    component: EmployeeAttendanceComponent 
  },
  { 
    path: 'trainer-departments', 
    component: TrainerDepartmentsListComponent,
    data: { title: 'إدارة أقسام المدربين' }
  },
  { 
    path: 'trainer-courses', 
    component: TrainerCoursesListComponent,
    data: { title: 'إدارة دورات المدربين' }
  }
];

@NgModule({
  declarations: [], // All components are standalone
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    FormsModule,
    
    // Material Modules
    MatTableModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatSortModule,
    MatDialogModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatTooltipModule,
    MatTabsModule,
    MatDividerModule,
    MatCheckboxModule,
    
    // Employee Components - Import standalone components
    EmployeeListComponent,
    EmployeeAttendanceComponent,
    EmployeeWizardModalComponent,
    
    // Trainer Assignment Components - Import standalone components
    TrainerDepartmentsListComponent,
    TrainerCoursesListComponent,
    AssignDepartmentWizardModalComponent,
    AssignCourseWizardModalComponent
  ]
})
export class EmployeesModule { }