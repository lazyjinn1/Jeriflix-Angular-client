import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { fetchJeriflixAPI } from '../fetch-api-data.service';
import { MatDialog } from '@angular/material/dialog';
import { OwlOptions } from 'ngx-owl-carousel-o';

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

  events: string[] = [];
  sideNavStates: boolean[] = [];
  sideDrawersOpened: boolean = false;

  constructor(
    public fetchAPI: fetchJeriflixAPI,
    public dialogRef: MatDialog,
    private router: Router
  ) {
    this.user = {}
  }

  customOptions: OwlOptions = {
    dots: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    slideTransition: 'linear',
    navSpeed: 200,
    navText: ['Previous', 'Next'] ,
    margin: 0,
    center: true,
    slideBy: 1,
    mergeFit: true,
    autoHeight: false,
    autoWidth: false,
    animateOut: true,
    animateIn: true,
    items: 2,
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
    },
    nav: true
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

  openMovieDialog(movieName: string, index: number): void {
    this.fetchAPI.getOneMovieService(movieName).subscribe((response: any) => {
      this.movie = response;
      console.log(response);
      this.sideNavStates = this.sideNavStates.map((state, i) => i === index);
      this.sideDrawersOpened = true;
    })
  }

  onSlideChanged(): void {
    this.sideNavStates.fill(false);
  }

  updateUser(): void {

  }

  deleteUser(): void {

  }
}
