import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { fetchJeriflixAPI } from '../fetch-api-data.service';

interface ProfilePicture {
  name: string;
  url: string;
}

@Component({
  selector: 'profile-picture',
  templateUrl: './profile-picture.component.html',
  styleUrls: ['./profile-picture.component.scss']
})
export class ProfilePictureComponent {
  avatars: ProfilePicture[] = [
    { name: 'Avatar 1', url: '../../../assets/ProfilePictures/Avatar1.png' },
    { name: 'Avatar 2', url: '../../../assets/ProfilePictures/Avatar2.png' },
    { name: 'Avatar 3', url: '../../../assets/ProfilePictures/Avatar3.png' },
    { name: 'Avatar 4', url: '../../../assets/ProfilePictures/Avatar4.png' },
    { name: 'Avatar 5', url: '../../../assets/ProfilePictures/Avatar5.png' },
    { name: 'Avatar 6', url: '../../../assets/ProfilePictures/Avatar6.png' },
    { name: 'Avatar 7', url: '../../../assets/ProfilePictures/Avatar7.png' },
    { name: 'Avatar 8', url: '../../../assets/ProfilePictures/Avatar8.png' },
    { name: 'Avatar 9', url: '../../../assets/ProfilePictures/Avatar9.png' },
    { name: 'Avatar 10', url: '../../../assets/ProfilePictures/Avatar10.png' }
  ];

  selectedAvatar: ProfilePicture | null = null;
  loading: boolean = false;
  user: any;

  constructor(
    public fetchAPI: fetchJeriflixAPI,
    public dialogRef: MatDialogRef<ProfilePictureComponent>,
    public snackBar: MatSnackBar,
  ) {
    const userString = localStorage.getItem('user');
    this.user = userString && JSON.parse(userString);
    this.loading = false;
  }
  updateUser(newData: any): void {
    localStorage.setItem('user', newData);
  }
  selectAvatar(avatar: ProfilePicture): void {
    this.loading = true;
    this.selectedAvatar = avatar;
    console.log(avatar);
    this.fetchAPI.editProfilePicture(this.user.Username, avatar).subscribe((response) => {
      localStorage.setItem('user', response);
      this.dialogRef.close();
      this.loading = false;
      this.updateUser(response);
      this.snackBar.open('New Avatar has been set', 'OK', { duration: 2000 });
    }, (error) => {
      console.error(error);
      this.loading = false;
      this.snackBar.open(error, 'OK', { duration: 2000 });
    });
  }
}
