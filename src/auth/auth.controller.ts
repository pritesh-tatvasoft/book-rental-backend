import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Sign in and receive a JWT token' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 200,
    description: 'Successful login returns a JWT token',
    schema: {
      example: {
        success: true,
        message: 'Request successful',
        data: {
          user: {
            id: '3f8e8a70-1a50-4a3a-b0f8-123456789abc',
            email: 'jane.doe@example.com',
            firstName: 'Jane',
            lastName: 'Doe',
            address: '123 Main St',
            profilePictureUrl: 'https://.../profile.png',
            role: 'USER',
            createdAt: '2026-05-22T12:00:00.000Z',
            updatedAt: '2026-05-22T12:00:00.000Z',
          },
          accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        },
      },
    },
  })
  signIn(@Body() signInDto: LoginDto) {
    return this.authService.signIn(signInDto.email, signInDto.password);
  }

  @Post('register')
  @ApiOperation({ summary: 'Register a new customer account' })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({
    status: 201,
    description: 'Registration successful and returns a created user',
    schema: {
      example: {
        success: true,
        message: 'Registration successful',
        data: {
          id: '3f8e8a70-1a50-4a3a-b0f8-123456789abc',
          email: 'jane.doe@example.com',
          firstName: 'Jane',
          lastName: 'Doe',
          address: '123 Main St',
          profilePictureUrl: 'https://.../profile.png',
          role: 'USER',
          createdAt: '2026-05-22T12:00:00.000Z',
          updatedAt: '2026-05-22T12:00:00.000Z',
        },
      },
    },
  })
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }
}
