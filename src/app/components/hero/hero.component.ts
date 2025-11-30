import { Component, OnInit, OnDestroy } from '@angular/core';
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
    'duell_arena.PNG',
    'choose_lecture_dashboard.PNG',
    'classroom_for_duells.PNG',
    'learn_duell_loaded.PNG',
    'choose_topic_before_duell.PNG',
    'join_lecture.PNG',
    'upload_script_to_classroom.PNG'
  ];

  currentScreenshotIndex = 0;
  private intervalId: ReturnType<typeof setInterval> | null = null;

  appStoreUrl = 'https://apps.apple.com/de/app/mind-slam/id6744414622';
  playStoreUrl = 'https://play.google.com/store/apps/details?id=app.mindslam&utm_source=emea_Med';

  ngOnInit(): void {
    this.startSlideshow();
  }

  ngOnDestroy(): void {
    this.stopSlideshow();
  }

  private startSlideshow(): void {
    this.intervalId = setInterval(() => {
      this.nextScreenshot();
    }, 3500);
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
