import { Component, OnInit, OnDestroy, AfterViewInit, ElementRef, signal, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslationService } from '../../services/translation.service';
import { TranslatePipe } from '../../pipes/translate.pipe';

const AVATAR_IMAGES = [
  'https://images.unsplash.com/photo-1728577740843-5f29c7586afe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NTYyMDF8MHwxfHNlYXJjaHwxMnx8YXZhdGFyfGVufDB8fHx8MTczMjEyMDcwNHww&ixlib=rb-4.0.3&q=80&w=1080',
  'https://plus.unsplash.com/premium_photo-1738910084668-c70bd5cac72a?w=900&auto=format&fit=crop&q=60',
  'https://plus.unsplash.com/premium_photo-1739088004528-bdaafb2f5f25?w=900&auto=format&fit=crop&q=60',
  'https://plus.unsplash.com/premium_photo-1739104471549-3fba06cd43e8?w=900&auto=format&fit=crop&q=60',
  'https://plus.unsplash.com/premium_photo-1738854003628-3249b2c5072c?w=900&auto=format&fit=crop&q=60',
  'https://plus.unsplash.com/premium_photo-1738497320977-d718f647b6e7?w=900&auto=format&fit=crop&q=60',
];

const TYPEWRITER_KEYS = [
  'hero.tw1', 'hero.tw2', 'hero.tw3', 'hero.tw4', 'hero.tw5', 'hero.tw6',
  'hero.tw7', 'hero.tw8', 'hero.tw9', 'hero.tw10', 'hero.tw11', 'hero.tw12',
];
const TYPE_SPEED = 70;
const DELETE_SPEED = 40;
const PAUSE_AFTER_TYPE = 2000;
const PAUSE_AFTER_DELETE = 300;
const PAUSE_LAST_WORD = 5000;

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss',
})
export class HeroComponent implements OnInit, OnDestroy, AfterViewInit {
  avatarPreviews = AVATAR_IMAGES;
  modelDropdownOpen = false;
  readonly ts = inject(TranslationService);

  typewriterText = signal(this.ts.t('hero.tw1'));
  private wordIndex = 0;
  private timeoutId: ReturnType<typeof setTimeout> | null = null;
  private videoEndedHandlers: Array<() => void> = [];

  constructor(private el: ElementRef<HTMLElement>) {
    effect(() => {
      // React to language changes
      const word = this.ts.t(TYPEWRITER_KEYS[this.wordIndex]);
      if (this.timeoutId) {
        clearTimeout(this.timeoutId);
      }
      this.typewriterText.set(word);
      this.scheduleNext();
    });
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    const videos = this.el.nativeElement.querySelectorAll<HTMLVideoElement>('video');
    videos.forEach((video) => {
      // Angular doesn't reliably set the muted property from the HTML attribute,
      // which causes browsers to block autoplay. Set it programmatically.
      video.muted = true;
      video.play().catch(() => {});

      const handler = () => {
        video.currentTime = 0;
        video.play();
      };
      video.addEventListener('ended', handler);
      this.videoEndedHandlers.push(() => video.removeEventListener('ended', handler));
    });
  }

  ngOnDestroy(): void {
    if (this.timeoutId) clearTimeout(this.timeoutId);
    this.videoEndedHandlers.forEach((cleanup) => cleanup());
  }

  private getWords(): string[] {
    return TYPEWRITER_KEYS.map((key) => this.ts.t(key));
  }

  private scheduleNext(): void {
    const words = this.getWords();
    const isLastWord = this.wordIndex === words.length - 1;
    const pause = isLastWord ? PAUSE_LAST_WORD : PAUSE_AFTER_TYPE;
    this.timeoutId = setTimeout(() => this.deleteWord(), pause);
  }

  private deleteWord(): void {
    const current = this.typewriterText();
    if (current.length === 0) {
      const words = this.getWords();
      this.wordIndex = (this.wordIndex + 1) % words.length;
      this.timeoutId = setTimeout(() => this.typeWord(), PAUSE_AFTER_DELETE);
      return;
    }
    this.typewriterText.set(current.slice(0, -1));
    this.timeoutId = setTimeout(() => this.deleteWord(), DELETE_SPEED);
  }

  private typeWord(): void {
    const words = this.getWords();
    const target = words[this.wordIndex];
    const current = this.typewriterText();
    if (current.length === target.length) {
      this.scheduleNext();
      return;
    }
    this.typewriterText.set(target.slice(0, current.length + 1));
    this.timeoutId = setTimeout(() => this.typeWord(), TYPE_SPEED);
  }
}
