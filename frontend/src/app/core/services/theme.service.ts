import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

const THEME_STORAGE_KEY = 'theme';
const DARK_CLASS = 'dark';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private darkModeSubject = new BehaviorSubject<boolean>(this.getInitialTheme());
  public darkMode$ = this.darkModeSubject.asObservable();

  constructor() {
    this.applyTheme(this.darkModeSubject.value);
  }

  private getInitialTheme(): boolean {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    if (saved === 'dark') {
      return true;
    }
    if (saved === 'light') {
      return false;
    }

    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  toggleTheme(): void {
    this.setTheme(!this.darkModeSubject.value);
  }

  setTheme(isDark: boolean): void {
    this.darkModeSubject.next(isDark);
    localStorage.setItem(THEME_STORAGE_KEY, isDark ? 'dark' : 'light');
    this.applyTheme(isDark);
  }

  private applyTheme(isDark: boolean): void {
    const html = document.documentElement;
    html.classList.toggle(DARK_CLASS, isDark);
  }
}
