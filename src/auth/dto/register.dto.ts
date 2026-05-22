import {
  IsEmail,
  IsString,
  MinLength,
  IsOptional,
  IsEnum,
} from 'class-validator';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsEnum(['ADMIN', 'USER'])
  role: 'USER';

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  profilePictureUrl?: string;
}
