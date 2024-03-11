import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { fetchJeriflixAPI } from '../fetch-api-data.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.scss'
})
export class ChangePasswordComponent {
  user: any;
  loading: boolean;
  newPassword: string;
  passwordConfirmed: string;

  constructor(
    public fetchAPI: fetchJeriflixAPI,
    public dialogRef: MatDialogRef<ChangePasswordComponent>,
    public snackBar: MatSnackBar,
  ) {
    const userString = localStorage.getItem('user');
    this.user = userString && JSON.parse(userString);
    this.loading = false;
    this.newPassword = '';
    this.passwordConfirmed = '';
  }

  /**
   * Initializes the component by calling the getProfile method.
   */
  ngOnInit(): void {
    this.getProfile();
  }

  /**
   * Updates the user data in localStorage with the provided new data.
   * @param newData The new user data to be stored in localStorage.
   */
  updateUser(newData: any): void {
    localStorage.setItem('user', newData);
  }

  /**
   * Retrieves user profile data from localStorage and assigns it to the user property.
   */
  getProfile(): void {
    const userString = localStorage.getItem('user');
    if (userString) {
      this.user = JSON.parse(userString);
    }
  }

 /**
   * Validates and updates the user's password.
   * Compares the new password with the confirmed password and invokes the updatePassword method if they match.
   */
  confirmAndUpdatePassword(): void {
    if (this.newPassword !== this.passwordConfirmed) {
      this.snackBar.open('New password and confirmed password do not match', 'OK', { duration: 2000 });
      return;
    }
    this.updatePassword(this.newPassword);
  }

  /**
   * Updates the user's password.
   * @param newPassword The new password to set for the user.
  */
  updatePassword(newPassword: any): void {
    this.loading = true;
    this.fetchAPI.editPassword(this.user.Username, newPassword).subscribe((response) => {
      localStorage.setItem('user', response);
      this.dialogRef.close();
      this.loading = false;
      this.updateUser(response);
      this.snackBar.open('New password has been set', 'OK', { duration: 2000 });
    }, (error) => {
      console.error(error);
      this.loading = false;
      this.snackBar.open(error, 'OK', { duration: 2000 });
    });
  }
}
