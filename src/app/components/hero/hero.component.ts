import { Component, OnInit, OnDestroy, NgZone, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss'
})
export class HeroComponent implements OnInit, OnDestroy {
  screenshots = [
    { image: 'duell_arena.PNG', label: 'Duell Arena', position: 'top-left' },
    { image: 'choose_lecture_dashboard.PNG', label: 'Vorlesungen wählen', position: 'bottom-left' },
    { image: 'classroom_for_duells.PNG', label: 'Klassenzimmer', position: 'top-left' },
    { image: 'learn_duell_loaded.PNG', label: 'Quiz spielen', position: 'bottom-left' },
    { image: 'choose_topic_before_duell.PNG', label: 'Thema wählen', position: 'top-left' },
    { image: 'join_lecture.PNG', label: 'Vorlesung beitreten', position: 'bottom-left' },
    { image: 'upload_script_to_classroom.PNG', label: 'Skript hochladen', position: 'top-left' }
  ];

  currentScreenshotIndex = 0;
  private intervalId: ReturnType<typeof setInterval> | null = null;

  appStoreUrl = 'https://apps.apple.com/de/app/mind-slam/id6744414622';
  playStoreUrl = 'https://play.google.com/store/apps/details?id=app.mindslam&utm_source=emea_Med';

  constructor(private ngZone: NgZone, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.startSlideshow();
  }

  ngOnDestroy(): void {
    this.stopSlideshow();
  }

  private startSlideshow(): void {
    // Run inside NgZone to ensure change detection
    this.ngZone.runOutsideAngular(() => {
      this.intervalId = setInterval(() => {
        this.ngZone.run(() => {
          this.nextScreenshot();
          this.cdr.detectChanges();
        });
      }, 3000);
    });
  }

  private stopSlideshow(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  nextScreenshot(): void {
    this.currentScreenshotIndex = (this.currentScreenshotIndex + 1) % this.screenshots.length;
  }

  prevScreenshot(): void {
    this.currentScreenshotIndex =
      (this.currentScreenshotIndex - 1 + this.screenshots.length) % this.screenshots.length;
  }

  goToScreenshot(index: number): void {
    this.currentScreenshotIndex = index;
    this.stopSlideshow();
    this.startSlideshow();
  }
}
