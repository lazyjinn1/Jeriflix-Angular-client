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

  /**
   * Initializes component by setting loading to true and retrieving user data from localStorage.
   * If user data exists, retrieves movies and favorite movies.
   */
  ngOnInit(): void {
    this.loading = true;
    const userString = localStorage.getItem('user');
    if (userString) {
      this.user = JSON.parse(userString);
      this.getMovies();
      this.getFavoriteMovies();
    }
  }

  /**
   * Retrieves movies data from the API and updates the component accordingly.
   */
  getMovies(): void {
    this.loading = true;
    this.fetchAPI.getAllMoviesService().subscribe((response: any) => {
      this.movies = response;
      this.loading = false;
      this.filterMovies();
      this.sideNavStates = new Array(this.movies.length).fill(false);
    });
  };

  /**
   * Retrieves favorite movies data for the current user from the API and updates the component accordingly.
   */
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
      /**
       * Handles errors that occur during the retrieval of favorite movies data.
       * Logs the error and updates the component accordingly.
       * @param error The error that occurred during the API call.
       */
      (error: any) => {
        console.error('Error fetching user data:', error);
        this.favoriteMovies = [];
        this.loading = false;
      }
    );
  }

  /**
   * Opens a dialog displaying details of the selected movie.
   * Retrieves movie details from the API and updates the component accordingly.
   * @param movieName The name of the movie to retrieve.
   * @param index The index of the movie in the list.
   * @param movieID The ID of the movie to retrieve.
   */
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

  /**
   * Redirects the user to the profile page.
   */
  goToUserProfile(): void {
    this.router.navigate(['profile']);
  }

  /**
   * Logs the user out by clearing user data from localStorage and redirects to the welcome page.
   */
  logOut(): void {
    localStorage.setItem('user', '');
    localStorage.setItem('token', '');
    this.router.navigate(['welcome']);
  }

  /**
   * Resets the sideNavStates array to false.
   * Called when the slide changes to close any open side drawers.
   */
  onSlideChanged(): void {
    this.sideNavStates.fill(false);
  }

  /**
   * Toggles the favorite status of a movie.
   * If the movie is already a favorite, removes it from favorites; otherwise, adds it to favorites.
   * @param movieID The ID of the movie to toggle favorite status.
   * @param i The index of the movie in the list.
   * @param movieTitle The title of the movie.
   */
  toggleFavorite(movieID: string, i: number, movieTitle: string) {
    if (this.isFav(movieID) === true) {
      this.isFavMovie[i] = false;
      this.removeFavoriteMovie(movieID, movieTitle);
    } else if (this.isFav(movieID) === false) {
      this.isFavMovie[i] = true;
      this.addToFavoriteMovies(movieID, movieTitle)
    }
  }

  /**
   * Checks if the movie with the specified ID is among the user's favorite movies.
   * @param movieID The ID of the movie to check.
   * @returns True if the movie is in the user's favorites, otherwise false.
   */
  isFav(movieID: string) {
    if (this.user.FavoriteMovies.includes(movieID)) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * Adds a movie to the user's favorite movies.
   * @param movieID The ID of the movie to add to favorites.
   * @param movieTitle The title of the movie being added.
   */
  addToFavoriteMovies(movieID: string, movieTitle: string): void {
    this.fetchAPI.addMovieToFavoritesService(movieID).subscribe((response: any) => {
      this.favoriteMovies.push(movieID);
      this.user.FavoriteMovies.push(movieID);
      this.snackBar.open(movieTitle + ' has been added to favorites', 'OK', { duration: 2000 });
    }, (error: any) => {
      this.snackBar.open('Failed to add movie to favorites: ' + error, 'OK', { duration: 2000 });
    });
  }

  /**
   * Removes a movie from the user's favorite movies.
   * @param movieID The ID of the movie to remove from favorites.
   * @param movieTitle The title of the movie being removed.
   */
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

  /**
   * Updates the typedText property and directs to the movie page based on the typed text.
   * @param typedText The text typed by the user.
   */
  onTypedTextChanged(typedText: string): void {
    this.typedText = typedText;
    this.directToMovie(typedText);
  }

  /**
   * Directs to the movie page based on the typed text.
   * @param typedText The text typed by the user.
   */
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
      }
    }
  }

  /**
   * Filters the list of movies based on the typed text.
   * Updates the filteredMovies property accordingly.
   */
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