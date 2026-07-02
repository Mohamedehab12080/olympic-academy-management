import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import {
  EnrollmentDTO, EnrollmentVTO, EnrollmentResultSet,
  EnrollmentTypeDTO, EnrollmentTypeVTO, EnrollmentTypeResultSet
} from '../models/enrollment.model';
import { LookupResultSet, NewRecordVTO } from '../models/common.model';

@Injectable({
  providedIn: 'root'
})
export class EnrollmentService {
  constructor(private api: ApiService) {}

  // Enrollment Type endpoints
  createEnrollmentType(data: EnrollmentTypeDTO): Observable<NewRecordVTO> {
    return this.api.post('/enrollment-types', data);
  }

  getAllEnrollmentTypes(params?: any): Observable<EnrollmentTypeResultSet> {
    return this.api.get('/enrollment-types', params);
  }

  getEnrollmentTypeById(id: number): Observable<EnrollmentTypeVTO> {
    return this.api.get(`/enrollment-types/${id}`);
  }

  updateEnrollmentType(id: number, data: EnrollmentTypeDTO): Observable<NewRecordVTO> {
    return this.api.put(`/enrollment-types/${id}`, data);
  }

  deleteEnrollmentType(id: number): Observable<void> {
    return this.api.delete(`/enrollment-types/${id}`);
  }

  // Enrollment endpoints
  createEnrollment(data: EnrollmentDTO): Observable<NewRecordVTO> {
    return this.api.post('/enrollments', data);
  }

  getAllEnrollmentsByFilter(params?: any): Observable<EnrollmentResultSet> {
    return this.api.get('/enrollments', params);
  }

    getAllEnrollmentsDetailsByFilter(params?: any): Observable<EnrollmentResultSet> {
    return this.api.get('/enrollments/enrollment-details', params);
  }


  getAllEnrollmentsLookup(): Observable<LookupResultSet> {
    return this.api.get('/lookup/enrollments');
  }

  getEnrollmentById(id: number): Observable<EnrollmentVTO> {
    return this.api.get(`/enrollments/${id}`);
  }

  updateEnrollment(id: number, data: EnrollmentDTO): Observable<NewRecordVTO> {
    return this.api.put(`/enrollments/${id}`, data);
  }

  deleteEnrollment(id: number): Observable<void> {
    return this.api.delete(`/enrollments/${id}`);
  }
}