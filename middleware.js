// middleware.js
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
// We might not even need NextResponse explicitly if Clerk handles everything.

const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/resume(.*)",
  "/interview(.*)",
  "/ai-cover-letter(.*)",
  "/onboarding(.*)",
]);

export default clerkMiddleware((auth, req) => {
  // The auth object contains an auth().protect() method that will throw a redirect to the sign-in page if the user is not authenticated.
  console.log(`✅ Clerk middleware executing for: ${req.nextUrl.pathname}`);

  if (isProtectedRoute(req)) {
    console.log(`Route ${req.nextUrl.pathname} is protected. Calling auth.protect().`);
    // auth.protect() will throw an error that signals a redirect if the user is not authenticated.
    // If the user IS authenticated, it does nothing, and execution continues.
    // We don't need to explicitly return its result here in many cases.
    auth.protect();

    // If auth.protect() did not throw (meaning user is authenticated for the protected route)
    console.log(`User authenticated for protected route ${req.nextUrl.pathname}. Clerk middleware will allow passage.`);
  } else {
    console.log(`Route ${req.nextUrl.pathname} is not protected. Clerk middleware will allow passage.`);
  }

  // If auth.protect() threw an error, clerkMiddleware should catch it and handle the redirect.
  // If no error was thrown (either not protected, or protected & authenticated),
  // clerkMiddleware should implicitly call NextResponse.next() or allow the request through.
  // No explicit 'return NextResponse.next()' is needed here if relying on default behavior.
});

export const config = {
  matcher: [
    "/((?!\\_next|favicon\\.ico|.*\\.(?:png|jpg|jpeg|svg|css|js|json)).*)",
    "/(api|trpc)(.*)",
  ],
};