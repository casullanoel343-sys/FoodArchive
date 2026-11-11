
import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

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
  IonTextarea,
  IonList,
  IonSpinner,
  IonBackButton
} from '@ionic/angular';

import { addIcons } from 'ionicons';
import {
  arrowBackOutline,
  createOutline,
  trashOutline,
  sendOutline,
  restaurantOutline
} from 'ionicons/icons';

import { RecipeService, Recipe } from '../services/recipe';
import { CommentService, Comment } from '../services/comment';
import { Auth } from '../services/auth';

@Component({
  selector: 'app-recipe-details',
  templateUrl: './recipe-details.html',
  styleUrl: './recipe-details.css',
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
    IonTextarea,
    IonList,
    IonSpinner,
    IonBackButton
  ]
})
export class RecipeDetails implements OnInit {

  recipe = signal<Recipe | null>(null);

  comments = this.commentService.comments;

  newComment = signal('');

  editingCommentId = signal<number | null>(null);

  editedMessage = signal('');

  loading = signal(false);

  currentUser = this.auth.currentUser;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private recipeService: RecipeService,
    private commentService: CommentService,
    private auth: Auth
  ) {
    addIcons({
      arrowBackOutline,
      createOutline,
      trashOutline,
      sendOutline,
      restaurantOutline
    });
  }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (!id || Number.isNaN(id)) {
      this.router.navigate(['/home']);
      return;
    }

    this.loadRecipe(id);
    this.loadComments(id);
  }

  // LOAD RECIPE
  loadRecipe(id: number): void {
    this.loading.set(true);

    this.recipeService.getRecipe(id).subscribe({
      next: response => {
        if (response.success && response.recipe) {
          this.recipe.set(response.recipe);
        } else {
          alert(response.message || 'Recipe not found.');
        }
        this.loading.set(false);
      },
      error: error => {
        console.error('Recipe loading error:', error);
        alert('Unable to load recipe.');
        this.loading.set(false);
      }
    });
  }

  // LOAD COMMENTS
  loadComments(recipeId: number): void {
    this.commentService.getComments(recipeId).subscribe({
      error: error => {
        console.error('Comment loading error:', error);
      }
    });
  }

  // ADD COMMENT
  addComment(): void {
    const recipe = this.recipe();
    const message = this.newComment().trim();

    if (!recipe || !message) {
      return;
    }

    this.commentService.addComment(recipe.id, message).subscribe({
      next: response => {
        if (response.success) {
          this.newComment.set('');
        } else {
          alert(response.message || 'Unable to add comment.');
        }
      },
      error: error => {
        console.error('Add comment error:', error);
        alert('Unable to add comment.');
      }
    });
  }

  // START EDITING
  startEdit(comment: Comment): void {
    this.editingCommentId.set(comment.id);
    this.editedMessage.set(comment.message);
  }

  // CANCEL EDITING
  cancelEdit(): void {
    this.editingCommentId.set(null);
    this.editedMessage.set('');
  }

  // UPDATE COMMENT
  updateComment(comment: Comment): void {
    const recipe = this.recipe();
    const message = this.editedMessage().trim();

    if (!recipe || !message) {
      return;
    }

    this.commentService.updateComment(
      comment.id,
      message,
      recipe.id
    ).subscribe({
      next: response => {
        if (response.success) {
          this.cancelEdit();
        } else {
          alert(response.message || 'Unable to update comment.');
        }
      },
      error: error => {
        console.error('Update comment error:', error);
        alert('Unable to update comment.');
      }
    });
  }

  // DELETE COMMENT
  deleteComment(comment: Comment): void {
    const recipe = this.recipe();

    if (!recipe) {
      return;
    }

    if (!confirm('Are you sure you want to delete this comment?')) {
      return;
    }

    this.commentService.deleteComment(
      comment.id,
      recipe.id
    ).subscribe({
      next: response => {
        if (!response.success) {
          alert(response.message || 'Unable to delete comment.');
        }
      },
      error: error => {
        console.error('Delete comment error:', error);
        alert('Unable to delete comment.');
      }
    });
  }

  // CHECK COMMENT OWNERSHIP
  isCommentOwner(comment: Comment): boolean {
    return comment.user_id === this.currentUser()?.id;
  }

  // GO BACK
  goBack(): void {
    this.router.navigate(['/home']);
  }

}
