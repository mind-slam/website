import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslationService } from '../../services/translation.service';
import { TranslatePipe } from '../../pipes/translate.pipe';

@Component({
  selector: 'app-impressum',
  standalone: true,
  imports: [RouterLink, TranslatePipe],
  templateUrl: './impressum.component.html',
  styleUrl: './impressum.component.scss'
})
export class ImpressumComponent {
  readonly ts = inject(TranslationService);
}
