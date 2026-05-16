import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiService } from './api.service';

interface Category {
  id: number;
  name: string;
  type: 'income' | 'expense';
  color: string;
  icon: string;
}

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private categoriesSubject = new BehaviorSubject<Category[]>([]);
  public categories$ = this.categoriesSubject.asObservable();

  constructor(private apiService: ApiService) { }

  getCategories(type?: 'income' | 'expense'): Observable<Category[]> {
    let endpoint = 'categories';
    if (type) {
      endpoint += `?type=${type}`;
    }
    return this.apiService.get<Category[]>(endpoint);
  }

  createCategory(data: any): Observable<any> {
    return this.apiService.post('categories', data);
  }

  updateCategory(id: number, data: any): Observable<any> {
    return this.apiService.put(`categories/update?id=${id}`, data);
  }

  deleteCategory(id: number): Observable<any> {
    return this.apiService.delete(`categories/delete?id=${id}`);
  }

  setCategories(categories: Category[]): void {
    this.categoriesSubject.next(categories);
  }
}
