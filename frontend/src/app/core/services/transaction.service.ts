import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiService } from './api.service';

interface Transaction {
  id: number;
  type: 'income' | 'expense';
  category_id: number;
  category_name: string;
  description: string;
  amount: number;
  date: string;
  notes: string;
}

interface Balance {
  income: number;
  expense: number;
  balance: number;
}

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

  constructor(private apiService: ApiService) { }

  getBalance(month?: number, year?: number): Observable<Balance> {
    let endpoint = 'transactions/balance';
    if (month || year) {
      const params = new URLSearchParams();
      if (month) params.append('month', month.toString());
      if (year) params.append('year', year.toString());
      endpoint += '?' + params.toString();
    }

    return this.apiService.get<Balance>(endpoint);
  }

  getTransactions(page: number = 1, perPage: number = 20): Observable<any> {
    return this.apiService.get<any>(
      `transactions?page=${page}&per_page=${perPage}`
    );
  }

  getMonthlyTransactions(month: number, year: number): Observable<Transaction[]> {
    return this.apiService.get<Transaction[]>(
      `transactions/monthly?month=${month}&year=${year}`
    );
  }

  createTransaction(data: any): Observable<any> {
    return this.apiService.post('transactions', data);
  }

  updateTransaction(id: number, data: any): Observable<any> {
    return this.apiService.put(`transactions/update?id=${id}`, data);
  }

  deleteTransaction(id: number): Observable<any> {
    return this.apiService.delete(`transactions/delete?id=${id}`);
  }

  setBalance(balance: Balance): void {
    this.balanceSubject.next(balance);
  }
}
