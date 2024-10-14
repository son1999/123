import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';
import { Exchange } from './exchange.entity';

@Entity('user_exchanges')
export class UserExchange {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, user => user.userExchanges, { onDelete: 'CASCADE' })
    user: User;

    @ManyToOne(() => Exchange, exchange => exchange.userExchanges, { onDelete: 'CASCADE' })
    exchange: Exchange;

    @Column({ type: 'varchar', length: 255 })
    api_key: string;

    @Column({ type: 'varchar', length: 255 })
    secret_key: string;

    @CreateDateColumn({ type: 'timestamp' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updated_at: Date;
}
