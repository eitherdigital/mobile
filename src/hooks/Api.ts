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
		`https://api.either.digital/user/get_releases?type=ok&limit=5`,
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

async function getReleases() {
	const user = getUser();
	if (!user) return { error: "not auth" };

	const { data: res } = await axios.get(
		`https://api.either.digital/user/get_releases?type=ok`,
		{
			headers: {
				authorization: `Bearer ${user.accessToken}`,
			},
		}
	);

	return res;
}

async function getModeration() {
	const user = getUser();
	if (!user) return { error: "not auth" };

	const { data: res } = await axios.get(
		`https://api.either.digital/user/get_releases?type=moderation`,
		{
			headers: {
				authorization: `Bearer ${user.accessToken}`,
			},
		}
	);

	return res;
}

async function getReports() {
	const user = getUser();
	if (!user) return { error: "not auth" };

	const { data: res } = await axios.get(
		`https://api.either.digital/user/get_reports`,
		{
			headers: {
				authorization: `Bearer ${user.accessToken}`,
			},
		}
	);

	return res;
}

async function getStreams(id?: string) {
	const user = getUser();
	if (!user) return { error: "not auth" };

	const { data: res } = await axios.get(
		id
			? `https://api.either.digital/user/get_release_analytics?id=${id}`
			: `https://api.either.digital/user/get_all_streams`,
		{
			headers: {
				authorization: `Bearer ${user.accessToken}`,
			},
		}
	);

	return id
		? {
				error: res.error,
				all_streams: res.analytics[0]?.all_streams || 0,
				pay_streams: res.analytics[0]?.pay_streams || 0,
		  }
		: res;
}

async function getDateStreams(id?: string) {
	const user = getUser();
	if (!user) return { error: "not auth" };

	const { data: res } = await axios.get(
		id
			? `https://api.either.digital/user/get_release_date_streams?id=${id}`
			: `https://api.either.digital/user/get_date_streams`,
		{
			headers: {
				authorization: `Bearer ${user.accessToken}`,
			},
		}
	);

	return res;
}

async function getTopReleases(id?: string) {
	const user = getUser();
	if (!user) return { error: "not auth" };

	const { data: res } = await axios.get(
		id
			? `https://api.either.digital/user/get_release_analytics?id=${id}`
			: `https://api.either.digital/user/get_analytics`,
		{
			headers: {
				authorization: `Bearer ${user.accessToken}`,
			},
		}
	);

	return res;
}

async function getSubaccounts() {
	const user = getUser();
	if (!user) return { error: "not auth" };
	if (user.isSubkabinet) return { error: 403 };

	const { data: res } = await axios.get(
		"https://api.either.digital/user/get_users",
		{
			headers: {
				authorization: `Bearer ${user.accessToken}`,
			},
		}
	);

	return res;
}

async function deleteSubaccount(id: number) {
	const user = getUser();
	if (!user) return { error: "not auth" };

	const { data: res } = await axios.post(
		`https://api.either.digital/user/delete_user`,
		{ id: id },
		{
			headers: {
				authorization: `Bearer ${user.accessToken}`,
			},
		}
	);

	return res;
}

async function createSubaccount(
	name: string,
	username: string,
	email: string,
	copyrights: string
) {
	const user = getUser();
	if (!user) return { error: "not auth" };

	const { data: res } = await axios.post(
		`https://api.either.digital/user/create_user`,
		{
			name: name,
			username: username,
			email: email,
			copyrights: copyrights,
		},
		{
			headers: {
				authorization: `Bearer ${user.accessToken}`,
			},
		}
	);

	return res;
}

async function changePassword(password: string) {
	const user = getUser();
	if (!user) return { error: "not auth" };

	const { data: res } = await axios.post(
		`https://api.either.digital/user/edit_profile`,
		{
			name: user.name,
			email: user.email,
			password: password,
		},
		{
			headers: {
				authorization: `Bearer ${user.accessToken}`,
			},
		}
	);

	return res;
}

async function getPromoLink(upc: string) {
	const user = getUser();
	if (!user) return { error: "not auth" };

	const { data: links } = await axios.get(
		`https://api.either.digital/user/get_links`,
		{
			headers: {
				authorization: `Bearer ${user.accessToken}`,
			},
		}
	);

	let linkUrl: string | null = null;
	for (const link of links.links) {
		if (link.release.upc === upc)
			linkUrl = `https://either.fun/${link.link.token}`;
	}

	return linkUrl;
}

export {
	getNews,
	getLastReleases,
	deleteRelease,
	getReleases,
	getModeration,
	getReports,
	getStreams,
	getDateStreams,
	getTopReleases,
	getSubaccounts,
	deleteSubaccount,
	createSubaccount,
	changePassword,
	getPromoLink,
};
