import {
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
  afterNextRender,
} from '@angular/core';

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

// Matching Flutter duel_screen.dart colors:
// FlutterFlowTheme primary, secondary, amber, orange
const THEME_COLORS = [
  '#3BC09C', // primary (teal)
  '#0EA5E9', // secondary (sky blue)
  '#F59E0B', // amber
  '#F97316', // orange
];

const EMISSION_WAVES = 3;
const PARTICLES_PER_WAVE = 25;
const WAVE_INTERVAL = 120; // ms between waves

@Component({
  selector: 'app-confetti',
  standalone: true,
  template: `<canvas #canvas class="confetti-canvas"></canvas>`,
  styles: [
    `
      .confetti-canvas {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        pointer-events: none;
        z-index: 9999;
      }
    `,
  ],
})
export class ConfettiComponent implements OnDestroy {
  @ViewChild('canvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;

  private ctx!: CanvasRenderingContext2D;
  private particles: ConfettiParticle[] = [];
  private animationId = 0;
  private alive = true;

  constructor() {
    afterNextRender(() => this.start());
  }

  ngOnDestroy() {
    this.alive = false;
    cancelAnimationFrame(this.animationId);
  }

  private start() {
    const canvas = this.canvasRef.nativeElement;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    this.ctx = canvas.getContext('2d')!;

    // Emit in waves like the Flutter confetti controller (emissionFrequency: 0.05)
    for (let wave = 0; wave < EMISSION_WAVES; wave++) {
      setTimeout(() => {
        if (!this.alive) return;
        this.emitBurst(canvas.width, canvas.height);
      }, wave * WAVE_INTERVAL);
    }

    this.loop();
  }

  private emitBurst(canvasW: number, canvasH: number) {
    const cx = canvasW / 2;
    const cy = canvasH * 0.15; // burst origin near top

    for (let i = 0; i < PARTICLES_PER_WAVE; i++) {
      // Explosive blast: random angle, random force (matching minBlastForce=10, maxBlastForce=30)
      const angle = Math.random() * Math.PI * 2;
      const force = 10 + Math.random() * 20;
      const shapes: ('rect' | 'circle' | 'strip')[] = ['rect', 'circle', 'strip'];

      this.particles.push({
        x: cx + (Math.random() - 0.5) * 20,
        y: cy + (Math.random() - 0.5) * 20,
        w: Math.random() * 8 + 4,
        h: Math.random() * 5 + 3,
        color: THEME_COLORS[Math.floor(Math.random() * THEME_COLORS.length)],
        vx: Math.cos(angle) * force * 0.3,
        vy: Math.sin(angle) * force * 0.3,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.2,
        opacity: 1,
        shape: shapes[Math.floor(Math.random() * shapes.length)],
        scaleY: 1,
        wobble: Math.random() * Math.PI * 2,
        wobbleSpeed: 0.03 + Math.random() * 0.05,
      });
    }
  }

  private loop = () => {
    if (!this.alive) return;

    const canvas = this.canvasRef.nativeElement;
    this.ctx.clearRect(0, 0, canvas.width, canvas.height);

    let anyAlive = false;

    for (const p of this.particles) {
      if (p.opacity <= 0) continue;
      anyAlive = true;

      // Physics matching Flutter: gravity 0.2
      p.vy += 0.2;
      p.x += p.vx;
      p.y += p.vy;
      p.vx *= 0.98;
      p.rotation += p.rotationSpeed;
      p.wobble += p.wobbleSpeed;
      p.scaleY = 0.5 + Math.abs(Math.sin(p.wobble)) * 0.5;

      // Fade out when leaving viewport
      if (p.y > canvas.height * 0.75) {
        p.opacity -= 0.02;
      }
      if (p.y > canvas.height) {
        p.opacity = 0;
      }

      this.ctx.save();
      this.ctx.translate(p.x, p.y);
      this.ctx.rotate(p.rotation);
      this.ctx.scale(1, p.scaleY);
      this.ctx.globalAlpha = Math.max(0, p.opacity);
      this.ctx.fillStyle = p.color;

      if (p.shape === 'rect') {
        this.ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      } else if (p.shape === 'circle') {
        this.ctx.beginPath();
        this.ctx.arc(0, 0, p.w / 2, 0, Math.PI * 2);
        this.ctx.fill();
      } else {
        // strip — tall thin rectangle
        this.ctx.fillRect(-1.5, -p.h, 3, p.h * 2);
      }

      this.ctx.restore();
    }

    if (anyAlive) {
      this.animationId = requestAnimationFrame(this.loop);
    }
  };
}
