import { Component, OnInit, ElementRef, ViewChildren, QueryList } from '@angular/core';
import { CommonModule } from '@angular/common';

interface TeamMember {
  name: string;
  role: string;
  description: string;
  image: string;
  linkedin?: string;
}

@Component({
  selector: 'app-team',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './team.component.html',
  styleUrl: './team.component.scss'
})
export class TeamComponent implements OnInit {
  @ViewChildren('teamCard') teamCards!: QueryList<ElementRef>;

  teamMembers: TeamMember[] = [
    {
      name: 'Maximilian',
      role: 'Founder & Visionär',
      description: 'Die treibende Kraft hinter mind.slam. Maximilian hat die Vision, das Lernen für Studenten revolutionär zu verändern.',
      image: 'placeholder-max.jpg',
      linkedin: '#'
    },
    {
      name: 'Nick Heidmann',
      role: 'Co-Founder',
      description: 'Finance & Strategy. Nick sorgt dafür, dass mind.slam auf einem soliden finanziellen Fundament steht und strategisch wächst.',
      image: 'placeholder-nick-h.jpg',
      linkedin: '#'
    },
    {
      name: 'Nick Volkmann',
      role: 'Co-Founder',
      description: 'AI & Platform Content Creation & Management. Nick entwickelt die KI-Systeme und sorgt für hochwertige Lerninhalte.',
      image: 'placeholder-nick-v.jpg',
      linkedin: '#'
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
      this.teamCards?.forEach((card) => {
        observer.observe(card.nativeElement);
      });
    }, 100);
  }
}
