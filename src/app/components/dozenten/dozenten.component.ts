import { Component, ElementRef, QueryList, ViewChildren, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-dozenten',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './dozenten.component.html',
  styleUrl: './dozenten.component.scss'
})
export class DozentenComponent implements AfterViewInit {
  @ViewChildren('benefitCard') benefitCards!: QueryList<ElementRef>;

  private formspreeUrl = 'https://formspree.io/f/meoykkvw';

  isModalOpen = false;
  isSubmitting = false;
  submitSuccess = false;
  submitError = false;

  constructor(private http: HttpClient) {}
  contactForm = {
    name: '',
    email: '',
    subject: 'mind.slam für Dozierende',
    message: ''
  };

  openModal(): void {
    this.isModalOpen = true;
    document.body.style.overflow = 'hidden';
  }

  closeModal(): void {
    this.isModalOpen = false;
    document.body.style.overflow = '';
  }

  submitForm(): void {
    this.isSubmitting = true;
    this.submitError = false;

    const formData = {
      name: this.contactForm.name,
      email: this.contactForm.email,
      subject: this.contactForm.subject,
      message: this.contactForm.message,
      _replyto: this.contactForm.email
    };

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });

    this.http.post<{ok: boolean}>(this.formspreeUrl, formData, { headers }).subscribe({
      next: (response) => {
        this.isSubmitting = false;
        if (response && response.ok) {
          this.submitSuccess = true;
          this.contactForm = {
            name: '',
            email: '',
            subject: 'mind.slam für Dozierende',
            message: ''
          };
          setTimeout(() => {
            this.closeModal();
            this.submitSuccess = false;
          }, 2000);
        } else {
          this.submitError = true;
        }
      },
      error: () => {
        this.isSubmitting = false;
        this.submitError = true;
      }
    });
  }

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
