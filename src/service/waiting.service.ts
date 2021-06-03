import Waiting from "@entities/waiting.entity";
import CardRepository from "@repository/card.repository";
import UserRepository from "@repository/user.repository";
import WaitingRepository from "@repository/wating.repsoitory";
import { getRepo } from "src/lib/util";

export class WaitingService {
	private static instance: WaitingService;

	constructor() {
	}

	static get service() {
		if (!WaitingService.instance) {
			WaitingService.instance = new WaitingService();
		}
		return WaitingService.instance;
	}

	async create(id: number, type: number) {
		const waitingRepo = getRepo(WaitingRepository);
		const userRepo = getRepo(UserRepository);

		const user = await userRepo.findOne(id);
		const exist = await waitingRepo.find({
			relations: [ 'user' ],
			where: { user: { _id: id }, deleteType: null }
		});
		if (exist.length > 0) throw "new BadRequestException";
		const waiting = new Waiting(user, type);
		waitingRepo.save(waiting);
	}

	async mailer(userId: number, timeOut: Date) {
		const userRepo = getRepo(UserRepository);
		const user = await userRepo.findOne(userId);
		const email = user.getEmail();
		const date = timeOut.toLocaleTimeString();
		// await this.mailerService
		//   .sendMail({
		//     to: email, // list of receivers
		//     from: '42checkin@gmail.com', // sender address
		//     subject: '이제 입장하실 수 있습니다.', // Subject line
		//     template: 'waitingMail', // HTML body content
		//     context: {
		//       timeOut: date,
		//     },
		//   })
		//   .then(() => {})
		//   .catch(() => {});
	}

	async wait(order: number, type: number) {
		const waitingRepo = getRepo(WaitingRepository);
		if (order < 0) throw "new BadRequestException";
		const waiting = await waitingRepo.find({
			where: { deleteType: null, type: type },
			order: { deletedAt: 'ASC' }
		});
		if (!waiting) return;
		if (waiting.length < order) return;

		waiting[order].setTimeOut();
		await this.mailer(waiting[order].getUserId(), waiting[order].getTimeOut());
		await waitingRepo.save(waiting[order]);

		setTimeout(() => {
			this.next(waiting[order]);
		}, 1000 * 60 * 1)
	}

	// @Timeout(1000 * 60 * 1)
	async next(waiting: Waiting) {
		const cardRepo = getRepo(CardRepository);
		if (await this.delete(waiting.getId(), 'timeOut')) {
			const usingCard = (await cardRepo.find({
				where: { using: true, type: waiting.getType() }
			})).length;
			this.wait(149 - usingCard, waiting.getType());
		}
	}

	async getWaitingInfo() {
		const gaepo = await this.waitingList(0);
		const seocho = await this.waitingList(1);
		return { gaepo: gaepo.length, seocho: seocho.length };
	}

	async waitingList(type: number) {
		const waitingRepo = getRepo(WaitingRepository);
		return await waitingRepo.find({
			where: { type: type, deleteType: null }
		});
	}

	async waitNum(id: number, type: number) {
		const waitingList = await this.waitingList(type);
		const num = waitingList.findIndex((ele, index) => {
			return ele.getUserId() === id;
		});
		return num + 1;
	}

	async isWaiting(id: number) {
		const waitingRepo = getRepo(WaitingRepository);
		const waiting = await waitingRepo.find({
			where: { user: { _id: id }, deleteType: null }
		});
		return waiting[0];
	}

	async delete(id: number, type: string) {
		const waitingRepo = getRepo(WaitingRepository);
		const waiting = await waitingRepo.findOne({
			where: { waitingId: id, deleteType: null }
		});
		if (!waiting && type == 'timeOut') return false;
		else if (!waiting) throw "new NotFoundException";
		waiting.setDeleted(type);
		await waitingRepo.save(waiting);
		return true;
	}

	async cancel(id: number) {
		const waitingRepo = getRepo(WaitingRepository);
		const waiting = await waitingRepo.findOne({
			relations: [ 'user' ],
			where: { user: { _id: id }, deleteType: null }
		});
		if (!waiting) throw "new NotFoundException";
		this.delete(waiting.getId(), 'cancel');
	}
}
