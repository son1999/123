import { Module } from '@nestjs/common';
import { AccountService } from './account.service';
import { AccountController } from './account.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Exchange } from 'src/entities/exchange.entity';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [TypeOrmModule.forFeature([User, Exchange]), HttpModule],
  providers: [AccountService],
  controllers: [AccountController]
})
export class AccountModule { }
