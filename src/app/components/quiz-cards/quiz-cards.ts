import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  selectedIndex: number | null;
  answered: boolean;
}

@Component({
  selector: 'app-quiz-cards',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './quiz-cards.html',
  styleUrl: './quiz-cards.scss'
})
export class QuizCardsComponent {
  showResult = false;

  quizQuestions: QuizQuestion[] = [
    {
      id: 1,
      question: 'Was ist die Hauptstadt von Australien?',
      options: ['Sydney', 'Melbourne', 'Canberra', 'Brisbane'],
      correctIndex: 2,
      selectedIndex: null,
      answered: false
    },
    {
      id: 2,
      question: 'Wie viele Planeten hat unser Sonnensystem?',
      options: ['7 Planeten', '8 Planeten', '9 Planeten', '10 Planeten'],
      correctIndex: 1,
      selectedIndex: null,
      answered: false
    },
    {
      id: 3,
      question: 'Wer malte die Mona Lisa?',
      options: ['Michelangelo', 'Leonardo da Vinci', 'Raphael', 'Donatello'],
      correctIndex: 1,
      selectedIndex: null,
      answered: false
    }
  ];

  get allAnswered(): boolean {
    return this.quizQuestions.every(q => q.answered);
  }

  get correctCount(): number {
    return this.quizQuestions.filter(q => q.selectedIndex === q.correctIndex).length;
  }

  selectAnswer(questionId: number, optionIndex: number): void {
    const question = this.quizQuestions.find(q => q.id === questionId);
    if (question && !question.answered) {
      question.selectedIndex = optionIndex;
      question.answered = true;

      // Check if all questions are answered
      if (this.allAnswered) {
        setTimeout(() => {
          this.showResult = true;
        }, 1000);
      }
    }
  }

  getOptionClass(question: QuizQuestion, optionIndex: number): string {
    if (!question.answered) {
      return '';
    }

    if (optionIndex === question.correctIndex) {
      return 'correct';
    }

    if (optionIndex === question.selectedIndex && question.selectedIndex !== question.correctIndex) {
      return 'wrong';
    }

    return 'disabled';
  }

  resetQuiz(): void {
    this.showResult = false;
    this.quizQuestions.forEach(q => {
      q.selectedIndex = null;
      q.answered = false;
    });
  }
}
