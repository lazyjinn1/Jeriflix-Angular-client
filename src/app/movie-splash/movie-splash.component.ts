import { Component, Input, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { fetchJeriflixAPI } from '../fetch-api-data.service';
// import { GenreComponent } from '../genre/genre.component';
// import { DirectorComponent } from '../director/director.component';

@Component({
  selector: 'app-movie-splash',
  templateUrl: './movie-splash.component.html',
  styleUrl: './movie-splash.component.scss'
})
export class MovieSplashComponent implements OnInit{

  movies: any[] = [];
  movie: any;

  constructor(
    public fetchAPI: fetchJeriflixAPI,
    public dialogRef: MatDialogRef<MovieSplashComponent>
  ) { }

  ngOnInit(): void { }

  // getGenre(movieId: string): void {
  //   this.fetchAPI.getGenreService(movieId).subscribe((response: any) => {
  //     this.dialogRef.open(GenreComponent, {
  //       width: '280px'
  //     });
  //     this.movies = response;
  //     console.log(this.movies)
  //     return this.movies;
  //   })
  // }

  // getDirector(movieId: string): void {
  //   this.fetchAPI.getDirectorService(movieId).subscribe((response: any) => {
  //     this.dialogRef.open(DirectorComponent, {
  //       width: '280px'
  //     });
  //     this.movies = response;
  //     console.log(this.movies)
  //     return this.movies;
  //   })
  // }
}
