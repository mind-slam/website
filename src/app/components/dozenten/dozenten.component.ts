import { Component, ElementRef, QueryList, ViewChildren, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { TranslationService } from '../../services/translation.service';
import { TranslatePipe } from '../../pipes/translate.pipe';

@Component({
  selector: 'app-dozenten',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, TranslatePipe],
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

  constructor(private http: HttpClient, public ts: TranslationService) {}
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

  get benefits() {
    return [
      { icon: '📄', title: this.ts.t('dozenten.benefit1.title'), description: this.ts.t('dozenten.benefit1.desc') },
      { icon: '🎓', title: this.ts.t('dozenten.benefit2.title'), description: this.ts.t('dozenten.benefit2.desc') },
      { icon: '📊', title: this.ts.t('dozenten.benefit3.title'), description: this.ts.t('dozenten.benefit3.desc') },
      { icon: '⚔️', title: this.ts.t('dozenten.benefit4.title'), description: this.ts.t('dozenten.benefit4.desc') },
      { icon: '🔒', title: this.ts.t('dozenten.benefit5.title'), description: this.ts.t('dozenten.benefit5.desc') },
      { icon: '🧠', title: this.ts.t('dozenten.benefit6.title'), description: this.ts.t('dozenten.benefit6.desc') },
    ];
  }

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
