import { validateRequest, lucia } from "@/lib/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function GET() {
  const { session } = await validateRequest();

  if (!session) {
    return new Response(null, {
      status: 401,
    });
  }

  await lucia.invalidateSession(session.id);

  const sessionCookie = lucia.createBlankSessionCookie();
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  );

  return redirect("/sign-in");
}
