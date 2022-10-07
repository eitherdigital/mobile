export type SettingsType = {
	apiType: "admin" | "user";
};

const Store = window.localStorage;

function getSettings() {
	const settings = Store.getItem("settings");
	if (!settings) {
		Store.setItem("settings", JSON.stringify({ apiType: "user" }));
		return { apiType: "user" };
	}

	return JSON.parse(settings) as SettingsType;
}

function setApiType(value: "admin" | "user") {
	let settings = getSettings();

	settings.apiType = value;
	Store.setItem("settings", JSON.stringify(settings));
	return settings;
}

export { getSettings, setApiType };
