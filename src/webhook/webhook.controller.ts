import { Controller, Post, Body } from '@nestjs/common';
import { WebhookService } from './webhook.service';

@Controller('webhooks')
export class WebhookController {
  constructor(private readonly webhookService: WebhookService) { }

  @Post()
  async handleWebhook(@Body() body: any) {
    await this.webhookService.logRequest(body);
    return { message: 'Webhook received' };
  }
}