
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
  IonLabel,
  IonInput,
  IonButton,
  IonIcon,
  IonSpinner
} from '@ionic/angular';

import { addIcons } from 'ionicons';
import {
  personOutline,
  lockClosedOutline,
  logInOutline,
  restaurantOutline
} from 'ionicons/icons';

import { Auth } from '../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.html',
  styleUrl: './login.css',
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
    IonLabel,
    IonInput,
    IonButton,
    IonIcon,
    IonSpinner
  ]
})
export class Login {

  email = '';
  password = '';
  loading = false;

  constructor(
    private auth: Auth,
    private router: Router
  ) {
    addIcons({
      personOutline,
      lockClosedOutline,
      logInOutline,
      restaurantOutline
    });
  }

  login(): void {
    if (!this.email.trim() || !this.password.trim()) {
      alert('Please enter your email and password.');
      return;
    }

    this.loading = true;

    this.auth.login({
      email: this.email.trim(),
      password: this.password
    }).subscribe({
      next: (response) => {
        this.loading = false;

        if (response.success) {
          this.router.navigate(['/home']);
        } else {
          alert(response.message || 'Invalid login credentials.');
        }
      },
      error: (error) => {
        this.loading = false;
        console.error('Login error:', error);
        alert('Login failed. Please check your API connection.');
      }
    });
  }

  goToRegister(): void {
    this.router.navigate(['/register']);
  }
}
