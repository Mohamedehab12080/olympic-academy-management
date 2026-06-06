import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
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
  createDepartment(data: any): Observable<NewRecordVTO> {
    return this.api.post('/departments', data);
  }

  getAllDepartments(params?: any): Observable<any> {
    return this.api.get('/departments', params);
  }

  getDepartmentById(id: number): Observable<any> {
    return this.api.get(`/departments/${id}`);
  }

  updateDepartment(id: number, data: any): Observable<NewRecordVTO> {
    return this.api.put(`/departments/${id}`, data);
  }
}