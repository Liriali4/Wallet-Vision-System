import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiService } from './api.service';

interface Goal {
  id: number;
  title: string;
  description: string;
  target_amount: number;
  current_amount: number;
  progress: number;
  status: 'not_started' | 'in_progress' | 'completed' | 'paused';
  end_date: string;
}

@Injectable({
  providedIn: 'root'
})
export class GoalService {
  private goalsSubject = new BehaviorSubject<Goal[]>([]);
  public goals$ = this.goalsSubject.asObservable();

  constructor(private apiService: ApiService) { }

  getGoals(status?: string): Observable<Goal[]> {
    let endpoint = 'goals';
    if (status) {
      endpoint += `?status=${status}`;
    }
    return this.apiService.get<Goal[]>(endpoint);
  }

  createGoal(data: any): Observable<any> {
    return this.apiService.post('goals', data);
  }

  updateGoal(id: number, data: any): Observable<any> {
    return this.apiService.put(`goals/update?id=${id}`, data);
  }

  deleteGoal(id: number): Observable<any> {
    return this.apiService.delete(`goals/delete?id=${id}`);
  }

  setGoals(goals: Goal[]): void {
    this.goalsSubject.next(goals);
  }
}
