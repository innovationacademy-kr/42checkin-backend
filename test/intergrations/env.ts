import { Users } from "../../src/models/users"
import { getAuth } from "../../src/service/auth.service";

export const getCookie = async () => {
    const user = await Users.findOne({ where: { login: 'yurlee' } })
    const { token } = await getAuth(user);
    return `w_auth_local=${token}`
}