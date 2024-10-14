import { Module } from '@nestjs/common';
import { AccountService } from './account.service';
import { AccountController } from './account.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Exchange } from 'src/entities/exchange.entity';
import { HttpModule } from '@nestjs/axios';
import { UserExchange } from 'src/entities/user-exchange.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Exchange, UserExchange]), HttpModule],
  providers: [AccountService],
  controllers: [AccountController]
})
export class AccountModule { }
