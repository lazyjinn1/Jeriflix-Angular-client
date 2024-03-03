import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
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

export class CarouselComponent implements OnInit {
  @ViewChild('owlCarousel', { static: false }) owlCarousel: any;
  typedText: string = '';
  loading: boolean = true;
  sideNavStates: boolean[] = [];
  sideDrawersOpened: boolean = false;
  movies: any[] = [];
  favoriteMovies: string[] = [];
  movie: any;
  newFavMovie: any;
  user = JSON.parse(localStorage.getItem('user') || '');
  userName: any;
  filteredMovies: any[] = [];
  firstFilteredMovie: any;
  specificMovieTitle: any;


  constructor(
    public fetchAPI: fetchJeriflixAPI,
    public dialogRef: MatDialog,
    public snackBar: MatSnackBar,
    public router: Router,
    private elementRef: ElementRef
  ) {
  }

  customOptions: OwlOptions = {
    loop: true,
    dots: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    slideTransition: 'linear',
    navSpeed: 200,
    navText: ['Previous', 'Next'],
    margin: 0,
    center: true,
    slideBy: 1,
    autoHeight: false,
    autoWidth: false,
    animateOut: true,
    animateIn: true,
    skip_validateItems: true,

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
      this.filterMovies();
      this.sideNavStates = new Array(this.movies.length).fill(false);
    });
  };

  openMovieDialog(movieName: string, index: number): void {
    this.fetchAPI.getOneMovieService(movieName).subscribe((response: any) => {
      this.movie = response;
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

  onSlideChanged(): void {
    this.sideNavStates.fill(false);
  }

  getFavorites(Username: string): void {
    this.favoriteMovies = this.user.FavoriteMovies;
    this.fetchAPI.getFavoriteMoviesService().subscribe((response: any) => {
      this.favoriteMovies = response;
    })
  }

  isFavoriteMovie(movieID: string): boolean {
    return this.user.FavoriteMovies.indexOf(movieID) >= 0;
  }

  addToFavoriteMovies(movieID: string): void {
    this.fetchAPI.addMovieToFavoritesService(movieID).subscribe((response: any) => {
      this.newFavMovie = response;
      this.favoriteMovies.push(this.newFavMovie);
      this.snackBar.open(movieID + ' has been added to Favorite List', 'OK', { duration: 2000 });
    },
      (error: any) => {
        console.error('Failed to add movie to favorites:', error);
        this.snackBar.open('Failed to add movie to favorites', 'OK', { duration: 2000 });
      }
    );
  }

  public removeFavoriteMovie(movieID: string): void {
    this.fetchAPI.deleteMovieFromFavoritesService(movieID).subscribe(() => {
      this.snackBar.open('removed from favorites', 'OK', {
        duration: 2000
      })
    });
  }

  onTypedTextChanged(typedText: string): void {
    this.typedText = typedText;
    this.directToMovie(typedText);
  }

  directToMovie(typedText: string): void {
    if (!!this.typedText && this.typedText.length >= 2) {
      this.filteredMovies = this.movies.filter(movies =>
        movies.Title.toLowerCase().includes(this.typedText.toLowerCase()));
      if (this.filteredMovies.length > 0) {
        this.specificMovieTitle = this.filteredMovies.filter(movies =>
          movies.Title.toLowerCase()===(this.typedText.toLowerCase()));
          const firstFilteredMovie = this.filteredMovies[0];
          this.owlCarousel.to(firstFilteredMovie._id);
          if (this.specificMovieTitle.length > 0) {
            this.owlCarousel.to(this.specificMovieTitle[0]._id);          
          } else {
            // Handle error: No exact match found
            console.error("No exact match found for the typed movie title.");
            // You can add any specific error handling code here, such as displaying a message to the user.
          }
        } else {
          // Handle error: No movies found for the typed text
          console.error("No movies found for the typed text.");
          // You can add any specific error handling code here, such as displaying a message to the user.
        }
      } else {
        // Handle error: Typed text is too short or empty
        console.error("Typed text is too short or empty.");
        // You can add any specific error handling code here, such as displaying a message to the user.
      }
    }

  filterMovies(): void {
    if (!!this.typedText) {
      this.filteredMovies = this.movies.filter(movie =>
        movie.Title.toLowerCase().includes(this.typedText.toLowerCase())
      );
    } else {
      this.filteredMovies = this.movies.slice();
    }
  }
}