import { Component, OnInit, ElementRef, ViewChildren, QueryList } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { TranslationService } from '../../services/translation.service';
import { TranslatePipe } from '../../pipes/translate.pipe';

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
  imports: [CommonModule, FormsModule, HttpClientModule, TranslatePipe],
  templateUrl: './team.component.html',
  styleUrl: './team.component.scss'
})
export class TeamComponent implements OnInit {
  @ViewChildren('teamCard') teamCards!: QueryList<ElementRef>;

  private formspreeUrl = 'https://formspree.io/f/meoykkvw';

  isModalOpen = false;
  isSubmitting = false;
  submitSuccess = false;
  submitError = false;

  applicationForm = {
    name: '',
    email: '',
    position: '',
    motivation: '',
    linkedin: ''
  };

  constructor(private http: HttpClient, public ts: TranslationService) {}

  get teamMembers(): TeamMember[] {
    return [
      {
        name: 'Maximilian Mintchev',
        role: 'Co-Founder & CEO',
        focus: 'Product & Tech',
        description: this.ts.t('team.member1.desc'),
        image: 'team_fotos/maximilian_mintchev.png',
        skills: ['Development', 'Vision', 'Product'],
        linkedin: 'https://linkedin.com/in/',
        email: 'max@mind-slam.de'
      },
      {
        name: 'Nick Heidmann',
        role: 'Co-Founder & CFO',
        focus: 'Finance & Strategy',
        description: this.ts.t('team.member2.desc'),
        image: 'team_fotos/nick_heidmann.png',
        skills: ['Finance', 'Strategy', 'Partnerships'],
        linkedin: 'https://linkedin.com/in/',
        email: 'nick.h@mind-slam.de'
      },
      {
        name: 'Nick Volkmann',
        role: 'Co-Founder & CAIO',
        focus: 'AI & Content',
        description: this.ts.t('team.member3.desc'),
        image: 'team_fotos/nick_volkmann.png',
        skills: ['AI/ML', 'RAG', 'Content'],
        linkedin: 'https://linkedin.com/in/',
        email: 'nick.v@mind-slam.de'
      }
    ];
  }

  openModal(): void {
    this.isModalOpen = true;
    document.body.style.overflow = 'hidden';
  }

  closeModal(): void {
    this.isModalOpen = false;
    document.body.style.overflow = '';
    this.submitSuccess = false;
    this.submitError = false;
  }

  submitApplication(): void {
    this.isSubmitting = true;
    this.submitError = false;

    const formData = {
      name: this.applicationForm.name,
      email: this.applicationForm.email,
      subject: `Bewerbung: ${this.applicationForm.position || 'Allgemeine Bewerbung'}`,
      message: `Position: ${this.applicationForm.position}\n\nMotivation:\n${this.applicationForm.motivation}\n\nLinkedIn: ${this.applicationForm.linkedin || 'Nicht angegeben'}`,
      _replyto: this.applicationForm.email
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
          this.applicationForm = {
            name: '',
            email: '',
            position: '',
            motivation: '',
            linkedin: ''
          };
          setTimeout(() => {
            this.closeModal();
          }, 2500);
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
