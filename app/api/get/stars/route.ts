import type { PostgrestError } from "@supabase/supabase-js";
import { type NextRequest, NextResponse } from "next/server";
import type { StarFromSupabase } from "@/types/projects.type";
import { createClient } from "@/utils/supabase/server";

export async function GET(request: NextRequest) {
	const supabase = await createClient();
	const searchParams = request.nextUrl.searchParams;
	const email = searchParams.get("email");

	if (!email) {
		return NextResponse.json({ error: "Email is required" }, { status: 400 });
	}

	const {
		data: star,
		error,
	}: { data: StarFromSupabase | null; error: PostgrestError | null } =
		await supabase.from("stars").select("*").eq("user_email", email).single();

	if (error) {
		return NextResponse.json({ error: error.message }, { status: 500 });
	}

	if (!star) {
		return NextResponse.json({ message: "Stars not found" }, { status: 200 });
	}

	return NextResponse.json(star, { status: 200 });
}
