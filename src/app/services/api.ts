
import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpParams,
  HttpHeaders
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Api {

  private apiUrl = 'http://localhost/foodarchive-api/index.php';

  constructor(private http: HttpClient) {}

  // Authentication headers
  private getHeaders(): HttpHeaders {

    const token = localStorage.getItem('foodarchive_token');

    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    if (token) {
      headers = headers.set(
        'Authorization',
        `Bearer ${token}`
      );
    }

    return headers;
  }

  // GET
  get<T>(route: string, params: any = {}): Observable<T> {

    let httpParams = new HttpParams()
      .set('route', route);

    Object.keys(params).forEach(key => {
      httpParams = httpParams.set(
        key,
        String(params[key])
      );
    });

    return this.http.get<T>(this.apiUrl, {
      params: httpParams,
      headers: this.getHeaders()
    });
  }

  // POST
  post<T>(route: string, data: any): Observable<T> {

    return this.http.post<T>(
      `${this.apiUrl}?route=${encodeURIComponent(route)}`,
      data,
      {
        headers: this.getHeaders()
      }
    );
  }

  // PUT
  put<T>(route: string, data: any): Observable<T> {

    return this.http.put<T>(
      `${this.apiUrl}?route=${encodeURIComponent(route)}`,
      data,
      {
        headers: this.getHeaders()
      }
    );
  }

  // DELETE
  delete<T>(route: string, params: any = {}): Observable<T> {

    let httpParams = new HttpParams()
      .set('route', route);

    Object.keys(params).forEach(key => {
      httpParams = httpParams.set(
        key,
        String(params[key])
      );
    });

    return this.http.delete<T>(this.apiUrl, {
      params: httpParams,
      headers: this.getHeaders()
    });
  }

}
