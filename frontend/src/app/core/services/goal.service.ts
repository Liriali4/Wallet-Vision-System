import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { ApiService } from './api.service';
import { Goal, GoalFilters } from '../interfaces/api.interface';

@Injectable({
  providedIn: 'root'
})
export class GoalService {
  private goalsSubject = new BehaviorSubject<Goal[]>([]);
  public goals$ = this.goalsSubject.asObservable();

  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();

  constructor(private apiService: ApiService) {}

  getGoals(filters: GoalFilters = {}): Observable<Goal[]> {
    this.loadingSubject.next(true);

    const params = new URLSearchParams();
    if (filters.status) params.append('status', filters.status);

    const endpoint = `goals?${params.toString()}`;

    return this.apiService.get<Goal[]>(endpoint).pipe(
      tap(goals => {
        const goalsWithProgress = (goals || []).map(goal => ({
          ...goal,
          progress: this.calculateProgress(goal)
        }));
        this.goalsSubject.next(goalsWithProgress);
      }),
      catchError(error => {
        this.loadingSubject.next(false);
        return throwError(() => error);
      }),
      tap(() => this.loadingSubject.next(false))
    );
  }

  getGoalsByStatus(status: string): Observable<Goal[]> {
    return this.getGoals({ status });
  }

  createGoal(data: Partial<Goal>): Observable<Goal> {
    this.loadingSubject.next(true);

    return this.apiService.post<Goal>('goals', data).pipe(
      tap(newGoal => {
        const goalWithProgress = {
          ...newGoal,
          progress: this.calculateProgress(newGoal)
        };
        const current = this.goalsSubject.value;
        this.goalsSubject.next([...current, goalWithProgress]);
      }),
      catchError(error => {
        this.loadingSubject.next(false);
        return throwError(() => error);
      }),
      tap(() => this.loadingSubject.next(false))
    );
  }

  updateGoal(id: number, data: Partial<Goal>): Observable<Goal> {
    this.loadingSubject.next(true);

    return this.apiService.put<Goal>(`goals/update?id=${id}`, data).pipe(
      tap(updatedGoal => {
        const current = this.goalsSubject.value;
        const index = current.findIndex(g => g.id === id);
        if (index !== -1) {
          updatedGoal.progress = this.calculateProgress(updatedGoal);
          current[index] = updatedGoal;
          this.goalsSubject.next([...current]);
        }
      }),
      catchError(error => {
        this.loadingSubject.next(false);
        return throwError(() => error);
      }),
      tap(() => this.loadingSubject.next(false))
    );
  }

  deleteGoal(id: number): Observable<void> {
    this.loadingSubject.next(true);

    return this.apiService.delete<void>(`goals/delete?id=${id}`).pipe(
      tap(() => {
        const current = this.goalsSubject.value;
        this.goalsSubject.next(current.filter(g => g.id !== id));
      }),
      catchError(error => {
        this.loadingSubject.next(false);
        return throwError(() => error);
      }),
      tap(() => this.loadingSubject.next(false))
    );
  }

  calculateProgress(goal: Goal): number {
    if (!goal.target_amount || goal.target_amount <= 0) return 0;
    const progress = (goal.current_amount / goal.target_amount) * 100;
    return Math.min(Math.max(progress, 0), 100);
  }

  getGoalsStats(): Observable<{
    total: number;
    completed: number;
    inProgress: number;
    notStarted: number;
    paused: number;
    averageProgress: number;
  }> {
    return this.goals$.pipe(
      map(goals => {
        const total = goals.length;
        const completed = goals.filter(g => g.status === 'completed').length;
        const inProgress = goals.filter(g => g.status === 'in_progress').length;
        const notStarted = goals.filter(g => g.status === 'not_started').length;
        const paused = goals.filter(g => g.status === 'paused').length;
        const averageProgress = total > 0
          ? goals.reduce((sum, g) => sum + (g.progress || 0), 0) / total
          : 0;

        return { total, completed, inProgress, notStarted, paused, averageProgress };
      })
    );
  }

  setGoals(goals: Goal[]): void {
    const goalsWithProgress = goals.map(goal => ({
      ...goal,
      progress: this.calculateProgress(goal)
    }));
    this.goalsSubject.next(goalsWithProgress);
  }

  getGoalById(id: number): Goal | undefined {
    return this.goalsSubject.value.find(g => g.id === id);
  }
}
