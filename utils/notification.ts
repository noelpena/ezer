import { notifications } from "@mantine/notifications";

export const showToast = (
	id: string,
	title: string,
	message: string,
	color: string = "blue",
	loading: boolean = false,
	autoClose: boolean | number = 10000
) => {
	notifications.show({
		id,
		title,
		message,
		autoClose,
		loading,
		withCloseButton: true,
		color,
	});
};

export const updateToast = (
	id: string,
	title: string,
	message: string,
	color: string = "blue",
	loading: boolean = false,
	autoClose: boolean | number = 10000
) => {
	notifications.update({
		id,
		title,
		message,
		autoClose,
		loading,
		withCloseButton: true,
		color,
	});
};
