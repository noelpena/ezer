import "@/styles/globals.css";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "@mantine/notifications/styles.css";

import type { AppProps } from "next/app";
import { createTheme, MantineProvider } from "@mantine/core";

import { Notifications } from "@mantine/notifications";

const theme = createTheme({
	/** Your theme override here */
});
export default function App({ Component, pageProps }: AppProps) {
	return (
		<MantineProvider>
			<Notifications position="top-right" zIndex={1000} />
			<Component {...pageProps} />
		</MantineProvider>
	);
}
