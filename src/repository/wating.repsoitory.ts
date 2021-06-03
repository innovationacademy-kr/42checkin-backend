import { EntityRepository, Repository } from 'typeorm';
import Waiting from '@entities/waiting.entity';

@EntityRepository(Waiting)
export default class WaitingRepository extends Repository<Waiting> {
	findByName(firstName: string, lastName: string) {
      		return this.createQueryBuilder("user")
              .where("user.firstName = :firstName", {firstName})
              .andWhere("user.lastName = :lastName", {lastName})
              .getMany();
	}
}
