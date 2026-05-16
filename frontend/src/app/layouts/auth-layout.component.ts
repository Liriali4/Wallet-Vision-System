import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      <router-outlet></router-outlet>
    </div>
  `
})
export class AuthLayoutComponent implements OnInit {
  constructor(private authService: AuthService) { }

  ngOnInit(): void { }
}
