import { ConflictException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { prisma } from 'database';
import type { AccountDto } from 'shared-types';
import type { CreateAccountDto } from './dto/create-account.dto';

interface UserRecord {
  id: string;
  name: string;
  email: string;
  role: string;
  dateOfBirth: Date | null;
  team: string | null;
}

@Injectable()
export class AccountsService {
  async create(dto: CreateAccountDto): Promise<AccountDto> {
    const passwordHash = await bcrypt.hash(dto.password, 10);

    try {
      const user = await prisma.user.create({
        data: {
          name: dto.name,
          email: dto.email,
          role: dto.role,
          dateOfBirth: new Date(dto.dateOfBirth),
          team: dto.team,
          passwordHash,
        },
      });
      return this.toDto(user);
    } catch (error: unknown) {
      if (this.isUniqueConstraintError(error)) {
        throw new ConflictException(
          `An account with email ${dto.email} already exists`,
        );
      }
      throw error;
    }
  }

  async findByRole(role?: string): Promise<AccountDto[]> {
    const roleFilter =
      role === 'STUDENT' || role === 'ADMIN' ? role : undefined;
    const users = await prisma.user.findMany({
      where: roleFilter ? { role: roleFilter } : undefined,
      orderBy: { name: 'asc' },
    });
    return users.map((user) => this.toDto(user));
  }

  private isUniqueConstraintError(error: unknown): boolean {
    return (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      error.code === 'P2002'
    );
  }

  private toDto(user: UserRecord): AccountDto {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role === 'ADMIN' ? 'ADMIN' : 'STUDENT',
      dateOfBirth: user.dateOfBirth ? user.dateOfBirth.toISOString() : null,
      team: user.team,
    };
  }
}
