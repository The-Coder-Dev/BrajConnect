import { NextResponse, type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;
    
    // Define protected and auth routes
    const isProtected = pathname.startsWith("/dashboard") || pathname.startsWith("/setup");
    const isAuthRoute = pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up");

    // Only fetch session if we are on a route that requires checking
    if (isProtected || isAuthRoute) {
        try {
            // Fetch session from better-auth API
            const response = await fetch(new URL("/api/auth/get-session", request.url).toString(), {
                headers: {
                    cookie: request.headers.get("cookie") || "",
                },
            });
            
            const session = response.ok ? await response.json() : null;

            // Redirect unauthenticated users to sign-in
            if (isProtected && !session) {
                return NextResponse.redirect(new URL("/sign-in", request.url));
            }

            // Redirect authenticated users away from sign-in/sign-up
            if (isAuthRoute && session) {
                return NextResponse.redirect(new URL("/dashboard", request.url));
            }
        } catch (error) {
            console.error("Middleware session fetch error:", error);
            // On fetch failure, fail safely by redirecting to sign-in if accessing protected route
            if (isProtected) {
                return NextResponse.redirect(new URL("/sign-in", request.url));
            }
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard/:path*", "/setup/:path*", "/sign-in", "/sign-up"]
};
