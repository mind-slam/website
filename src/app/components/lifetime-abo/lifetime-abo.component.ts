import { Component, OnInit, OnDestroy, ElementRef, ViewChild, ChangeDetectorRef, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslationService } from '../../services/translation.service';
import { TranslatePipe } from '../../pipes/translate.pipe';

const TYPEWRITER_KEYS = ['lifetime.tw1', 'lifetime.tw2', 'lifetime.tw3'];

@Component({
  selector: 'app-lifetime-abo',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  templateUrl: './lifetime-abo.component.html',
  styleUrls: ['./lifetime-abo.component.scss']
})
export class LifetimeAboComponent implements OnInit, OnDestroy {
  @ViewChild('counterSection') counterSection!: ElementRef;
  readonly ts = inject(TranslationService);

  // Countdown-Zähler: verbleibende Plätze
  totalSlots = 1000;
  claimedSlots = 847;
  remainingSlots = 153;

  // Animierter Counter
  displayedRemaining = 0;
  private counterAnimated = false;
  private counterInterval: any;
  private observer!: IntersectionObserver;

  // Typewriter
  currentWordIndex = 0;
  displayedText = '';
  private typewriterInterval: any;
  private wordTimeout: any;

  // Vorteile
  get benefits() {
    return [
      { icon: '∞', title: this.ts.t('lifetime.benefit1.title'), desc: this.ts.t('lifetime.benefit1.desc') },
      { icon: '⚡', title: this.ts.t('lifetime.benefit2.title'), desc: this.ts.t('lifetime.benefit2.desc') },
      { icon: '🎓', title: this.ts.t('lifetime.benefit3.title'), desc: this.ts.t('lifetime.benefit3.desc') },
      { icon: '👑', title: this.ts.t('lifetime.benefit4.title'), desc: this.ts.t('lifetime.benefit4.desc') }
    ];
  }

  // Progress bar
  get progressPercent(): number {
    return (this.claimedSlots / this.totalSlots) * 100;
  }

  constructor(private cdr: ChangeDetectorRef) {
    effect(() => {
      // React to language changes — restart typewriter with new words
      const _ = this.ts.lang();
      this.restartTypewriter();
    });
  }

  ngOnInit(): void {
    this.startTypewriter();
    this.setupIntersectionObserver();
  }

  ngOnDestroy(): void {
    this.clearTypewriter();
    if (this.counterInterval) clearInterval(this.counterInterval);
    if (this.observer) this.observer.disconnect();
  }

  private getWords(): string[] {
    return TYPEWRITER_KEYS.map((key) => this.ts.t(key));
  }

  private restartTypewriter(): void {
    this.clearTypewriter();
    this.currentWordIndex = 0;
    this.startTypewriter();
  }

  // === Typewriter ===
  private clearTypewriter(): void {
    if (this.typewriterInterval) clearInterval(this.typewriterInterval);
    if (this.wordTimeout) clearTimeout(this.wordTimeout);
  }

  private startTypewriter(): void {
    this.typeText();
  }

  private typeText(): void {
    const words = this.getWords();
    const currentWord = words[this.currentWordIndex];
    let charIndex = 0;
    this.displayedText = '';

    this.typewriterInterval = setInterval(() => {
      if (charIndex < currentWord.length) {
        this.displayedText += currentWord[charIndex];
        charIndex++;
        this.cdr.detectChanges();
      } else {
        clearInterval(this.typewriterInterval);
        this.cdr.detectChanges();
        this.wordTimeout = setTimeout(() => this.deleteText(), 2500);
      }
    }, 80);
  }

  private deleteText(): void {
    this.typewriterInterval = setInterval(() => {
      if (this.displayedText.length > 0) {
        this.displayedText = this.displayedText.slice(0, -1);
        this.cdr.detectChanges();
      } else {
        clearInterval(this.typewriterInterval);
        const words = this.getWords();
        this.currentWordIndex = (this.currentWordIndex + 1) % words.length;
        this.wordTimeout = setTimeout(() => this.typeText(), 400);
      }
    }, 40);
  }

  // === Counter Animation ===
  private setupIntersectionObserver(): void {
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !this.counterAnimated) {
            this.counterAnimated = true;
            this.animateCounter();
          }
        });
      },
      { threshold: 0.3 }
    );
  }

  ngAfterViewInit(): void {
    if (this.counterSection) {
      this.observer.observe(this.counterSection.nativeElement);
    }
  }

  private animateCounter(): void {
    const target = this.remainingSlots;
    const duration = 2000;
    const steps = 60;
    let step = 0;

    this.counterInterval = setInterval(() => {
      step++;
      // Easing: schnell am Anfang, langsam am Ende
      const progress = step / steps;
      const eased = 1 - Math.pow(1 - progress, 3);
      this.displayedRemaining = Math.round(eased * target);
      this.cdr.detectChanges();

      if (step >= steps) {
        this.displayedRemaining = target;
        this.cdr.detectChanges();
        clearInterval(this.counterInterval);
      }
    }, duration / steps);
  }
}
