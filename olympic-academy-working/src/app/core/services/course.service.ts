import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import {CourseSessionDTO, CourseSessionVTO, CourseSessionResultSet } from '../models/employee.model'
import { CourseDTO, CourseVTO, CourseResultSet} from '../models/course.model';
import { LookupResultSet, NewRecordVTO } from '../models/common.model';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  constructor(private api: ApiService) {}

  // Course endpoints
  createCourse(data: CourseDTO): Observable<NewRecordVTO> {
    return this.api.post('/courses', data);
  }

  getAllCourses(params?: any): Observable<CourseResultSet> {
    return this.api.get('/courses', params);
  }

  getCourseById(id: number): Observable<CourseVTO> {
    return this.api.get(`/courses/${id}`);
  }

  updateCourse(id: number, data: CourseDTO): Observable<NewRecordVTO> {
    return this.api.put(`/courses/${id}`, data);
  }

  // Course Session endpoints
  createCourseSession(courseId: number, data: CourseSessionDTO): Observable<NewRecordVTO> {
    return this.api.post(`/courses/${courseId}/sessions`, data);
  }

  getAllCourseSessionsByFilter(courseId: number, params?: any): Observable<CourseSessionResultSet> {
    return this.api.get(`/courses/${courseId}/sessions`, params);
  }

  getAllSessionsByFilter(params?: any): Observable<CourseSessionResultSet> {
    return this.api.get('/courses/sessions', params);
  }

  getCourseSessionById(courseId: number, sessionId: number): Observable<CourseSessionVTO> {
    return this.api.get(`/courses/${courseId}/sessions/${sessionId}`);
  }

  updateCourseSession(courseId: number, sessionId: number, data: CourseSessionDTO): Observable<NewRecordVTO> {
    return this.api.put(`/courses/${courseId}/sessions/${sessionId}`, data);
  }

  deleteCourseSession(courseId: number, sessionId: number): Observable<void> {
    return this.api.delete(`/courses/${courseId}/sessions/${sessionId}`);
  }

  deleteCourse(id: number): Observable<void> {
  return this.api.delete(`/courses/${id}`);
  }

  // Lookup endpoints
    getAllCoursesLookup(): Observable<LookupResultSet> {
      return this.api.get('/lookup/courses');
    }

    getAllCoursesTypesLookup(): Observable<LookupResultSet> {
      return this.api.get('/lookup/course-types');
    }
}