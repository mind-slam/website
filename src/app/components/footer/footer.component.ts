import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  currentYear = new Date().getFullYear();

  links = [
    { label: 'Home', href: '#' },
    { label: 'Features', href: '#features' },
    { label: 'Download', href: '#' },
    { label: 'Kontakt', href: '#' }
  ];

  mindslam = [
    { label: 'Über uns', href: '#' },
    { label: 'Vision', href: '#' },
    { label: 'Blog', href: '#' },
    { label: 'Karriere', href: '#' }
  ];

  social = [
    { label: 'LinkedIn', href: '#' },
    { label: 'Instagram', href: '#' },
    { label: 'YouTube', href: '#' },
    { label: 'TikTok', href: '#' }
  ];

  socialIcons = [
    { name: 'instagram', href: '#' },
    { name: 'facebook', href: '#' },
    { name: 'x', href: '#' },
    { name: 'linkedin', href: '#' },
    { name: 'youtube', href: '#' },
    { name: 'tiktok', href: '#' }
  ];
}
