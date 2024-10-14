import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectRepository } from "@nestjs/typeorm";
import axios from "axios";
import { exchanges } from "src/configs/configs";
import { User } from "src/entities/user.entity";
import { generateSignature } from "src/helpers/signature";
import { Repository } from "typeorm";

@Injectable()
export class AccountService {
    constructor(
        @InjectRepository(User) private userRepository: Repository<User>,
        private httpService: HttpService,
        private configService: ConfigService
    ) { }

    async getBalance(userId: number) {
        const user = await this.userRepository.findOne({
            where: { id: userId },
            relations: ['userExchanges', 'userExchanges.exchange'],
        });

        const userExchange = user.userExchanges.find(ex => ex.exchange.name === exchanges.BYBIT);

        if (!userExchange) {
            throw new Error('User does not have Bybit exchange linked.');
        }

        const { api_key, secret_key } = userExchange;
        const timestamp = Date.now().toString();
        const accountType = "UNIFIED";

        const queryString = `accountType=${accountType}&api_key=${api_key}&timestamp=${timestamp}`;

        const signature = generateSignature(secret_key, queryString);

        const response = await axios.get(`${process.env.BYBIT_API_URL}/v5/account/wallet-balance`, {
            params: {
                accountType,
                api_key: api_key,
                timestamp,
                sign: signature,
            },
        });

        if (response.data.retCode !== 0) {
            throw new Error(`API Error: ${response.data.retMsg}`);
        }

        return response.data;
    }
}
