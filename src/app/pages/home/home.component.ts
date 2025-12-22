import { Component } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { HeroComponent } from '../../components/hero/hero.component';
import { TiktokCarouselComponent } from '../../components/tiktok-carousel/tiktok-carousel.component';
import { FeaturesComponent } from '../../components/features/features.component';
import { DozentenComponent } from '../../components/dozenten/dozenten.component';
import { TeamComponent } from '../../components/team/team.component';
import { TestimonialsComponent } from '../../components/testimonials/testimonials.component';
import { RoadmapComponent } from '../../components/roadmap/roadmap.component';
import { BillboardComponent } from '../../components/billboard/billboard.component';
import { FooterComponent } from '../../components/footer/footer.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    HeaderComponent,
    HeroComponent,
    TiktokCarouselComponent,
    FeaturesComponent,
    DozentenComponent,
    TeamComponent,
    TestimonialsComponent,
    RoadmapComponent,
    BillboardComponent,
    FooterComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {}
