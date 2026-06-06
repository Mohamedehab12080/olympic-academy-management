import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { FinancialService } from '../../../../../../core/services/financial.service';
import { NotificationService } from '../../../../../../core/services/notification.service';

@Component({
  selector: 'app-rent-type-list',
  standalone: false,
  template: `
    <div class="container">
      <div class="header">
        <h1>أنواع الإيجار</h1>
        <button mat-raised-button color="primary" routerLink="/financial/rent-types/new">
          <mat-icon>add</mat-icon> نوع إيجار جديد
        </button>
      </div>

      <mat-card>
        <mat-form-field appearance="outline" class="search-field">
          <mat-label>بحث</mat-label>
          <input matInput (keyup)="applyFilter($event)" placeholder="ابحث عن نوع إيجار">
          <mat-icon matSuffix>search</mat-icon>
        </mat-form-field>

        <div class="table-container">
          <table mat-table [dataSource]="dataSource" matSort>
            <ng-container matColumnDef="id">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>#</th>
              <td mat-cell *matCellDef="let item">{{ item.id }}<\/td>
            <\/ng-container>

            <ng-container matColumnDef="title">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>الاسم</th>
              <td mat-cell *matCellDef="let item">{{ item.title }}<\/td>
            <\/ng-container>

            <ng-container matColumnDef="description">
              <th mat-header-cell *matHeaderCellDef>الوصف</th>
              <td mat-cell *matCellDef="let item">{{ item.description || '-' }}<\/td>
            <\/ng-container>

            <ng-container matColumnDef="createdOn">
              <th mat-header-cell *matHeaderCellDef>تاريخ الإنشاء</th>
              <td mat-cell *matCellDef="let item">{{ item.createdOn | date:'dd/MM/yyyy' }}<\/td>
            <\/ng-container>

            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>الإجراءات</th>
              <td mat-cell *matCellDef="let item">
                <button mat-icon-button color="primary" [routerLink]="['/financial/rent-types', item.id, 'edit']">
                  <mat-icon>edit</mat-icon>
                <\/button>
                <button mat-icon-button color="warn" (click)="deleteItem(item)">
                  <mat-icon>delete</mat-icon>
                <\/button>
              <\/td>
            <\/ng-container>

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
export class RentTypeListComponent implements OnInit {
  displayedColumns = ['id', 'title', 'description', 'createdOn', 'actions'];
  dataSource = new MatTableDataSource<any>([]);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private financialService: FinancialService,
    private notification: NotificationService
  ) {}

  ngOnInit() { this.loadData(); }
  ngAfterViewInit() { this.dataSource.paginator = this.paginator; this.dataSource.sort = this.sort; }

  loadData() {
    this.financialService.getAllRentTypes().subscribe({
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
      this.financialService.deleteRentType(item.id).subscribe({
        next: () => { this.notification.showSuccess('تم الحذف بنجاح'); this.loadData(); },
        error: () => { this.notification.showError('حدث خطأ في الحذف'); }
      });
    }
  }
}