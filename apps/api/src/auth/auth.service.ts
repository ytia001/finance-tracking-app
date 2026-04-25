import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Inject } from '@nestjs/common';
import { DRIZZLE, DrizzleDB } from '../db/db.module';
import { users, userRoles, roles } from '../db/schema';
import { eq } from 'drizzle-orm';
import * as bcrypt from 'bcrypt';
import { LoginResponseDto, RegisterDto } from './dto/auth.dto';
import { AuthenticatedUser } from 'src/models/auth';

@Injectable()
export class AuthService {
  constructor(
    @Inject(DRIZZLE) private db: DrizzleDB,
    private jwtService: JwtService
  ) {}

  async register(createUserDto: RegisterDto) {
    const { email, password, firstName, lastName } = createUserDto;

    const existingUser = await this.db.query.users.findFirst({
      where: eq(users.email, email)
    });

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [newUser] = await this.db
      .insert(users)
      .values({
        email,
        password: hashedPassword,
        firstName,
        lastName
      })
      .returning();

    // Assign default 'user' role
    const defaultRole = await this.db.query.roles.findFirst({
      where: eq(roles.name, 'user')
    });

    if (defaultRole) {
      await this.db.insert(userRoles).values({
        userId: newUser.id,
        roleId: defaultRole.id
      });
    }

    return { id: newUser.id, email: newUser.email };
  }

  async validateUser(email: string, pass: string): Promise<AuthenticatedUser | null> {
    const user = await this.db.query.users.findFirst({
      where: eq(users.email, email),
      with: {
        userRoles: {
          with: {
            role: true
          }
        }
      }
    });

    if (!user) {
      return null;
    }

    const isMatch = await bcrypt.compare(pass, user.password);
    if (!isMatch) {
      return null;
    }

    const userRolesList = (user as any).userRoles.map((ur: any) => ur.role.name);

    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName!,
      lastName: user.lastName!,
      roles: userRolesList
    };
  }

  async login(user: AuthenticatedUser): Promise<LoginResponseDto> {
    const payload = {
      email: user.email,
      sub: user.id,
      roles: user.roles
    };

    return {
      accessToken: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        roles: user.roles
      }
    };
  }
}
