import { Component, OnInit, OnDestroy, ElementRef, ViewChildren, QueryList, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Duell {
  id: number;
  player1: {
    name: string;
    image: string;
  };
  player2: {
    name: string;
    image: string;
  };
  course: string;
  chapter: string;
  score1: number;
  score2: number;
  status: 'aktiv' | 'warten' | 'beendet';
  result?: 'win' | 'loss' | 'draw';
  visible: boolean;
}

interface FilterTab {
  key: string;
  label: string;
  count: number | null;
  dotColor: string;
}

// Avatar URLs
const AVATAR_IMAGES = [
  'https://images.unsplash.com/photo-1728577740843-5f29c7586afe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NTYyMDF8MHwxfHNlYXJjaHwxMnx8YXZhdGFyfGVufDB8fHx8MTczMjEyMDcwNHww&ixlib=rb-4.0.3&q=80&w=1080',
  'https://plus.unsplash.com/premium_photo-1738910084668-c70bd5cac72a?w=900&auto=format&fit=crop&q=60',
  'https://plus.unsplash.com/premium_photo-1739088004528-bdaafb2f5f25?w=900&auto=format&fit=crop&q=60',
  'https://plus.unsplash.com/premium_photo-1739104471549-3fba06cd43e8?w=900&auto=format&fit=crop&q=60',
  'https://plus.unsplash.com/premium_photo-1738854003628-3249b2c5072c?w=900&auto=format&fit=crop&q=60',
  'https://plus.unsplash.com/premium_photo-1738497320977-d718f647b6e7?w=900&auto=format&fit=crop&q=60',
  'https://plus.unsplash.com/premium_photo-1739040729170-a62f31ac1fc1?w=900&auto=format&fit=crop&q=60',
  'https://plus.unsplash.com/premium_photo-1739196856919-70e2ccef68b3?w=900&auto=format&fit=crop&q=60',
  'https://plus.unsplash.com/premium_photo-1739178656567-068b26a4b979?w=900&auto=format&fit=crop&q=60',
  'https://plus.unsplash.com/premium_photo-1739054760972-a65a3fe8e639?w=900&auto=format&fit=crop&q=60',
  'https://plus.unsplash.com/premium_photo-1740011638701-40279c34ca87?w=900&auto=format&fit=crop&q=60',
  'https://plus.unsplash.com/premium_photo-1739054760940-8761def0eb50?w=900&auto=format&fit=crop&q=60',
];

@Component({
  selector: 'app-duells',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './duells.component.html',
  styleUrl: './duells.component.scss'
})
export class DuellsComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChildren('duellCard') duellCards!: QueryList<ElementRef>;

  private observer!: IntersectionObserver;

  // Typewriter
  words = ['Student:innen', 'Diggis'];
  currentWordIndex = 0;
  displayedText = '';
  private typewriterInterval: any;
  private wordTimeout: any;

  // Filter
  activeFilter = 'aktiv';

  filterTabs: FilterTab[] = [
    { key: 'aktiv', label: 'Aktiv', count: 3, dotColor: '#3BC09C' },
    { key: 'warten', label: 'Warten', count: 2, dotColor: '#F59E0B' },
    { key: 'beendet', label: 'Beendet', count: null, dotColor: '#6B7280' },
  ];

  // All duels across different statuses
  allDuels: Duell[] = [
    // Active duels
    {
      id: 1,
      player1: { name: 'Du', image: AVATAR_IMAGES[0] },
      player2: { name: 'Lisa', image: AVATAR_IMAGES[1] },
      course: 'Statistik I',
      chapter: 'Wahrscheinlichkeitsrechnung',
      score1: 2,
      score2: 1,
      status: 'aktiv',
      visible: false
    },
    {
      id: 2,
      player1: { name: 'Du', image: AVATAR_IMAGES[2] },
      player2: { name: 'Tim', image: AVATAR_IMAGES[3] },
      course: 'BWL Grundlagen',
      chapter: 'Marketing Mix',
      score1: 1,
      score2: 1,
      status: 'aktiv',
      visible: false
    },
    {
      id: 3,
      player1: { name: 'Du', image: AVATAR_IMAGES[4] },
      player2: { name: 'Sophie', image: AVATAR_IMAGES[5] },
      course: 'Mathe für WiWis',
      chapter: 'Integralrechnung',
      score1: 0,
      score2: 1,
      status: 'aktiv',
      visible: false
    },
    // Waiting duels
    {
      id: 4,
      player1: { name: 'Du', image: AVATAR_IMAGES[6] },
      player2: { name: 'Jan', image: AVATAR_IMAGES[7] },
      course: 'Organische Chemie',
      chapter: 'Alkane & Alkene',
      score1: 1,
      score2: 0,
      status: 'warten',
      visible: false
    },
    {
      id: 5,
      player1: { name: 'Du', image: AVATAR_IMAGES[8] },
      player2: { name: 'Anna', image: AVATAR_IMAGES[9] },
      course: 'Mikroökonomie',
      chapter: 'Angebot & Nachfrage',
      score1: 2,
      score2: 2,
      status: 'warten',
      visible: false
    },
    // Finished duels
    {
      id: 6,
      player1: { name: 'Du', image: AVATAR_IMAGES[10] },
      player2: { name: 'Felix', image: AVATAR_IMAGES[11] },
      course: 'Statistik I',
      chapter: 'Deskriptive Statistik',
      score1: 3,
      score2: 1,
      status: 'beendet',
      result: 'win',
      visible: false
    },
    {
      id: 7,
      player1: { name: 'Du', image: AVATAR_IMAGES[0] },
      player2: { name: 'Laura', image: AVATAR_IMAGES[3] },
      course: 'BWL Grundlagen',
      chapter: 'Finanzierung',
      score1: 1,
      score2: 3,
      status: 'beendet',
      result: 'loss',
      visible: false
    },
    {
      id: 8,
      player1: { name: 'Du', image: AVATAR_IMAGES[6] },
      player2: { name: 'Max', image: AVATAR_IMAGES[9] },
      course: 'Mathe für WiWis',
      chapter: 'Lineare Algebra',
      score1: 2,
      score2: 2,
      status: 'beendet',
      result: 'draw',
      visible: false
    },
  ];

  constructor(private cdr: ChangeDetectorRef) {}

  get filteredDuels(): Duell[] {
    return this.allDuels.filter(d => d.status === this.activeFilter);
  }

  setFilter(key: string): void {
    this.activeFilter = key;
    // Reset visibility for animation
    this.allDuels.forEach(d => d.visible = false);
    this.cdr.detectChanges();
    // Trigger staggered reveal
    setTimeout(() => {
      const filtered = this.filteredDuels;
      filtered.forEach((d, i) => {
        setTimeout(() => {
          d.visible = true;
          this.cdr.detectChanges();
        }, i * 100);
      });
    }, 50);
  }

  ngOnInit(): void {
    this.setupIntersectionObserver();
    this.startTypewriter();
  }

  ngAfterViewInit(): void {
    this.duellCards.changes.subscribe(() => {
      this.observeCards();
    });
    this.observeCards();
  }

  ngOnDestroy(): void {
    if (this.observer) {
      this.observer.disconnect();
    }
    this.clearTypewriter();
  }

  private clearTypewriter(): void {
    if (this.typewriterInterval) {
      clearInterval(this.typewriterInterval);
    }
    if (this.wordTimeout) {
      clearTimeout(this.wordTimeout);
    }
  }

  private startTypewriter(): void {
    this.typeText();
  }

  private typeText(): void {
    const currentWord = this.words[this.currentWordIndex];
    let charIndex = 0;
    this.displayedText = '';

    this.typewriterInterval = setInterval(() => {
      if (charIndex < currentWord.length) {
        this.displayedText += currentWord[charIndex];
        charIndex++;
        this.cdr.detectChanges();
      } else {
        clearInterval(this.typewriterInterval);
        this.cdr.detectChanges();

        this.wordTimeout = setTimeout(() => {
          this.deleteText();
        }, 2000);
      }
    }, 100);
  }

  private deleteText(): void {
    this.typewriterInterval = setInterval(() => {
      if (this.displayedText.length > 0) {
        this.displayedText = this.displayedText.slice(0, -1);
        this.cdr.detectChanges();
      } else {
        clearInterval(this.typewriterInterval);

        this.currentWordIndex = (this.currentWordIndex + 1) % this.words.length;

        this.wordTimeout = setTimeout(() => {
          this.typeText();
        }, 300);
      }
    }, 50);
  }

  private setupIntersectionObserver(): void {
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.getAttribute('data-index') || '0', 10);
            // Find the duel in filtered list and make it visible
            const filtered = this.filteredDuels;
            if (index < filtered.length) {
              setTimeout(() => {
                filtered[index].visible = true;
                this.cdr.detectChanges();
              }, index * 100);
            }
          }
        });
      },
      {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
      }
    );
  }

  private observeCards(): void {
    this.duellCards.forEach((card, index) => {
      card.nativeElement.setAttribute('data-index', index.toString());
      this.observer.observe(card.nativeElement);
    });
  }
}
