import axios from "axios";
import { getUser } from "./Auth";

async function getNews() {
	const user = getUser();
	if (!user) return { error: "not auth" };

	const { data: res } = await axios.get(
		`https://api.either.digital/user/get_news`,
		{
			headers: {
				authorization: `Bearer ${user.accessToken}`,
			},
		}
	);

	return res;
}

export { getNews };
