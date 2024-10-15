import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WebhookController } from './webhook.controller';
import { WebhookService } from './webhook.service';
import { Log } from '../entities/log.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Log])],
  controllers: [WebhookController],
  providers: [WebhookService],
})
export class WebhookModule { }