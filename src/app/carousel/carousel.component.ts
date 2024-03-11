import { Component, OnInit, ViewChild } from '@angular/core';
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
  selected: boolean = false;
  movies: any[] = [];
  favoriteMovies: string[] = [];
  isFavMovie: boolean[] = [];
  movie: any;
  user: any;
  filteredMovies: any[] = [];
  firstFilteredMovie: any;
  specificMovieTitle: any;

  constructor(
    public fetchAPI: fetchJeriflixAPI,
    public dialogRef: MatDialog,
    public snackBar: MatSnackBar,
    public router: Router,
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
    this.loading = true;
    const userString = localStorage.getItem('user');
    if (userString) {
      this.user = JSON.parse(userString);
      this.getMovies();
      this.getFavoriteMovies();
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

  getFavoriteMovies(): void {
    this.fetchAPI.viewUserService(this.user.Username).subscribe((response: any) => {
      let fixedResponse = (JSON.parse(response));
      if (fixedResponse && fixedResponse.FavoriteMovies) {
        this.favoriteMovies = fixedResponse.FavoriteMovies;
        this.loading = false;
      } else {
        this.favoriteMovies = [];
        this.loading = false;
      }
    },
      (error: any) => {
        console.error('Error fetching user data:', error);
        this.favoriteMovies = [];
        this.loading = false;
      }
    );
  }

  openMovieDialog(movieName: string, index: number, movieID: string): void {
    this.fetchAPI.getOneMovieService(movieName).subscribe((response: any) => {
      this.movie = response;
      this.sideNavStates = this.sideNavStates.map((state, i) => i === index);
      this.sideDrawersOpened = true;
      this.isFav(movieID);
      if (this.isFav(movieID) === true) {
        this.isFavMovie[index] = true;
      } else if (this.isFav(movieID) === false) {
        this.isFavMovie[index] = false;
      }
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

  toggleFavorite(movieID: string, i: number, movieTitle: string) {
    if (this.isFav(movieID) === true) {
      this.isFavMovie[i] = false;
      this.removeFavoriteMovie(movieID, movieTitle);
    } else if (this.isFav(movieID) === false) {
      this.isFavMovie[i] = true;
      this.addToFavoriteMovies(movieID, movieTitle)
    }
  }

  isFav(movieID: string) {
    if (this.user.FavoriteMovies.includes(movieID)) {
      return true;
    } else {
      return false;
    }
  }

  addToFavoriteMovies(movieID: string, movieTitle: string): void {
    this.fetchAPI.addMovieToFavoritesService(movieID).subscribe((response: any) => {
      this.favoriteMovies.push(movieID);
      this.user.FavoriteMovies.push(movieID);
      this.snackBar.open(movieTitle + ' has been added to favorites', 'OK', { duration: 2000 });
    }, (error: any) => {
      this.snackBar.open('Failed to add movie to favorites: ' + error, 'OK', { duration: 2000 });
    });
  }

  removeFavoriteMovie(movieID: string, movieTitle: string): void {
    this.fetchAPI.deleteMovieFromFavoritesService(movieID).subscribe((response: any) => {
      const index = this.user.FavoriteMovies.indexOf(movieID);
      this.favoriteMovies.splice(index, 1);
      this.user.FavoriteMovies.splice(index, 1);
      this.snackBar.open(movieTitle + ' has been removed from favorites', 'OK', { duration: 2000 })
    }, (error: any) => {
      this.snackBar.open('Failed to remove movie from favorites ' + error, 'OK', { duration: 2000 });
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
          movies.Title.toLowerCase() === (this.typedText.toLowerCase()));
        const firstFilteredMovie = this.filteredMovies[0];
        this.owlCarousel.to(firstFilteredMovie._id);
        if (this.specificMovieTitle.length > 0) {
          this.owlCarousel.to(this.specificMovieTitle[0]._id);
        } else {
          console.error("No exact match found for the typed movie title.");
        }
      } else {
      }
    } else {
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