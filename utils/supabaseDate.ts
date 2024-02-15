export default function formatDate(inputDate: Date) {
	// Extract year, month, and day from the input date
	var year = inputDate.getFullYear();
	var month = (inputDate.getMonth() + 1).toString().padStart(2, "0");
	var day = inputDate.getDate().toString().padStart(2, "0");

	// Format the date into "YYYY-MM-DDT00:00:00"
	var formattedDate = year + "-" + month + "-" + day + "T00:00:00";

	return formattedDate;
}
