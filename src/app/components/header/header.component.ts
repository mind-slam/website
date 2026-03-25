import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslationService } from '../../services/translation.service';
import { TranslatePipe } from '../../pipes/translate.pipe';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslatePipe],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  isScrolled = false;
  isMobileMenuOpen = false;

  constructor(public ts: TranslationService) {}

  get navItems() {
    return [
      { label: 'Investors', href: '/investors', isRoute: true, hidden: true }
    ];
  }

  @HostListener('window:scroll')
  onScroll(): void {
    this.isScrolled = window.scrollY > 50;
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen = false;
  }
}
