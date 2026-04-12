import { Controller, Post, Body, UseGuards, Request, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from './decorators/roles.decorator';
import { Public } from './decorators/public.decorator';
import { AuthGuard } from '@nestjs/passport';
import { RegisterDto } from './dto/auth.dto';
import { AuthenticatedUser } from '../models/auth';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('register')
  async register(@Body() createUserDto: RegisterDto) {
    return this.authService.register(createUserDto);
  }

  @Public()
  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Request() req: Express.Request) {
    // Passport LocalStrategy attaches the validated user to req.user
    // Since LocalStrategy throws UnauthorizedException on failure, req.user is guaranteed to exist
    return this.authService.login(req.user as AuthenticatedUser);
  }

  @UseGuards(RolesGuard)
  @Roles('admin')
  @Get('admin-only')
  async adminOnly() {
    return { message: 'Welcome, Admin!' };
  }

  @Get('profile')
  async getProfile(@Request() req: Express.Request) {
    return req.user;
  }
}
