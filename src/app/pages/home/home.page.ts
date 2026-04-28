import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { catchError, of } from 'rxjs';
import { ToastController } from '@ionic/angular/standalone';
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
  IonRefresher,
  IonRefresherContent,
  IonThumbnail,
  IonSpinner,
} from '@ionic/angular/standalone';

import { addIcons } from 'ionicons';
import { heart } from 'ionicons/icons';

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
    IonRefresher,
    IonRefresherContent,
    IonSpinner,
  ],
})
// Home page component that displays trending movies and allows searching for movies
export class HomePage implements OnInit {
  searchQuery: string = '';
  movies: Movie[] = [];
  heading: string = "Today's Trending Movies";
  loading: boolean = true;
  hasSearched: boolean = false;

  constructor(
    private tmdb: Tmdb,
    private router: Router,
    private toastController: ToastController,
  ) {
    addIcons({ heart });
  }

  ngOnInit(): void {
    this.loadTrending();
  }

  // Load trending movies from TMDb API
  loadTrending(): void {
    this.loading = true;
    this.heading = "Today's Trending Movies";

    this.tmdb
      .getTrendingMovies()
      .pipe(
        catchError(() => {
          this.showError(
            'Failed to load trending movies. Please try again later.',
          );
          return of({ results: [] } as any);
        }),
      )
      .subscribe((response) => {
        this.movies = response.results;
        this.loading = false;
      });
  }

  // Search for movies based on the search query
  onSearch(): void {
    const query = this.searchQuery.trim();
    if (!query) {
      this.hasSearched = false;
      this.loadTrending();
      return;
    }
    this.loading = true;
    this.hasSearched = true;
    this.heading = `${query} Movies`;
    this.tmdb.searchMovies(query).pipe(
      catchError(() => {
        this.showError('Failed to search movies. Please try again');
        return of({ results: [] } as any);
      })
    ).subscribe((response) => {
      this.movies = response.results;
      this.loading = false;
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

  // Handle pull-to-refresh action to reload trending movies
  handleRefresh(event: any): void {
    this.tmdb.getTrendingMovies().subscribe({
      next: (response) => {
        this.movies = response.results;
        event.target.complete();
      },
      error: () => {
        this.showError('Failed to refresh. Please try again later.');
        event.target.complete();
      },
    });
  }

  // Show an error toast message
  async showError(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      color: 'danger',
      position: 'bottom',
    });
    await toast.present();
  }
}
