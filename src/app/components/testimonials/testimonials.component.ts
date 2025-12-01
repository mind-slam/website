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
      image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop&crop=face',
      quote: 'Mit mind.slam macht Lernen endlich Spaß! Die Quiz-Duelle mit meinen Kommilitonen motivieren mich, am Ball zu bleiben.'
    },
    {
      name: 'Tobias K.',
      image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&h=150&fit=crop&crop=face',
      quote: 'Die KI-generierten Quizfragen aus meinen Vorlesungsskripten sind ein Game-Changer. So effizient habe ich noch nie gelernt!'
    },
    {
      name: 'Sophie H.',
      image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&h=150&fit=crop&crop=face',
      quote: 'Der Arena-Modus ist super spannend! Es fühlt sich gar nicht wie Lernen an, obwohl ich so viel dabei mitnehme.'
    },
    {
      name: 'Max B.',
      image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face',
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
