import { Component, OnInit, ElementRef, ViewChildren, QueryList } from '@angular/core';
import { CommonModule } from '@angular/common';

interface TeamMember {
  name: string;
  role: string;
  focus: string;
  description: string;
  image: string;
  skills: string[];
  linkedin?: string;
  email?: string;
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
      name: 'Maximilian Mintchev',
      role: 'Founder & CEO',
      focus: 'Product & Tech',
      description: 'Die treibende Kraft hinter mind.slam. Max entwickelt die Vision und führt das technische Team. Als Student kennt er die Herausforderungen des Lernens aus erster Hand.',
      image: 'team_fotos/maximilian_mintchev.png',
      skills: ['Flutter', 'AI/ML', 'Product'],
      linkedin: 'https://linkedin.com/in/',
      email: 'max@mind-slam.de'
    },
    {
      name: 'Nick Heidmann',
      role: 'Co-Founder & CFO',
      focus: 'Finance & Strategy',
      description: 'Nick sorgt für das solide Fundament. Er verantwortet Finanzen, Strategie und Partnerschaften. Sein analytischer Blick treibt das Wachstum voran.',
      image: 'team_fotos/nick_heidmann.png',
      skills: ['Finance', 'Strategy', 'Partnerships'],
      linkedin: 'https://linkedin.com/in/',
      email: 'nick.h@mind-slam.de'
    },
    {
      name: 'Nick Volkmann',
      role: 'Co-Founder & CTO',
      focus: 'AI & Content',
      description: 'Nick ist das Gehirn hinter unserer KI. Er entwickelt die Algorithmen für die automatische Fragengeneration und sorgt für hochwertige Lerninhalte.',
      image: 'team_fotos/nick_volkmann.png',
      skills: ['AI/ML', 'RAG', 'Content'],
      linkedin: 'https://linkedin.com/in/',
      email: 'nick.v@mind-slam.de'
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
      { threshold: 0.15 }
    );

    setTimeout(() => {
      this.teamCards?.forEach((card) => {
        observer.observe(card.nativeElement);
      });
    }, 100);
  }
}
