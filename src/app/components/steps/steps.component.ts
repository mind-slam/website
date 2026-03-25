import {
  Component,
  ElementRef,
  AfterViewInit,
  OnDestroy,
  NgZone,
  PLATFORM_ID,
  Inject,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { TranslationService } from '../../services/translation.service';
import { TranslatePipe } from '../../pipes/translate.pipe';

@Component({
  selector: 'app-steps',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  templateUrl: './steps.component.html',
  styleUrl: './steps.component.scss',
})
export class StepsComponent implements AfterViewInit, OnDestroy {
  steps = [
    {
      number: '01',
      tagKey: 'steps.step1.tag',
      titleKey: 'steps.step1.title',
      descKey: 'steps.step1.desc',
      image: '',
      imageAlt: 'Uni Dashboard',
      video: 'step-videos/step1_joinUniversity.MP4',
      finnAvatar: 'avatars/finn_happy.png',
    },
    {
      number: '02',
      tagKey: 'steps.step2.tag',
      titleKey: 'steps.step2.title',
      descKey: 'steps.step2.desc',
      image: '',
      imageAlt: 'Kurs wählen',
      video: 'step-videos/step2_joinCourse.MP4',
      finnAvatar: 'avatars/finn_excited.png',
    },
    {
      number: '03',
      tagKey: 'steps.step3.tag',
      titleKey: 'steps.step3.title',
      descKey: 'steps.step3.desc',
      image: '',
      imageAlt: 'Skript hochladen',
      video: 'step-videos/step3_upload_material.mp4',
      finnAvatar: 'avatars/finn_happy.png',
    },
    {
      number: '04',
      tagKey: 'steps.step4.tag',
      titleKey: 'steps.step4.title',
      descKey: 'steps.step4.desc',
      image: '',
      imageAlt: 'Quiz Duell Arena',
      video: 'step-videos/step4-duell-arena.mp4',
      finnAvatar: 'avatars/finn_excited.png',
    },
  ];

  private observer: IntersectionObserver | null = null;
  private isBrowser: boolean;

  constructor(
    public ts: TranslationService,
    private el: ElementRef,
    private zone: NgZone,
    @Inject(PLATFORM_ID) platformId: object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngAfterViewInit(): void {
    if (!this.isBrowser) return;

    this.zone.runOutsideAngular(() => {
      // Ensure all videos are properly loaded
      const videos = this.el.nativeElement.querySelectorAll('video') as NodeListOf<HTMLVideoElement>;
      videos.forEach((video) => {
        video.muted = true;
        video.loop = true;
        video.playsInline = true;
        video.load();
      });

      this.observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('steps__row--visible');
            }
            const video = entry.target.querySelector('video') as HTMLVideoElement | null;
            if (video) {
              if (entry.isIntersecting) {
                video.muted = true;
                video.loop = true;
                video.play().catch(() => {});
              } else {
                video.pause();
              }
            }
          });
        },
        { threshold: 0.15 }
      );

      const rows = this.el.nativeElement.querySelectorAll('.steps__row');
      rows.forEach((row: Element) => this.observer!.observe(row));
    });
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
