import { NextResponse, NextRequest } from "next/server";
import { createSupabaseReqResClient } from "./utils/supabase";

export async function middleware(req: NextRequest) {
	const res = NextResponse.next();

	// const supabase = createSupabaseReqResClient(req, res);

	// const sesh = await supabase.auth.getSession();
	// console.log("sesh", sesh);

	return res;
}
