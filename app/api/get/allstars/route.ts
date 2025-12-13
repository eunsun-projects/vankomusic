import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET() {
	const supabase = await createClient();
	const { data: stars, error } = await supabase.from("stars").select("*");

	if (error) {
		return NextResponse.json({ error: error.message }, { status: 500 });
	}

	if (!stars) {
		return NextResponse.json({ error: "No stars found" }, { status: 404 });
	}

	const starsWithoutCredentials = stars.map((star) => {
		return {
			id: star.id,
			power: star.power,
			created_at: star.created_at,
			updated_at: star.updated_at,
			color: star.color,
			positions: star.positions,
			last_touched_at: star.last_touched_at,
		};
	});

	return NextResponse.json(starsWithoutCredentials, { status: 200 });
}
