
import { Injectable, signal } from '@angular/core';
import { Observable, tap, finalize } from 'rxjs';
import { Api } from './api';

export interface Comment {
  id: number;
  recipe_id: number;
  user_id: number;
  username: string;
  message: string;
  created_at?: string;
}

export interface CommentResponse {
  success: boolean;
  message: string;
  comments?: Comment[];
  comment?: Comment;
}

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  // Angular Signals
  comments = signal<Comment[]>([]);
  loading = signal<boolean>(false);

  constructor(private api: Api) {}

  // GET: Load comments for a recipe
  getComments(recipeId: number): Observable<CommentResponse> {

    this.loading.set(true);

    return this.api.get<CommentResponse>(
      'comments',
      { recipe_id: recipeId }
    ).pipe(
      tap(response => {
        if (response.success) {
          this.comments.set(response.comments ?? []);
        }
      }),
      finalize(() => {
        this.loading.set(false);
      })
    );
  }

  // POST: Add a comment
  addComment(
    recipeId: number,
    message: string
  ): Observable<CommentResponse> {

    return this.api.post<CommentResponse>(
      'comments',
      {
        recipe_id: recipeId,
        message
      }
    ).pipe(
      tap(response => {
        if (response.success) {
          this.getComments(recipeId).subscribe();
        }
      })
    );
  }

  // PUT: Update a comment
  updateComment(
    commentId: number,
    message: string,
    recipeId: number
  ): Observable<CommentResponse> {

    return this.api.put<CommentResponse>(
      'comments',
      {
        id: commentId,
        message
      }
    ).pipe(
      tap(response => {
        if (response.success) {
          this.getComments(recipeId).subscribe();
        }
      })
    );
  }

  // DELETE: Delete a comment
  deleteComment(
    commentId: number,
    recipeId: number
  ): Observable<CommentResponse> {

    return this.api.delete<CommentResponse>(
      'comments',
      { id: commentId }
    ).pipe(
      tap(response => {
        if (response.success) {
          this.comments.update(comments =>
            comments.filter(comment => comment.id !== commentId)
          );
        }
      })
    );
  }

}
