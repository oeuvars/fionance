import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth-server";

export async function middleware(request: NextRequest) {
  // Skip auth check for public routes
  const publicRoutes = ['/api/auth', '/sign-in', '/sign-up'];
  const isPublicRoute = publicRoutes.some(route => request.nextUrl.pathname.startsWith(route));
  
  if (isPublicRoute) {
    return NextResponse.next();
  }

  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (!session) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
