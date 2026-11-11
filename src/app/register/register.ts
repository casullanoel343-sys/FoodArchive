
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonItem,
  IonInput,
  IonButton,
  IonIcon,
  IonSpinner
} from '@ionic/angular';

import { addIcons } from 'ionicons';
import {
  personOutline,
  mailOutline,
  lockClosedOutline,
  personAddOutline,
  restaurantOutline
} from 'ionicons/icons';

import { Auth } from '../services/auth';

@Component({
  selector: 'app-register',
  standalone: true,
  templateUrl: './register.html',
  styleUrl: './register.css',
  imports: [
    CommonModule,
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonItem,
    IonInput,
    IonButton,
    IonIcon,
    IonSpinner
  ]
})
export class Register {

  username = '';
  email = '';
  password = '';
  confirmPassword = '';

  loading = false;

  constructor(
    private auth: Auth,
    private router: Router
  ) {
    addIcons({
      personOutline,
      mailOutline,
      lockClosedOutline,
      personAddOutline,
      restaurantOutline
    });
  }

  register(): void {

    if (
      !this.username.trim() ||
      !this.email.trim() ||
      !this.password ||
      !this.confirmPassword
    ) {
      alert('Please complete all fields.');
      return;
    }

    if (this.password.length < 8) {
      alert('Password must be at least 8 characters.');
      return;
    }

    if (this.password !== this.confirmPassword) {
      alert('Passwords do not match.');
      return;
    }

    this.loading = true;

    this.auth.register({
      username: this.username.trim(),
      email: this.email.trim(),
      password: this.password
    }).subscribe({

      next: (response) => {
        this.loading = false;

        if (response.success) {
          alert('Registration successful! You can now log in.');
          this.router.navigate(['/login']);
        } else {
          alert(response.message || 'Registration failed.');
        }
      },

      error: (error) => {
        this.loading = false;
        console.error('Registration error:', error);
        alert('Unable to register. Please check your API connection.');
      }

    });
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}
