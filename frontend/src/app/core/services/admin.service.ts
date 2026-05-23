import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  constructor(private apiService: ApiService) { }

  getUsers(page: number = 1, perPage: number = 20): Observable<any> {
    return this.apiService.get<any>(`admin/users?page=${page}&per_page=${perPage}`);
  }

  getUser(id: number): Observable<any> {
    return this.apiService.get<any>(`admin/users?id=${id}`);
  }

  deactivateUser(id: number): Observable<any> {
    return this.apiService.put(`admin/users/deactivate?id=${id}`, {});
  }

  activateUser(id: number): Observable<any> {
    return this.apiService.put(`admin/users/activate?id=${id}`, {});
  }

  deleteUser(id: number): Observable<any> {
    return this.apiService.delete(`admin/users/delete?id=${id}`);
  }

  updateUserRole(id: number, role: string): Observable<any> {
    return this.apiService.put(`admin/users/update-role?id=${id}`, { role });
  }

  getStatistics(): Observable<any> {
    return this.apiService.get<any>('admin/stats');
  }
}
