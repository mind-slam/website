import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslationService } from '../../services/translation.service';
import { TranslatePipe } from '../../pipes/translate.pipe';

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  templateUrl: './faq.component.html',
  styleUrl: './faq.component.scss'
})
export class FaqComponent {
  openIndex = signal<number | null>(null);

  faqs = [
    { q: 'faq.q1', a: 'faq.a1', iconType: 'logo' as const },
    { q: 'faq.q2', a: 'faq.a2', iconType: 'svg' as const, icon: 'cpu' },
    { q: 'faq.q3', a: 'faq.a3', iconType: 'svg' as const, icon: 'swords' },
    { q: 'faq.q4', a: 'faq.a4', iconType: 'svg' as const, icon: 'book' },
    { q: 'faq.q5', a: 'faq.a5', iconType: 'svg' as const, icon: 'gift' },
    { q: 'faq.q6', a: 'faq.a6', iconType: 'svg' as const, icon: 'brain' },
    { q: 'faq.q7', a: 'faq.a7', iconType: 'svg' as const, icon: 'trophy' },
    { q: 'faq.q8', a: 'faq.a8', iconType: 'svg' as const, icon: 'graduation' },
    { q: 'faq.q9', a: 'faq.a9', iconType: 'svg' as const, icon: 'shield' },
    { q: 'faq.q10', a: 'faq.a10', iconType: 'svg' as const, icon: 'rocket' },
  ];

  constructor(public ts: TranslationService) {}

  toggle(index: number): void {
    this.openIndex.set(this.openIndex() === index ? null : index);
  }
}
