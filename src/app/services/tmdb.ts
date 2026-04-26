import { Injectable } from '@angular/core';
import { HttpClient, HttpParams} from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Movie, MovieCredits, PersonDetails, PersonMovieCredit } from '../models/movie.model';

interface TmdbListResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

interface PersonMovieCreditsResponse {
  id: number;
  cast: PersonMovieCredit[];
  crew: PersonMovieCredit[];
}

@Injectable({
  providedIn: 'root',
})
export class Tmdb {
  private apiKey = environment.tmdbApiKey;
  private baseUrl = environment.tmdbBaseUrl;


  constructor(private http: HttpClient) {}

  // Fetch trending movies for the week
  getTrendingMovies(): Observable<TmdbListResponse<Movie>> {
    const url = `${this.baseUrl}/trending/movie/week`;
    const params = new HttpParams().set('api_key', this.apiKey);
    return this.http.get<TmdbListResponse<Movie>>(url, { params });
  }

  // Used by user to search for movies by title
  searchMovies(query: string): Observable<TmdbListResponse<Movie>> {
    const url = `${this.baseUrl}/search/movie`;
    const params = new HttpParams()
      .set('api_key', this.apiKey)
      .set('query', query);
    return this.http.get<TmdbListResponse<Movie>>(url, { params });
  }

  // Fetch movie credits (cast and crew) by movie ID
  getMovieCredits(movieId: number): Observable<MovieCredits> {
    const url = `${this.baseUrl}/movie/${movieId}/credits`;
    const params = new HttpParams().set('api_key', this.apiKey);
    return this.http.get<MovieCredits>(url, { params });
  }

  // Fetch person details by person ID
  getPersonDetails(personId: number): Observable<PersonDetails> {
    const url = `${this.baseUrl}/person/${personId}`;
    const params = new HttpParams().set('api_key', this.apiKey);
    return this.http.get<PersonDetails>(url, { params });
  }

  // Fetch movie credits for a person by person ID
  getPersonMovieCredits(personId: number): Observable<PersonMovieCreditsResponse> {
    const url = `${this.baseUrl}/person/${personId}/movie_credits`;
    const params = new HttpParams().set('api_key', this.apiKey);
    return this.http.get<PersonMovieCreditsResponse>(url, { params });
  }


  // Helper method to construct full image URL from poster path
  getImageUrl(path: string | null): string {
    return path ? `${environment.tmdbImageBaseUrl}${path}` : 'assets/placeholder.png';
  }

}
