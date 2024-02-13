function addCommasToAmount(amountString: string) {
	// Split the amount string into integer and decimal parts
	let [integerPart, decimalPart] = amountString.split(".");

	// Add commas to the integer part
	integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

	// Combine the integer and decimal parts back together with the decimal point
	if (decimalPart === undefined) {
		return integerPart;
	} else {
		return integerPart + "." + decimalPart;
	}
}

export default addCommasToAmount;
