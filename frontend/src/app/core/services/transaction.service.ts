import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { ApiService } from './api.service';
import { Transaction, Balance, PaginatedResponse, TransactionFilters } from '../interfaces/api.interface';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private transactionsSubject = new BehaviorSubject<Transaction[]>([]);
  public transactions$ = this.transactionsSubject.asObservable();

  private balanceSubject = new BehaviorSubject<Balance>({
    income: 0,
    expense: 0,
    balance: 0
  });
  public balance$ = this.balanceSubject.asObservable();

  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();

  constructor(private apiService: ApiService) {}

  getBalance(month?: number, year?: number): Observable<Balance> {
    this.loadingSubject.next(true);

    let endpoint = 'transactions/balance';
    if (month || year) {
      const params = new URLSearchParams();
      if (month) params.append('month', month.toString());
      if (year) params.append('year', year.toString());
      endpoint += '?' + params.toString();
    }

    return this.apiService.get<Balance>(endpoint).pipe(
      tap(balance => this.balanceSubject.next(balance)),
      catchError(error => {
        this.loadingSubject.next(false);
        return throwError(() => error);
      }),
      tap(() => this.loadingSubject.next(false))
    );
  }

  getTransactions(filters: TransactionFilters = {}): Observable<PaginatedResponse<Transaction>> {
    this.loadingSubject.next(true);

    const params = new URLSearchParams();
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.perPage) params.append('per_page', filters.perPage.toString());
    if (filters.type) params.append('type', filters.type);

    const endpoint = `transactions?${params.toString()}`;

    return this.apiService.get<PaginatedResponse<Transaction>>(endpoint).pipe(
      tap(data => this.transactionsSubject.next(data.data || [])),
      catchError(error => {
        this.loadingSubject.next(false);
        return throwError(() => error);
      }),
      tap(() => this.loadingSubject.next(false))
    );
  }

  getMonthlyTransactions(month: number, year: number, type?: 'income' | 'expense'): Observable<Transaction[]> {
    this.loadingSubject.next(true);

    const params = new URLSearchParams();
    params.append('month', month.toString());
    params.append('year', year.toString());
    if (type) params.append('type', type);

    const endpoint = `transactions/monthly?${params.toString()}`;

    return this.apiService.get<Transaction[]>(endpoint).pipe(
      catchError(error => {
        this.loadingSubject.next(false);
        return throwError(() => error);
      }),
      tap(() => this.loadingSubject.next(false))
    );
  }

  createTransaction(data: Partial<Transaction>): Observable<Transaction> {
    this.loadingSubject.next(true);

    return this.apiService.post<Transaction>('transactions', data).pipe(
      tap(newTransaction => {
        const current = this.transactionsSubject.value;
        this.transactionsSubject.next([newTransaction, ...current]);
      }),
      catchError(error => {
        this.loadingSubject.next(false);
        return throwError(() => error);
      }),
      tap(() => this.loadingSubject.next(false))
    );
  }

  updateTransaction(id: number, data: Partial<Transaction>): Observable<Transaction> {
    this.loadingSubject.next(true);

    return this.apiService.put<Transaction>(`transactions/update?id=${id}`, data).pipe(
      tap(updatedTransaction => {
        const current = this.transactionsSubject.value;
        const index = current.findIndex(t => t.id === id);
        if (index !== -1) {
          current[index] = updatedTransaction;
          this.transactionsSubject.next([...current]);
        }
      }),
      catchError(error => {
        this.loadingSubject.next(false);
        return throwError(() => error);
      }),
      tap(() => this.loadingSubject.next(false))
    );
  }

  deleteTransaction(id: number): Observable<void> {
    this.loadingSubject.next(true);

    return this.apiService.delete<void>(`transactions/delete?id=${id}`).pipe(
      tap(() => {
        const current = this.transactionsSubject.value;
        this.transactionsSubject.next(current.filter(t => t.id !== id));
      }),
      catchError(error => {
        this.loadingSubject.next(false);
        return throwError(() => error);
      }),
      tap(() => this.loadingSubject.next(false))
    );
  }

  refreshBalance(month?: number, year?: number): void {
    this.getBalance(month, year).subscribe();
  }

  setTransactions(transactions: Transaction[]): void {
    this.transactionsSubject.next(transactions);
  }

  setBalance(balance: Balance): void {
    this.balanceSubject.next(balance);
  }
}
