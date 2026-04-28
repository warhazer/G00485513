import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { catchError, of } from 'rxjs';
import { ToastController } from '@ionic/angular/standalone';
import {
  IonHeader,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonSelect,
  IonSelectOption,
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
import { Movie, Genre } from '../../models/movie.model';

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
    IonSelect,
    IonSelectOption,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
  ],
})
// Home page component that displays trending movies and allows searching for movies
export class HomePage implements OnInit {
  searchQuery: string = '';
  movies: Movie[] = [];
  heading: string = "Today's Trending Movies";
  loading: boolean = true;
  hasSearched: boolean = false;
  genres: Genre[] = [];
  selectedGenreId: number | null = null;

  currentPage: number = 1;
  totalPages: number = 1;
  currentMode: 'trending' | 'search' | 'genre' = 'trending'; // Track current mode for infinite scroll
  disableInfiniteScroll: boolean = false; // Flag to disable infinite scroll when no more pages are available

  constructor(
    private tmdb: Tmdb,
    private router: Router,
    private toastController: ToastController,
  ) {
    addIcons({ heart });
  }

  ngOnInit(): void {
    this.loadTrending();
    this.loadGenres();
  }

  // Load trending movies from TMDb API
  loadTrending(): void {
    this.loading = true;
    this.selectedGenreId = null;
    this.currentPage = 1;
    this.totalPages = 1;
    this.disableInfiniteScroll = false;
    this.currentMode = 'trending';
    this.heading = "Today's Trending Movies";

    this.tmdb
      .getTrendingMovies(1)
      .pipe(
        catchError(() => {
          this.showError(
            'Failed to load trending movies. Please try again later.',
          );
          return of({ results: [], page: 1, total_pages: 1} as any);
        }),
      )
      .subscribe((response) => {
        this.movies = response.results;
        this.totalPages = response.total_pages;
        this.loading = false;
      });
  }

  // Search for movies based on the search query
  onSearch(): void {
    const query = this.searchQuery.trim();
    if (!query) {
      this.hasSearched = false;
      this.selectedGenreId = null; // Clear genre filter when performing a search with an empty query
      this.loadTrending();
      return;
    }
    this.loading = true;
    this.hasSearched = true;
    this.selectedGenreId = null;
    this.currentPage = 1;
    this.totalPages = 1;
    this.disableInfiniteScroll = false;
    this.currentMode = 'search';
    this.heading = `${query} Movies`;
    this.tmdb
      .searchMovies(query, 1)
      .pipe(
        catchError(() => {
          this.showError('Failed to search movies. Please try again');
          return of({ results: [], page: 1, total_pages: 1 } as any);
        }),
      )
      .subscribe((response) => {
        this.movies = response.results;
        this.totalPages = response.total_pages;
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

  // Load movie genres from TMDb API
  loadGenres(): void {
    this.tmdb
      .getGenres()
      .pipe(
        catchError(() => {
          this.showError('Failed to load genres. Please try again later.'); // Show error toast if genres fail to load
          return of({ genres: [] } as any); // Return empty genres array on error to prevent app from breaking
        }),
      )
      .subscribe({
        next: (response) => {
          this.genres = response.genres;
        },
      });
  }

  // Handle genre selection to filter movies by genre
  onGenreChange(event: any) {
    const genreId = event.detail.value;
    if (!genreId) {
      this.selectedGenreId = null;
      this.searchQuery = '';
      this.hasSearched = false;
      this.loadTrending();
      return;
    }

    this.selectedGenreId = genreId;
    this.searchQuery = '';
    this.hasSearched = false;
    this.currentPage = 1;
    this.totalPages = 1;
    this.disableInfiniteScroll = false;
    this.currentMode = 'genre';

    const genre = this.genres.find((g) => g.id === genreId);
    this.heading = genre ? `${genre.name} Movies` : 'Movies';
    this.loading = true;

    this.tmdb.getMoviesByGenre(genreId, 1)
      .pipe(
        catchError(() => {
          this.showError(
            'Failed to load movies for selected genre. Please try again later.',
          );
          return of({ results: [], page: 1, total_pages: 1 } as any);
        }),
      )
      .subscribe((response) => {
        this.movies = response.results;
        this.totalPages = response.total_pages;
        this.loading = false;
      });
  }


  // Handle infinite scroll to load more movies when the user scrolls to the bottom
  loadMore(event: any) {
    if (this.currentPage >= this.totalPages) {
      event.target.disabled = true; // Disable infinite scroll if we've reached the last page
      return;
    }

    this.currentPage++;
    let loadObservable;

    if (this.currentMode === 'trending') {// Load more trending movies if we're in trending mode
      loadObservable = this.tmdb.getTrendingMovies(this.currentPage);
    } else if (this.currentMode === 'search' && this.searchQuery.trim()) {// Load more search results if we're in search mode and have a valid search query
      loadObservable = this.tmdb.searchMovies(this.searchQuery.trim(), this.currentPage);
    } else if (this.currentMode === 'genre' && this.selectedGenreId) {// Load more movies for the selected genre if we're in genre mode and have a valid genre selected
      loadObservable = this.tmdb.getMoviesByGenre(this.selectedGenreId, this.currentPage);
    } else {// If we don't have a valid mode or parameters for loading more movies, just complete the infinite scroll without making an API call
      event.target.complete();
      return;
    }

    loadObservable.pipe(
      catchError(() => {
        this.showError('Failed to load more movies. Please try again later.');
        return of({ results: [], page: this.currentPage, total_pages: this.totalPages } as any);
      }),
    ).subscribe((response) => {
      this.movies = [...this.movies, ...response.results];
      this.totalPages = response.total_pages;
      event.target.complete();
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
