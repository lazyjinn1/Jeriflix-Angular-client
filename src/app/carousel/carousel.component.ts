import { Component, OnInit } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { fetchJeriflixAPI } from '../fetch-api-data.service'
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';



@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrl: './carousel.component.scss'
})

export class CarouselComponent implements OnInit{

  typedText: string = '';

  loading: boolean = true;

  events: string[] = [];
  sideNavStates: boolean[] = [];
  sideDrawersOpened: boolean = false;

  movies: any[] = [];
  favoriteMovies: string[] = [];
  movie: any;
  newFavMovie: any;
  user: any;
  userName: any;
  
  constructor(
    public fetchAPI: fetchJeriflixAPI,
    public dialogRef: MatDialog,
    public snackBar: MatSnackBar,
    public router: Router
  ) {
    this.user = {};
  }

  customOptions: OwlOptions = {
    loop: true,
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
    autoHeight: false,
    autoWidth: false,
    animateOut: true,
    animateIn: true,
    responsive: {
      940: {
        items: 4
      },
      1180: {
        items: 5
      },
    },
    nav: true,
  }

  ngOnInit(): void {
    const userString = localStorage.getItem('user');
    if (userString) {
      this.user = JSON.parse(userString);

      this.getMovies();
      
      this.loading = false;
    }
  }

  getMovies(): void {
    this.loading = true;
    this.fetchAPI.getAllMoviesService().subscribe((response: any) => {
      
      this.movies = response;
      this.loading = false;
      this.sideNavStates = new Array(this.movies.length).fill(false);
    });
  };

  openMovieDialog(movieName: string, index: number): void {
    this.fetchAPI.getOneMovieService(movieName).subscribe((response: any) => {
      this.movie = response;
      console.log(response);
      this.sideNavStates = this.sideNavStates.map((state, i) => i === index);
      this.sideDrawersOpened = true;
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

  closeSideNav(): void {
    this.sideNavStates = new Array(this.movies.length).fill(false);
  }

  onSlideChanged(): void {
    this.sideNavStates.fill(false);
  }

  addToFavoriteMovies(userName: string, movieID: string) : void {
    this.user = localStorage.getItem('user');
    this.userName = this.user.Username;
  if (!userName) {
    this.snackBar.open('Username is missing.', 'OK', { duration: 2000 });
    return;
  }

    this.fetchAPI.addMovieToFavouritesService(userName, movieID).subscribe((response: any) => {
      this.newFavMovie = response;
      this.favoriteMovies.push(this.newFavMovie);
      this.fetchAPI.getFavouriteMoviesService(userName).subscribe((response: any) => {
        this.favoriteMovies = response;
        this.snackBar.open(movieID + ' has been added to Favorite List', 'OK', { duration: 2000 });
      })
    })
  }

  onTypedTextChanged(typedText: string): void {
    this.typedText = typedText;
    this.directToMovie();
  }

  directToMovie():void{}

}