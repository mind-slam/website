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

interface DuelQuestion {
  question: string;
  answers: string[];
  correct: number;
  botAnswer: number;
  botDelay: number;
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

  // ========================================
  // Walkthrough / Interactive Duel State
  // ========================================
  walkthroughPhase: 'list' | 'transition' | 'arena' | 'result' = 'list';
  showClickHint = true;
  selectedDuelForArena: Duell | null = null;

  // Phase-based side text configuration
  // phoneSide: where the phone sits, text goes on the opposite side
  get phoneSide(): 'left' | 'right' {
    return 'right'; // phone always on the right
  }

  get sideTextTitle(): string {
    switch (this.walkthroughPhase) {
      case 'list': return 'Deine Duelle auf einen Blick';
      case 'arena': return 'Wissen ist deine Waffe';
      case 'result': return 'Jedes Duell macht dich besser';
      default: return '';
    }
  }

  get sideTextBody(): string {
    switch (this.walkthroughPhase) {
      case 'list': return 'Sieh, wer dich herausfordert. Fordere zurück. Jede Runde zählt, jeder Punkt bringt dich weiter. Bist du bereit?';
      case 'arena': return 'Tick, tack. 10 Sekunden pro Frage. Dein Gegner antwortet gleichzeitig. Wer schneller und schlauer ist, gewinnt die Runde.';
      case 'result': return 'Sofort sehen, was du richtig hattest und was nicht. Aus Fehlern lernen, beim nächsten Mal dominieren.';
      default: return '';
    }
  }

  get sideTextAccent(): string {
    switch (this.walkthroughPhase) {
      case 'list': return 'Klicke auf ein aktives Duell!';
      case 'arena': return 'Beantworte die Fragen!';
      case 'result': return 'So sieht Fortschritt aus.';
      default: return '';
    }
  }

  // Transition
  transitionActive = false;
  // During transition, we keep track of both the outgoing and incoming phase
  // so we can render both simultaneously (new screen builds underneath triangles)
  transitionFrom: 'list' | 'arena' | 'result' | null = null;
  transitionTo: 'list' | 'arena' | 'result' | null = null;
  outgoingSlideOut = false;

  // Duel Arena
  duelTimer = 10;
  currentQuestionIndex = 0;
  selectedAnswerIndex: number | null = null;
  botAnswerIndex: number | null = null;
  playerScore = 0;
  botScore = 0;
  roundResults: boolean[] = [];
  botRoundResults: boolean[] = [];
  showFeedback = false;
  private timerInterval: any;
  private botTimeout: any;
  private nextQuestionTimeout: any;

