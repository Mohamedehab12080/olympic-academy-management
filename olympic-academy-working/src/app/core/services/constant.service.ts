// services/constant.service.ts
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { 
  ConstantDTO, 
  ConstantListItem, 
  ConstantVTO, 
  ConstantResultSet, 
  ConstantFilterParams 
} from '../models/constant.model';
import { NewRecordVTO } from '../models/common.model';

@Injectable({
  providedIn: 'root'
})
export class ConstantService {
  constructor(private api: ApiService) {}

  /**
   * Get all constants with filters
   */
  getAllConstantsByFilter(params: ConstantFilterParams = {}): Observable<ConstantResultSet> {
    return this.api.get('/constants', params);
  }

  /**
   * Get constant by ID
   */
  getConstantById(id: number): Observable<ConstantVTO> {
    return this.api.get(`/constants/${id}`);
  }

  /**
   * Create new constant
   */
  createConstant(data: ConstantDTO): Observable<NewRecordVTO> {
    return this.api.post('/constants', data);
  }

  /**
   * Update constant by ID
   */
  updateConstantById(id: number, data: ConstantDTO): Observable<NewRecordVTO> {
    return this.api.put(`/constants/${id}`, data);
  }

  /**
   * Delete constant by ID
   */
  deleteConstantById(id: number): Observable<void> {
    return this.api.delete(`/constants/${id}`);
  }

  /**
   * Get constants by location
   */
  getConstantsByLocation(location: string, pageSize: number = 100): Observable<ConstantResultSet> {
    return this.getAllConstantsByFilter({
      location: location,
      pageSize: pageSize,
      pageNum: 0
    });
  }

  /**
   * Get constants by position
   */
  getConstantsByPosition(position: string, pageSize: number = 100): Observable<ConstantResultSet> {
    return this.getAllConstantsByFilter({
      position: position,
      pageSize: pageSize,
      pageNum: 0
    });
  }

  /**
   * Search constants by value or title
   */
  searchConstants(searchTerm: string): Observable<ConstantResultSet> {
    return this.getAllConstantsByFilter({
      quickSearch: searchTerm,
      pageSize: 100,
      pageNum: 0
    });
  }

  /**
   * Get constant value by key (useful for looking up constants)
   */
  getConstantValue(key: string): Observable<ConstantListItem | null> {
    return new Observable<ConstantListItem | null>(observer => {
      this.getAllConstantsByFilter({
        value: key,
        pageSize: 1,
        pageNum: 0
      }).subscribe({
        next: (result) => {
          if (result.items && result.items.length > 0) {
            observer.next(result.items[0]);
          } else {
            observer.next(null);
          }
          observer.complete();
        },
        error: (error) => observer.error(error)
      });
    });
  }

  /**
   * Get all constants as a map (value -> id)
   */
  getConstantsMap(location?: string, position?: string): Observable<Map<string, number>> {
    return new Observable<Map<string, number>>(observer => {
      const params: ConstantFilterParams = {
        pageSize: 1000 // Get all constants
      };
      
      if (location) params.location = location;
      if (position) params.position = position;

      this.getAllConstantsByFilter(params).subscribe({
        next: (result) => {
          const map = new Map<string, number>();
          result.items.forEach(item => {
            map.set(item.value, item.id);
          });
          observer.next(map);
          observer.complete();
        },
        error: (error) => observer.error(error)
      });
    });
  }

  /**
   * Get constants as dropdown options
   */
  getConstantsAsOptions(location?: string, position?: string): Observable<{ value: number; label: string }[]> {
    return new Observable<{ value: number; label: string }[]>(observer => {
      const params: ConstantFilterParams = {
        pageSize: 1000 // Get all constants
      };
      
      if (location) params.location = location;
      if (position) params.position = position;

      this.getAllConstantsByFilter(params).subscribe({
        next: (result) => {
          const options = result.items.map(item => ({
            value: item.id,
            label: item.title || item.value
          }));
          observer.next(options);
          observer.complete();
        },
        error: (error) => observer.error(error)
      });
    });
  }
}