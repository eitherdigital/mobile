function getTheme() {
	let theme: "dark" | "light" = "light";
	if (
		window.matchMedia &&
		window.matchMedia("(prefers-color-scheme: dark)").matches
	) {
		theme = "dark";
	}

	const appTheme = window.localStorage.getItem("app-theme");
	if (appTheme === "light" || appTheme === "dark") {
		theme = appTheme;
	}

	return theme;
}

export { getTheme };
