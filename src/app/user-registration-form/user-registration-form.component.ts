// src/app/user-registration-form/user-registration-form.component.ts
import { Component, OnInit, Input } from '@angular/core';

// You'll use this import to close the dialog on success
import { MatDialogRef } from '@angular/material/dialog';

// This import brings in the API calls we created in 6.2
import { fetchJeriflixAPI } from '../fetch-api-data.service';

// This import is used to display notifications back to the user
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-user-registration-form',
  templateUrl: './user-registration-form.component.html',
  styleUrls: ['./user-registration-form.component.scss']
})
export class UserRegistrationFormComponent implements OnInit {

  @Input() userData = { Username: '', Password: '', Email: '', Birthday: '' };

  loading: boolean = false;

  constructor(
    public fetchApiData: fetchJeriflixAPI,
    public dialogRef: MatDialogRef<UserRegistrationFormComponent>,
    public snackBar: MatSnackBar) { }

  ngOnInit(): void {
  }
  /**
    * Registers a new user by calling the userRegistrationService from the fetchApiData service.
    * If registration is successful, closes the modal and displays a success message.
    * If registration fails, displays an error message.
    */
  // This is the function responsible for sending the form inputs to the backend
  registerUser(): void {
    this.loading = true;
    this.fetchApiData.userRegistrationService(this.userData).subscribe((response) => {
      this.dialogRef.close(); // This will close the modal on success!
      this.loading = false;
      this.snackBar.open('User has successfully been registered!', 'OK', { duration: 2000 });
    }, (error) => {
      console.error(error);
      this.snackBar.open(error, 'OK', { duration: 2000 });
    });
  }
}