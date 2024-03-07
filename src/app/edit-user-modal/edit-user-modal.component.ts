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
  user: any = localStorage.getItem('user');
  token: any = localStorage.getItem('token');
  loading: boolean = false;


  @Input() newData: any = { Username: this.user.Username, Email: this.user.Email, Birthday: this.user.Birthday, Bio: this.user.Bio };

  constructor(
    public fetchAPI: fetchJeriflixAPI,
    public dialogRef: MatDialogRef<ProfilePictureComponent>,
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    private router: Router,
  ) { }

  ngOnInit(): void { }

  openProfilePictureMenu(): void {
    this.dialog.open(ProfilePictureComponent, {
      width: '400px',
      data: { user: this.user }
    });
  }

  openPasswordMenu(): void {
    this.dialog.open(ChangePasswordComponent, {
      width: '400px',
      data: { user: this.user }
    })
  }

  updateUserName(): void {
    this.loading = true;
    if (this.newData.Username) {
      this.fetchAPI.editUserService(this.newData).subscribe((result) => {
        localStorage.setItem('user', JSON.stringify(result));
        this.loading = false;
        this.snackBar.open('Username has been updated!', 'OK', { duration: 2000 });
      }, (error) => {
        console.error(error);
        this.snackBar.open(error, 'OK', { duration: 2000 });
      });
    } else {
      this.snackBar.open('Fields must be entered')
    }
  }
  updateEmail(): void {
    this.loading = true;
    if (this.newData.Email) {
      this.fetchAPI.editUserService(this.newData).subscribe((result) => {
        localStorage.setItem('user', JSON.stringify(result));
        this.loading = false;
        this.snackBar.open('Email has been updated!', 'OK', { duration: 2000 });
      }, (error) => {
        console.error(error);
        this.snackBar.open(error, 'OK', { duration: 2000 });
      });
    } else {
      this.snackBar.open('Fields must be entered')
    }
  }
  updateBirthday(): void {
    this.loading = true;
    if (this.newData.Birthday) {
      this.fetchAPI.editUserService(this.newData).subscribe((result) => {
        localStorage.setItem('user', JSON.stringify(result));
        this.loading = false;
        this.snackBar.open('Birthday has been updated!', 'OK', { duration: 2000 });
      }, (error) => {
        console.error(error);
        this.snackBar.open(error, 'OK', { duration: 2000 });
      });
    } else {
      this.snackBar.open('Fields must be entered')
    }
  }
  updateBio(): void {
    this.loading = true;
    if (this.newData.Bio) {
      this.fetchAPI.editUserService(this.newData).subscribe((result) => {
        localStorage.setItem('user', JSON.stringify(result));
        this.loading = false;
        this.snackBar.open('Bio has been updated!', 'OK', { duration: 2000 });
      }, (error) => {
        console.error(error);
        this.snackBar.open(error, 'OK', { duration: 2000 });
      });
    } else {
      this.snackBar.open('Fields must be entered')
    }
  }

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
