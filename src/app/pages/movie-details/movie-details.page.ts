import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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
import { home, heart } from 'ionicons/icons';

import { Tmdb } from '../../services/tmdb';
import { Favourites } from '../../services/favourites';
import { Movie, CastMember, CrewMember } from '../../models/movie.model';
import { ActivatedRoute, Router } from '@angular/router';
  
@Component({
  selector: 'app-movie-details',
  templateUrl: './movie-details.page.html',
  styleUrls: ['./movie-details.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonButton,
    IonIcon,
    IonItem,
    IonLabel,
    IonList,
    IonThumbnail,
    CommonModule,
    FormsModule,
    IonSpinner,
  ],
})

export class MovieDetailsPage implements OnInit {
  movie: Movie | null = null;
  cast: CastMember[] = [];
  crew: CrewMember[] = [];
  loading: boolean = true;


  constructor(
    private tmdb: Tmdb,
    private favourites: Favourites,
    private router: Router,
    private route: ActivatedRoute
  ) {
    addIcons({ home, heart });
  }

  ngOnInit() {

    // Read the movie from router state
    this.movie = history.state.movie ?? null;

    // Read the movie id form URL and fetch details if not available in state
    const movieId = Number(this.route.snapshot.paramMap.get('id'));

    // Fetch cast and crew details
    this.tmdb.getMovieCredits(movieId).subscribe(response => {
      this.cast = response.cast;
      this.crew = response.crew;
      this.loading = false;
    });
  }

 
  toggleFavourite() { // Add or remove the current movie from favourites
    if (!this.movie) return;
    if (this.favourites.isFavourite(this.movie.id)) {
      this.favourites.remove(this.movie.id);
    } else {
      this.favourites.add(this.movie);
    }
  }

  
  get isFavourite(): boolean { // Check if the current movie is in favourites
    return this.movie ? this.favourites.isFavourite(this.movie.id) : false;
  }

  openPersonDetails(personId: number) { // Navigate to person details page
    this.router.navigate(['/details', personId]);
  }

  goHome() { // Navigate back to home page
    this.router.navigate(['/home']);
  }

  goToFavourites() { // Navigate to favourites page
    this.router.navigate(['/favourites']);
  }

  getProfileUrl(path: string | null): string { // Helper method to get full poster URL
    return this.tmdb.getImageUrl(path);
  }

  openPerson(personId: number) { // Navigate to person details page
    this.router.navigate(['/details', personId]);
  }



}