  // Mock questions for the duel
  duelQuestions: DuelQuestion[] = [
    {
      question: 'Welche Stadt ist die Hauptstadt von Australien?',
      answers: ['Sydney', 'Melbourne', 'Canberra', 'Brisbane'],
      correct: 2,
      botAnswer: 2,
      botDelay: 2500,
    },
    {
      question: 'Wie viele Planeten hat unser Sonnensystem?',
      answers: ['7', '8', '9', '10'],
      correct: 1,
      botAnswer: 2,
      botDelay: 1800,
    },
    {
      question: 'Wer malte die Mona Lisa?',
      answers: ['Michelangelo', 'Leonardo da Vinci', 'Raphael', 'Donatello'],
      correct: 1,
      botAnswer: 1,
      botDelay: 3200,
    },
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

  get currentQuestion(): DuelQuestion {
    return this.duelQuestions[this.currentQuestionIndex];
  }

  get timerPercent(): number {
    return (this.duelTimer / 10) * 100;
  }

  get resultTitle(): string {
    if (this.playerScore > this.botScore) return 'Gewonnen!';
    if (this.playerScore < this.botScore) return 'Verloren!';
    return 'Unentschieden!';
  }

  get resultSubtitle(): string {
    if (this.playerScore > this.botScore) return 'Starke Leistung! Du hast das Duell dominiert.';
    if (this.playerScore < this.botScore) return 'Knapp! Nächstes Mal holst du dir den Sieg.';
    return 'Ein ausgeglichenes Duell!';
  }

  get answerLetters(): string[] {
    return ['A', 'B', 'C', 'D'];
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

  // ========================================
  // Walkthrough Methods
  // ========================================

  onDuelCardClick(duel: Duell): void {
    if (duel.status !== 'aktiv' || this.walkthroughPhase !== 'list') return;

    this.showClickHint = false;
    this.selectedDuelForArena = duel;

    // Start transition: triangles slide in covering old content
    this.transitionFrom = 'list';
    this.transitionTo = 'arena';
    this.transitionActive = true;
    this.outgoingSlideOut = false;
    this.cdr.detectChanges();

    // At 40% (480ms) triangles fully cover - switch to new phase underneath
    setTimeout(() => {
      this.walkthroughPhase = 'arena';
      this.outgoingSlideOut = true;
      this.cdr.detectChanges();
      this.startDuelArena();
    }, 480);

    // At 100% (1200ms) triangles fully gone - clean up
    setTimeout(() => {
      this.transitionActive = false;
      this.transitionFrom = null;
      this.transitionTo = null;
      this.outgoingSlideOut = false;
      this.cdr.detectChanges();
    }, 1200);
  }

  private startDuelArena(): void {
    this.duelTimer = 10;
    this.currentQuestionIndex = 0;
    this.selectedAnswerIndex = null;
    this.botAnswerIndex = null;
    this.playerScore = 0;
    this.botScore = 0;
    this.roundResults = [];
    this.botRoundResults = [];
    this.showFeedback = false;

    this.startTimer();
    this.startBotAnswer();
  }

  private startTimer(): void {
    this.clearTimers();
    this.duelTimer = 10;
    this.timerInterval = setInterval(() => {
      if (this.duelTimer > 0 && this.selectedAnswerIndex === null) {
        this.duelTimer--;
        this.cdr.detectChanges();
        if (this.duelTimer === 0) {
          this.handleTimeUp();
        }
      }
    }, 1000);
  }

  private startBotAnswer(): void {
    const q = this.currentQuestion;
    this.botTimeout = setTimeout(() => {
      this.botAnswerIndex = q.botAnswer;
      this.cdr.detectChanges();
    }, q.botDelay);
  }

  private handleTimeUp(): void {
    if (this.selectedAnswerIndex !== null) return;

    const q = this.currentQuestion;
    const botCorrect = q.botAnswer === q.correct;

    this.selectedAnswerIndex = -1; // timeout marker
    if (botCorrect) this.botScore++;
    this.roundResults.push(false);
    this.botRoundResults.push(botCorrect);
    this.showFeedback = true;
    this.cdr.detectChanges();

    this.advanceAfterDelay();
  }

  onAnswerClick(answerIndex: number): void {
    if (this.selectedAnswerIndex !== null || this.walkthroughPhase !== 'arena') return;

    const q = this.currentQuestion;
    const isCorrect = answerIndex === q.correct;
    const botCorrect = q.botAnswer === q.correct;

    this.selectedAnswerIndex = answerIndex;
    if (isCorrect) this.playerScore++;
    if (botCorrect) this.botScore++;

    this.roundResults.push(isCorrect);
    this.botRoundResults.push(botCorrect);
    this.showFeedback = true;
    this.cdr.detectChanges();

    this.advanceAfterDelay();
  }

  private advanceAfterDelay(): void {
    clearInterval(this.timerInterval);

    this.nextQuestionTimeout = setTimeout(() => {
      if (this.currentQuestionIndex < this.duelQuestions.length - 1) {
        this.currentQuestionIndex++;
        this.selectedAnswerIndex = null;
        this.botAnswerIndex = null;
        this.showFeedback = false;
        this.cdr.detectChanges();
        this.startTimer();
        this.startBotAnswer();
      } else {
        // Duel finished → transition to result
        this.showFeedback = false;
        this.transitionFrom = 'arena';
        this.transitionTo = 'result';
        this.transitionActive = true;
        this.outgoingSlideOut = false;
        this.cdr.detectChanges();

        setTimeout(() => {
          this.walkthroughPhase = 'result';
          this.outgoingSlideOut = true;
          this.cdr.detectChanges();
        }, 480);

        setTimeout(() => {
          this.transitionActive = false;
          this.transitionFrom = null;
          this.transitionTo = null;
          this.outgoingSlideOut = false;
          this.cdr.detectChanges();
        }, 1200);
      }
    }, 1500);
  }

  onBackToList(): void {
    this.transitionFrom = this.walkthroughPhase as 'list' | 'arena' | 'result';
    this.transitionTo = 'list';
    this.transitionActive = true;
    this.outgoingSlideOut = false;
    this.cdr.detectChanges();

    setTimeout(() => {
      this.walkthroughPhase = 'list';
      this.outgoingSlideOut = true;
      this.selectedDuelForArena = null;
      this.showClickHint = true;
      this.clearTimers();
      this.cdr.detectChanges();
    }, 480);

    setTimeout(() => {
      this.transitionActive = false;
      this.transitionFrom = null;
      this.transitionTo = null;
      this.outgoingSlideOut = false;
      this.cdr.detectChanges();
    }, 1200);
  }

  getAnswerClass(idx: number): string {
    if (this.selectedAnswerIndex === null) return '';
    const q = this.currentQuestion;
    if (idx === q.correct) return 'correct';
    if (idx === this.selectedAnswerIndex) return 'wrong';
    return 'dimmed';
  }

  private clearTimers(): void {
    if (this.timerInterval) clearInterval(this.timerInterval);
    if (this.botTimeout) clearTimeout(this.botTimeout);
    if (this.nextQuestionTimeout) clearTimeout(this.nextQuestionTimeout);
  }

  // ========================================
  // Lifecycle
  // ========================================

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
    this.clearTimers();
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
