import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home.page').then((m) => m.HomePage),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'movie-details/:id',
    loadComponent: async () => (await import('./pages/movie-details/movie-details.page')).MovieDetailsPage
  },
  {
    path: 'details/:id',
    loadComponent: async () => (await import('./pages/details/details.page')).DetailsPage
  },
  {
    path: 'favourites',
    loadComponent: async () => (await import('./pages/favourites/favourites.page')).FavouritesPage
  },
];
