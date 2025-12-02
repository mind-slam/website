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
      title: 'Echtzeit-Insights',
      description: 'Sehen Sie live, welche Themen sitzen und wo nachgebessert werden muss – ohne Extra-Klausuren oder Umfragen.'
    },
    {
      icon: '🤖',
      title: 'KI erstellt Ihre Quizze',
      description: 'Laden Sie Ihr Skript hoch und erhalten Sie in Sekunden prüfungsrelevante Fragen. Null Aufwand für Sie.'
    },
    {
      icon: '🎯',
      title: 'Studierende lernen freiwillig',
      description: 'Durch Gamification und Wettbewerb lernen Ihre Studierenden regelmäßig – nicht erst kurz vor der Prüfung.'
    },
    {
      icon: '📈',
      title: 'Bessere Prüfungsergebnisse',
      description: 'Aktives Wiederholen statt passives Lesen. Spaced Repetition sorgt dafür, dass der Stoff wirklich hängen bleibt.'
    },
    {
      icon: '🔒',
      title: 'Geschlossene Kursräume',
      description: 'Ihre Materialien bleiben privat. Nur eingeschriebene Studierende haben Zugang zu Ihren Klassenzimmern.'
    },
    {
      icon: '⏱️',
      title: 'Spart Ihnen Zeit',
      description: 'Keine manuellen Übungsblätter mehr. Die Plattform übernimmt Erstellung, Auswertung und Feedback.'
    }
  ];

  stats: { value: string; label: string }[] = [];

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
