import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslationService } from '../../services/translation.service';
import { TranslatePipe } from '../../pipes/translate.pipe';

interface SlideDuel {
  id: number;
  player: { name: string; image: string };
  opponent: { name: string; image: string };
  course: string;
  chapter: string;
  score1: number;
  score2: number;
  status: 'aktiv' | 'warten' | 'beendet';
  result?: 'win' | 'loss' | 'draw';
  testimonial: string;
  university: string;
  studiengang: string;
}

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
  selector: 'app-quiz-cards',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  templateUrl: './quiz-cards.html',
  styleUrls: ['./quiz-cards.scss']
})
export class QuizCardsComponent implements OnDestroy {
  constructor(public ts: TranslationService) {}

  topRow: SlideDuel[] = [
    { id: 1, player: { name: 'Eli', image: AVATAR_IMAGES[0] }, opponent: { name: 'Lisa', image: AVATAR_IMAGES[1] }, course: 'Statistik I', chapter: 'Wahrscheinlichkeitsrechnung', score1: 2, score2: 1, status: 'aktiv', testimonial: 'Dank DiggiDuell habe ich Statistik endlich verstanden!', university: 'TU Dresden', studiengang: 'Informatik' },
    { id: 2, player: { name: 'Davide', image: AVATAR_IMAGES[2] }, opponent: { name: 'Tim', image: AVATAR_IMAGES[3] }, course: 'BWL Grundlagen', chapter: 'Marketing Mix', score1: 1, score2: 1, status: 'aktiv', testimonial: 'Die Duelle motivieren mich, jeden Tag am Ball zu bleiben.', university: 'TU Dresden', studiengang: 'Wirtschaftswissenschaften' },
    { id: 3, player: { name: 'Marie', image: AVATAR_IMAGES[4] }, opponent: { name: 'Sophie', image: AVATAR_IMAGES[5] }, course: 'Mathe für WiWis', chapter: 'Integralrechnung', score1: 3, score2: 2, status: 'beendet', result: 'win', testimonial: 'Mathe-Duelle mit Freunden machen einfach Spaß!', university: 'TU Dresden', studiengang: 'Wirtschaftsmathematik' },
    { id: 4, player: { name: 'Niko', image: AVATAR_IMAGES[6] }, opponent: { name: 'Jan', image: AVATAR_IMAGES[7] }, course: 'Organische Chemie', chapter: 'Alkane & Alkene', score1: 1, score2: 0, status: 'warten', testimonial: 'Orga-Chemie lernen war noch nie so unterhaltsam.', university: 'TU Dresden', studiengang: 'Chemie' },
    { id: 5, player: { name: 'Lena', image: AVATAR_IMAGES[8] }, opponent: { name: 'Anna', image: AVATAR_IMAGES[9] }, course: 'Mikroökonomie', chapter: 'Angebot & Nachfrage', score1: 2, score2: 2, status: 'beendet', result: 'draw', testimonial: 'Perfekt zum Wiederholen in der Straßenbahn!', university: 'TU Dresden', studiengang: 'VWL' },
    { id: 6, player: { name: 'Jonas', image: AVATAR_IMAGES[10] }, opponent: { name: 'Felix', image: AVATAR_IMAGES[11] }, course: 'Statistik I', chapter: 'Deskriptive Statistik', score1: 3, score2: 1, status: 'beendet', result: 'win', testimonial: 'Hab meine Note in Statistik von 3,0 auf 1,7 verbessert!', university: 'TU Dresden', studiengang: 'Psychologie' },
  ];

  bottomRow: SlideDuel[] = [
    { id: 7, player: { name: 'Sarah', image: AVATAR_IMAGES[0] }, opponent: { name: 'Laura', image: AVATAR_IMAGES[2] }, course: 'BWL Grundlagen', chapter: 'Finanzierung', score1: 1, score2: 3, status: 'beendet', result: 'loss', testimonial: 'Die KI-Fragen aus meinem Skript sind ein Game-Changer!', university: 'TU Dresden', studiengang: 'BWL' },
    { id: 8, player: { name: 'Paul', image: AVATAR_IMAGES[4] }, opponent: { name: 'Max', image: AVATAR_IMAGES[4] }, course: 'Mathe für WiWis', chapter: 'Lineare Algebra', score1: 2, score2: 2, status: 'beendet', result: 'draw', testimonial: 'Endlich eine App, die versteht wie Studenten ticken.', university: 'TU Dresden', studiengang: 'Maschinenbau' },
    { id: 9, player: { name: 'Clara', image: AVATAR_IMAGES[6] }, opponent: { name: 'Emma', image: AVATAR_IMAGES[6] }, course: 'Psychologie', chapter: 'Kognitive Prozesse', score1: 0, score2: 1, status: 'aktiv', testimonial: 'Die kurzen Quiz-Sessions passen perfekt in meinen Alltag.', university: 'TU Dresden', studiengang: 'Psychologie' },
    { id: 10, player: { name: 'Ben', image: AVATAR_IMAGES[8] }, opponent: { name: 'Noah', image: AVATAR_IMAGES[8] }, course: 'Informatik I', chapter: 'Algorithmen', score1: 3, score2: 0, status: 'beendet', result: 'win', testimonial: 'Algorithmen-Duelle gegen Kommilitonen sind genial!', university: 'TU Dresden', studiengang: 'Informatik' },
    { id: 11, player: { name: 'Hannah', image: AVATAR_IMAGES[10] }, opponent: { name: 'Mia', image: AVATAR_IMAGES[10] }, course: 'Jura', chapter: 'BGB AT', score1: 1, score2: 2, status: 'warten', testimonial: 'Jura-Fälle per Quiz wiederholen ist super effektiv.', university: 'TU Dresden', studiengang: 'Rechtswissenschaft' },
    { id: 12, player: { name: 'Finn', image: AVATAR_IMAGES[0] }, opponent: { name: 'Luca', image: AVATAR_IMAGES[0] }, course: 'VWL', chapter: 'Makroökonomie', score1: 2, score2: 1, status: 'aktiv', testimonial: 'DiggiDuell macht Prokrastination unmöglich!', university: 'TU Dresden', studiengang: 'VWL' },
  ];

  getStatusLabel(duel: SlideDuel): string {
    if (duel.status === 'aktiv') return duel.course;
    if (duel.status === 'warten') return this.ts.t('quizCards.waitingFor') + ' ' + duel.opponent.name + ' ...';
    if (duel.result === 'win') return this.ts.t('quizCards.won');
    if (duel.result === 'loss') return this.ts.t('quizCards.lost');
    return this.ts.t('quizCards.draw');
  }

  ngOnDestroy(): void {}
}
