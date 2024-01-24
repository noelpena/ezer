import type { Database } from "@/types/database.types";
import { createBrowserClient, createServerClient } from "@supabase/ssr";
import { getCookie, setCookie } from "cookies-next";
import { NextRequest, NextResponse } from "next/server";
import {
	GetServerSidePropsContext,
	NextApiRequest,
	NextApiResponse,
} from "next/types";

export function createSupabaseFrontendClient() {
	return createBrowserClient<Database>(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
	);
}

type ReqRes =
	| {
			request: NextApiRequest;
			response: NextApiResponse;
	  }
	| undefined;

export const createSupabaseReqResClient = (
	context: GetServerSidePropsContext | undefined,
	ReqResObj: ReqRes = undefined
) => {
	let req: any,
		res: any = null;

	if (context) {
		req = context.req;
		res = context.res;
	} else {
		req = ReqResObj?.request;
		res = ReqResObj?.response;
	}

	return createServerClient<Database>(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
		{
			cookies: {
				get(name) {
					return getCookie(name, { req, res });
				},
				set(name, value, options) {
					setCookie(name, value, { req, res, ...options });
				},
				remove(name, options) {
					setCookie(name, "", { req, res, ...options });
				},
			},
		}
	);
};
