
import { Component, OnInit, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import {
  IonMenu,
  IonMenuToggle,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonMenuButton,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonIcon,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonButton
} from '@ionic/angular';

import { addIcons } from 'ionicons';
import {
  menuOutline,
  restaurantOutline,
  personCircleOutline,
  shieldCheckmarkOutline,
  logOutOutline
} from 'ionicons/icons';

import { RecipeService, Recipe } from '../services/recipe';
import { Auth } from '../services/auth';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrl: './home.page.scss',
  standalone: true,
  imports: [
    CommonModule,
    IonMenu,
    IonMenuToggle,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonMenuButton,
    IonContent,
    IonList,
    IonItem,
    IonLabel,
    IonIcon,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonButton
  ]
})
export class HomePage implements OnInit {

  categories = [
    'All Recipes',
    'Chicken',
    'Beef',
    'Pasta',
    'Dessert'
  ];

  selectedCategory = signal('All Recipes');

  recipes = this.recipeService.recipes;

  filteredRecipes = computed(() => {
    const selected = this.selectedCategory();

    if (selected === 'All Recipes') {
      return this.recipes();
    }

    return this.recipes().filter(
      recipe => recipe.category.toLowerCase() === selected.toLowerCase()
    );
  });

  constructor(
    private recipeService: RecipeService,
    private auth: Auth,
    private router: Router
  ) {
    addIcons({
      menuOutline,
      restaurantOutline,
      personCircleOutline,
      shieldCheckmarkOutline,
      logOutOutline
    });
  }

  ngOnInit(): void {
    this.loadRecipes();
  }

  loadRecipes(): void {
    this.recipeService.getRecipes().subscribe({
      error: error => {
        console.error('Recipe loading error:', error);
      }
    });
  }

  chooseCategory(category: string): void {
    this.selectedCategory.set(category);
  }

  openRecipe(recipe: Recipe): void {
    this.router.navigate(['/recipe-details', recipe.id]);
  }

  goProfile(): void {
    this.router.navigate(['/profile']);
  }

  goAdmin(): void {
    this.router.navigate(['/admin']);
  }

  isAdmin(): boolean {
    return this.auth.isAdmin();
  }

  logout(): void {
    this.auth.logout().subscribe({
      next: () => this.router.navigate(['/login']),
      error: error => {
        console.error('Logout error:', error);
        alert('Unable to contact the server.');
      }
    });
  }
}
