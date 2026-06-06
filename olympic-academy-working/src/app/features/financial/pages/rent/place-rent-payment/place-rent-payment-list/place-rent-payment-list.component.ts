import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { FinancialService } from '../../../../../../core/services/financial.service';
import { PlaceService } from '../../../../../../core/services/place.service';
import { NotificationService } from '../../../../../../core/services/notification.service';

@Component({
  selector: 'app-place-rent-payment-list',
  standalone: false,
  template: `
    <div class="container">
      <div class="header">
        <h1>مدفوعات إيجار المواقع</h1>
        <button mat-raised-button color="primary" routerLink="/financial/place-rent-payments/new">
          <mat-icon>add</mat-icon> دفعة جديدة
        </button>
      </div>

      <mat-card>
        <div class="filters">
          <mat-form-field appearance="outline"><mat-label>بحث</mat-label><input matInput (keyup)="applyFilter($event)" placeholder="بحث"><\/mat-form-field>
          <mat-form-field appearance="outline"><mat-label>الموقع</mat-label><mat-select (selectionChange)="filterByPlace($event.value)"><mat-option>الكل</mat-option><mat-option *ngFor="let p of places" [value]="p.id">{{ p.title }}</mat-option><\/mat-select><\/mat-form-field>
        <\/div>

        <div class="table-container">
          <table mat-table [dataSource]="dataSource" matSort>
            <ng-container matColumnDef="id"><th mat-header-cell *matHeaderCellDef>#</th><td mat-cell *matCellDef="let p">{{ p.id }}<\/td><\/ng-container>
            <ng-container matColumnDef="place"><th mat-header-cell *matHeaderCellDef>الموقع</th><td mat-cell *matCellDef="let p">{{ p.place?.title }}<\/td><\/ng-container>
            <ng-container matColumnDef="rentAmount"><th mat-header-cell *matHeaderCellDef>قيمة الإيجار</th><td mat-cell *matCellDef="let p">{{ p.rentAmount | currency:'SAR ' }}<\/td><\/ng-container>
            <ng-container matColumnDef="payedAmount"><th mat-header-cell *matHeaderCellDef>المبلغ المدفوع</th><td mat-cell *matCellDef="let p">{{ p.payedAmount | currency:'SAR ' }}<\/td><\/ng-container>
            <ng-container matColumnDef="remainedAmount"><th mat-header-cell *matHeaderCellDef>المتبقي</th><td mat-cell *matCellDef="let p">{{ p.remainedAmount | currency:'SAR ' }}<\/td><\/ng-container>
            <ng-container matColumnDef="paymentDate"><th mat-header-cell *matHeaderCellDef>تاريخ الدفع</th><td mat-cell *matCellDef="let p">{{ p.paymentDate | date }}<\/td><\/ng-container>
            <ng-container matColumnDef="actions"><th mat-header-cell *matHeaderCellDef>الإجراءات</th><td mat-cell *matCellDef="let p"><button mat-icon-button color="primary" [routerLink]="['/financial/place-rent-payments', p.id, 'edit']"><mat-icon>edit</mat-icon><\/button><button mat-icon-button color="warn" (click)="deleteItem(p)"><mat-icon>delete</mat-icon><\/button><\/td><\/ng-container>
            <tr mat-header-row *matHeaderRowDef="displayedColumns"><\/tr><tr mat-row *matRowDef="let row; columns: displayedColumns;"><\/tr>
          <\/table>
          <mat-paginator [pageSize]="10"><\/mat-paginator>
        <\/div>
      <\/mat-card>
    <\/div>
  `,
  styles: [`
    .container { padding: 24px; }
    .header { display: flex; justify-content: space-between; margin-bottom: 24px; }
    .filters { display: flex; gap: 16px; margin-bottom: 20px; }
    .filters mat-form-field { flex: 1; }
    .table-container { overflow-x: auto; }
  `]
})
export class PlaceRentPaymentListComponent implements OnInit {
  displayedColumns = ['id', 'place', 'rentAmount', 'payedAmount', 'remainedAmount', 'paymentDate', 'actions'];
  dataSource = new MatTableDataSource<any>([]);
  places: any[] = [];
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private financialService: FinancialService, private placeService: PlaceService, private notification: NotificationService) {}

  ngOnInit() { this.loadData(); this.loadPlaces(); }

  loadData() {
    this.financialService.getAllPlaceRentPaymentsByFilter().subscribe({
      next: (res: any) => { this.dataSource.data = res.items; this.dataSource.paginator = this.paginator; },
      error: () => this.notification.showError('حدث خطأ')
    });
  }

  loadPlaces() { this.placeService.getAllPlacesLookup().subscribe((res: any) => this.places = res.list); }
  applyFilter(event: Event) { this.dataSource.filter = (event.target as HTMLInputElement).value; }
  filterByPlace(placeId: number) { this.financialService.getAllPlaceRentPaymentsByFilter({ placeId }).subscribe((res: any) => this.dataSource.data = res.items); }

  deleteItem(item: any) {
    if (confirm('هل أنت متأكد من حذف هذه الدفعة؟')) {
      this.financialService.deletePlaceRentPayment(item.id).subscribe({
        next: () => { this.notification.showSuccess('تم الحذف'); this.loadData(); },
        error: () => this.notification.showError('حدث خطأ')
      });
    }
  }
}