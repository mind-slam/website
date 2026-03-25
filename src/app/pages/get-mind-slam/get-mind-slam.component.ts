import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '../../pipes/translate.pipe';

@Component({
  selector: 'app-get-mind-slam',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslatePipe],
  templateUrl: './get-mind-slam.component.html',
  styleUrl: './get-mind-slam.component.scss'
})
export class GetMindSlamComponent {}
