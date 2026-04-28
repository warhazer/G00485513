import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { forkJoin, catchError, of } from 'rxjs'; // Import forkJoin to handle multiple API calls
import { ToastController } from '@ionic/angular';
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
  IonList,
  IonThumbnail,
  IonSpinner,
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
    IonList,
    IonThumbnail,
    IonSpinner,
  ],
})
export class DetailsPage implements OnInit {
  person: PersonDetails | null = null;
  movies: PersonMovieCredit[] = [];
  loading: boolean = true;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private tmdb: Tmdb,
    private toastController: ToastController,
  ) {
    addIcons({ heart, home });
  }

  ngOnInit() {
    const personId = Number(this.route.snapshot.paramMap.get('id'));

    // Use forkJoin to make both API calls in parallel
    forkJoin({
      person: this.tmdb.getPersonDetails(personId),
      credits: this.tmdb.getPersonMovieCredits(personId),
    })
    .pipe(
      catchError(() => {
        this.showToast('Failed to load person details. Please try again later.');
        return of({ person: null, credits: { cast: [], crew: [] } });
      })
    )
    .subscribe(({ person, credits }) => {
      this.person = person;
      // Combine cast and crew credits into a single list of movies
      this.movies = [...credits.cast, ...credits.crew];
      this.loading = false;
    });
  }

  openMovie(movie: PersonMovieCredit) {
    // Navigate to the movie details page
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

  async showToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      color: 'danger',
      position: 'bottom',
    });
    await toast.present();
  }
}
