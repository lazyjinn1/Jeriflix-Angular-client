
import { AppComponent } from './app.component';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';

import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatFabButton } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatGridListModule } from '@angular/material/grid-list'

import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { WelcomePageComponent } from './welcome-page/welcome-page.component';
import { UserLoginFormComponent } from './user-login-form/user-login-form.component';
import { UserRegistrationFormComponent } from './user-registration-form/user-registration-form.component';
import { CarouselComponent } from './carousel/carousel.component';
import { ProfileComponent } from './profile/profile.component';
import { TypedTextComponent } from './typed-text/typed-text.component';
import { EditUserModalComponent } from './edit-user-modal/edit-user-modal.component';
import { ProfilePictureComponent } from './profile-picture/profile-picture.component';
import { ChangePasswordComponent } from './change-password/change-password.component';

const appRoutes: Routes = [
  { path: 'welcome', component: WelcomePageComponent },
  { path: 'movies', component: CarouselComponent },
  { path: 'profile', component: ProfileComponent },
  { path: '', redirectTo: 'welcome', pathMatch: 'prefix' },
];

@NgModule({
  declarations: [
    AppComponent,
    UserRegistrationFormComponent,
    UserLoginFormComponent,
    WelcomePageComponent,
    CarouselComponent,
    ProfileComponent,
    TypedTextComponent,
    EditUserModalComponent,
    ProfilePictureComponent,
    ChangePasswordComponent,
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatDialogModule,
    MatSnackBarModule,
    MatIconModule,
    MatDialogModule,
    MatFabButton,
    MatMenuModule,
    MatListModule,
    MatGridListModule,
    BrowserAnimationsModule,
    MatSidenavModule,
    CarouselModule,
    MatProgressSpinnerModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
