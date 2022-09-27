function getTheme() {
	let theme: "dark" | "light" = "light";
	if (
		window.matchMedia &&
		window.matchMedia("(prefers-color-scheme: dark)").matches
	) {
		theme = "dark";
	}
	if (window.localStorage.getItem("defaultDark")) {
		theme = "dark";
	}
	return theme;
}

export { getTheme };
