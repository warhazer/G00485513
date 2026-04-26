import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonItem,
  IonIcon,
  IonLabel,
  IonList,
  IonThumbnail,
  IonButton,
  IonButtons,
} from '@ionic/angular/standalone';

import { Favourites } from '../../services/favourites';
import { Tmdb } from '../../services/tmdb';
import { Movie } from '../../models/movie.model';
import { addIcons } from 'ionicons';
import { home } from 'ionicons/icons';

@Component({
  selector: 'app-favourites',
  templateUrl: './favourites.page.html',
  styleUrls: ['./favourites.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    IonItem,
    IonLabel,
    IonList,
    IonThumbnail,
    IonButton,
    IonIcon,
    IonButtons,
  ],
})
export class FavouritesPage {
  favouriteMovies: Movie[] = [];

  constructor(
    private favourites: Favourites,
    private tmdb: Tmdb,
    private router: Router,
  ) {
    addIcons({ home });
  }

  ionViewWillEnter() {
    this.favouriteMovies = this.favourites.getAll(); // Ensure we have the latest list of favourite movies
  }

  openDetails(movie: Movie) {
    this.router.navigate(['/movie-details', movie.id], { state: { movie } });
  }

  goHome() {
    this.router.navigate(['/home']);
  }

  getPosterUrl(path: string | null): string {
    return this.tmdb.getImageUrl(path);
  }
}
