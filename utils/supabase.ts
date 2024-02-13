import type { Database } from "@/types/database.types";
import {
	createBrowserClient,
	createServerClient,
	type CookieOptions,
	serialize,
} from "@supabase/ssr";
import {
	type GetServerSidePropsContext,
	type NextApiRequest,
	type NextApiResponse,
} from "next/types";

export function createSupabaseFrontendClient() {
	return createBrowserClient<Database>(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
	);
}

export const createSupabaseReqResClient = (
	context: GetServerSidePropsContext
) => {
	return createServerClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
		{
			cookies: {
				get(name: string) {
					return context.req.cookies[name];
				},
				set(name: string, value: string, options: CookieOptions) {
					context.res.appendHeader(
						"Set-Cookie",
						serialize(name, value, options)
					);
				},
				remove(name: string, options: CookieOptions) {
					context.res.appendHeader(
						"Set-Cookie",
						serialize(name, "", options)
					);
				},
			},
		}
	);
};

export const createApiRouteClient = (
	req: NextApiRequest,
	res: NextApiResponse
) => {
	return createServerClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
		{
			cookies: {
				get(name: string) {
					return req.cookies[name];
				},
				set(name: string, value: string, options: CookieOptions) {
					res.appendHeader(
						"Set-Cookie",
						serialize(name, value, options)
					);
				},
				remove(name: string, options: CookieOptions) {
					res.appendHeader(
						"Set-Cookie",
						serialize(name, "", options)
					);
				},
			},
		}
	);
};
