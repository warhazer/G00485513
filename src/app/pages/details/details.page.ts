import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs'; // Import forkJoin to handle multiple API calls
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonButtons,
  IonIcon,
  IonItem,
  IonLabel,
  IonInput,
  IonList,
  IonThumbnail,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { heart, home } from 'ionicons/icons';

import { Tmdb } from '../../services/tmdb';
import { PersonDetails, PersonMovieCredit } from 'src/app/models/movie.model';

@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    IonButtons,
    IonButton,
    IonIcon,
    IonItem,
    IonLabel,
    IonInput,
    IonList,
    IonThumbnail,
  ],
})
export class DetailsPage implements OnInit {
  person: PersonDetails | null = null;
  movies: PersonMovieCredit[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private tmdb: Tmdb
  ) {
    addIcons({ heart, home });
  }

  ngOnInit() {
    const personId = Number(this.route.snapshot.paramMap.get('id'));

    // Use forkJoin to make both API calls in parallel
    forkJoin({
      person: this.tmdb.getPersonDetails(personId),
      credits: this.tmdb.getPersonMovieCredits(personId),
    }).subscribe(({ person, credits }) => {
      this.person = person;
      // Combine cast and crew credits into a single list of movies
      this.movies = [...credits.cast, ...credits.crew]; 
    });
  }

  openMovie(movie: PersonMovieCredit) { // Navigate to the movie details page
    this.router.navigate(['/movie-details', movie.id], { state: { movie } });
  }

  goToFavourites() {
    this.router.navigate(['/favourites']);
  }

  goHome() {
    this.router.navigate(['/home']);
  }

  getProfileUrl(path: string | null): string {
    return this.tmdb.getImageUrl(path);
  }
}
