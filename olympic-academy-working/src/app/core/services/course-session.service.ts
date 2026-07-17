// course-session.service.ts

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { CourseSessionDTO, CourseSessionVTO, CourseSessionResultSet } from '../models/employee.model';
import { NewRecordVTO } from '../models/common.model';
import { HttpParams } from '@angular/common/http';

export interface CourseSessionFilterParams {
  quickSearch?: string;
  courseId?: number;
  trainerId?: number;
  trainersId?: number[];
  placeId?: number;
  status?: string;
  sessionDay?: string;
  sessionDateFrom?: string;
  sessionDateTo?: string;
  startTimeFrom?: string;
  startTimeTo?: string;
  endTimeFrom?: string;
  endTimeTo?: string;
  pageNum?: number;
  pageSize?: number;
  orderDir?: 'ASC' | 'DESC';
  orderBy?: string;
}

/**
 * DTO for day-specific operations (single day)
 */
export interface CourseSessionDayDTO {
  title: string;
  courseId: number;
  trainersId: number[];
  placeId: number;
  sessionDay: string;
  startTime: string;
  endTime: string;
  status?: string;
  note?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CourseSessionService {
  constructor(private api: ApiService) {}

  // ============================================================
  // GET METHODS
  // ============================================================

  /**
   * GET /courses/sessions
   * All sessions across all courses, with optional filters.
   */
  getAllSessionsByFilter(params?: CourseSessionFilterParams): Observable<CourseSessionResultSet> {
    return this.api.get('/courses/sessions', params);
  }

  /**
   * GET /courses/{courseId}/sessions
   * Sessions scoped to one course.
   */
  getAllCourseSessionsByFilter(courseId: number, params?: CourseSessionFilterParams): Observable<CourseSessionResultSet> {
    return this.api.get(`/courses/${courseId}/sessions`, params);
  }

  /**
   * GET /courses/course-session/{courseSessionId}
   * Get a specific session by ID.
   */
  getCourseSessionById(courseSessionId: number): Observable<CourseSessionVTO> {
    return this.api.get(`/courses/course-session/${courseSessionId}`);
  }

  // ============================================================
  // CREATE METHODS
  // ============================================================

  /**
   * POST /courses/{courseId}/sessions
   * Create sessions for multiple days.
   */
  createCourseSession(courseId: number, data: CourseSessionDTO): Observable<NewRecordVTO[]> {
    return this.api.post(`/courses/${courseId}/sessions`, data);
  }

  // ============================================================
  // UPDATE METHODS
  // ============================================================

  /**
   * PUT /courses/course-session
   * Update sessions for multiple days.
   * The id travels inside the DTO body.
   */
  updateCourseSession(data: CourseSessionDTO): Observable<NewRecordVTO[]> {
    return this.api.put(`/courses/course-session`, data);
  }

  /**
   * PUT /courses/course-session/day
   * Update sessions for a specific day and course.
   * Uses CourseSessionDayDTO with sessionDay (singular).
   */
  updateSessionsByDayAndCourse(data: CourseSessionDayDTO): Observable<NewRecordVTO[]> {
    return this.api.put(`/courses/course-session/day`, data);
  }

  /**
   * PUT /courses/course-session/day/trainers
   * Update sessions for a specific day and trainers.
   * Uses CourseSessionDayDTO with sessionDay (singular).
   */
  updateSessionsByDayAndTrainer(data: CourseSessionDayDTO): Observable<NewRecordVTO[]> {
    return this.api.put(`/courses/course-session/day/trainers`, data);
  }

  // ============================================================
  // DELETE METHODS
  // ============================================================

  /**
   * DELETE /courses/course-session/{courseSessionId}
   * Delete a specific session by ID.
   */
  deleteCourseSession(courseSessionId: number): Observable<void> {
    return this.api.delete(`/courses/course-session/${courseSessionId}`);
  }

  /**
   * DELETE /courses/course-session/{courseSessionId}
   * Alias for deleteCourseSession - Delete a specific session by ID.
   */
  deleteSpecificSession(courseSessionId: number): Observable<void> {
    return this.api.delete(`/courses/course-session/${courseSessionId}`);
  }

  /**
   * DELETE /courses/{courseId}/sessions/day
   * Delete all sessions for a specific day and course.
   * 
   * @param courseId - The course ID
   * @param sessionDay - The day to delete (e.g., "MONDAY")
   */
  deleteSessionsByDayAndCourse(courseId: number, sessionDay: string): Observable<void> {
    // Build query params as a string
    const queryParams = new HttpParams().set('sessionDay', sessionDay);
    return this.api.delete(`/courses/${courseId}/sessions/day?${queryParams.toString()}`);
  }

  /**
   * DELETE /courses/{courseId}/sessions/day/all
   * Delete all sessions for a specific day (all trainers).
   * 
   * @param courseId - The course ID
   * @param sessionDay - The day to delete (e.g., "MONDAY")
   */
  deleteSessionsByDay(courseId: number, sessionDay: string): Observable<void> {
    const queryParams = new HttpParams().set('sessionDay', sessionDay);
    return this.api.delete(`/courses/${courseId}/sessions/day/all?${queryParams.toString()}`);
  }

  /**
   * DELETE /courses/{courseId}/sessions/day/trainers
   * Delete sessions for specific day, course, and trainers.
   * 
   * @param courseId - The course ID
   * @param sessionDay - The day to delete (e.g., "MONDAY")
   * @param trainersId - Array of trainer IDs
   */
  deleteSessionsByDayCourseAndTrainers(courseId: number, sessionDay: string, trainersId: number[]): Observable<void> {
    let queryParams = new HttpParams()
      .set('sessionDay', sessionDay);
    
    // Add each trainer ID as a separate parameter
    trainersId.forEach(id => {
      queryParams = queryParams.append('trainersId', id.toString());
    });
    
    return this.api.delete(`/courses/${courseId}/sessions/day/trainers?${queryParams.toString()}`);
  }

  /**
   * DELETE /courses/{courseId}/sessions/day/trainers
   * Alias for deleteSessionsByDayCourseAndTrainers.
   */
  deleteSessionsByDayAndTrainer(courseId: number, sessionDay: string, trainersId: number[]): Observable<void> {
    let queryParams = new HttpParams()
      .set('sessionDay', sessionDay);
    
    trainersId.forEach(id => {
      queryParams = queryParams.append('trainersId', id.toString());
    });
    
    return this.api.delete(`/courses/${courseId}/sessions/day/trainers?${queryParams.toString()}`);
  }
}