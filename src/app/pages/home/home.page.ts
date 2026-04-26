import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
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

import {addIcons} from 'ionicons';
import {heart} from 'ionicons/icons';

import { Tmdb } from '../../services/tmdb';
import { Movie } from '../../models/movie.model';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [
    CommonModule,
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButton,
    IonIcon,
    IonItem,
    IonLabel,
    IonInput,
    IonList,
    IonThumbnail,
    IonButtons,
  ],
})
// Home page component that displays trending movies and allows searching for movies
export class HomePage implements OnInit {
  searchQuery: string = '';
  movies: Movie[] = [];
  heading: string = 'Today\'s Trending Movies';

  constructor(
    private tmdb: Tmdb,
    private router: Router
  ) {
    addIcons({heart});
  }

  ngOnInit(): void {
    this.loadTrending();
  }

  // Load trending movies from TMDb API
  loadTrending(): void {
    this.heading = 'Today\'s Trending Movies';
    this.tmdb.getTrendingMovies().subscribe(response => {
      this.movies = response.results;
    });
  }

  // Search for movies based on the search query
  onSearch(): void {
    const query = this.searchQuery.trim();
    if (!query) {
      this.loadTrending();
      return;
    }
    this.heading = `${query} Movies`;
    this.tmdb.searchMovies(query).subscribe(response => {
      this.movies = response.results;
    });
  }

  // Navigate to the movie details page
  openMovie(movie: Movie): void {
    this.router.navigate(['/movie-details', movie.id], { state: { movie } });
  }

  // Navigate to the favourites page
  goFavourites(): void {
    this.router.navigate(['/favourites']);
  }

  // Helper method to get the full poster URL
  getPosterUrl(path: string | null): string {
    return this.tmdb.getImageUrl(path);
  }

}
