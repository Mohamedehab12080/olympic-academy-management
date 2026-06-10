import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import {
  DepartmentDTO,
  DepartmentVTO,
  DepartmentResultSet
} from '../models/department.model';
import { NewRecordVTO, LookupResultSet } from '../models/common.model';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {
  constructor(private api: ApiService) {}

  // Lookup endpoints
  getAllDepartmentsLookup(): Observable<LookupResultSet> {
    return this.api.get('/lookup/departments');
  }

  // CRUD endpoints
  createDepartment(data: DepartmentDTO): Observable<NewRecordVTO> {
    return this.api.post('/departments', data);
  }

  getAllDepartments(params?: any): Observable<DepartmentResultSet> {
    return this.api.get('/departments', params);
  }

  getDepartmentById(id: number): Observable<DepartmentVTO> {
    return this.api.get(`/departments/${id}`);
  }

  updateDepartment(id: number, data: DepartmentDTO): Observable<NewRecordVTO> {
    return this.api.put(`/departments/${id}`, data);
  }

  deleteDepartment(id: number): Observable<void> {
    return this.api.delete(`/departments/${id}`);
  }
}