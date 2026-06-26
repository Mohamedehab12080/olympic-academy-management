// employee.service.ts
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ApiService } from './api.service';
import {
  EmployeeDTO, EmployeeVTO, EmployeeResultSet,
  EmployeeAttendanceDTO, EmployeeAttendanceVTO, EmployeeAttendanceResultSet,
  DailyAttendanceReport, TrainerCourseResultSet,
  AssignCourseDTO, CourseSessionResultSet, TrainerDepartmentResultSet, 
  AssignDepartmentDTO, TrainerDepartmentVTO, EmployeeLookupVTO
} from '../models/employee.model';
import { NewRecordVTO, LookupResultSet } from '../models/common.model';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  constructor(private api: ApiService) {}

  // ==================== Lookup Endpoints ====================

  getAllEmployeeAttendanceStatusLookup(): Observable<LookupResultSet> {
    return this.api.get('/lookup/employee/attendance/status').pipe(
      map((response: any) => ({
        list: response._list || response.list || [],
        total: response.total || 0
      }))
    );
  }

  getAllEmployeeTypesLookup(): Observable<LookupResultSet> {
    return this.api.get('/lookup/employee/types').pipe(
      map((response: any) => ({
        list: response._list || response.list || [],
        total: response.total || 0
      }))
    );
  }

  getAllEmployeesLookup(): Observable<EmployeeLookupVTO[]> {
    return this.api.get('/lookup/employees');
  }

  getAllTrainersLookup(): Observable<LookupResultSet> {
    return this.api.get('/lookup/trainers').pipe(
      map((response: any) => ({
        list: response._list || response.list || [],
        total: response.total || 0
      }))
    );
  }

  // ==================== Employee CRUD ====================

  createEmployee(data: EmployeeDTO): Observable<NewRecordVTO> {
    return this.api.post('/employees', data);
  }

  getAllEmployees(params?: any): Observable<EmployeeResultSet> {
    return this.api.get('/employees', params).pipe(
      map((response: any) => ({
        items: response.items || [],
        total: response.total || 0
      }))
    );
  }

  getEmployeeById(id: number): Observable<EmployeeVTO> {
    return this.api.get(`/employees/${id}`);
  }

  updateEmployee(id: number, data: EmployeeDTO): Observable<NewRecordVTO> {
    return this.api.put(`/employees/${id}`, data);
  }

  deleteEmployee(id: number): Observable<void> {
    return this.api.delete(`/employees/${id}`);
  }

  // ==================== Employee Contacts ====================

  getAllEmployeeContacts(params?: any): Observable<any> {
    return this.api.get('/employees/contacts', params);
  }

createEmployeeContact(employeeId: number, data: { contactType: string; contactValue: string }): Observable<NewRecordVTO> {
  return this.api.post(`/employees/${employeeId}/contacts`, data);
}

updateEmployeeContact(employeeId: number, contactId: number, data: { contactType: string; contactValue: string }): Observable<NewRecordVTO> {
  return this.api.put(`/employees/${employeeId}/contacts/${contactId}`, data);
}

  deleteEmployeeContact(employeeId: number, contactId: number): Observable<void> {
    return this.api.delete(`/employees/${employeeId}/contacts/${contactId}`);
  }

  // ==================== Employee Attendance ====================

  createEmployeeAttendance(employeeId: number, data: EmployeeAttendanceDTO): Observable<NewRecordVTO> {
    return this.api.post(`/employees/${employeeId}/attendances`, data);
  }

  getAllEmployeeAttendances(employeeId: number, params?: any): Observable<EmployeeAttendanceResultSet> {
    return this.api.get(`/employees/${employeeId}/attendances`, params).pipe(
      map((response: any) => ({
        items: response.items || [],
        total: response.total || 0
      }))
    );
  }

  getAllEmployeesAttendances(params?: any): Observable<EmployeeAttendanceResultSet> {
    return this.api.get('/employees/attendances', params).pipe(
      map((response: any) => ({
        items: response.items || [],
        total: response.total || 0
      }))
    );
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

  // ==================== Trainer Department Management ====================

  /**
   * Get all trainer-department assignments with filters
   * GET /trainers/departments
   */
  getTrainerDepartments(params?: {
    trainerId?: number;
    departmentId?: number;
    quickSearch?: string;
    pageNum?: number;
    pageSize?: number;
    orderDir?: string;
    orderBy?: string;
  }): Observable<TrainerDepartmentResultSet> {
    console.log("PARAMS ",params)
    return this.api.get('/trainers/departments', params).pipe(
      map((response: any) => ({
        items: response.items || [],
        total: response.total || 0
      }))
    );
  }

  /**
   * Assign a department to a trainer
   * POST /trainers/{trainerId}/departments
   */
  assignDepartmentToTrainer(trainerId: number, data: AssignDepartmentDTO): Observable<NewRecordVTO[]> {
    return this.api.post(`/trainers/${trainerId}/departments`, data);
  }

  /**
   * Get trainer department details by ID
   * GET /trainers/{trainerDepartmentId}
   */
  getTrainerDepartmentById(trainerDepartmentId: number): Observable<TrainerDepartmentVTO> {
    return this.api.get(`/trainers/${trainerDepartmentId}`);
  }

  /**
   * Update trainer department
   * PUT /trainers/{trainerDepartmentId}
   */
  updateTrainerDepartment(trainerDepartmentId: number, data: AssignDepartmentDTO): Observable<void> {
    return this.api.put(`/trainers/${trainerDepartmentId}`, data);
  }

  /**
   * Unassign a department from a trainer
   * DELETE /trainers/{trainerDepartmentId}
   */
  unassignDepartmentFromTrainer(trainerDepartmentId: number): Observable<void> {
    return this.api.delete(`/trainers/${trainerDepartmentId}/department`);
  }

  // ==================== Trainer Course Management ====================

  /**
   * Get all courses assigned to a trainer
   * GET /trainers/{trainerId}/courses
   */
 // employee.service.ts
getTrainerCourses(params?: {
  quickSearch?: string;
  trainerId?: number;
  pageNum?: number;
  pageSize?: number;
  orderDir?: string;
  orderBy?: string;
}): Observable<TrainerCourseResultSet> {
  return this.api.get('/trainers/courses', params).pipe(
    map((response: any) => ({
      items: response.items || [],
      total: response.total || 0
    }))
  );
}


  /**
   * Assign a course to a trainer
   * POST /trainers/{trainerId}/courses
   */
  assignCourseToTrainer(trainerId: number, data: AssignCourseDTO): Observable<NewRecordVTO> {
    return this.api.post(`/trainers/${trainerId}/courses`, data);
  }

  /**
   * Unassign a course from a trainer
   */
  unassignCourseFromTrainer(trainerCourseId: number): Observable<void> {
    return this.api.delete(`/trainers/${trainerCourseId}/course`);
  }

}