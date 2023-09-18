import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, Observable } from 'rxjs';
import { map, retry } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Parameter } from 'src/models/form/form.model';

@Injectable({
  providedIn: 'root'
})


export class AuthService {

  private systemParam$ = new BehaviorSubject<Parameter[]>([]);

  constructor(
    private http: HttpClient
  ) { }

  public login(req: any): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/auth/login`, req);
  }

  public refreshToken(token: string): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/auth/refresh-token`, { token });
  }

  /** 取得系統參數 */
  public initSystemParam(key = ''): Observable<any> {
    const apiUrl = `${environment.apiUrl}/auth/getSystemParam${key ? `?key=${key}` : ''}`;
    return this.http.get<any>(apiUrl);
  }

}
