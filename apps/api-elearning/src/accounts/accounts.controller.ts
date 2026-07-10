import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import type { AccountDto } from 'shared-types';
import { AccountsService } from './accounts.service';
import { CreateAccountDto } from './dto/create-account.dto';

@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Post()
  create(@Body() dto: CreateAccountDto): Promise<AccountDto> {
    return this.accountsService.create(dto);
  }

  @Get()
  findAll(@Query('role') role?: string): Promise<AccountDto[]> {
    return this.accountsService.findByRole(role);
  }
}
