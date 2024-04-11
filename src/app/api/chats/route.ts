import { validateRequest } from "@/lib/auth";
import sql from "@/lib/db";

export async function GET() {
  const { user } = await validateRequest();

  if (!user) {
    return new Response(null, { status: 401 });
  }

  const data = await sql(
    "SELECT users.username, users.image_url, users.id, friends.created_at, (SELECT content FROM messages WHERE ((receiver_id = $1 AND sender_id = users.id) OR (sender_id = $1 AND receiver_id = users.id)) ORDER BY created_at DESC LIMIT 1) AS message FROM friends JOIN users ON (CASE WHEN friends.receiver_id = $1 THEN friends.sender_id ELSE friends.receiver_id END) = users.id WHERE (friends.receiver_id = $1 OR friends.sender_id = $1) AND friends.status = 'accepted'",
    [user.id],
  );

  return new Response(JSON.stringify(data));
}
