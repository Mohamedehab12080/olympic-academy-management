import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';

import { FinancialService } from '../../../../../core/services/financial.service';
import { NotificationService } from '../../../../../core/services/notification.service';

@Component({
  selector: 'app-payment-method-list',
  standalone: false,
  template: `
    <div class="container">
      <div class="header">
        <h1>طرق الدفع</h1>
        <button mat-raised-button color="primary" routerLink="/financial/payment-methods/new">
          <mat-icon>add</mat-icon> طريقة دفع جديدة
        </button>
      </div>

      <mat-card>
        <mat-form-field appearance="outline" class="search-field">
          <mat-label>بحث</mat-label>
          <input matInput (keyup)="applyFilter($event)" placeholder="ابحث عن طريقة دفع">
          <mat-icon matSuffix>search</mat-icon>
        </mat-form-field>

        <div class="table-container">
          <table mat-table [dataSource]="dataSource" matSort>
            <ng-container matColumnDef="id"><th mat-header-cell *matHeaderCellDef>#</th><td mat-cell *matCellDef="let item">{{ item.id }}<\/td><\/ng-container>
            <ng-container matColumnDef="title"><th mat-header-cell *matHeaderCellDef>الاسم</th><td mat-cell *matCellDef="let item">{{ item.title }}<\/td><\/ng-container>
            <ng-container matColumnDef="actions"><th mat-header-cell *matHeaderCellDef>الإجراءات</th><td mat-cell *matCellDef="let item"><button mat-icon-button color="primary" [routerLink]="['/financial/payment-methods', item.id, 'edit']"><mat-icon>edit</mat-icon><\/button><button mat-icon-button color="warn" (click)="deleteItem(item)"><mat-icon>delete</mat-icon><\/button><\/td><\/ng-container>
            <tr mat-header-row *matHeaderRowDef="displayedColumns"><\/tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;"><\/tr>
          <\/table>
          <mat-paginator [pageSize]="10" [pageSizeOptions]="[5,10,25,50]" showFirstLastButtons><\/mat-paginator>
        <\/div>
      <\/mat-card>
    <\/div>
  `,
  styles: [`
    .container { padding: 24px; }
    .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
    .search-field { width: 100%; margin-bottom: 20px; }
    .table-container { overflow-x: auto; }
  `]
})
export class PaymentMethodListComponent implements OnInit {
  displayedColumns = ['id', 'title', 'actions'];
  dataSource = new MatTableDataSource<any>([]);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private financialService: FinancialService,
    private notification: NotificationService,
    private dialog: MatDialog
  ) {}

  ngOnInit() { this.loadData(); }
  ngAfterViewInit() { this.dataSource.paginator = this.paginator; this.dataSource.sort = this.sort; }

  loadData() {
    this.financialService.getAllPaymentMethods().subscribe({
      next: (res: any) => { this.dataSource.data = res.items; },
      error: () => { this.notification.showError('حدث خطأ في تحميل البيانات'); }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  deleteItem(item: any) {
    if (confirm(`هل أنت متأكد من حذف "${item.title}"؟`)) {
      this.financialService.deletePaymentMethod(item.id).subscribe({
        next: () => { this.notification.showSuccess('تم الحذف بنجاح'); this.loadData(); },
        error: () => { this.notification.showError('حدث خطأ في الحذف'); }
      });
    }
  }
}