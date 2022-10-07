import axios from "axios";

interface UserData {
	id: number;
	accessToken: string;
	email: string;
	isLabel: number;
	isSubkabinet: number;
	name: string;
	username: string;
	status: string;
}

const Store = window.localStorage;

function setAuth(user: UserData) {
	Store.setItem(
		"auth-data",
		JSON.stringify({
			id: user.id,
			accessToken: user.accessToken,
			email: user.email,
			isLabel: user.isLabel,
			isSubkabinet: user.isSubkabinet,
			name: user.name,
			username: user.username,
			status: user.status,
		})
	);
}

function getUser() {
	const data = Store.getItem("auth-data");

	if (!data) {
		return null;
	} else {
		let userData: UserData = JSON.parse(data);
		return userData;
	}
}

function logout() {
	Store.clear();
}

async function getAuth() {
	const user = getUser();

	if (!user) {
		return false;
	}

	try {
		const { data: res } = await axios.get(
			`https://api.either.digital/user/profile_info`,
			{
				headers: {
					authorization: `Bearer ${user.accessToken}`,
				},
			}
		);

		if (res.error !== false) {
			logout();
			return false;
		}

		return true;
	} catch {
		logout();
		return false;
	}
}

async function login(email: string, password: string) {
	try {
		const { data: res } = await axios.post(
			"https://api.either.digital/auth/login",
			{
				email: email,
				password: password,
			}
		);

		if (!res.token) return { error: "bad login or pass" };

		const { data: user } = await axios.get(
			`https://api.either.digital/user/profile_info`,
			{
				headers: {
					authorization: `Bearer ${res.token}`,
				},
			}
		);

		if (user.error !== false) return { error: `${user.error}` };

		let userData: UserData = {
			id: user.user.id,
			accessToken: res.token,
			name: user.user.name,
			email: user.user.email,
			isLabel: user.user.isLabel,
			isSubkabinet: user.user.isSubkabinet,
			username: user.user.username,
			status: user.user.status,
		};

		setAuth(userData);

		return { error: false };
	} catch (e) {
		return { error: `${e}` };
	}
}

async function updateAuth() {
	const user = getUser();
	if (!user) {
		logout();
		return { error: "not auth" };
	}

	try {
		const { data: res } = await axios.get(
			`https://api.either.digital/user/profile_info`,
			{
				headers: {
					authorization: `Bearer ${user.accessToken}`,
				},
			}
		);

		if (res.error !== false) {
			logout();
			return { error: true };
		}

		let userData: UserData = {
			id: res.user.id,
			accessToken: user.accessToken,
			name: res.user.name,
			email: res.user.email,
			isLabel: res.user.isLabel,
			isSubkabinet: res.user.isSubkabinet,
			username: res.user.username,
			status: res.user.status,
		};

		setAuth(userData);

		return { error: false };
	} catch {
		logout();
		return { error: true };
	}
}

export type { UserData };
export { getAuth, getUser, setAuth, logout, login, updateAuth };
