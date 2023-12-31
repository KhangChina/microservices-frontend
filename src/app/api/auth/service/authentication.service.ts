import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'environments/environment';
import { User, Role } from 'app/api/auth/models';
import axios from 'axios'

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  //public
  public currentUser: Observable<User>;
  //private
  private currentUserSubject: BehaviorSubject<User>;
  constructor() {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  // getter: currentUserValue
  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  /**
   *  Confirms if user is admin
   */
  get isAdmin() {
    return this.currentUser && this.currentUserSubject.value.role === Role.Admin;
  }

  /**
   *  Confirms if user is client
   */
  get isClient() {
    return this.currentUser && this.currentUserSubject.value.role === Role.Client;
  }

  /**
   * User login
   *
   * @param email
   * @param password
   * @returns user
   */

  // {
  //   "productID": "e2eab0ea-fb88-4bfe-96c8-adc4cc86bcaa",
  //   "username": "admin@htgsoft.com",
  //   "password": "htgsoft@X"
  // }

  async login(email: string, password: string) {
    let data = JSON.stringify({
      "productID": environment.productID,
      "username": email,
      "password": password
    });

    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `${environment.apiUrl}/authentication/login`,
      headers: {
        'Content-Type': 'application/json',
      },
      data: data
    };
    try {
      const response = await axios(config)
      if (response.data.statusCode === 200) {
        return {
          check: 'OK',
          data: response.data.data
        }
      }
    } catch (error) {
      return {
        check: 'ERROR',
        data: error.response.data.message
      }
    }
  }

  isAuthenticated() {
    const accessToken = localStorage.getItem('accessToken')
    const refreshToken = localStorage.getItem('refreshToken')
    if (accessToken && refreshToken) {
      // console.log(accessToken + refreshToken)
      return true
    }
    return false
  }


  /**
   * User logout
   *
   */
  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken')
    // notify
    this.currentUserSubject.next(null);
  }
}
