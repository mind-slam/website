import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-features',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './features.component.html',
  styleUrl: './features.component.scss'
})
export class FeaturesComponent {
  isVideoPlaying = false;

  toggleVideo(event: Event): void {
    const wrapper = (event.currentTarget as HTMLElement);
    const video = wrapper.querySelector('video') as HTMLVideoElement;

    if (video.paused) {
      video.play();
      this.isVideoPlaying = true;
    } else {
      video.pause();
      this.isVideoPlaying = false;
    }
  }
}
