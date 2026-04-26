import { Injectable } from '@angular/core';
import { Movie } from '../models/movie.model';

@Injectable({
  providedIn: 'root',
})
export class Favourites {
  private readonly STORAGE_KEY = 'favouriteMovies';

  constructor() {}


  
  getAll(): Movie[] {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (!stored) {
      return [];
    }
    try {
      return JSON.parse(stored) as Movie[];
    } catch {
      // If parsing fails, clear the invalid data and return an empty list
      localStorage.removeItem(this.STORAGE_KEY);
      return [];
    }
  }

  // Add a movie to favourites, ensuring no duplicates
  add(movie: Movie): void {
    const favourites = this.getAll();
    if (favourites.some(m => m.id === movie.id)) {
      return;
    }
    favourites.push(movie);
    this.save(favourites);
  }


  // Remove a movie from favourites by ID
  remove(movieId: number): void {
    const favourites = this.getAll();
    const updated = favourites.filter(m => m.id !== movieId);
    this.save(updated);
  }


  // Check if a movie is in favourites by ID
  isFavourite(movieId: number): boolean {
    const favourites = this.getAll();
    return favourites.some(m => m.id === movieId);
  }

  // persist the favourites list to localStorage
  private save(favourites: Movie[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(favourites));
  }



}
