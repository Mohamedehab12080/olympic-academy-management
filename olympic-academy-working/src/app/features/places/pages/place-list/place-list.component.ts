import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { PlaceService } from '../../../../core/services/place.service';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-place-list',
  template: `
    <div style="padding: 24px;">
      <div style="display: flex; justify-content: space-between; margin-bottom: 24px;">
        <h2>إدارة المواقع</h2>
        <button mat-raised-button color="primary" routerLink="/places/new">إضافة موقع</button>
      </div>
      <mat-card>
        <div class="table-container">
          <table mat-table [dataSource]="dataSource" class="full-width">
            <ng-container matColumnDef="id"><th mat-header-cell *matHeaderCellDef>#</th><td mat-cell *matCellDef="let p">{{ p.id }}</td></ng-container>
            <ng-container matColumnDef="title"><th mat-header-cell *matHeaderCellDef>الاسم</th><td mat-cell *matCellDef="let p">{{ p.title }}</td></ng-container>
            <ng-container matColumnDef="address"><th mat-header-cell *matHeaderCellDef>العنوان</th><td mat-cell *matCellDef="let p">{{ p.address }}</td></ng-container>
            <ng-container matColumnDef="actions"><th mat-header-cell *matHeaderCellDef>إجراءات</th><td mat-cell *matCellDef="let p"><button mat-icon-button [routerLink]="['/places', p.id, 'edit']"><mat-icon>edit</mat-icon></button></td></ng-container>
            <tr mat-header-row *matHeaderRowDef="displayedColumns"><tr><tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
          </table>
          <mat-paginator [pageSize]="10"></mat-paginator>
        </div>
      </mat-card>
    </div>
  `,
  styles: [`.table-container { overflow-x: auto; } .full-width { width: 100%; }`]
})
export class PlaceListComponent implements OnInit {
  displayedColumns = ['id', 'title', 'address', 'actions'];
  dataSource = new MatTableDataSource<any>([]);
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private placeService: PlaceService, private notification: NotificationService) {}

  ngOnInit() {
    this.placeService.getAllPlacesByFilter().subscribe((res: any) => {
      this.dataSource.data = res.items;
      this.dataSource.paginator = this.paginator;
    });
  }
}