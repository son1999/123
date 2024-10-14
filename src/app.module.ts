import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { Exchange } from './entities/exchange.entity';
import { User } from './entities/user.entity';
import { AccountModule } from './account/account.module';
import { UserExchange } from './entities/user-exchange.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [User, Exchange, UserExchange],
      synchronize: true,
    }),
    AccountModule
  ],
})
export class AppModule { }
