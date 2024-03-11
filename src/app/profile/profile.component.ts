import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { fetchJeriflixAPI } from '../fetch-api-data.service';
import { MatDialog } from '@angular/material/dialog';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { EditUserModalComponent } from '../edit-user-modal/edit-user-modal.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  loading: boolean = true;

  user: any = { Username: '', Password: '', Email: '', Birthday: '', Bio: '', ProfilePicture: '' };

  movies: any[] = [];
  favoriteMovies: any[] = [];
  movie: any;

  constructor(
    public fetchAPI: fetchJeriflixAPI,
    public dialogRef: MatDialog,
    private router: Router
  ) { }

  customOptions: OwlOptions = {
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    slideTransition: 'linear',
    navSpeed: 200,
    margin: 0,
    center: true,
    slideBy: 1,
    mergeFit: true,
    autoHeight: false,
    autoWidth: false,
    animateOut: true,
    animateIn: true,
    items: 3,
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

  /**
     * Initializes the component by loading profile data.
     */
  ngOnInit(): void {
    this.loadProfileData();
  }

  /**
   * Loads profile data including user profile and movies.
   */
  loadProfileData(): void {
    this.getProfile();
    this.getMovies();
    this.loading = false;
  }

  /**
   * Retrieves user profile data from localStorage and assigns it to the user property.
   */
  getProfile(): void {
    const userString = localStorage.getItem('user');
    if (userString) {
      this.user = JSON.parse(userString);
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
      this.getFavoriteMovies();
    });
  };

  /**
   * Retrieves favorite movies for the current user and updates the favoriteMovies property.
   */
  getFavoriteMovies(): void {
    this.favoriteMovies = this.movies.filter(movies => this.user.FavoriteMovies.includes(movies._id));
  }

  /**
   * Redirects the user to the movies page.
   */
  openMovieList(): void {
    this.router.navigate(['movies']);
  }

  /**
   * Opens a dialog to allow the user to edit their profile.
   * After the dialog is closed, reloads profile data.
   */
  updateUser(): void {
    this.dialogRef.open(EditUserModalComponent, {
      width: '400px',
      height: '600px'
    }).afterClosed().subscribe(() => {
      this.loadProfileData();
    });
  }

  /**
   * Logs the user out by removing user data from localStorage and redirecting to the welcome page.
   */
    logOut(): void {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    this.router.navigate(['welcome']);
  }

  /**
   * Reloads profile data.
   */
  onUpdate(): void {
    this.loadProfileData();
  }
}
