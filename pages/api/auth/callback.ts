import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { createSupabaseReqResClient } from "@/utils/supabase";

const handler: NextApiHandler = async (req, res) => {
	const { code } = req.query;
	if (code) {
		const supabase = createSupabaseReqResClient(undefined, {
			request: req,
			response: res,
		});
		await supabase.auth.exchangeCodeForSession(String(code));
	}

	res.redirect("/");
};

export default handler;
