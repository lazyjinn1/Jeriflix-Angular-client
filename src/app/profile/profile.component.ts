import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { fetchJeriflixAPI } from '../fetch-api-data.service';
import { MovieSplashComponent } from '../movie-splash/movie-splash.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  loading: boolean = true;

  user: any;
  movies: any[] = [];
  favoriteMovies: any[] = [];
  movie: any;

  constructor(
    public fetchAPI: fetchJeriflixAPI,
    public dialogRef: MatDialog,
    private router: Router
  ) {
    this.user = {}
  }

  ngOnInit(): void {
    const userString = localStorage.getItem('user');
    if (userString) {
      this.user = JSON.parse(userString);

      this.getMovies();
      
      this.loading = false;
    }
  }

  openMovieList(): void {
    this.router.navigate(['movies']);
  }

  logOut(): void {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    this.router.navigate(['welcome']);
  }

  getMovies(): void {
    this.loading = true;
    this.fetchAPI.getAllMoviesService().subscribe((response: any) => {
      this.movies = response;
      this.loading = false;
      this.getFavoriteMovies();
    });
  };

  getFavoriteMovies(): void {
    this.favoriteMovies = this.movies.filter(movies => this.user.FavoriteMovies.includes(movies._id));
    console.log(this.favoriteMovies);
  }

  openMovieDialog(movieName: string): void {
    this.fetchAPI.getOneMovieService(movieName).subscribe((response: any) => {
      console.log(response);
      this.movie = response;
      this.dialogRef.open(MovieSplashComponent, {
        data: this.movie,
        width: '700px'
      });
    })
  }

}
