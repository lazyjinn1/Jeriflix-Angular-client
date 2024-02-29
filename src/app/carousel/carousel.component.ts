import { Component } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { fetchJeriflixAPI } from '../fetch-api-data.service'
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MovieSplashComponent } from '../movie-splash/movie-splash.component';
// import { GenreComponent } from '../genre/genre.component';
// import { DirectorComponent } from '../director/director.component';



@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrl: './carousel.component.scss'
})

export class CarouselComponent {

  loading: boolean = true;

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
    dots: true,
    mouseDrag: false,
    slideTransition: 'linear',
    navSpeed: 300,
    navText: ['Previous', 'Next'] ,
    margin: 15,
    center: true,
    slideBy: 1,
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
    this.loading = true;
    this.fetchAPI.getAllMoviesService().subscribe((response: any) => {
      this.movies = response;
      this.loading = false;
      return this.movies;
    });
  };

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

  goToUserProfile(): void {
    this.router.navigate(['profile']);
  }

  logOut(): void {
    localStorage.setItem('user', '');
    localStorage.setItem('token', '');
    this.router.navigate(['welcome']);
  }

}