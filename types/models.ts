import type { Database, Tables } from "@/types/database.types";
import { PostgrestSingleResponse } from "@supabase/supabase-js";

export type Department = Tables<"departments">;

export type Deposit = Tables<"deposits">;

export type Category = Tables<"categories">;

export type Member = Tables<"members">;

export type Record = Tables<"records">;

export type GoogleSheetView =
	Database["public"]["Views"]["googlesheetview"]["Row"];

export type Supabase_Response<T> = PostgrestSingleResponse<T[]>;
