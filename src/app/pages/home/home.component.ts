import { Component } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { HeroComponent } from '../../components/hero/hero.component';
import { DuellsComponent } from '../../components/duells/duells.component';
import { FaqComponent } from '../../components/faq/faq.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { StepsComponent } from '../../components/steps/steps.component';
import { ConfettiComponent } from '../../components/confetti/confetti.component';
import { UniChallengeComponent } from '../../components/uni-challenge/uni-challenge.component';
// LIFETIME ABO MODULE AUSGEBLENDET
// import { LifetimeAboComponent } from '../../components/lifetime-abo/lifetime-abo.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    HeaderComponent,
    HeroComponent,
    DuellsComponent,
    UniChallengeComponent,
    StepsComponent,
    // LifetimeAboComponent, // LIFETIME ABO MODULE AUSGEBLENDET
    FaqComponent,
    FooterComponent,
    ConfettiComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {}
