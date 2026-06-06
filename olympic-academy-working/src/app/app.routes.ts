import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      
      // الوحدات الرئيسية
      { path: 'departments', loadChildren: () => import('./features/departments/department.module').then(m => m.DepartmentsModule) },
      { path: 'courses', loadChildren: () => import('./features/courses/course.module').then(m => m.CoursesModule) },
      { path: 'employees', loadChildren: () => import('./features/employees/employees.module').then(m => m.EmployeesModule) },
      { path: 'trainees', loadChildren: () => import('./features/trainees/trainess.module').then(m => m.TraineesModule) },
      { path: 'enrollments', loadChildren: () => import('./features/enrollments/enrollments.module').then(m => m.EnrollmentsModule) },
      { path: 'places', loadChildren: () => import('./features/places/places.module').then(m => m.PlacesModule) },
      { path: 'financial', loadChildren: () => import('./features/financial/financial.module').then(m => m.FinancialModule) },
      
      // ============================================
      // التقارير المنفصلة (Standalone Components)
      // ============================================
      
      // تقرير التسجيلات
      { 
        path: 'reports/enrollment', 
        loadComponent: () => import('./features/enrollments/reports/enrollment-report/enrollment-report.component')
          .then(m => m.EnrollmentReportComponent) 
      },
      
      // تقرير المتدربين
      { 
        path: 'reports/trainee', 
        loadComponent: () => import('./features/trainees/reports/trainee-report/trainee-report.component')
          .then(m => m.TraineeReportComponent) 
      },
      
      // تقرير الموظفين
      { 
        path: 'reports/employee', 
        loadComponent: () => import('./features/employees/reports/employee-report/employee-report.component')
          .then(m => m.EmployeeReportComponent) 
      },
      
      // تقرير الحضور
      { 
        path: 'reports/attendance', 
        loadComponent: () => import('./features/employees/reports/attendance-report/attendance-report.component')
          .then(m => m.AttendanceReportComponent) 
      },
      
      // تقرير الدورات
      { 
        path: 'reports/course', 
        loadComponent: () => import('./features/courses/reports/course-report/course-report.component')
          .then(m => m.CourseReportComponent) 
      }
    ]
  }
];