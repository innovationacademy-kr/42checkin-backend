import {
	Column,
	CreateDateColumn,
	DeleteDateColumn,
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn,
	RelationId,
	UpdateDateColumn
} from 'typeorm';
import Card from './card.entity';
import User from './user.entity';

@Entity('log')
export default class Log {
	constructor(user: User, card: Card, type: string) {
		this.user = user;
		this.card = card;
		this.logType = type;
	}

	@PrimaryGeneratedColumn() private logId: number;

	@ManyToOne(() => User)
	@JoinColumn()
	private user: User;

	@RelationId((log: Log) => log.card)
	private cardId: number;

	@ManyToOne(() => Card)
	@JoinColumn()
	private card: Card;

	@Column() private logType: string;

	@CreateDateColumn() private createdAt: Date;

	@UpdateDateColumn() private updatedAt: Date;

	@DeleteDateColumn() private deletedAt: Date;
}
