import { Controller, Get, Param } from '@nestjs/common';
import { AccountService } from './account.service';

@Controller('account')
export class AccountController {
    constructor(private accountService: AccountService) { }

    @Get(':userId/balance')
    async getUserAPIKeys(@Param('userId') userId: string) {
        return this.accountService.getBalance(parseInt(userId));
    }
}
