import { Component, OnInit, ElementRef, ViewChildren, QueryList } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Testimonial {
  name: string;
  image: string;
  quote: string;
}

@Component({
  selector: 'app-testimonials',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './testimonials.component.html',
  styleUrl: './testimonials.component.scss'
})
export class TestimonialsComponent implements OnInit {
  @ViewChildren('testimonialCard') testimonialCards!: QueryList<ElementRef>;

  testimonials: Testimonial[] = [
    {
      name: 'Laura M.',
      image: 'placeholder-1.jpg',
      quote: 'Mit mind.slam macht Lernen endlich Spaß! Die Quiz-Duelle mit meinen Kommilitonen motivieren mich, am Ball zu bleiben.'
    },
    {
      name: 'Tobias K.',
      image: 'placeholder-2.jpg',
      quote: 'Die KI-generierten Quizfragen aus meinen Vorlesungsskripten sind ein Game-Changer. So effizient habe ich noch nie gelernt!'
    },
    {
      name: 'Sophie H.',
      image: 'placeholder-3.jpg',
      quote: 'Der Arena-Modus ist super spannend! Es fühlt sich gar nicht wie Lernen an, obwohl ich so viel dabei mitnehme.'
    },
    {
      name: 'Max B.',
      image: 'placeholder-4.jpg',
      quote: 'Endlich eine Lern-App, die versteht, wie wir Studenten ticken. Das Klassenzimmer-Feature ist genial für Lerngruppen!'
    }
  ];

  ngOnInit(): void {
    this.setupScrollAnimation();
  }

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
      this.testimonialCards?.forEach((card) => {
        observer.observe(card.nativeElement);
      });
    }, 100);
  }
}
