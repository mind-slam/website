import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectorRef,
  ElementRef,
  NgZone,
  PLATFORM_ID,
  Inject,
  ViewChild,
  effect,
  inject,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { TranslationService } from '../../services/translation.service';
import { TranslatePipe } from '../../pipes/translate.pipe';

interface ConfettiParticle {
  x: number;
  y: number;
  w: number;
  h: number;
  color: string;
  vx: number;
  vy: number;
  rotation: number;
  rotationSpeed: number;
  opacity: number;
  shape: 'rect' | 'circle' | 'strip';
  scaleY: number;
  wobble: number;
  wobbleSpeed: number;
}

// Design tokens: primary, secondary, tertiary-gold, primary-light
const CONFETTI_COLORS = ['#3BC09C', '#0EA5E9', '#F59E0B', '#6EE7B7'];

@Component({
  selector: 'app-uni-challenge',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  templateUrl: './uni-challenge.component.html',
  styleUrl: './uni-challenge.component.scss',
})
export class UniChallengeComponent implements OnInit, OnDestroy {
  @ViewChild('confettiCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;

  displayedText = '';
  typingDone = false;
  private typewriterInterval: ReturnType<typeof setInterval> | null = null;
  private isBrowser: boolean;

  private observer: IntersectionObserver | null = null;
  isVisible = false;
  private started = false;
  private confettiAnimationId = 0;
  private confettiParticles: ConfettiParticle[] = [];
  readonly t = inject(TranslationService);

  constructor(
    private cdr: ChangeDetectorRef,
    private el: ElementRef,
    private zone: NgZone,
    @Inject(PLATFORM_ID) private platformId: object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    effect(() => {
      const text = this.t.t('uniChallenge.text');
      if (this.started) {
        this.resetTypewriter();
        this.displayedText = text;
        this.typingDone = true;
        this.cdr.detectChanges();
      }
    });
  }

  ngOnInit(): void {
    if (!this.isBrowser) return;

    this.zone.runOutsideAngular(() => {
      this.observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && !this.started) {
              this.started = true;
              this.zone.run(() => {
                this.isVisible = true;
                this.startTypewriter();
              });
            }
          });
        },
        { threshold: 0.3 }
      );
      this.observer.observe(this.el.nativeElement);
    });
  }

  ngOnDestroy(): void {
    if (this.typewriterInterval) clearInterval(this.typewriterInterval);
    this.observer?.disconnect();
    cancelAnimationFrame(this.confettiAnimationId);
  }

  private resetTypewriter(): void {
    if (this.typewriterInterval) clearInterval(this.typewriterInterval);
    this.typewriterInterval = null;
  }

  private startTypewriter(): void {
    const text = this.t.t('uniChallenge.text');
    let charIndex = 0;
    this.displayedText = '';

    this.typewriterInterval = setInterval(() => {
      if (charIndex < text.length) {
        this.displayedText += text[charIndex];
        charIndex++;
        this.cdr.detectChanges();
      } else {
        clearInterval(this.typewriterInterval!);
        this.typingDone = true;
        this.cdr.detectChanges();
        this.fireConfetti();
      }
    }, 80);
  }

  private fireConfetti(): void {
    const canvas = this.canvasRef?.nativeElement;
    if (!canvas) return;

    const rect = this.el.nativeElement.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cx = canvas.width / 2;
    const cy = canvas.height * 0.5;

    // Emit 5 waves with more particles
    for (let wave = 0; wave < 5; wave++) {
      setTimeout(() => {
        for (let i = 0; i < 50; i++) {
          const angle = Math.random() * Math.PI * 2;
          const force = 14 + Math.random() * 24;
          const shapes: ('rect' | 'circle' | 'strip')[] = ['rect', 'circle', 'strip'];

          this.confettiParticles.push({
            x: cx + (Math.random() - 0.5) * 60,
            y: cy + (Math.random() - 0.5) * 30,
            w: Math.random() * 14 + 6,
            h: Math.random() * 8 + 5,
            color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
            vx: Math.cos(angle) * force * 0.4,
            vy: Math.sin(angle) * force * 0.4 - 4,
            rotation: Math.random() * Math.PI * 2,
            rotationSpeed: (Math.random() - 0.5) * 0.25,
            opacity: 1,
            shape: shapes[Math.floor(Math.random() * shapes.length)],
            scaleY: 1,
            wobble: Math.random() * Math.PI * 2,
            wobbleSpeed: 0.03 + Math.random() * 0.05,
          });
        }
      }, wave * 150);
    }

    this.zone.runOutsideAngular(() => {
      const loop = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        let anyAlive = false;

        for (const p of this.confettiParticles) {
          if (p.opacity <= 0) continue;
          anyAlive = true;

          p.vy += 0.15;
          p.x += p.vx;
          p.y += p.vy;
          p.vx *= 0.98;
          p.rotation += p.rotationSpeed;
          p.wobble += p.wobbleSpeed;
          p.scaleY = 0.5 + Math.abs(Math.sin(p.wobble)) * 0.5;

          if (p.y > canvas.height * 0.75) {
            p.opacity -= 0.02;
          }
          if (p.y > canvas.height) {
            p.opacity = 0;
          }

          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation);
          ctx.scale(1, p.scaleY);
          ctx.globalAlpha = Math.max(0, p.opacity);
          ctx.fillStyle = p.color;

          if (p.shape === 'rect') {
            ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
          } else if (p.shape === 'circle') {
            ctx.beginPath();
            ctx.arc(0, 0, p.w / 2, 0, Math.PI * 2);
            ctx.fill();
          } else {
            ctx.fillRect(-1.5, -p.h, 3, p.h * 2);
          }

          ctx.restore();
        }

        if (anyAlive) {
          this.confettiAnimationId = requestAnimationFrame(loop);
        } else {
          this.confettiParticles = [];
        }
      };

      this.confettiAnimationId = requestAnimationFrame(loop);
    });
  }
}
