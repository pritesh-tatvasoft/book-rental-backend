import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CustomersService } from 'src/customers/customers.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly customerService: CustomersService,
  ) {}

  async signIn(email: string, password: string) {
    const user = await this.customerService.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException("Account with this email doesn't exist");
    }

    const passwordValid = await bcrypt.compare(password, user.password);
    if (!passwordValid) {
      throw new UnauthorizedException("Invalid password");
    }

    const payload = { sub: user.id, username: user.email, role: user.role };

    return {
      message: 'Login successful',
      data: {
        user: user,
        accessToken: this.jwtService.sign(payload),
      },
      
    };
  }

  async register(registerDto: Record<string, any>) {
    const existing = await this.customerService.findByEmail(registerDto.email);
    if (existing) {
      throw new ConflictException('Email already taken');
    }

    const passwordHash = await bcrypt.hash(registerDto.password, 10);
    const user = await this.customerService.create({
      ...registerDto,
      password: passwordHash,
    });

    const { password: _, ...userWithoutPassword } = user;

    return {
      message: 'Registration successful',
      data: userWithoutPassword,
    };
  }
}
