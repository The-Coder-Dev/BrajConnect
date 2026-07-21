import { NextResponse, type NextRequest } from "next/server";
import { auth } from "@/lib/auth";

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Define protected and auth routes
    const isProtected = pathname.startsWith("/dashboard") || pathname.startsWith("/setup");
    const isAuthRoute = pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up");

    // Only look up the session if the route actually needs it
    if (isProtected || isAuthRoute) {
        try {
            // Direct in-process call — no internal HTTP round-trip.
            // auth.api.getSession reads the cookie from the request headers
            // and validates the session token against the DB (or cookie cache).
            const session = await auth.api.getSession({
                headers: request.headers,
            });

            // Redirect unauthenticated users to sign-in
            if (isProtected && !session) {
                return NextResponse.redirect(new URL("/sign-in", request.url));
            }

            // Redirect authenticated users away from sign-in/sign-up
            if (isAuthRoute && session) {
                return NextResponse.redirect(new URL("/dashboard", request.url));
            }
        } catch (error) {
            console.error("Middleware session error:", error);
            // Fail safely: redirect to sign-in if accessing a protected route
            if (isProtected) {
                return NextResponse.redirect(new URL("/sign-in", request.url));
            }
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard/:path*", "/setup/:path*", "/sign-in", "/sign-up"],
};
