import { JwtToken } from '@account-budget/models';
import { TokenService } from '@account-budget/services';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, switchMap, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient, private tokenService: TokenService) {}

  public isAuthenticated(): boolean {
    return !!this.tokenService.getToken();
  }

  public login(userName: string, password: string): Observable<boolean | null> {
    return this.http
      .put<JwtToken>('auth', {
        userName: userName,
        password: password,
      })
      .pipe(
        tap(token => {
          if (token) {
            return of(this.tokenService.setToken(token));
          }
          return throwError(() => new Error('Invalid credentials'));
        }),
        switchMap(() => of(true)),
      );
  }
}
