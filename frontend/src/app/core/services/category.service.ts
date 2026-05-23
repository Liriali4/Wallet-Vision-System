import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { ApiService } from './api.service';
import { Category, CategoryFilters } from '../interfaces/api.interface';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private categoriesSubject = new BehaviorSubject<Category[]>([]);
  public categories$ = this.categoriesSubject.asObservable();

  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();

  constructor(private apiService: ApiService) {}

  getCategories(filters: CategoryFilters = {}): Observable<Category[]> {
    this.loadingSubject.next(true);

    const params = new URLSearchParams();
    if (filters.type) params.append('type', filters.type);

    const endpoint = `categories?${params.toString()}`;

    return this.apiService.get<Category[]>(endpoint).pipe(
      tap(categories => this.categoriesSubject.next(categories || [])),
      catchError(error => {
        this.loadingSubject.next(false);
        return throwError(() => error);
      }),
      tap(() => this.loadingSubject.next(false))
    );
  }

  getCategoriesByType(type: 'income' | 'expense'): Observable<Category[]> {
    return this.getCategories({ type });
  }

  createCategory(data: Partial<Category>): Observable<Category> {
    this.loadingSubject.next(true);

    return this.apiService.post<Category>('categories', data).pipe(
      tap(newCategory => {
        const current = this.categoriesSubject.value;
        this.categoriesSubject.next([...current, newCategory]);
      }),
      catchError(error => {
        this.loadingSubject.next(false);
        return throwError(() => error);
      }),
      tap(() => this.loadingSubject.next(false))
    );
  }

  updateCategory(id: number, data: Partial<Category>): Observable<Category> {
    this.loadingSubject.next(true);

    return this.apiService.put<Category>(`categories/update?id=${id}`, data).pipe(
      tap(updatedCategory => {
        const current = this.categoriesSubject.value;
        const index = current.findIndex(c => c.id === id);
        if (index !== -1) {
          current[index] = updatedCategory;
          this.categoriesSubject.next([...current]);
        }
      }),
      catchError(error => {
        this.loadingSubject.next(false);
        return throwError(() => error);
      }),
      tap(() => this.loadingSubject.next(false))
    );
  }

  deleteCategory(id: number): Observable<void> {
    this.loadingSubject.next(true);

    return this.apiService.delete<void>(`categories/delete?id=${id}`).pipe(
      tap(() => {
        const current = this.categoriesSubject.value;
        this.categoriesSubject.next(current.filter(c => c.id !== id));
      }),
      catchError(error => {
        this.loadingSubject.next(false);
        return throwError(() => error);
      }),
      tap(() => this.loadingSubject.next(false))
    );
  }

  setCategories(categories: Category[]): void {
    this.categoriesSubject.next(categories);
  }

  getCategoryById(id: number): Category | undefined {
    return this.categoriesSubject.value.find(c => c.id === id);
  }

  getIncomeCategories(): Observable<Category[]> {
    return this.getCategoriesByType('income');
  }

  getExpenseCategories(): Observable<Category[]> {
    return this.getCategoriesByType('expense');
  }
}
