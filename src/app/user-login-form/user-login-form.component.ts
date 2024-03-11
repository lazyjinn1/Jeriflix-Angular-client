// src/app/user-registration-form/user-registration-form.component.ts
import { Component, OnInit, Input } from '@angular/core';

// You'll use this import to close the dialog on success
import { MatDialogRef } from '@angular/material/dialog';

// This import brings in the API calls we created in 6.2
import { fetchJeriflixAPI } from '../fetch-api-data.service';

// This import is used to display notifications back to the user
import { MatSnackBar } from '@angular/material/snack-bar';

import { Router } from '@angular/router';

@Component({
  selector: 'app-user-login-form',
  templateUrl: './user-login-form.component.html',
  styleUrl: './user-login-form.component.scss'
})
export class UserLoginFormComponent implements OnInit{

  @Input() userData = { Username: '', Password: '' };

  loading: boolean = false;

  constructor(
    public fetchApiData: fetchJeriflixAPI,
    public dialogRef: MatDialogRef<UserLoginFormComponent>,
    public snackBar: MatSnackBar,
    private router: Router
  ) {}

  /**
   * initializes nothing
   */
  ngOnInit(): void {
  }

   /**
   * Logs in the user by calling the userLoginService from the fetchApiData service.
   * If login is successful, stores user data and token in localStorage and navigates to the movies page.
   * If login fails, displays an error message.
   */
  logInUser(): void {
    this.loading = true;
    this.fetchApiData.userLoginService(this.userData).subscribe((response) => {
      this.dialogRef.close();
      
      localStorage.setItem('user', JSON.stringify(response.user));
      localStorage.setItem('token', response.token);
      this.loading = false;
      this.snackBar.open('Login successful', 'OK', {
        duration: 2000
      });
      this.router.navigate(['movies']);
    }, (response) => {
      console.error(response);
      this.snackBar.open('Error logging in. Please verify your information.', 'OK', {
        duration: 2000
      })
      this.loading = false;
      return;
    });
  }
}
