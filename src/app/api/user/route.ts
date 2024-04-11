import { validateRequest } from "@/lib/auth";
import sql from "@/lib/db";

export async function GET() {
  return new Response(JSON.stringify((await validateRequest()).user));
}

export async function PATCH(req: Request) {
  const { user } = await validateRequest();
  const { username } = await req.json();

  if (!user) {
    return new Response(null, { status: 401 });
  }

  if (username) {
    try {
      await sql("UPDATE users SET username = $1 WHERE id = $2", [
        username,
        user.id,
      ]);
    } catch (e) {
      return new Response(null, { status: 409 });
    }
  }

  return new Response(null, { status: 200 });
}
