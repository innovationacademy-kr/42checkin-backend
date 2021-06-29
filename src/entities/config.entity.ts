
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('config')
export default class Config {
  constructor() {
  }

  @Column({ default: false })
  private maxCapacity: number;

  @PrimaryGeneratedColumn()
  private env: string;

  public getMaxCapacity() {
    return this.maxCapacity;
  }

  public getEnv() {
    return this.env;
  }

  public setCapacity(maxCapacity: number) {
    return this.maxCapacity = maxCapacity;
  }
}
