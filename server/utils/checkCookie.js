import { getHashByLogin } from "./getHashByLogin";

const checkCookie = async (req) => {
    const { hash, login } = req.cookies;
	return !(!hash || !login || await getHashByLogin(login) != hash);
}
export default checkCookie;