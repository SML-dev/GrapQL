import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { User } from '../users/models/user';
import { jwtSecret } from 'src/secretKeys';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  validate(email: string, password: string): User | null {
    const user = this.usersService.getUserByEmail(email);

    if (!user) {
      return null;
    }
    const passwordIsValid = password === user.password;
    return passwordIsValid ? user : null;
  }

  login(user: User): { access_token: string } {
    const payload = {
      id: user.userId,
      email: user.email,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  verify(token: string): User {
    const decoded = this.jwtService.verify(token, { secret: jwtSecret });
    const user = this.usersService.getUserByEmail(decoded.email);
    if (!user) {
      throw new Error('Unable to get the user from decoded token');
    }
    return user;
  }
}
