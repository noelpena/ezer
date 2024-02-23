import type { Database } from "@/types/database.types";
import {
	createBrowserClient,
	createServerClient,
	type CookieOptions,
	serialize,
} from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";
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
	return createServerClient<Database>(
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

export async function updateSession(req: NextRequest) {
	let res = NextResponse.next({
		request: {
			headers: req.headers,
		},
	});

	const supabase = createServerClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
		{
			cookies: {
				get(name: string) {
					return req.cookies.get(name)?.value; //[name];
				},
				set(name: string, value: string, options: CookieOptions) {
					req.cookies.set({
						name,
						value,
						...options,
					});
					res = NextResponse.next({
						request: {
							headers: req.headers,
						},
					});
					res.cookies.set({
						name,
						value,
						...options,
					});

					// res.appendHeader(
					// 	"Set-Cookie",
					// 	serialize(name, value, options)
					// );
				},
				remove(name: string, options: CookieOptions) {
					req.cookies.set({
						name,
						value: "",
						...options,
					});
					res = NextResponse.next({
						request: {
							headers: req.headers,
						},
					});
					res.cookies.set({
						name,
						value: "",
						...options,
					});
				},
			},
		}
	);

	const { data, error } = await supabase.auth.getUser();
	if ((error || !data) && req.nextUrl.pathname != "/") {
		const url = new URL("/", req.url);

		return NextResponse.redirect(url);
	}

	return res;
}
