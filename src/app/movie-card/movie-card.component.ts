import { Component, OnInit } from '@angular/core';
import { fetchJeriflixAPI } from '../fetch-api-data.service'

@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrl: './movie-card.component.scss'
})
export class MovieCardComponent {

  movies: any[] = [];
  constructor(public fetchMovies: fetchJeriflixAPI) {}

  ngOnInit(): void{
    this.getMovies();
  }

  getMovies(): void{
    this.fetchMovies.getAllMoviesService().subscribe((response: any) => {
      this.movies = response;
      console.log(this.movies);
      return this.movies;
    })
  }
}
