import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login.component';
import { RegisterComponent } from './pages/register.component';
import { ForgotPasswordComponent } from './pages/forgot-password.component';
import { ResetPasswordComponent } from './pages/reset-password.component';

export const AUTH_ROUTES: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent
  },
  {
    path: 'reset-password',
    component: ResetPasswordComponent
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  }
];
