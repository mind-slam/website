import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { TranslationService } from '../../services/translation.service';
import { TranslatePipe } from '../../pipes/translate.pipe';

@Component({
  selector: 'app-datenschutz',
  standalone: true,
  imports: [RouterLink, HeaderComponent, FooterComponent, TranslatePipe],
  templateUrl: './datenschutz.component.html',
  styleUrl: './datenschutz.component.scss'
})
export class DatenschutzComponent {
  readonly ts = inject(TranslationService);
}
