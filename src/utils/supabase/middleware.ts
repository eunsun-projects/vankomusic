import { type CookieOptions, createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

export async function updateSession(request: NextRequest) {
	const requestHeaders = new Headers(request.headers);

	let supabaseResponse = NextResponse.next({
		request,
	});

	const supabase = createServerClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
		{
			cookies: {
				getAll() {
					return request.cookies.getAll();
				},
				setAll(
					cookiesToSet: {
						name: string;
						value: string;
						options: CookieOptions;
					}[],
				) {
					for (const { name, value, options } of cookiesToSet) {
						request.cookies.set(name, value);
					}
					supabaseResponse = NextResponse.next({
						request,
					});
					for (const { name, value, options } of cookiesToSet) {
						supabaseResponse.cookies.set(name, value, options);
					}
				},
			},
		},
	);

	const {
		data: { user },
	} = await supabase.auth.getUser();

	// console.log('user from middleware  ======>', user);

	// if (
	//   !user &&
	//   request.nextUrl.pathname !== '/' &&
	//   !request.nextUrl.pathname.startsWith('/vankoadmin') &&
	//   !request.nextUrl.pathname.startsWith('/api')
	// ) {
	//   // no user, potentially respond by redirecting the user to the login page
	//   const url = request.nextUrl.clone();
	//   url.pathname = '/vankoadmin';
	//   return NextResponse.redirect(url);
	// }

	if (user) {
		requestHeaders.set("x-user", user.id);
		// 헤더에 유저 정보(x-user)로 담아서 새로운 응답 객체 생성
		supabaseResponse = NextResponse.next({
			request: {
				headers: requestHeaders,
			},
		});
	}

	return supabaseResponse;
}
