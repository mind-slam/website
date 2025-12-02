import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-get-mind-slam',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './get-mind-slam.component.html',
  styleUrl: './get-mind-slam.component.scss'
})
export class GetMindSlamComponent {}
