import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

export const appRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/landing/pages/landing.component').then(m => m.LandingComponent)
  },
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES)
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./features/dashboard/dashboard.routes').then(m => m.DASHBOARD_ROUTES),
    canActivate: [AuthGuard]
  },
  {
    path: 'transactions',
    loadChildren: () => import('./features/transactions/transactions.routes').then(m => m.TRANSACTIONS_ROUTES),
    canActivate: [AuthGuard]
  },
  {
    path: 'categories',
    loadChildren: () => import('./features/categories/categories.routes').then(m => m.CATEGORIES_ROUTES),
    canActivate: [AuthGuard]
  },
  {
    path: 'goals',
    loadChildren: () => import('./features/goals/goals.routes').then(m => m.GOALS_ROUTES),
    canActivate: [AuthGuard]
  },
  {
    path: 'admin',
    loadChildren: () => import('./features/admin/admin.routes').then(m => m.ADMIN_ROUTES),
    canActivate: [AuthGuard]
  },
  {
    path: 'profile',
    loadChildren: () => import('./features/profile/profile.routes').then(m => m.PROFILE_ROUTES),
    canActivate: [AuthGuard]
  },
  {
    path: '**',
    redirectTo: '/dashboard'
  }
];
