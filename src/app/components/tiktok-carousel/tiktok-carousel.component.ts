import { Component, OnInit, OnDestroy, ElementRef, ViewChildren, ViewChild, QueryList, AfterViewInit, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';

interface VideoState {
  ready: boolean;
  ended: boolean;
  showLogo: boolean;
  src: string;
  caption: string;
  likes: string;
  comments: string;
  saves: string;
  summary: string;
}

@Component({
  selector: 'app-tiktok-carousel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tiktok-carousel.component.html',
  styleUrl: './tiktok-carousel.component.scss'
})
export class TiktokCarouselComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChildren('promoVideo') promoVideos!: QueryList<ElementRef<HTMLVideoElement>>;
  @ViewChild('tiktokCarousel') tiktokCarousel!: ElementRef<HTMLDivElement>;
  @ViewChild('tiktokSection') tiktokSection!: ElementRef<HTMLElement>;

  constructor(private cdr: ChangeDetectorRef, private ngZone: NgZone) {}

  private sectionObserver?: IntersectionObserver;
  private scrollTimeout?: ReturnType<typeof setTimeout>;
  private autoScrollTimer?: ReturnType<typeof setInterval>;
  private isAutoScrollActive = false;

  currentVideoIndex = 0;
  private isCarouselActive = false;
  private isUserScrolling = false;
  private isAutoScrolling = false;
  carouselStarted = false;

  videoStates: VideoState[] = [
    { ready: false, ended: false, showLogo: false, src: 'ich bin der beste_original.mp4', caption: 'Ich bin der Beste! 🏆 #diggiduell #quiz', likes: '42.1K', comments: '1,337', saves: '8,912', summary: 'Bist du der Beste?' },
    { ready: false, ended: false, showLogo: false, src: 'digiduell ist super.mp4', caption: 'DiggiDuell ist super! 🔥 #studium #lernen', likes: '38.7K', comments: '2,451', saves: '5,123', summary: 'Quizduell für Studenten' },
    { ready: false, ended: false, showLogo: false, src: 'ich bin der beste_original.mp4', caption: 'Quiz-Battle gewonnen! 💪 #winning', likes: '51.2K', comments: '3,891', saves: '12,456', summary: 'Spiele gegen deine Freunde' },
    { ready: false, ended: false, showLogo: false, src: 'digiduell ist super.mp4', caption: 'Lernen war noch nie so fun! 🎮', likes: '29.8K', comments: '1,892', saves: '7,234', summary: 'Prokrastination adé' },
    { ready: false, ended: false, showLogo: false, src: 'ich bin der beste_original.mp4', caption: 'Prüfung bestanden dank DiggiDuell! 🎓', likes: '63.4K', comments: '5,127', saves: '18,903', summary: 'Spaß am Lernen' }
  ];

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.setupCarousel();

    // Starte Auto-Scroll nach 1 Sekunde
    setTimeout(() => {
      this.startAutoScroll();
    }, 1000);
  }

  // NEUER ANSATZ: Einfacher Timer außerhalb von Angular
  private startAutoScroll(): void {
    const carousel = this.tiktokCarousel?.nativeElement;
    if (!carousel) return;

    this.isAutoScrollActive = true;

    // Führe außerhalb von Angular aus für bessere Performance
    this.ngZone.runOutsideAngular(() => {
      // Deaktiviere scroll-snap
      carousel.style.scrollSnapType = 'none';
      carousel.style.scrollBehavior = 'auto';

      let lastIndex = 0;

      this.autoScrollTimer = setInterval(() => {
        if (!this.isAutoScrollActive) {
          this.stopAutoScroll();
          return;
        }

        const maxScroll = carousel.scrollWidth - carousel.clientWidth;
        const currentScroll = carousel.scrollLeft;

        // Scroll um 1 Pixel
        if (currentScroll < maxScroll - 2) {
          carousel.scrollLeft = currentScroll + 1;

          // Finde das nächste aktive Handy
          const newIndex = this.findCenterPhone(carousel);
          if (newIndex !== lastIndex) {
            lastIndex = newIndex;
            // Zurück in Angular Zone für Change Detection
            this.ngZone.run(() => {
              this.currentVideoIndex = newIndex;
              this.cdr.detectChanges();
            });
          }
        } else {
          // Am Ende angekommen
          this.stopAutoScroll();
        }
      }, 32); // Langsamer: 32ms statt 16ms
    });
  }

  private findCenterPhone(carousel: HTMLElement): number {
    const phones = carousel.querySelectorAll('.tiktok-phone');
    const carouselRect = carousel.getBoundingClientRect();
    const centerX = carouselRect.left + carouselRect.width / 2;

    let closest = 0;
    let minDist = Infinity;

    phones.forEach((phone, i) => {
      const rect = phone.getBoundingClientRect();
      const phoneCenterX = rect.left + rect.width / 2;
      const dist = Math.abs(centerX - phoneCenterX);
      if (dist < minDist) {
        minDist = dist;
        closest = i;
      }
    });

    return closest;
  }

  private stopAutoScroll(): void {
    if (this.autoScrollTimer) {
      clearInterval(this.autoScrollTimer);
      this.autoScrollTimer = undefined;
    }

    this.isAutoScrollActive = false;

    const carousel = this.tiktokCarousel?.nativeElement;
    if (carousel) {
      carousel.style.scrollSnapType = 'x mandatory';
      carousel.style.scrollBehavior = 'smooth';
    }

    // Finale Position bestimmen
    this.ngZone.run(() => {
      this.detectCurrentPhone();
    });
  }

  ngOnDestroy(): void {
    this.sectionObserver?.disconnect();
    this.stopAutoScroll();
  }

  private setupCarousel(): void {
    setTimeout(() => {
      if (!this.tiktokCarousel?.nativeElement) return;

      const carousel = this.tiktokCarousel.nativeElement;

      // Setup video event listeners
      this.promoVideos.forEach((videoRef, index) => {
        const video = videoRef.nativeElement;

        const onLoadedData = () => {
          this.videoStates[index].ready = true;
        };

        video.addEventListener('loadeddata', onLoadedData);
        video.addEventListener('canplay', onLoadedData);

        if (video.readyState >= 1) {
          this.videoStates[index].ready = true;
        }

        // Fallback
        setTimeout(() => {
          if (!this.videoStates[index].ready) {
            this.videoStates[index].ready = true;
          }
        }, 2000);

        // Logo einblenden kurz vor Ende
        video.addEventListener('timeupdate', () => {
          if (video.duration && !this.videoStates[index].ended) {
            const timeLeft = video.duration - video.currentTime;
            const shouldShowLogo = timeLeft <= 2;
            if (shouldShowLogo !== this.videoStates[index].showLogo) {
              this.videoStates[index].showLogo = shouldShowLogo;
              this.cdr.detectChanges();
            }
          }
        });

        // Video ended - zeige Logo und starte nächstes
        video.addEventListener('ended', () => {
          this.videoStates[index].ended = true;
          this.videoStates[index].showLogo = true;
          this.cdr.detectChanges();

          setTimeout(() => {
            if (!this.isUserScrolling && this.carouselStarted) {
              this.scrollToNextVideo();
            }
          }, 150);
        });
      });

      // Manuelle Scroll-Erkennung
      carousel.addEventListener('scroll', () => {
        // Ignoriere während Auto-Scroll
        if (this.isAutoScrollActive || this.isAutoScrolling) return;

        this.isUserScrolling = true;
        this.detectCurrentPhone();

        if (this.scrollTimeout) {
          clearTimeout(this.scrollTimeout);
        }

        this.scrollTimeout = setTimeout(() => {
          this.isUserScrolling = false;
          this.detectCurrentPhone();
        }, 150);
      });

      // Intersection Observer
      if (this.tiktokSection?.nativeElement) {
        const section = this.tiktokSection.nativeElement;

        this.sectionObserver = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting && !this.isCarouselActive) {
                this.isCarouselActive = true;
                this.startCarousel();
              } else if (!entry.isIntersecting && this.isCarouselActive) {
                this.isCarouselActive = false;
                this.pauseAllVideos();
              }
            });
          },
          { threshold: 0.1 }
        );
        this.sectionObserver.observe(section);

        setTimeout(() => {
          const rect = section.getBoundingClientRect();
          const isVisible = rect.top < window.innerHeight * 0.9 && rect.bottom > 0;
          if (isVisible && !this.isCarouselActive) {
            this.isCarouselActive = true;
            this.startCarousel();
          }
        }, 200);
      }
    }, 100);
  }

  private detectCurrentPhone(): void {
    const carousel = this.tiktokCarousel?.nativeElement;
    if (!carousel) return;

    const phones = carousel.querySelectorAll('.tiktok-phone');
    const carouselCenter = carousel.scrollLeft + carousel.offsetWidth / 2;

    let closestIndex = 0;
    let closestDistance = Infinity;

    phones.forEach((phone, index) => {
      const phoneElement = phone as HTMLElement;
      const phoneCenter = phoneElement.offsetLeft + phoneElement.offsetWidth / 2;
      const distance = Math.abs(carouselCenter - phoneCenter);

      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
    });

    if (closestIndex !== this.currentVideoIndex) {
      this.switchToVideo(closestIndex);
    }
  }

  private switchToVideo(index: number): void {
    this.pauseAllVideos();
    this.currentVideoIndex = index;
    this.cdr.detectChanges();

    if (this.carouselStarted && !this.videoStates[index].ended && !this.isUserScrolling) {
      const videoRefs = this.promoVideos.toArray();
      if (videoRefs[index]) {
        const video = videoRefs[index].nativeElement;
        video.currentTime = 0;
        video.play().catch(() => {});
      }
    }
  }

  private startCarousel(): void {
    this.currentVideoIndex = 0;
    this.cdr.detectChanges();
    this.scrollToVideo(0);
  }

  navigateNext(): void {
    if (this.currentVideoIndex < this.videoStates.length - 1) {
      this.scrollToVideoPublic(this.currentVideoIndex + 1);
    }
  }

  navigatePrev(): void {
    if (this.currentVideoIndex > 0) {
      this.scrollToVideoPublic(this.currentVideoIndex - 1);
    }
  }

  scrollToVideoPublic(index: number): void {
    // Stoppe Auto-Scroll wenn User navigiert
    this.stopAutoScroll();

    this.isAutoScrolling = true;
    this.currentVideoIndex = index;
    this.cdr.detectChanges();
    this.scrollToVideo(index);
    setTimeout(() => {
      this.isAutoScrolling = false;
      if (this.carouselStarted && !this.videoStates[index].ended) {
        this.playVideo(index);
      }
    }, 250);
  }

  onVideoClick(index: number): void {
    // Stoppe Auto-Scroll
    this.stopAutoScroll();

    const videoRefs = this.promoVideos.toArray();
    const clickedVideo = videoRefs[index]?.nativeElement;

    // Wenn das aktuelle Video läuft und angeklickt wird -> Pause/Play Toggle
    if (this.currentVideoIndex === index && this.carouselStarted && clickedVideo) {
      if (clickedVideo.paused) {
        clickedVideo.play().catch(() => {});
      } else {
        clickedVideo.pause();
      }
      return;
    }

    // Ansonsten: Video starten
    this.carouselStarted = true;
    this.pauseAllVideos();

    this.isAutoScrolling = true;
    this.currentVideoIndex = index;
    this.cdr.detectChanges();
    this.scrollToVideo(index);

    setTimeout(() => {
      this.isAutoScrolling = false;

      if (!this.videoStates[index].ended) {
        if (clickedVideo) {
          clickedVideo.currentTime = 0;
          clickedVideo.play().catch(() => {});
        }
      }
    }, 250);
  }

  private scrollToNextVideo(): void {
    if (this.currentVideoIndex < this.videoStates.length - 1) {
      this.isAutoScrolling = true;
      this.currentVideoIndex++;
      this.cdr.detectChanges();
      this.scrollToVideo(this.currentVideoIndex);
      setTimeout(() => {
        this.isAutoScrolling = false;
        this.playVideo(this.currentVideoIndex);
      }, 250);
    }
  }

  private scrollToVideo(index: number): void {
    const carousel = this.tiktokCarousel?.nativeElement;
    if (!carousel) return;

    const phones = carousel.querySelectorAll('.tiktok-phone');
    if (phones[index]) {
      const phone = phones[index] as HTMLElement;
      const scrollLeft = phone.offsetLeft - (carousel.offsetWidth / 2) + (phone.offsetWidth / 2);

      carousel.scrollTo({
        left: scrollLeft,
        behavior: 'smooth'
      });
    }
  }

  private playVideo(index: number): void {
    const videoRefs = this.promoVideos.toArray();
    if (videoRefs[index] && !this.videoStates[index].ended) {
      const video = videoRefs[index].nativeElement;
      video.currentTime = 0;
      video.play().catch(() => {});
    }
  }

  private pauseAllVideos(): void {
    this.promoVideos.forEach((videoRef) => {
      videoRef.nativeElement.pause();
    });
  }
}
