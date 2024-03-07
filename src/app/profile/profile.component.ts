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
    this.loadProfileData();
  }

  loadProfileData(): void {
    this.getProfile();
    this.getMovies();
    this.loading = false;
  }

  getProfile(): void {
    const userString = localStorage.getItem('user');
    console.log(userString);
    if (userString) {
      this.user = JSON.parse(userString);
    }
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
  }

  openMovieList(): void {
    this.router.navigate(['movies']);
  }

  updateUser(): void {
    this.dialogRef.open(EditUserModalComponent, {
      width: '400px',
      height: '600px'
    }).afterClosed().subscribe(() => {
      this.loadProfileData();
    });
  }

  logOut(): void {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    this.router.navigate(['welcome']);
  }

  onUpdate(): void {
    this.loadProfileData();
  }
}
