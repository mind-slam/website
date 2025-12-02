import { Component, ElementRef, QueryList, ViewChildren, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dozenten',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dozenten.component.html',
  styleUrl: './dozenten.component.scss'
})
export class DozentenComponent implements AfterViewInit {
  @ViewChildren('benefitCard') benefitCards!: QueryList<ElementRef>;

  benefits = [
    {
      icon: '📊',
      title: 'Lernfortschritt verfolgen',
      description: 'Sehen Sie auf einen Blick, wie gut Ihre Studierenden den Stoff verstanden haben. Identifizieren Sie Wissenslücken frühzeitig.'
    },
    {
      icon: '🎯',
      title: 'Gezieltes Feedback',
      description: 'Erkennen Sie, welche Themen mehr Erklärung brauchen. Die Statistiken zeigen genau, wo Studierende Schwierigkeiten haben.'
    },
    {
      icon: '⚡',
      title: 'Aktivere Vorlesungen',
      description: 'Nutzen Sie Live-Quizze in der Vorlesung. Steigern Sie die Aufmerksamkeit und Beteiligung Ihrer Studierenden.'
    },
    {
      icon: '📚',
      title: 'Automatische Fragengenerierung',
      description: 'Die KI erstellt Quizfragen aus Ihren Skripten. Sparen Sie Zeit bei der Erstellung von Übungsmaterial.'
    },
    {
      icon: '🏆',
      title: 'Motivation durch Gamification',
      description: 'Studierende lernen regelmäßiger durch Quiz-Duelle. Die spielerische Komponente erhöht die Prüfungsvorbereitung.'
    },
    {
      icon: '🔒',
      title: 'Volle Kontrolle',
      description: 'Erstellen Sie geschlossene Klassenzimmer für Ihre Kurse. Bestimmen Sie, wer Zugang zu Ihren Materialien hat.'
    }
  ];

  stats = [
    { value: '40%', label: 'bessere Prüfungsergebnisse' },
    { value: '3x', label: 'höhere Lernmotivation' },
    { value: '85%', label: 'aktive Kursteilnahme' }
  ];

  ngAfterViewInit(): void {
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

    this.benefitCards.forEach((card) => {
      observer.observe(card.nativeElement);
    });
  }
}
