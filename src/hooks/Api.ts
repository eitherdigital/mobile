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

async function getLastReleases() {
	const user = getUser();
	if (!user) return { error: "not auth" };

	const { data: res } = await axios.get(
		`https://api.either.digital/admin/get_releases?type=ok&limit=5`,
		{
			headers: {
				authorization: `Bearer ${user.accessToken}`,
			},
		}
	);

	return res;
}

async function deleteRelease(id: number) {
	const user = getUser();
	if (!user) return { error: "not auth" };

	const { data: res } = await axios.post(
		`https://api.either.digital/user/delete_release`,
		{ id: id },
		{
			headers: {
				authorization: `Bearer ${user.accessToken}`,
			},
		}
	);

	return res;
}

export { getNews, getLastReleases, deleteRelease };
