import { ForbiddenException } from '@nestjs/common';
import { ClsService } from 'nestjs-cls';
import { USER_ID_KEY } from './cls.module';

export class BaseService {
  constructor(protected readonly clsService: ClsService) {}

  protected getUserId(): number {
    const userId = this.clsService.get(USER_ID_KEY);
    if (!userId) {
      throw new ForbiddenException('User not authenticated');
    }
    return userId;
  }
}