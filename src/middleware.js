export default function middleware(req, event) {
  // Here should me middleware logic
  return;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
