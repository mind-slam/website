import { Component } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { RoadmapComponent } from '../../components/roadmap/roadmap.component';
import { FooterComponent } from '../../components/footer/footer.component';

@Component({
  selector: 'app-investors',
  standalone: true,
  imports: [HeaderComponent, RoadmapComponent, FooterComponent],
  templateUrl: './investors.component.html',
  styleUrl: './investors.component.scss'
})
export class InvestorsComponent {}
