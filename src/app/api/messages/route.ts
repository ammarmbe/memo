import { validateRequest } from "@/lib/auth";
import sql from "@/lib/db";
import PusherServer from "pusher";

export const pusher = new PusherServer({
  appId: process.env.PUSHER_APP_ID as string,
  cluster: "eu",
  key: process.env.NEXT_PUBLIC_PUSHER_KEY as string,
  secret: process.env.PUSHER_SECRET as string,
  useTLS: true,
});

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const created_at = searchParams.get("created_at");
  const id = searchParams.get("id");

  const { user } = await validateRequest();

  if (!user) {
    return new Response(null, { status: 401 });
  }

  const data = await sql(
    "SELECT messages.id AS id, messages.created_at, messages.content, messages.sender_id, messages.receiver_id FROM messages WHERE (messages.sender_id = $1 AND messages.receiver_id = $2) OR (messages.sender_id = $2 AND messages.receiver_id = $1) AND messages.created_at < $3::timestamp ORDER BY messages.created_at DESC LIMIT 20",
    [user.id, id, created_at],
  );

  return new Response(JSON.stringify(data));
}

export async function POST(req: Request) {
  const { user } = await validateRequest();

  if (!user) {
    return new Response(null, { status: 401 });
  }

  const { receiver_id, content } = await req.json();

  if (!receiver_id || !content) {
    return new Response(null, { status: 400 });
  }

  const [message] = await sql(
    "INSERT INTO messages (sender_id, receiver_id, content) VALUES ($1, $2, $3) RETURNING *",
    [user.id, receiver_id, content],
  );

  await pusher.trigger(`${user.id}_${receiver_id}`, "message", message);

  return new Response(null, { status: 200 });
}
