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
      icon: '📄',
      title: 'PDF hochladen – fertig',
      description: 'Laden Sie Ihr Vorlesungsskript als PDF hoch. Unsere KI generiert automatisch Quizfragen daraus – nach Themen sortiert.'
    },
    {
      icon: '🎓',
      title: 'Eigenes Klassenzimmer',
      description: 'Erstellen Sie ein Klassenzimmer für Ihre Vorlesung. Studierende treten bei und spielen mit den Fragen aus Ihrem Skript.'
    },
    {
      icon: '📊',
      title: 'Statistiken pro Student',
      description: 'Sehen Sie, wie viele Quizze jeder Studierende gespielt hat, ihre Trefferquote und Punkte – alles im Dashboard.'
    },
    {
      icon: '⚔️',
      title: 'Duelle im Klassenzimmer',
      description: 'Studierende fordern sich gegenseitig zu Quiz-Duellen heraus. Sie sehen aktive, wartende und beendete Duelle.'
    },
    {
      icon: '🔒',
      title: 'Geschlossener Kursraum',
      description: 'Ihr Klassenzimmer ist privat. Nur Studierende, die beitreten, haben Zugang zu Ihren Materialien und Fragen.'
    },
    {
      icon: '🧠',
      title: 'Spaced Repetition inklusive',
      description: 'Im Einzelspieler-Modus lernen Studierende mit wissenschaftlich fundierter Wiederholung – der Stoff bleibt hängen.'
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
