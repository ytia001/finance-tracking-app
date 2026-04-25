import { NestInterceptor, ExecutionContext, Injectable, CallHandler } from '@nestjs/common';
import { ClsService, ClsModule } from 'nestjs-cls';
import { Observable } from 'rxjs';

export const USER_ID_KEY = 'userId';

@Injectable()
export class TenantInterceptor implements NestInterceptor {
  constructor(private clsService: ClsService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (user?.id) {
      this.clsService.set(USER_ID_KEY, user.id);
    }

    return next.handle();
  }
}

export const ClsModuleSetup = ClsModule.forRoot({
  global: true,
  middleware: { mount: true }
});
