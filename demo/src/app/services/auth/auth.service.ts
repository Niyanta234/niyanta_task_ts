import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  btn_signup(data: any) {
    return this.http.post<any>('http://localhost:3000/user/signup', data);
  }

  btn_signin(data: any) {
    return this.http.post<any>('http://localhost:3000/user/login', data, {
      withCredentials: true,
    });
  }

  forgot_pass(data: any) {
    console.log(data);
    return this.http.post<any>(
      'http://localhost:3000/user/password/forgot',
      data
    );
  }

  reset_pass(data: any) {
    return this.http.put<any>(
      'http://localhost:3000/user/resetpassword/' + data.token,
      { password: data.password }
    );
  }

  add_payment(data: any) {
    return this.http.post<any>('http://localhost:3000/user/addpayment', data, {
      withCredentials: true,
    });
  }

  viewhistory(params: any) {
    return this.http.get('http://localhost:3000/user/paymenthistory', {
      params,
      withCredentials: true,
    });
  }

  set_profile(data: any) {
    return this.http.post<any>('http://localhost:3000/user/profile', data, {
      withCredentials: true,
    });
  }
  get_profile() {
    return this.http.get<any>('http://localhost:3000/user/profile', {
      withCredentials: true,
    });
  }
}
