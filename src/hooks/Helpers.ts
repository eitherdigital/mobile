function openLink(link: string) {
	let a = document.createElement("a");
	a.target = "_blank";
	a.href = link;
	a.click();
}

const getInitials = (name: string) => {
	const [firstName, lastName] = name.split(" ");
	return firstName && lastName
		? `${firstName.charAt(0)}${lastName.charAt(0)}`
		: firstName.charAt(0);
};

export { openLink, getInitials };
