import { JwtToken } from '@account-budget/models';
import { Injectable } from '@angular/core';

const TOKEN_KEY = 'auth-token';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  public getToken(): JwtToken | null {
    const token = localStorage.getItem(TOKEN_KEY);

    if (token) {
      return JSON.parse(token);
    }

    return null;
  }

  public setToken(token: JwtToken): void {
    localStorage.removeItem(TOKEN_KEY);
    token ?? localStorage.setItem(TOKEN_KEY, JSON.stringify(token));
  }
}
