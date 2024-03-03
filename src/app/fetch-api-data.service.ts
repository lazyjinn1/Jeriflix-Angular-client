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
    return this.http.post(apiUrl + 'users', userData, { responseType: 'text' }).pipe(
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
  public getAllMoviesService(): Observable<any> {
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
  public getOneMovieService(title: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + 'movies/' + title, {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token,
      }),
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  //favorite movies
  public getFavoriteMoviesService(): Observable<any> {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + 'users/' + user.Username, {
      headers: new HttpHeaders(
        {
          Authorization: 'Bearer ' + token,
        })
    }).pipe(
      map(this.extractResponseData),
      map((data) => data.FavoriteMovies),
      catchError(this.handleError)
    );
  }

  //add to favorites
  public addMovieToFavoritesService(movieID: string): Observable<any> {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = localStorage.getItem('token');

    user.FavoriteMovies.push(movieID);

    localStorage.setItem('user', JSON.stringify(user));

    return this.http.put(apiUrl + 'users/' + user.Username + '/favorites/' + movieID, 
    {},
    {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`
      }),
      responseType: "text",
      withCredentials: true,
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  //delete a favorite movie
  public deleteMovieFromFavoritesService(movieID: string): Observable<any> {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = localStorage.getItem('token');

    const index = user.FavoriteMovies.indexOf(movieID);
    if (index > -1) {
      user.FavoriteMovies.splice(index, 1);
    }

    localStorage.setItem('user', JSON.stringify(user));

    return this.http.delete(apiUrl + 'users/' + user.Username + '/favorites/' + movieID, {
      headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      responseType: "text",
      withCredentials: true,
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  // //edit a user
  // public editUserService(userName: string, userData: any): Observable<any> {
  //   return this.http.put(apiUrl + 'users/' + userName, userData).pipe(
  //     catchError(this.handleError)
  //   );
  // }

  // Non-typed response extraction
  private extractResponseData(response: any): any {
    const body = response;
    return body || {};
  }

  //errors
  private handleError(error: HttpErrorResponse): any {
    if (error.status === 201) {
      console.log('Resource created successfully', error.message);
      return throwError(() => 'Resource created successfully but interpreted as an error. Status code: ' + error.status);
    } else if (error.error instanceof ErrorEvent) {
      console.error('Some error occurred:', error.error.message);
    } else {
      console.error(
        `Error Status code ${error.status}, ` +
        `Error body is: ${JSON.stringify(error.error)}`);
    }
    return throwError(() => 'Something went wrong. Error code: ' + error.status);
  }
}