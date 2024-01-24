function capitalize(str: string) {
	return str !== null && typeof str !== "undefined"
		? str.charAt(0).toUpperCase() + str.slice(1)
		: "";
}

export default capitalize;
