import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { DatenschutzComponent } from './pages/datenschutz/datenschutz.component';
import { ImpressumComponent } from './pages/impressum/impressum.component';
import { GetMindSlamComponent } from './pages/get-mind-slam/get-mind-slam.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'datenschutz', component: DatenschutzComponent },
  { path: 'impressum', component: ImpressumComponent },
  { path: 'get-mind-slam', component: GetMindSlamComponent },
  { path: '**', redirectTo: '' }
];
