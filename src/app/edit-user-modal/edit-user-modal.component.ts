import { Component, Input } from '@angular/core';
import { fetchJeriflixAPI } from '../fetch-api-data.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ProfilePictureComponent } from '../profile-picture/profile-picture.component';
import { ChangePasswordComponent } from '../change-password/change-password.component';

@Component({
  selector: 'app-edit-user-modal',
  templateUrl: './edit-user-modal.component.html',
  styleUrl: './edit-user-modal.component.scss'
})
export class EditUserModalComponent {
  @Input() newData: any = { Username: '', Email: '', Birthday: '', Bio: '' };

  loading: boolean = false;
  user: any;

  constructor(
    public fetchAPI: fetchJeriflixAPI,
    public dialogRef: MatDialogRef<ProfilePictureComponent>,
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    private router: Router,
  ) { }

  /**
   * Initializes the component by calling the getProfile method.
   */
  ngOnInit(): void {
    this.getProfile();
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
   * Opens a dialog to allow the user to change their profile picture.
   */
  openProfilePictureMenu(): void {
    this.dialog.open(ProfilePictureComponent, {
      width: '400px',
      data: { user: this.user }
    });
  }

  /**
   * Opens a dialog to allow the user to change their password.
   */
  openPasswordMenu(): void {
    this.dialog.open(ChangePasswordComponent, {
      width: '400px',
      data: { user: this.user }
    })
  }

  /**
   * Updates the user data in localStorage with the provided new data.
   * @param newData The new user data to be stored in localStorage.
   */
  updateUser(newData: any): void {
    localStorage.setItem('user', newData);
  }

  /**
   * Updates the username of the current user.
   */
  updateUserName(): void {
    this.loading = true;
    if (this.newData.Username) {
      this.fetchAPI.editUsername(this.newData.Username).subscribe((response) => {
        this.loading = false;
        this.snackBar.open('Username has been updated!', 'OK', { duration: 2000 });
        this.updateUser(response);
        this.getProfile();
      }, (error) => {
        console.error(error);
        this.snackBar.open(error, 'OK', { duration: 2000 });
      });
    } else {
      this.snackBar.open('Fields must be entered')
      this.loading = false;
      return;
    }
  }

  /**
   * Updates the email of the current user.
   */
  updateEmail(): void {
    this.loading = true;
    if (this.newData.Email) {
      this.fetchAPI.editEmail(this.user.Username, this.newData.Email).subscribe((response) => {
        this.loading = false;
        this.snackBar.open('Email has been updated!', 'OK', { duration: 2000 });
        this.updateUser(response);
        this.getProfile();
      }, (error) => {
        console.error(error);
        this.snackBar.open(error, 'OK', { duration: 2000 });
      });
    } else {
      this.snackBar.open('Fields must be entered')
      this.loading = false;
      return;
    }
  }

  /**
   * Updates the birthday of the current user.
   */
  updateBirthday(): void {
    this.loading = true;
    if (this.newData.Birthday) {
      this.fetchAPI.editBirthday(this.user.Username, this.newData.Birthday).subscribe((response) => {
        this.loading = false;
        this.snackBar.open('Birthday has been updated!', 'OK', { duration: 2000 });
        this.updateUser(response);
        this.getProfile();
      }, (error) => {
        console.error(error);
        this.snackBar.open(error, 'OK', { duration: 2000 });
      });
    } else {
      this.snackBar.open('Fields must be entered')
      this.loading = false;
      return;
    }
  }

  /**
   * Updates the biography of the current user.
   */
  updateBio(): void {
    this.loading = true;
    if (this.newData.Bio) {
      this.fetchAPI.editBio(this.user.Username, this.newData.Bio).subscribe((response) => {
        this.loading = false;
        this.snackBar.open('Bio has been updated!', 'OK', { duration: 2000 });
        this.updateUser(response);
        this.getProfile();
      }, (error) => {
        console.error(error);
        this.snackBar.open(error, 'OK', { duration: 2000 });
      });
    } else {
      this.snackBar.open('Fields must be entered')
      this.loading = false;
      return;
    }
  }

  /**
   * Deletes the current user's account.
   */
  deleteUser(): void {
    if (confirm('Are you sure you want to delete your account?')) {
      this.loading = true;
      this.fetchAPI.deleteUserService().subscribe(() => {
        this.dialogRef.close();
        this.logOut();
        this.loading = false;
      }, (error: any) => {
        console.error('Error deleting user:', error);
        this.loading = false;
      });
    }
  }

  logOut(): void {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    this.router.navigate(['welcome']);
  }
}
