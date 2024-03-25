function formatDate(inputDate: string) {
	// Parse the input date string
	const dateObj = new Date(inputDate);

	// // Check if the input is a valid date
	if (isNaN(dateObj.getTime())) {
		// Handle the case where the input is not a valid date
		return "Invalid Date";
	}

	// // Format the date as mm/dd/yyyy
	const month = String(dateObj.getMonth() + 1).padStart(2, "0");
	const day = String(dateObj.getDate()).padStart(2, "0");
	const year = dateObj.getFullYear();

	return `${month}/${day}/${year}`;
}

export default formatDate;
