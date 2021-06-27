import User from '@entities/user.entity';

export class StatusDTO {
	constructor(user: User, waitingNum: number) {
		this.login = user.getName();
		this.card = user.getCard() ? user.getCard().getId() : null;
		this.waitingNum = waitingNum ? waitingNum : null;
	}

	private login: string;
	private card: number;
	private waitingNum: number;
	private timeOut: Date;
}
