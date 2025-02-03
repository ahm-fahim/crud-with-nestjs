import { Injectable } from '@nestjs/common';

@Injectable({})
export class AuthService {
  signup() {
    return { msg: 'I am sign up' };
  }
  signin() {
    return { msg: 'I am sign in' };
  }
}
