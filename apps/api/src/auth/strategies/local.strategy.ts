import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';

/**
 * Local Strategy - Authenticates users with email/password during login.
 * Used only once at login time to verify credentials and issue a JWT token.
 * Extends PassportStrategy to integrate passport-local with NestJS DI.
 */
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'email', // Map the 'email' field from the request body
      passwordField: 'password' // Map the 'password' field from the request body
    });
  }

  /**
   * Called by Passport with the extracted email and password.
   * Must be named 'validate' — this is a Passport.js requirement.
   * Throws UnauthorizedException if credentials are invalid.
   *
   * NOTE: Local strategy does NOT validate credentials automatically.
   * It only extracts email/password from the request body.
   * You MUST manually verify them against your database here.
   */
  async validate(email: string, password: string): Promise<any> {
    const user = await this.authService.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
