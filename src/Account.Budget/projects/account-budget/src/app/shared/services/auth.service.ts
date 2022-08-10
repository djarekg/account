import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'any',
})
export class AuthService {
  constructor() {}

  public isAuthenticated(): boolean {
    return !!localStorage.getItem('jwtToken');
  }
}
