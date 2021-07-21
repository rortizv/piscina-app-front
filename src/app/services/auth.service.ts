import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LoginModel } from '../interfaces/LoginModel';
import { LocalDataService } from './local-data.service';
import { TokenModel } from '../interfaces/TokenModel';
import jwt_decode from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private API_URL: string;
  private NAME_TOKEN: string;
  

  constructor(
    private http: HttpClient,
    private localDataService: LocalDataService
  ) { 
    this.API_URL = environment.API_URL_CORE;
    this.NAME_TOKEN = 'JWT';
    
  }

  setToken(token: string): void {
    this.localDataService.setItem({ value: token, key: this.NAME_TOKEN });
  }

  getToken(): string {
    return this.localDataService.getItem(this.NAME_TOKEN);
  }

  login(userData: LoginModel): Observable<any> {
    const endpoint = 'api/usuarios/login';
    const url = `${this.API_URL}${endpoint}`;
    return this.http.post<any>(url, userData);
  }

  getRolenameUser(): boolean {
    const decoded = jwt_decode(this.getToken()) as TokenModel;
    //console.log(decoded);
    return decoded.rolename == "administrador";
  }

  hasTokenSession() {
    if (localStorage.getItem(this.NAME_TOKEN)) {
      return true;
    } else {
      return false;
    }
  }

  getExpDateToken(token: string): Date {
    const decoded = jwt_decode(token) as TokenModel;
    const date = new Date(0);
    date.setUTCSeconds(decoded.exp);
    return date;
  }
 
  isExpiredToken(token?: string): boolean {
    if (!token) token = this.getToken();
    if (!token) return true;
    const date = this.getExpDateToken(token);
    if (date === undefined) return false;
    return !(date.valueOf() > new Date().valueOf());
  }


  getCurrentUser(token?: string): TokenModel {
    if (!token) token = this.getToken();
    const decoded = jwt_decode(token) as TokenModel;
    return decoded;
  }
}