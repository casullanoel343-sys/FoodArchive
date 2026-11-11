
import { Injectable, signal } from '@angular/core';
import { Observable, tap, finalize } from 'rxjs';
import { Api } from './api';

export interface Recipe {
  id: number;
  name: string;
  category: string;
  description: string;
  ingredients: string[];
  steps: string[];
  image?: string;
  cooking_time?: number;
  created_by?: number;
}

export interface RecipeResponse {
  success: boolean;
  message: string;
  recipes?: Recipe[];
  recipe?: Recipe;
}

@Injectable({
  providedIn: 'root'
})
export class RecipeService {

  // Angular Signals
  recipes = signal<Recipe[]>([]);
  loading = signal<boolean>(false);

  constructor(private api: Api) {}

  // GET: Load all recipes
  getRecipes(): Observable<RecipeResponse> {

    this.loading.set(true);

    return this.api.get<RecipeResponse>('recipes').pipe(
      tap(response => {
        if (response.success) {
          this.recipes.set(response.recipes ?? []);
        }
      }),
      finalize(() => {
        this.loading.set(false);
      })
    );
  }

  // GET: Load one recipe
  getRecipe(id: number): Observable<RecipeResponse> {

    return this.api.get<RecipeResponse>(
      'recipes',
      { id }
    );
  }

  // POST: Add a recipe (Admin)
  addRecipe(data: Partial<Recipe>): Observable<RecipeResponse> {

    return this.api.post<RecipeResponse>(
      'recipes',
      data
    ).pipe(
      tap(response => {
        if (response.success) {
          this.getRecipes().subscribe();
        }
      })
    );
  }

  // PUT: Update a recipe (Admin)
  updateRecipe(
    id: number,
    data: Partial<Recipe>
  ): Observable<RecipeResponse> {

    return this.api.put<RecipeResponse>(
      'recipes',
      {
        id,
        ...data
      }
    ).pipe(
      tap(response => {
        if (response.success) {
          this.getRecipes().subscribe();
        }
      })
    );
  }

  // DELETE: Delete a recipe (Admin)
  deleteRecipe(id: number): Observable<RecipeResponse> {

    return this.api.delete<RecipeResponse>(
      'recipes',
      { id }
    ).pipe(
      tap(response => {
        if (response.success) {
          this.recipes.update(recipes =>
            recipes.filter(recipe => recipe.id !== id)
          );
        }
      })
    );
  }

}
