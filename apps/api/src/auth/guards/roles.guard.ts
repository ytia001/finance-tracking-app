import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Read required roles from @Roles decorator (on method or controller)
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(), // The route handler method
      context.getClass() // The controller class
    ]);

    if (!requiredRoles) {
      return true;
    }

    // Get the user from the request (attached by JwtStrategy.validate())
    const { user } = context.switchToHttp().getRequest();

    // Deny access if no user or user has no roles
    if (!user || !user.roles) {
      return false;
    }

    return requiredRoles.some((role) => user.roles?.includes(role));
  }
}
