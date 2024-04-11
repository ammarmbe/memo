import { validateRequest } from "@/lib/auth";
import sql from "@/lib/db";

export async function GET() {
  const { user } = await validateRequest();

  if (!user) {
    return new Response(null, { status: 401 });
  }

  const data = await sql(
    "SELECT users.username, users.image_url, users.id FROM friends JOIN users ON friends.sender_id = users.id WHERE friends.receiver_id = $1 AND friends.status = 'pending'",
    [user.id],
  );

  return new Response(JSON.stringify(data));
}

export async function POST(req: Request) {
  const {
    username,
    status,
  }: {
    username: string;
    status: "accept" | "ignore" | "send";
  } = await req.json();

  const { user } = await validateRequest();

  if (!user) {
    return new Response(null, { status: 401 });
  }

  const friend = (
    await sql("SELECT id FROM users WHERE username = $1", [username])
  )[0];

  if (!friend) {
    return new Response(null, { status: 404 });
  }

  if (status === "send") {
    await sql(
      "INSERT INTO friends (sender_id, receiver_id, status) VALUES ($1, $2, 'pending')",
      [user.id, friend.id],
    );

    return new Response(null, { status: 201 });
  } else {
    await sql(
      `UPDATE friends SET status = ${status === "accept" ? "'accepted'" : "'ignored'"} WHERE sender_id = $1 AND receiver_id = $2`,
      [friend.id, user.id],
    );

    return new Response(null, { status: 204 });
  }
}
