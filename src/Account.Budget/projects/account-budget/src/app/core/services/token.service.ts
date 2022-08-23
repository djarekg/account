import { JwtToken } from '@account-budget/models';
import { Injectable } from '@angular/core';

const TOKEN_KEY = 'auth-token';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  public getToken(): JwtToken | null {
    const token = sessionStorage.getItem(TOKEN_KEY);

    if (token) {
      return JSON.parse(token);
    }

    return null;
  }

  public setToken(token: JwtToken): void {
    localStorage.removeItem(TOKEN_KEY);

    if (token) {
      sessionStorage.setItem(TOKEN_KEY, JSON.stringify(token));
    }
  }
}
