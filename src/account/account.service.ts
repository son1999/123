import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectRepository } from "@nestjs/typeorm";
import { lastValueFrom } from "rxjs";
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

    async getBalance(userId: number): Promise<any> {
        const user = await this.userRepository.findOne({
            where: { id: userId },
            relations: ['exchange'],
        });

        if (!user) {
            throw new Error(`User with ID ${userId} not found.`);
        }

        const exchangeName = user.exchange.name.trim().toUpperCase();

        if (exchangeName === 'BINANCE') {
            return this.getBinanceBalance(user.apiKey, user.secretKey);
        }

        if (exchangeName === 'MEXC') {
            return this.getMEXCBalance(user.apiKey, user.secretKey);
        }

        throw new Error(`Unsupported exchange: ${user.exchange.name}`);
    }

    private async getBinanceBalance(apiKey: string, secretKey: string): Promise<any> {
        const timestamp = Date.now();
        const queryString = `timestamp=${timestamp}`;
        const signature = generateSignature(secretKey, queryString);

        console.log('Binance Query String:', queryString);
        console.log('Binance Signature:', signature);

        const headers = {
            'X-MBX-APIKEY': apiKey,
        };

        const binanceApiUrl = this.configService.get<string>('BINANCE_API_URL');
        const url = `${binanceApiUrl}/api/v3/account?${queryString}&signature=${signature}`;
        console.log('Binance URL:', url);

        try {
            const response = await lastValueFrom(this.httpService.get(url, { headers }));
            return response.data;
        } catch (error) {
            console.error('Binance API Error:', error.response.data);
            throw new Error(`Binance API request failed: ${error.response.data}`);
        }
    }

    private async getMEXCBalance(apiKey: string, secretKey: string): Promise<any> {
        const timestamp = Date.now();
        const params = new URLSearchParams({
            api_key: apiKey,
            asset: 'USDT',
            req_time: timestamp.toString()
        });
        params.sort();
        const queryString = params.toString();

        const signature = generateSignature(secretKey, queryString);

        console.log('MEXC API Key:', apiKey);
        console.log('MEXC Secret Key:', secretKey);
        console.log('MEXC Params:', params);
        console.log('MEXC Signature:', signature);
        console.log('Query String:', queryString);
        console.log('Signature:', signature);

        const mexcApiUrl = this.configService.get<string>('MEXC_API_URL');
        const url = `${mexcApiUrl}/api/v1/private/account/assets?${params}&sign=${signature}`;
        console.log('MEXC URL:', url);

        try {
            const response = await lastValueFrom(this.httpService.get(`${mexcApiUrl}/open/api/v2/account/info?${queryString}&sign=${signature}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'X-MEXC-APIKEY': apiKey
                }
            }));
            console.log('response', response);
            return response.data;
        } catch (error) {
            console.error('MEXC API Error:', error.response.data);
            throw new Error(`MEXC API request failed: ${error.response.data}`);
        }
    }
}
