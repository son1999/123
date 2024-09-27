import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Exchange } from './exchange.entity';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    apiKey: string;

    @Column()
    secretKey: string;

    @ManyToOne(() => Exchange, (exchange) => exchange.users)
    exchange: Exchange;
}
