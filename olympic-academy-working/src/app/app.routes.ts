import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { AuthGuard } from './core/auth/guards/auth.guard';

export const routes: Routes = [
  // مسارات المصادقة (بدون حماية)
  { path: 'login', loadComponent: () => import('./core/auth/pages/login/login.component').then(m => m.LoginComponent) },
  { path: 'register', loadComponent: () => import('./core/auth/pages/register/register.component').then(m => m.RegisterComponent) },
  { path: 'activate', loadComponent: () => import('./core/auth/pages/activate-account/activate-account.component').then(m => m.ActivateAccountComponent) },
  { path: 'forgot-password', loadComponent: () => import('./core/auth/pages/forgot-password/forgot-password.component').then(m => m.ForgotPasswordComponent) },
  { path: 'reset-password', loadComponent: () => import('./core/auth/pages/reset-password/reset-password.component').then(m => m.ResetPasswordComponent) },


  // المسارات المحمية (تتطلب تسجيل دخول)
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      
      // الوحدات الرئيسية
      { path: 'departments', loadChildren: () => import('./features/departments/department.module').then(m => m.DepartmentsModule) },
      { path: 'courses', loadChildren: () => import('./features/courses/course.module').then(m => m.CoursesModule) },
      { path: 'employees', loadChildren: () => import('./features/employees/employees.module').then(m => m.EmployeesModule) },
      { path: 'trainees', loadChildren: () => import('./features/trainees/trainees.module').then(m => m.TraineesModule) },
      { path: 'enrollments', loadChildren: () => import('./features/enrollments/enrollments.module').then(m => m.EnrollmentsModule) },
      { path: 'places', loadChildren: () => import('./features/places/places.module').then(m => m.PlacesModule) },
      { path: 'financial', loadChildren: () => import('./features/financial/financial.module').then(m => m.FinancialModule) },
      
      // ============================================
      // الحضور (Attendance)
      // ============================================
      { 
      path: 'attendance/employee', 
      loadComponent: () => import('./features/employees/pages/employee-attendance/employee-attendance.component')
        .then(m => m.EmployeeAttendanceComponent) 
     },
      { 
    path: 'trainees/attendance', 
    loadComponent: () => import('./features/trainees/pages/trainee-attendance/trainee-attendance.component')
      .then(m => m.TraineeAttendanceComponent) 
    },

    {
      path: 'sessions',
      loadChildren: () => import('./features/course-session/course-session.module').then(m => m.CourseSessionModule)
    },
      
      // ============================================
      // التقارير (Reports)
      // ============================================
      { 
        path: 'reports/attendance', 
        loadComponent: () => import('./features/employees/reports/attendance-report/attendance-report.component')
          .then(m => m.AttendanceReportComponent) 
      },
      { 
        path: 'reports/employee', 
        loadComponent: () => import('./features/employees/reports/employee-report/employee-report.component')
          .then(m => m.EmployeeReportComponent) 
      },
      { 
        path: 'reports/trainee', 
        loadComponent: () => import('./features/trainees/reports/trainee-report/trainee-report.component')
          .then(m => m.TraineeReportComponent) 
      },
      { 
        path: 'reports/enrollment', 
        loadComponent: () => import('./features/enrollments/reports/enrollment-report/enrollment-report.component')
          .then(m => m.EnrollmentReportComponent) 
      },
      { 
        path: 'reports/course', 
        loadComponent: () => import('./features/courses/reports/courses-reports/course-report.component')
          .then(m => m.CourseReportComponent) 
      },
      { 
        path: 'reports/financial', 
        loadComponent: () => import('./features/financial/reports/financial-report/financial-report.component')
          .then(m => m.FinancialReportComponent) 
      }
    ]
  },

  // إعادة توجيه أي مسار غير معروف إلى login
  { path: '**', redirectTo: 'login' }
];