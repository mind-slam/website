import { Component, OnInit, ElementRef, ViewChildren, QueryList } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Milestone {
  title: string;
  subtitle: string;
  date: string;
  icon: string;
  completed: boolean;
}

interface BudgetItem {
  percentage: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-roadmap',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './roadmap.component.html',
  styleUrl: './roadmap.component.scss'
})
export class RoadmapComponent implements OnInit {
  @ViewChildren('milestoneCard') milestoneCards!: QueryList<ElementRef>;

  milestones: Milestone[] = [
    {
      title: 'Idee & Vorstudie',
      subtitle: '',
      date: 'Sommer 2024',
      icon: 'lightbulb',
      completed: true
    },
    {
      title: 'Gründung der UG',
      subtitle: '',
      date: 'Jan. 2025',
      icon: 'key',
      completed: true
    },
    {
      title: 'App im Store',
      subtitle: '& Pre-Launch',
      date: 'Juli 2025',
      icon: 'check',
      completed: true
    },
    {
      title: 'Launch auf',
      subtitle: 'erstem Campus',
      date: 'Oktober 2025',
      icon: 'graduation',
      completed: false
    },
    {
      title: 'Präsent',
      subtitle: 'skalieren',
      date: 'ab Jan. 2026',
      icon: 'rocket',
      completed: false
    },
    {
      title: 'Dtl.-weiter',
      subtitle: 'Rollout',
      date: 'ab Q4 2026',
      icon: 'rocket',
      completed: false
    }
  ];

  budgetItems: BudgetItem[] = [
    {
      percentage: '10',
      title: 'Hardware & Lizenzen',
      description: ''
    },
    {
      percentage: '40',
      title: 'Marketing-Budget:',
      description: 'über die Grenzen der TUD bekannt werden'
    },
    {
      percentage: '50',
      title: 'KI- & Software-Kosten:',
      description: 'resilientes RAG-System + skalierbarer Code'
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
      this.milestoneCards?.forEach((card) => {
        observer.observe(card.nativeElement);
      });
    }, 100);
  }
}
