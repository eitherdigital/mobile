function getTheme() {
	let theme: "dark" | "light" = "light";
	if (
		window.matchMedia &&
		window.matchMedia("(prefers-color-scheme: dark)").matches
	) {
		theme = "dark";
	}

	const headers = new Headers();

	if (headers.get("app-theme")) {
		theme = headers.get("app-theme") as "dark" | "light";
	}

	return theme;
}

export { getTheme };
