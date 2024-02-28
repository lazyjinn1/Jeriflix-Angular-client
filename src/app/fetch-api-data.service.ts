import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, catchError } from 'rxjs';
import { map } from 'rxjs/operators';


const apiUrl = 'https://jeriflix.onrender.com/';

@Injectable({
  providedIn: 'root'
})

export class fetchJeriflixAPI {

  constructor(private http: HttpClient) {

  }

  //register
  public userRegistrationService(userData: any): Observable<any> {
    return this.http.post(apiUrl + 'users', userData, {responseType: 'text'}).pipe(
      catchError(this.handleError)
    );
  }

  //login
  public userLoginService(userData: any): Observable<any> {
    return this.http.post(apiUrl + 'login', userData).pipe(
      catchError(this.handleError)
    );
  }

  //movies
  getAllMoviesService(): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + 'movies', {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token,
      }),
      withCredentials: true
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  //one movie
  getOneMovieService(title: string): Observable<any> {
    const token = localStorage.getItem('token');
    console.log(apiUrl+'movies/' + title);
    return this.http.get(apiUrl + 'movies/' + title, {
      
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token,
      }),
    }).pipe(
      map(this.extractResponseData),
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
  getGenreService(genreName: string): Observable<any> {
    return this.http.get(apiUrl + 'genres/' + genreName).pipe(
      catchError(this.handleError)
    );
  }

  //users
  getUserService(userName: string): Observable<any> {
    return this.http.get(apiUrl + 'users/' + userName).pipe(
      catchError(this.handleError)
    );
  }

  //favorite movies
  getFavouriteMoviesService(userName: string): Observable<any> {
    return this.http.get(apiUrl + 'users/' + userName + '/favorites').pipe(
      catchError(this.handleError)
    );
  }

  //add to favorites
  addMovieToFavouritesService(userName: string, movieName: string): Observable<any> {
    const body = { movieName: movieName };
    return this.http.post(apiUrl + 'users/' + userName + '/favorites', body).pipe(
      catchError(this.handleError)
    );
  }

  //edit a user
  editUserService(userName: string, userData: any): Observable<any> {
    return this.http.put(apiUrl + 'users/' + userName, userData).pipe(
      catchError(this.handleError)
    );
  }

  //delete a user
  deleteUserService(userName: string): Observable<any> {
    return this.http.delete(apiUrl + 'users/' + userName).pipe(
      catchError(this.handleError)
    );
  }

  //delete a favorite movie
  deleteMovieFromFavouritesService(userName: string, movieName: string): Observable<any> {
    return this.http.delete(apiUrl + 'users/' + userName + '/favorites/' + movieName).pipe(
      catchError(this.handleError)
    );
  }

  // Non-typed response extraction
  private extractResponseData(res: any): any {
    const body = res;
    return body || {};
  }

  //errors
  private handleError(error: HttpErrorResponse): any {
    if (error.status === 201) {
      console.log('Resource created successfully', error.message);
      return throwError(()=>'Resource created successfully but interpreted as an error. Status code: ' + error.status);
    }else if(error.error instanceof ErrorEvent) {
      console.error('Some error occurred:', error.error.message);
    } else {
      console.error(
        `Error Status code ${error.status}, ` +
        `Error body is: ${JSON.stringify(error.error)}`);
    }
    return throwError(()=>'Something went wrong. Error code: ' + error.status);
  }

}