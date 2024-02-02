function formatDate(inputDate: string) {
	// Parse the input date string
	var dateObj = new Date(inputDate);

	// Extract year, month, and day
	var year = dateObj.getFullYear();
	var month = (dateObj.getMonth() + 1).toString().padStart(2, "0"); // Months are zero-indexed
	var day = dateObj.getDate().toString().padStart(2, "0");

	// Return formatted date string
	return month + "/" + day + "/" + year;
}

export default formatDate;
