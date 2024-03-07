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

  confirmAndUpdatePassword(): void {
    if (this.newPassword !== this.passwordConfirmed) {
      this.snackBar.open('New password and confirmed password do not match', 'OK', { duration: 2000 });
      return;
    }
    this.updatePassword(this.newPassword);
  }

  updatePassword(newPassword: any): void {
    this.loading = true;
    this.fetchAPI.editPassword(newPassword).subscribe((response) => {
      localStorage.setItem('user', response);
      this.dialogRef.close();
      this.loading = false;
      this.snackBar.open('New password has been set', 'OK', { duration: 2000 });
    }, (error) => {
      console.error(error);
      this.loading = false;
      this.snackBar.open(error, 'OK', { duration: 2000 });
    });
  }
}
