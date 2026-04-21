export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/fleet/:path*",
    "/benefits/:path*",
    "/analytics/:path*",
    "/incentives/:path*",
    "/users/:path*",
    "/settings/:path*",
    "/customers/:path*",
    "/admin/:path*"
  ]
};
