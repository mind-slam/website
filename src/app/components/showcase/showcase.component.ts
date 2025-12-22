import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-showcase',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './showcase.component.html',
  styleUrl: './showcase.component.scss'
})
export class ShowcaseComponent {
  parallaxOffset = 0;

  @HostListener('window:scroll')
  onScroll() {
    this.parallaxOffset = window.scrollY * 0.3;
  }
}
