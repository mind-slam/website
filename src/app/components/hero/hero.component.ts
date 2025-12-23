import { Component, OnInit, OnDestroy, NgZone, ChangeDetectorRef, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface VideoData {
  src: string;
  caption: string;
  likes: string;
  comments: string;
  saves: string;
}

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss'
})
export class HeroComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('heroVideo') heroVideoRef!: ElementRef<HTMLVideoElement>;

  videos: VideoData[] = [
    { src: 'ich bin der beste_original.mp4', caption: 'Ich bin der Beste! 🏆 #diggiduell #quiz', likes: '42.1K', comments: '1,337', saves: '8,912' },
    { src: 'digiduell ist super.mp4', caption: 'DiggiDuell ist super! 🔥 #studium #lernen', likes: '38.7K', comments: '2,451', saves: '5,123' }
  ];

  currentVideoIndex = 0;
  videoReady = false;
  videoPlaying = false;

  appStoreUrl = 'https://apps.apple.com/de/app/mind-slam/id6744414622';
  playStoreUrl = 'https://play.google.com/store/apps/details?id=app.mindslam&utm_source=emea_Med';

  get currentVideo(): VideoData {
    return this.videos[this.currentVideoIndex];
  }

  constructor(private ngZone: NgZone, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.setupVideo();
  }

  ngOnDestroy(): void {
    const video = this.heroVideoRef?.nativeElement;
    if (video) {
      video.pause();
    }
  }

  private setupVideo(): void {
    setTimeout(() => {
      const video = this.heroVideoRef?.nativeElement;
      if (!video) return;

      video.addEventListener('loadeddata', () => {
        this.videoReady = true;
        this.cdr.detectChanges();
      });

      video.addEventListener('canplay', () => {
        this.videoReady = true;
        this.cdr.detectChanges();
      });

      video.addEventListener('play', () => {
        this.videoPlaying = true;
        this.cdr.detectChanges();
      });

      video.addEventListener('pause', () => {
        this.videoPlaying = false;
        this.cdr.detectChanges();
      });

      video.addEventListener('ended', () => {
        this.videoPlaying = false;
        this.cdr.detectChanges();
      });

      // Fallback ready state
      if (video.readyState >= 1) {
        this.videoReady = true;
        this.cdr.detectChanges();
      }

      // Fallback timeout
      setTimeout(() => {
        if (!this.videoReady) {
          this.videoReady = true;
          this.cdr.detectChanges();
        }
      }, 3000);
    }, 100);
  }

  toggleVideo(): void {
    const video = this.heroVideoRef?.nativeElement;
    if (!video) return;

    if (video.paused) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }

  selectVideo(index: number): void {
    if (index === this.currentVideoIndex) return;

    const video = this.heroVideoRef?.nativeElement;
    if (video) {
      video.pause();
    }

    this.currentVideoIndex = index;
    this.videoReady = false;
    this.videoPlaying = false;
    this.cdr.detectChanges();

    // Wait for Angular to update the source, then reload
    setTimeout(() => {
      const newVideo = this.heroVideoRef?.nativeElement;
      if (newVideo) {
        newVideo.load();
      }
    }, 50);
  }
}
