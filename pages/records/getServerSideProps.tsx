// import { GetServerSidePropsContext } from "next/types";
// import { createSupabaseReqResClient } from "@/utils/supabase";

// export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
// 	const supabase = createSupabaseReqResClient<Database>(ctx);

// 	try {
// 		const [departmentRes] = await Promise.all([
// 			supabase.from("departments").select("*"),
// 		]);
// 		const { data: dept_data, error: dept_error } = departmentRes;
// 		return {
// 			props: { dept_data },
// 		};
// 	} catch (error) {
// 		console.error(
// 			"An error occurred while fetching data from the database:",
// 			error
// 		);

// 		return {
// 			props: {
// 				error: "An error occurred while fetching data from the database.",
// 			},
// 		};
// 	}
// };
