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
    { name: 'Avatar 1', url: 'https://jeriflix.netlify.app/Avatar1.0b9816be.png' },
    { name: 'Avatar 2', url: 'https://jeriflix.netlify.app/Avatar2.3620682d.png' },
    { name: 'Avatar 3', url: 'https://jeriflix.netlify.app/Avatar3.179ab953.png' },
    { name: 'Avatar 4', url: 'https://jeriflix.netlify.app/Avatar4.aebfdb69.png' },
    { name: 'Avatar 5', url: 'https://jeriflix.netlify.app/Avatar5.f08403c7.png' },
    { name: 'Avatar 6', url: 'https://jeriflix.netlify.app/Avatar6.0c838743.png' },
    { name: 'Avatar 7', url: 'https://jeriflix.netlify.app/Avatar7.d0555ee1.png' },
    { name: 'Avatar 8', url: 'https://jeriflix.netlify.app/Avatar8.426d9a2d.png' },
    { name: 'Avatar 9', url: 'https://jeriflix.netlify.app/Avatar9.5e531ae0.png' }
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

   /**
   * Updates the user data in localStorage with the provided new data.
   * @param newData The new user data to be stored in localStorage.
   */
  updateUser(newData: any): void {
    localStorage.setItem('user', newData);
  }

  /**
   * Handles the selection of a profile picture.
   * Updates the selectedAvatar property and sends a request to the API to update the user's profile picture.
   * @param avatar The selected avatar.
   */
  selectAvatar(avatar: ProfilePicture): void {
    this.loading = true;
    this.selectedAvatar = avatar;
    this.fetchAPI.editProfilePicture(this.user.Username, avatar.url).subscribe((response) => {
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
