import {
  IsDateString,
  IsEmail,
  IsIn,
  IsString,
  MinLength,
} from 'class-validator';
import type { CreateAccountRequestDto, Role } from 'shared-types';

export class CreateAccountDto implements CreateAccountRequestDto {
  @IsString()
  name!: string;

  @IsEmail()
  email!: string;

  @IsIn(['STUDENT', 'ADMIN'])
  role!: Role;

  @IsDateString()
  dateOfBirth!: string;

  @IsString()
  team!: string;

  @MinLength(8)
  password!: string;
}
