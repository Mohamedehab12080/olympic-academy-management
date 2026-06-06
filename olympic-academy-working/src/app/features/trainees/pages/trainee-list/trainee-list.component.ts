import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { TraineeService } from '../../../../core/services/trainee.service';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-trainee-list',
  template: `
    <div class="trainees-container">
      <div class="page-header">
        <h2>إدارة المتدربين</h2>
        <button mat-raised-button color="primary" routerLink="/trainees/new">
          <mat-icon>add</mat-icon> متدرب جديد
        </button>
      </div>

      <mat-card>
        <mat-form-field appearance="outline" class="search-field">
          <mat-label>بحث</mat-label>
          <input matInput (keyup)="applyFilter($event)" placeholder="ابحث باسم المتدرب أو رقم الهوية">
          <mat-icon matSuffix>search</mat-icon>
        </mat-form-field>

        <div class="table-container" *ngIf="!isLoading; else loading">
          <table mat-table [dataSource]="dataSource" matSort class="full-width">
            <ng-container matColumnDef="id"><th mat-header-cell *matHeaderCellDef mat-sort-header>#</th><td mat-cell *matCellDef="let t">{{ t.id }}</td></ng-container>
            <ng-container matColumnDef="fullName"><th mat-header-cell *matHeaderCellDef mat-sort-header>الاسم</th><td mat-cell *matCellDef="let t">{{ t.fullName }}</td></ng-container>
            <ng-container matColumnDef="nationalId"><th mat-header-cell *matHeaderCellDef>رقم الهوية</th><td mat-cell *matCellDef="let t">{{ t.nationalId }}</td></ng-container>
            <ng-container matColumnDef="academicYear"><th mat-header-cell *matHeaderCellDef>السنة الدراسية</th><td mat-cell *matCellDef="let t">{{ t.academicYear }}</td></ng-container>
            <ng-container matColumnDef="gender"><th mat-header-cell *matHeaderCellDef>الجنس</th><td mat-cell *matCellDef="let t">{{ t.gender?.title }}</td></ng-container>
            <ng-container matColumnDef="status"><th mat-header-cell *matHeaderCellDef>الحالة</th><td mat-cell *matCellDef="let t"><mat-chip [color]="t.isActive ? 'primary' : 'warn'">{{ t.isActive ? 'نشط' : 'غير نشط' }}</mat-chip></td></ng-container>
            <ng-container matColumnDef="actions"><th mat-header-cell *matHeaderCellDef>الإجراءات</th><td mat-cell *matCellDef="let t"><button mat-icon-button color="primary" [routerLink]="['/trainees', t.id, 'edit']"><mat-icon>edit</mat-icon></button><button mat-icon-button color="warn" (click)="deleteTrainee(t)"><mat-icon>delete</mat-icon></button></td></ng-container>
            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr><tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
          </table>
          <mat-paginator [pageSize]="10" [pageSizeOptions]="[5, 10, 25, 50]"></mat-paginator>
        </div>
        <ng-template #loading><div class="loading-spinner"><mat-spinner diameter="40"></mat-spinner></div></ng-template>
      </mat-card>
    </div>
  `,
  styles: [`
    .trainees-container { padding: 24px; }
    .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
    .page-header h2 { margin: 0; font-size: 24px; }
    .search-field { width: 100%; margin-bottom: 20px; }
    .table-container { overflow-x: auto; }
    .full-width { width: 100%; }
    .loading-spinner { display: flex; justify-content: center; padding: 40px; }
  `]
})
export class TraineeListComponent implements OnInit {
  displayedColumns = ['id', 'fullName', 'nationalId', 'academicYear', 'gender', 'status', 'actions'];
  dataSource = new MatTableDataSource<any>([]);
  isLoading = false;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private traineeService: TraineeService, private notification: NotificationService) {}

  ngOnInit() { this.loadTrainees(); }
  ngAfterViewInit() { this.dataSource.paginator = this.paginator; this.dataSource.sort = this.sort; }

  loadTrainees() {
    this.isLoading = true;
    this.traineeService.getAllTraineesByFilter().subscribe({
      next: (res: any) => { this.dataSource.data = res.items; this.isLoading = false; },
      error: () => { this.notification.showError('حدث خطأ في تحميل المتدربين'); this.isLoading = false; }
    });
  }

  applyFilter(event: Event) {
    this.dataSource.filter = (event.target as HTMLInputElement).value.trim().toLowerCase();
    if (this.dataSource.paginator) this.dataSource.paginator.firstPage();
  }

  deleteTrainee(trainee: any) {
    if (confirm(`هل أنت متأكد من حذف المتدرب "${trainee.fullName}"؟`)) {
      this.traineeService.deleteTrainee(trainee.id).subscribe({
        next: () => { this.notification.showSuccess('تم حذف المتدرب بنجاح'); this.loadTrainees(); },
        error: () => this.notification.showError('حدث خطأ في الحذف')
      });
    }
  }
}