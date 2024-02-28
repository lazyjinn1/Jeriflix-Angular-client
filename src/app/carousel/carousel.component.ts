import { Component } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { fetchJeriflixAPI } from '../fetch-api-data.service'
import { MatDialog } from '@angular/material/dialog';
// import { GenreComponent } from '../genre/genre.component';
// import { DirectorComponent } from '../director/director.component';
import { ProfileComponent } from '../profile/profile.component';
import { MovieSplashComponent } from '../movie-splash/movie-splash.component';
import { Router } from '@angular/router';


@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrl: './carousel.component.scss'
})

export class CarouselComponent {

  movies: any[] = [];
  movie: any;
  user: any;

  constructor(
    public fetchAPI: fetchJeriflixAPI,
    public dialogRef: MatDialog,
    private router: Router
  ) { 
    this.user = {};
  }

  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: true,
    navSpeed: 500,
    navText: ['Previous', 'Next'],
    margin: 15,
    center: true,
    slideBy: 3,
    animateOut: true,
    animateIn: true,
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 2
      },
      740: {
        items: 3
      },
      940: {
        items: 4
      },
      1180: {
        items: 5
      },
    },
    nav: true
  }

  ngOnInit(): void {
    this.getMovies();

  }

  getMovies(): void {
    this.fetchAPI.getAllMoviesService().subscribe((response: any) => {
      this.movies = response;
      console.log(this.movies);
      return this.movies;
    });
  };

  getOneMovie(movieName: string): void {
    this.fetchAPI.getOneMovieService(movieName).subscribe((response: any) => {
      console.log(response);
      this.movie = response;
      this.dialogRef.open(MovieSplashComponent, {
        width: '600px',
        data: { movie: this.movie }
      });
    })
  }

  goToUserProfile(userName: string): void {
    this.user = localStorage.getItem('user');
    console.log(this.user);
    this.fetchAPI.getUserService(userName).subscribe((response: any) => {
      console.log(response);
      this.user = response;
      this.router.navigate(['profile']);
    })
  }

  // getGenre(movieId: string): void {
  //   this.fetchAPI.getGenreService(movieId).subscribe((response: any) => {
  //     this.dialogRef.open(GenreComponent, {
  //       width: '280px'
  //     });
  //     this.movies = response;
  //     console.log(this.movies)
  //     return this.movies;
  //   })
  // }

  // getDirector(movieId: string): void {
  //   this.fetchAPI.getDirectorService(movieId).subscribe((response: any) => {
  //     this.dialogRef.open(DirectorComponent, {
  //       width: '280px'
  //     });
  //     this.movies = response;
  //     console.log(this.movies)
  //     return this.movies;
  //   })
  // }
}