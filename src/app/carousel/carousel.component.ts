import { Component } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { fetchJeriflixAPI } from '../fetch-api-data.service'
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';



@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrl: './carousel.component.scss'
})

export class CarouselComponent {

  loading: boolean = true;

  events: string[] = [];
  sideNavStates: boolean[] = [];
  sideDrawersOpened: boolean = false;

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
      1360: {
        items: 6
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
}