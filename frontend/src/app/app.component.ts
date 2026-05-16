import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ThemeService } from './core/services/theme.service';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="app-container">
      <router-outlet></router-outlet>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      height: 100%;
    }

    .app-container {
      height: 100%;
      width: 100%;
      background: white;
    }

    :host ::ng-deep html.dark .app-container {
      background: #0f1419;
    }
  `]
})
export class AppComponent implements OnInit {
  constructor(
    private themeService: ThemeService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    // Initialize theme
    this.themeService.darkMode$.subscribe();

    // Check authentication
    this.authService.isAuthenticated$.subscribe();
  }
}
