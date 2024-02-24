import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, catchError } from 'rxjs';
import { map } from 'rxjs/operators';


const apiUrl = 'https://jeriflix.onrender.com/'

@Injectable({
  providedIn: 'root'
})
export class fetchJeriflixAPI {

  constructor(private http: HttpClient) {

  }

  //register
  public userRegistrationService(userDetails: any): Observable<any> {
    return this.http.post(apiUrl + 'users', userDetails).pipe(
      catchError(this.handleError)
    );
  }

  //login
  public userLoginService(userDetails: any): Observable<any> {
    return this.http.post(apiUrl + 'login', userDetails).pipe(
      catchError(this.handleError)
    );
  }

  //movies
  getAllMovies(): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + 'movies', {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token,
      }),
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }



  //one movie
  getOneMovieService(movieId: string): Observable<any> {
    return this.http.get(apiUrl + 'movies/' + movieId).pipe(
      catchError(this.handleError)
    );
  }

  //directors
  getDirectorService(directorId: string): Observable<any> {
    return this.http.get(apiUrl + 'directors/' + directorId).pipe(
      catchError(this.handleError)
    );
  }

  //genres
  getGenreService(genreId: string): Observable<any> {
    return this.http.get(apiUrl + 'genres/' + genreId).pipe(
      catchError(this.handleError)
    );
  }

  //users
  getUserService(userId: string): Observable<any> {
    return this.http.get(apiUrl + 'users/' + userId).pipe(
      catchError(this.handleError)
    );
  }

  //favorite movies
  getFavouriteMoviesService(userId: string): Observable<any> {
    return this.http.get(apiUrl + 'users/' + userId + '/favorites').pipe(
      catchError(this.handleError)
    );
  }

  //add to favorites
  addMovieToFavouritesService(userId: string, movieId: string): Observable<any> {
    const body = { movieId: movieId };
    return this.http.post(apiUrl + 'users/' + userId + '/favorites', body).pipe(
      catchError(this.handleError)
    );
  }

  //edit a user
  editUserService(userId: string, userDetails: any): Observable<any> {
    return this.http.put(apiUrl + 'users/' + userId, userDetails).pipe(
      catchError(this.handleError)
    );
  }

  //delete a user
  deleteUserService(userId: string): Observable<any> {
    return this.http.delete(apiUrl + 'users/' + userId).pipe(
      catchError(this.handleError)
    );
  }

  //delete a favorite movie
  deleteMovieFromFavouritesService(userId: string, movieId: string): Observable<any> {
    return this.http.delete(apiUrl + 'users/' + userId + '/favorites/' + movieId).pipe(
      catchError(this.handleError)
    );
  }

  // Non-typed response extraction
  private extractResponseData(res: any): any {
    const body = res;
    return body || {};
  }

  //errors.
  private handleError(error: any) {
    console.error('API Error:', error);
    return throwError(error);
  }

}
