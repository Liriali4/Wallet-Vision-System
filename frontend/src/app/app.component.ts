import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { ThemeService } from './core/services/theme.service';
import { AuthService } from './core/services/auth.service';
import { I18nService } from './core/services/i18n.service';

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
    }
  `]
})
export class AppComponent implements OnInit {
  constructor(
    private themeService: ThemeService,
    private authService: AuthService,
    private i18n: I18nService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Initialize theme
    this.themeService.darkMode$.subscribe();

    // Check authentication
    this.authService.isAuthenticated$.subscribe();

    // Apply language globally on first load and route changes
    this.i18n.language$.subscribe(() => {
      setTimeout(() => this.i18n.applyDocumentTranslations(), 0);
    });

    this.router.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe(() => {
        setTimeout(() => this.i18n.applyDocumentTranslations(), 0);
      });
  }
}
