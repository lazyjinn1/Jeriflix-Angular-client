import { Component, Input } from '@angular/core';
import { fetchJeriflixAPI } from '../fetch-api-data.service';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-movie-splash',
  templateUrl: './movie-splash.component.html',
  styleUrl: './movie-splash.component.scss'
})
export class MovieSplashComponent {

  @Input() movie: any;
  constructor(
    public fetchMovies: fetchJeriflixAPI,
    public dialogRef: MatDialog,
  ) { }
  
  
}
