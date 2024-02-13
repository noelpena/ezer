function formatDate(inputDate: string) {
	// Parse the input date string
	var dateObj = new Date(inputDate);

	const year = dateObj.getUTCFullYear();
	const month = (dateObj.getUTCMonth() + 1).toString().padStart(2, "0"); // Months are zero-indexed
	const day = dateObj.getUTCDate().toString().padStart(2, "0");

	// Return formatted date string
	return month + "/" + day + "/" + year;
}

export default formatDate;
