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
  uni: string;
  uniBadge: string; // Kürzel z.B. "TUM", "LMU", "FUB"
  visible: boolean;
}

// Avatar URLs aus der App (app_constants.dart)
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
  'https://plus.unsplash.com/premium_photo-1739201500158-6934fd386f8c?w=900&auto=format&fit=crop&q=60',
  'https://plus.unsplash.com/premium_photo-1739278713397-f54477b600f1?w=900&auto=format&fit=crop&q=60',
  'https://plus.unsplash.com/premium_photo-1739266574712-d1c6bc58311a?w=900&auto=format&fit=crop&q=60',
  'https://plus.unsplash.com/premium_photo-1739275163094-2873554b3113?w=900&auto=format&fit=crop&q=60',
  'https://plus.unsplash.com/premium_photo-1739104471536-1d097254e6aa?w=900&auto=format&fit=crop&q=60',
  'https://plus.unsplash.com/premium_photo-1739786996040-32bde1db0610?w=900&auto=format&fit=crop&q=60',
  'https://plus.unsplash.com/premium_photo-1739201499625-bf074c38221d?w=900&auto=format&fit=crop&q=60',
  'https://plus.unsplash.com/premium_photo-1739210832175-d0ea23cd5446?w=900&auto=format&fit=crop&q=60',
  'https://plus.unsplash.com/premium_photo-1740105309652-b5c1f52953cc?w=900&auto=format&fit=crop&q=60',
  'https://plus.unsplash.com/premium_photo-1739786995552-0a2ccfa62ba5?w=900&auto=format&fit=crop&q=60',
  'https://plus.unsplash.com/premium_photo-1739580360043-f2c498c1d861?w=900&auto=format&fit=crop&q=60',
  'https://plus.unsplash.com/premium_photo-1738590729343-fb884bac3b58?w=900&auto=format&fit=crop&q=60',
  'https://plus.unsplash.com/premium_photo-1739376473691-cdc1db244ac6?w=900&auto=format&fit=crop&q=60',
  'https://plus.unsplash.com/premium_photo-1739931374888-ba85cffbc8be?w=900&auto=format&fit=crop&q=60',
  'https://plus.unsplash.com/premium_photo-1739170099068-cb3963903f64?w=900&auto=format&fit=crop&q=60',
  'https://plus.unsplash.com/premium_photo-1739333585975-c7c456f3985b?w=900&auto=format&fit=crop&q=60',
  'https://plus.unsplash.com/premium_photo-1738910084675-f50540f5af4d?w=900&auto=format&fit=crop&q=60',
  'https://plus.unsplash.com/premium_photo-1738989235674-290022372c58?w=900&auto=format&fit=crop&q=60',
  'https://plus.unsplash.com/premium_photo-1739278712940-2b36e2ab87de?w=900&auto=format&fit=crop&q=60'
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

  // Typewriter Effekt (wie in Hero-Komponente)
  words = ['Studenten', 'Diggis'];
  currentWordIndex = 0;
  displayedText = '';
  private typewriterInterval: any;
  private wordTimeout: any;

  constructor(private cdr: ChangeDetectorRef) {}

  duells: Duell[] = [
    {
      id: 1,
      player1: { name: 'Max', image: AVATAR_IMAGES[0] },
      player2: { name: 'Lisa', image: AVATAR_IMAGES[1] },
      course: 'Statistik I',
      uni: 'LMU München',
      uniBadge: 'LMU',
      visible: false
    },
    {
      id: 2,
      player1: { name: 'Tim', image: AVATAR_IMAGES[2] },
      player2: { name: 'Anna', image: AVATAR_IMAGES[3] },
      course: 'BWL Grundlagen',
      uni: 'Uni Mannheim',
      uniBadge: 'UMA',
      visible: false
    },
    {
      id: 3,
      player1: { name: 'Jan', image: AVATAR_IMAGES[4] },
      player2: { name: 'Sophie', image: AVATAR_IMAGES[5] },
      course: 'Mathe für WiWis',
      uni: 'TU München',
      uniBadge: 'TUM',
      visible: false
    },
    {
      id: 4,
      player1: { name: 'Felix', image: AVATAR_IMAGES[6] },
      player2: { name: 'Laura', image: AVATAR_IMAGES[7] },
      course: 'Organische Chemie',
      uni: 'Uni Heidelberg',
      uniBadge: 'UHD',
      visible: false
    }
  ];

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

        // Warte 2 Sekunden, dann lösche den Text
        this.wordTimeout = setTimeout(() => {
          this.deleteText();
        }, 2000);
      }
    }, 100); // Tippgeschwindigkeit
  }

  private deleteText(): void {
    this.typewriterInterval = setInterval(() => {
      if (this.displayedText.length > 0) {
        this.displayedText = this.displayedText.slice(0, -1);
        this.cdr.detectChanges();
      } else {
        clearInterval(this.typewriterInterval);

        // Nächstes Wort
        this.currentWordIndex = (this.currentWordIndex + 1) % this.words.length;

        // Kurze Pause, dann nächsten Text tippen
        this.wordTimeout = setTimeout(() => {
          this.typeText();
        }, 300);
      }
    }, 50); // Löschgeschwindigkeit (schneller als Tippen)
  }

  private setupIntersectionObserver(): void {
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.getAttribute('data-index') || '0', 10);
            setTimeout(() => {
              this.duells[index].visible = true;
            }, index * 150); // Gestaffeltes Einblenden
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
