import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

/**
 * JWT Strategy - Validates JWT tokens on protected routes.
 * Used after login to verify the user's token on every API request.
 * Extends PassportStrategy to integrate passport-jwt with NestJS DI.
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Extract token from Authorization: Bearer <token>
      ignoreExpiration: false, // Reject expired tokens
      secretOrKey: process.env.JWT_SECRET || 'fallback_secret_key' // Secret used to sign/verify the token
    });
  }

  /**
   * Called by Passport after the token is successfully verified.
   * Must be named 'validate' — this is a Passport.js requirement.
   * The return value is attached to request.user in route handlers.
   *
   * NOTE: JWT strategy automatically validates the token signature and expiration.
   * By the time this runs, the token is already proven valid.
   * This method only shapes what user data gets attached to request.user.
   * Re-checking the database here is optional (e.g., to verify user still exists).
   */
  override async validate(payload: any) {
    return {
      userId: payload.sub,
      email: payload.email,
      roles: payload.roles
    };
  }
}
