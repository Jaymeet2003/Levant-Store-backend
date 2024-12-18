import { auth } from "@/auth";
import { AuthRoutes, DefaultRedirectRoute } from "./lib/routes";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const { nextUrl } = req;

  if (isLoggedIn && AuthRoutes.includes(nextUrl.pathname)) {
    return Response.redirect(new URL(DefaultRedirectRoute, nextUrl));
  } else if (!isLoggedIn && !AuthRoutes.includes(nextUrl.pathname)) {
    return Response.redirect(new URL("/login", nextUrl));
  }
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
