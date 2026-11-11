
import { Component, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonButton,
  IonIcon,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonItem,
  IonLabel,
  IonAvatar,
  IonBadge
} from '@ionic/angular';

import { addIcons } from 'ionicons';
import {
  personCircleOutline,
  mailOutline,
  shieldCheckmarkOutline,
  logOutOutline,
  arrowBackOutline
} from 'ionicons/icons';

import { Auth } from '../services/auth';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.html',
  styleUrl: './profile.css',
  standalone: true,
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButtons,
    IonButton,
    IonIcon,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonItem,
    IonLabel,
    IonAvatar,
    IonBadge
  ]
})
export class Profile {

  currentUser = this.auth.currentUser;

  isAdmin = computed(() => this.auth.isAdmin());

  constructor(
    private auth: Auth,
    private router: Router
  ) {
    addIcons({
      personCircleOutline,
      mailOutline,
      shieldCheckmarkOutline,
      logOutOutline,
      arrowBackOutline
    });
  }

  goBack(): void {
    this.router.navigate(['/home']);
  }

  logout(): void {
    this.auth.logout().subscribe({
      next: () => this.router.navigate(['/login']),
      error: error => {
        console.error('Logout error:', error);
        alert('Unable to contact the server. Please try again.');
      }
    });
  }
}
