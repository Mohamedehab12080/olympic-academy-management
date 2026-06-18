import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import {
  EmployeeDTO, EmployeeVTO, EmployeeResultSet,
  EmployeeAttendanceDTO, EmployeeAttendanceVTO, EmployeeAttendanceResultSet,
  DailyAttendanceReport, TrainerCourseResultSet, TrainerCourseAssignmentResultSet,
  AssignCourseDTO, CourseSessionResultSet,
  EmployeeLookupVTO
} from '../models/employee.model';
import { NewRecordVTO, LookupResultSet } from '../models/common.model';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  constructor(private api: ApiService) {}

  // Lookup endpoints
  getAllEmployeeAttendanceStatusLookup(): Observable<LookupResultSet> {
    return this.api.get('/lookup/employee/attendance/status');
  }

  getAllEmployeeTypesLookup(): Observable<LookupResultSet> {
    return this.api.get('/lookup/employee/types');
  }

  getAllEmployeesLookup(): Observable<EmployeeLookupVTO[]> {
    return this.api.get('/lookup/employees');
  }
  
  getAllTrainersLookup(): Observable<LookupResultSet> {
    return this.api.get('/lookup/trainers');
  }

  // Employee CRUD
  createEmployee(data: any): Observable<NewRecordVTO> {
    return this.api.post('/employees', data);
  }

  getAllEmployees(params?: any): Observable<EmployeeResultSet> {
    return this.api.get('/employees', params);
  }

  getEmployeeById(id: number): Observable<EmployeeVTO> {
    return this.api.get(`/employees/${id}`);
  }

  updateEmployee(id: number, data: any): Observable<NewRecordVTO> {
    return this.api.put(`/employees/${id}`, data);
  }
  deleteEmployee(id: number): Observable<void> {
    return this.api.delete(`/employees/${id}`);
  }

  // Employee Contacts
  getAllEmployeeContacts(params?: any): Observable<any> {
    return this.api.get('/employees/contacts', params);
  }

  createEmployeeContact(employeeId: number, data: any): Observable<NewRecordVTO> {
    return this.api.post(`/employees/${employeeId}/contacts`, data);
  }

  updateEmployeeContact(employeeId: number, contactId: number, data: any): Observable<NewRecordVTO> {
    return this.api.put(`/employees/${employeeId}/contacts/${contactId}`, data);
  }

  deleteEmployeeContact(employeeId: number, contactId: number): Observable<void> {
    return this.api.delete(`/employees/${employeeId}/contacts/${contactId}`);
  }

  // Employee Attendance
  createEmployeeAttendance(employeeId: number, data: EmployeeAttendanceDTO): Observable<NewRecordVTO> {
    return this.api.post(`/employees/${employeeId}/attendances`, data);
  }

  getAllEmployeeAttendances(employeeId: number, params?: any): Observable<EmployeeAttendanceResultSet> {
    return this.api.get(`/employees/${employeeId}/attendances`, params);
  }

  getAllEmployeesAttendances(params?: any): Observable<EmployeeAttendanceResultSet> {
    return this.api.get('/employees/attendances', params);
  }

  getEmployeeAttendance(employeeId: number, attendanceId: number): Observable<EmployeeAttendanceVTO> {
    return this.api.get(`/employees/${employeeId}/attendances/${attendanceId}`);
  }

  updateEmployeeAttendance(employeeId: number, attendanceId: number, data: EmployeeAttendanceDTO): Observable<NewRecordVTO> {
    return this.api.put(`/employees/${employeeId}/attendances/${attendanceId}`, data);
  }

  deleteEmployeeAttendance(employeeId: number, attendanceId: number): Observable<void> {
    return this.api.delete(`/employees/${employeeId}/attendances/${attendanceId}`);
  }

  getDailyAttendanceReport(attendanceDate: string): Observable<DailyAttendanceReport> {
    return this.api.get('/attendances/reports/daily', { attendanceDate });
  }

  // Trainer Course
  getTrainerCourses(trainerId: number, params?: any): Observable<TrainerCourseResultSet> {
    return this.api.get(`/trainers/${trainerId}/courses`, params);
  }

  assignCourseToTrainer(trainerId: number, data: AssignCourseDTO): Observable<NewRecordVTO> {
    return this.api.post(`/trainers/${trainerId}/courses`, data);
  }

  unassignCourseFromTrainer(trainerId: number, courseId: number): Observable<void> {
    return this.api.delete(`/trainers/${trainerId}/courses/${courseId}`);
  }

  getAllTrainerCourseAssignments(params?: any): Observable<TrainerCourseAssignmentResultSet> {
    return this.api.get('/trainers/courses/assignments', params);
  }
}