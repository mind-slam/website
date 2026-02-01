import { Component, OnInit, OnDestroy, ElementRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-lifetime-abo',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './lifetime-abo.component.html',
  styleUrls: ['./lifetime-abo.component.scss']
})
export class LifetimeAboComponent implements OnInit, OnDestroy {
  @ViewChild('counterSection') counterSection!: ElementRef;

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
  words = ['Lifetime Zugang', 'Für immer lernen', 'Einmal. Fertig.'];
  currentWordIndex = 0;
  displayedText = '';
  private typewriterInterval: any;
  private wordTimeout: any;

  // Vorteile
  benefits = [
    { icon: '∞', title: 'Unbegrenzter Zugang', desc: 'Alle Kurse, alle Duelle – für immer.' },
    { icon: '⚡', title: 'Keine monatlichen Kosten', desc: 'Einmal zahlen, nie wieder dran denken.' },
    { icon: '🎓', title: 'Alle zukünftigen Features', desc: 'Neue Inhalte? Bekommst du automatisch.' },
    { icon: '👑', title: 'Early Supporter Badge', desc: 'Zeig, dass du von Anfang an dabei warst.' }
  ];

  // Progress bar
  get progressPercent(): number {
    return (this.claimedSlots / this.totalSlots) * 100;
  }

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.startTypewriter();
    this.setupIntersectionObserver();
  }

  ngOnDestroy(): void {
    this.clearTypewriter();
    if (this.counterInterval) clearInterval(this.counterInterval);
    if (this.observer) this.observer.disconnect();
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
    const currentWord = this.words[this.currentWordIndex];
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
        this.currentWordIndex = (this.currentWordIndex + 1) % this.words.length;
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
    const increment = target / steps;
    let current = 0;
    let step = 0;

    this.counterInterval = setInterval(() => {
      step++;
      // Easing: schnell am Anfang, langsam am Ende
      const progress = step / steps;
      const eased = 1 - Math.pow(1 - progress, 3);
      current = Math.round(eased * target);
      this.displayedRemaining = current;
      this.cdr.detectChanges();

      if (step >= steps) {
        this.displayedRemaining = target;
        this.cdr.detectChanges();
        clearInterval(this.counterInterval);
      }
    }, duration / steps);
  }
}
