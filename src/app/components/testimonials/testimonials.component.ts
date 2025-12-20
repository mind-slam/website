import { Component, OnInit, ElementRef, ViewChildren, QueryList } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Testimonial {
  name: string;
  image: string;
  university: string;
  quote: string;
  tags: string[];
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
      university: 'TU Dresden • Informatik',
      quote: 'Mit mind.slam macht Lernen endlich Spaß! Die Quiz-Duelle mit meinen Kommilitonen motivieren mich, am Ball zu bleiben. Hab meine Note in Algorithmen von 3,0 auf 1,7 verbessert!',
      tags: ['Quiz-Duelle', 'Motivation']
    },
    {
      name: 'Tobias K.',
      image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&h=150&fit=crop&crop=face',
      university: 'TU Dresden • Wirtschaftswissenschaften',
      quote: 'Die KI-generierten Quizfragen aus meinen Vorlesungsskripten sind ein Game-Changer. So effizient habe ich noch nie gelernt! Upload, Quiz, bestanden.',
      tags: ['KI-Fragen', 'Effizienz']
    },
    {
      name: 'Sophie H.',
      image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&h=150&fit=crop&crop=face',
      university: 'TU Dresden • Medizin',
      quote: 'Der Arena-Modus ist super spannend! Es fühlt sich gar nicht wie Lernen an, obwohl ich so viel dabei mitnehme. Perfekt für Anatomie!',
      tags: ['Arena-Modus', 'Gamification']
    },
    {
      name: 'Max B.',
      image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face',
      university: 'TU Dresden • Maschinenbau',
      quote: 'Endlich eine Lern-App, die versteht, wie wir Studenten ticken. Das Klassenzimmer-Feature ist genial für unsere Lerngruppe vor der Klausur!',
      tags: ['Klassenzimmer', 'Lerngruppen']
    },
    {
      name: 'Anna S.',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      university: 'TU Dresden • Psychologie',
      quote: 'Ich nutze mind.slam täglich in der Straßenbahn. Die kurzen Quiz-Sessions passen perfekt in meinen Alltag. Statistik ist jetzt mein Lieblingsfach!',
      tags: ['Mobil lernen', 'Alltag']
    },
    {
      name: 'Felix R.',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      university: 'TU Dresden • Rechtswissenschaft',
      quote: 'Die Wiederholungsfunktion ist Gold wert! mind.slam merkt sich, welche Fragen ich falsch beantwortet habe und fragt sie immer wieder ab.',
      tags: ['Spaced Repetition', 'Jura']
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
      { threshold: 0.1 }
    );

    setTimeout(() => {
      this.testimonialCards?.forEach((card) => {
        observer.observe(card.nativeElement);
      });
    }, 100);
  }
}
