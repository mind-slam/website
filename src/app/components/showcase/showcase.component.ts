import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslationService } from '../../services/translation.service';
import { TranslatePipe } from '../../pipes/translate.pipe';

@Component({
  selector: 'app-showcase',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  templateUrl: './showcase.component.html',
  styleUrl: './showcase.component.scss'
})
export class ShowcaseComponent {
  parallaxOffset = 0;

  constructor(public ts: TranslationService) {}

  @HostListener('window:scroll')
  onScroll() {
    this.parallaxOffset = window.scrollY * 0.3;
  }
}
