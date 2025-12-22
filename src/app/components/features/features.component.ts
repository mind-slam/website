import { Component, OnInit, ElementRef, ViewChildren, QueryList, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Feature {
  icon: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-features',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './features.component.html',
  styleUrl: './features.component.scss'
})
export class FeaturesComponent implements OnInit, AfterViewInit {
  @ViewChildren('featureCard') featureCards!: QueryList<ElementRef>;

  featuresLeft: Feature[] = [
    {
      icon: '🎯',
      title: 'Quiz-Duelle',
      description: 'Fordere deine Kommilitonen heraus und beweise dein Wissen in spannenden 1v1 Duellen.'
    },
    {
      icon: '📚',
      title: 'KI-Quizze',
      description: 'Lade dein Skript hoch und erhalte automatisch generierte Quizfragen zum Lernen.'
    }
  ];

  featuresRight: Feature[] = [
    {
      icon: '🏆',
      title: 'Arena-Modus',
      description: 'Tritt in der Arena gegen alle an und kämpfe um die Spitzenplätze im Ranking.'
    },
    {
      icon: '👥',
      title: 'Klassenzimmer',
      description: 'Lerne gemeinsam mit deinem Kurs und vergleiche deinen Fortschritt.'
    }
  ];

  featuredScreenshot = 'duell_arena.PNG';

  ngOnInit(): void {
    this.setupScrollAnimation();
  }

  ngAfterViewInit(): void {}

  private setupScrollAnimation(): void {
    if (typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.2 }
    );

    setTimeout(() => {
      this.featureCards?.forEach((card) => {
        observer.observe(card.nativeElement);
      });
    }, 100);
  }
}
