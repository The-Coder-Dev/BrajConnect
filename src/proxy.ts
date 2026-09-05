import { NextResponse, type NextRequest } from "next/server";
import { auth } from "@/lib/auth";

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Define protected and auth routes
    const isFranchiseProtected = pathname.startsWith("/franchise/dashboard") || 
                                 pathname.startsWith("/franchise/applications") || 
                                 pathname.startsWith("/franchise/profile");
    const isProtected = pathname.startsWith("/dashboard") || 
                        pathname.startsWith("/setup") || 
                        pathname.startsWith("/admin") || 
                        isFranchiseProtected;
    const isAuthRoute = pathname.startsWith("/sign-in") || 
                        pathname.startsWith("/sign-up") || 
                        pathname.startsWith("/login/franchise") || 
                        pathname.startsWith("/register/franchise");

    // Only look up the session if the route actually needs it
    if (isProtected || isAuthRoute) {
        try {
            // Direct in-process call — no internal HTTP round-trip.
            // auth.api.getSession reads the cookie from the request headers
            // and validates the session token against the DB (or cookie cache).
            const session = await auth.api.getSession({
                headers: request.headers,
            });

            // Redirect unauthenticated users
            if (isProtected && !session) {
                const loginRedirect = isFranchiseProtected ? "/login/franchise" : "/sign-in";
                return NextResponse.redirect(new URL(loginRedirect, request.url));
            }

            // Role guard for Franchise Portal routes: only franchise_partner allowed
            if (isFranchiseProtected && session) {
                const role = (session.user as { role?: string })?.role;
                if (role !== "franchise_partner") {
                    const fallback = role === "admin" ? "/admin" : "/dashboard";
                    return NextResponse.redirect(new URL(fallback, request.url));
                }
            }

            // Redirect authenticated users away from sign-in/sign-up/login/register (GET direct navigation only)
            // DO NOT intercept Server Actions or POST requests!
            const isServerActionOrApi = request.method !== "GET" || request.headers.has("next-action") || request.headers.has("rsc");
            if (isAuthRoute && session && !isServerActionOrApi) {
                const role = (session.user as { role?: string })?.role;
                let targetUrl = "/dashboard";
                if (role === "admin") {
                    targetUrl = "/admin";
                } else if (role === "franchise_partner") {
                    targetUrl = "/franchise/dashboard";
                }
                return NextResponse.redirect(new URL(targetUrl, request.url));
            }
        } catch (error) {
            console.error("Middleware session error:", error);
            // Fail safely: redirect to sign-in if accessing a protected route
            if (isProtected) {
                const loginRedirect = isFranchiseProtected ? "/login/franchise" : "/sign-in";
                return NextResponse.redirect(new URL(loginRedirect, request.url));
            }
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/dashboard/:path*", 
        "/admin/:path*", 
        "/setup/:path*", 
        "/franchise/dashboard/:path*",
        "/franchise/applications/:path*",
        "/franchise/profile/:path*",
        "/sign-in", 
        "/sign-up",
        "/login/franchise",
        "/register/franchise"
    ],
};
