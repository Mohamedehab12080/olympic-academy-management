import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import {
  TraineeDTO, TraineeVTO, TraineeResultSet,
  TraineeCertificateDTO, TraineeCertificateVTO, TraineeCertificateResultSet,
  HealthConditionDTO, HealthConditionVTO, HealthConditionResultSet,
  TraineeContactDTO, TraineeContactResultSet
} from '../models/trainee.model';
import { NewRecordVTO,LookupResultSet } from '../models/common.model';

@Injectable({
  providedIn: 'root'
})
export class TraineeService {
  constructor(private api: ApiService) {}

  // ==================== Trainee CRUD ====================
  
  createTrainee(data: TraineeDTO): Observable<NewRecordVTO> {
    return this.api.post('/trainees', data);
  }

  getAllTraineesByFilter(params?: any): Observable<TraineeResultSet> {
    return this.api.get('/trainees', params);
  }

  uploadTraineeImage(formData: FormData): Observable<{ imageUrl: string }> {
    return this.api.post('/trainees/upload-image', formData);
  }

  getTraineeById(id: number): Observable<TraineeVTO> {
    return this.api.get(`/trainees/${id}`);
  }

  updateTrainee(id: number, data: TraineeDTO): Observable<NewRecordVTO> {
    return this.api.put(`/trainees/${id}`, data);
  }

  deleteTrainee(id: number): Observable<void> {
    return this.api.delete(`/trainees/${id}`);
  }

  // ==================== Trainee Contacts ====================

  createTraineeContact(traineeId: number, data: TraineeContactDTO): Observable<NewRecordVTO> {
    return this.api.post(`/trainees/${traineeId}/contacts`, data);
  }

  getTraineeContacts(traineeId: number, contactValue?: string): Observable<TraineeContactResultSet> {
    return this.api.get(`/trainees/${traineeId}/contacts`, { contactValue });
  }

  updateTraineeContact(traineeId: number, contactId: number, data: TraineeContactDTO): Observable<NewRecordVTO> {
    return this.api.put(`/trainees/${traineeId}/contacts/${contactId}`, data);
  }

  deleteTraineeContact(traineeId: number, contactId: number): Observable<void> {
    return this.api.delete(`/trainees/${traineeId}/contacts/${contactId}`);
  }

  // ==================== Trainee Certificates ====================

  createTraineeCertificate(traineeId: number, data: TraineeCertificateDTO): Observable<NewRecordVTO> {
    return this.api.post(`/trainees/${traineeId}/certificates`, data);
  }

  getAllTraineeCertificatesByFilter(traineeId: number, params?: any): Observable<TraineeCertificateResultSet> {
    return this.api.get(`/trainees/${traineeId}/certificates`, params);
  }

  updateTraineeCertificate(traineeId: number, certificateId: number, data: TraineeCertificateDTO): Observable<NewRecordVTO> {
    return this.api.put(`/trainees/${traineeId}/certificates/${certificateId}`, data);
  }

  deleteTraineeCertificate(traineeId: number, certificateId: number): Observable<void> {
    return this.api.delete(`/trainees/${traineeId}/certificates/${certificateId}`);
  }

  // ==================== Health Conditions ====================

  createHealthCondition(traineeId: number, data: HealthConditionDTO): Observable<NewRecordVTO> {
    return this.api.post(`/trainees/${traineeId}/health-conditions`, data);
  }

  getAllHealthConditionsByFilter(traineeId: number, params?: any): Observable<HealthConditionResultSet> {
    return this.api.get(`/trainees/${traineeId}/health-conditions`, params);
  }

  updateHealthCondition(traineeId: number, conditionId: number, data: HealthConditionDTO): Observable<NewRecordVTO> {
    return this.api.put(`/trainees/${traineeId}/health-conditions/${conditionId}`, data);
  }

  deleteHealthCondition(traineeId: number, conditionId: number): Observable<void> {
    return this.api.delete(`/trainees/${traineeId}/health-conditions/${conditionId}`);
  }

    getAllTraineesLookup(): Observable<LookupResultSet> {
    return this.api.get(`/lookup/trainees`);
    }
}

