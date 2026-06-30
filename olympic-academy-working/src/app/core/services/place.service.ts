import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { PlaceDTO, PlaceVTO, PlaceResultSet } from '../models/place.model';
import { NewRecordVTO, LookupResultSet } from '../models/common.model';

@Injectable({
  providedIn: 'root'
})
export class PlaceService {
  constructor(private api: ApiService) {}

  // Lookup
  getAllPlacesLookup(): Observable<LookupResultSet> {
    return this.api.get('/lookup/places');
  }

  // CRUD
  createPlace(data: PlaceDTO): Observable<NewRecordVTO> {
    return this.api.post('/places', data);
  }

  getAllPlacesByFilter(params?: any): Observable<PlaceResultSet> {
    return this.api.get('/places', params);
  }

  getAllPlacesDetailsByFilter(params?: any): Observable<PlaceResultSet> {
    return this.api.get('/places/details', params);
  }

  getPlaceById(id: number): Observable<PlaceVTO> {
    return this.api.get(`/places/${id}`);
  }

  updatePlace(id: number, data: PlaceDTO): Observable<NewRecordVTO> {
    return this.api.put(`/places/${id}`, data);
  }

  deletePlace(id: number): Observable<void> {
    return this.api.delete(`/places/${id}`);
  }
}