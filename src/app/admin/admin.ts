
import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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
  IonInput,
  IonTextarea,
  IonSelect,
  IonSelectOption,
  IonSpinner
} from '@ionic/angular';

import { addIcons } from 'ionicons';
import {
  arrowBackOutline,
  addOutline,
  createOutline,
  trashOutline,
  logOutOutline,
  restaurantOutline
} from 'ionicons/icons';

import { RecipeService, Recipe } from '../services/recipe';
import { Auth } from '../services/auth';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.html',
  styleUrl: './admin.css',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
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
    IonInput,
    IonTextarea,
    IonSelect,
    IonSelectOption,
    IonSpinner
  ]
})
export class Admin implements OnInit {

  recipes = this.recipeService.recipes;
  loading = this.recipeService.loading;

  editingId = signal<number | null>(null);
  showForm = signal(false);

  recipeForm = {
    name: '',
    category: 'Chicken',
    description: '',
    cooking_time: 30,
    image: '',
    ingredientsText: '',
    stepsText: ''
  };

  constructor(
    private recipeService: RecipeService,
    private auth: Auth,
    private router: Router
  ) {
    addIcons({
      arrowBackOutline,
      addOutline,
      createOutline,
      trashOutline,
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
        alert('Unable to load recipes.');
      }
    });
  }

  openAddForm(): void {
    this.resetForm();
    this.showForm.set(true);
  }

  editRecipe(recipe: Recipe): void {
    this.editingId.set(recipe.id);

    this.recipeForm = {
      name: recipe.name,
      category: recipe.category,
      description: recipe.description,
      cooking_time: recipe.cooking_time ?? 30,
      image: recipe.image ?? '',
      ingredientsText: recipe.ingredients.join('\n'),
      stepsText: recipe.steps.join('\n')
    };

    this.showForm.set(true);
  }

  saveRecipe(): void {
    const form = this.recipeForm;

    if (
      !form.name.trim() ||
      !form.description.trim() ||
      !form.ingredientsText.trim() ||
      !form.stepsText.trim()
    ) {
      alert('Please complete all required fields.');
      return;
    }

    const data: Partial<Recipe> = {
      name: form.name.trim(),
      category: form.category,
      description: form.description.trim(),
      cooking_time: Number(form.cooking_time),
      image: form.image.trim(),
      ingredients: form.ingredientsText
        .split('\n')
        .map(item => item.trim())
        .filter(item => item),
      steps: form.stepsText
        .split('\n')
        .map(item => item.trim())
        .filter(item => item)
    };

    const id = this.editingId();

    const request = id
      ? this.recipeService.updateRecipe(id, data)
      : this.recipeService.addRecipe(data);

    request.subscribe({
      next: response => {
        if (response.success) {
          alert(id ? 'Recipe updated successfully!' : 'Recipe added successfully!');
          this.cancelForm();
          this.loadRecipes();
        } else {
          alert(response.message || 'Unable to save recipe.');
        }
      },
      error: error => {
        console.error('Save recipe error:', error);
        alert('Unable to save recipe. Check your API connection.');
      }
    });
  }

  deleteRecipe(recipe: Recipe): void {
    if (!confirm(`Delete "${recipe.name}"?`)) return;

    this.recipeService.deleteRecipe(recipe.id).subscribe({
      next: response => {
        if (response.success) {
          alert('Recipe deleted successfully!');
        } else {
          alert(response.message || 'Unable to delete recipe.');
        }
      },
      error: error => {
        console.error('Delete recipe error:', error);
        alert('Unable to delete recipe.');
      }
    });
  }

  cancelForm(): void {
    this.showForm.set(false);
    this.resetForm();
  }

  resetForm(): void {
    this.editingId.set(null);

    this.recipeForm = {
      name: '',
      category: 'Chicken',
      description: '',
      cooking_time: 30,
      image: '',
      ingredientsText: '',
      stepsText: ''
    };
  }

  goBack(): void {
    this.router.navigate(['/home']);
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
