import { getConnection, ObjectType } from 'typeorm';

export const isError = (e: any) => {
 return e && e.stack && e.message;
}

export const getRepo = <T>(repo: ObjectType<T>) => {
	return getConnection().getCustomRepository<T>(repo) ;
}