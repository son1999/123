import { Controller, Get, Param } from '@nestjs/common';
import { AccountService } from './account.service';

@Controller('account')
export class AccountController {
    constructor(private accountService: AccountService) { }

    @Get('balance/:userId')
    async getBalance(@Param('userId') userId: number) {
        try {
            const balance = await this.accountService.getBalance(userId);
            return {
                success: true,
                data: balance,
            };
        } catch (error) {
            return {
                success: false,
                message: error.message,
            };
        }
    }
}
