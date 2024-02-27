import { Component } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { fetchJeriflixAPI } from '../fetch-api-data.service'


@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrl: './carousel.component.scss'
})

export class CarouselComponent {

  movies: any[] = [];
  constructor(public fetchMovies: fetchJeriflixAPI) {}
  
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
      }
    },
    nav: true
  }

  ngOnInit(): void{
    this.getMovies();
  }
  
  getMovies(): void{
    this.fetchMovies.getAllMoviesService().subscribe((response: any) => {
      this.movies = response;
      console.log(this.movies);
      return this.movies;
    });
  };
}