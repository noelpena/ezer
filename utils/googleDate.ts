function googleDate(inputDate: string) {
	// Parse the input date string
	const inputDateTime = new Date(inputDate);

	// Format the date as MM/DD/YYYY
	const outputDate =
		(inputDateTime.getMonth() + 1).toString().padStart(2, "0") +
		"/" +
		inputDateTime.getDate().toString().padStart(2, "0") +
		"/" +
		inputDateTime.getFullYear();

	return outputDate;
}

export default googleDate;
