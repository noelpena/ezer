import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { createTheme, MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";

import { Notifications } from "@mantine/notifications";

const theme = createTheme({
	/** Your theme override here */
});
export default function App({ Component, pageProps }: AppProps) {
	return (
		<MantineProvider theme={theme}>
			<Notifications position="top-right" zIndex={2077} />
			<Component {...pageProps} />;
		</MantineProvider>
	);
}
