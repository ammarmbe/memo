import { validateRequest } from "@/lib/auth";
import sql from "@/lib/db";
import PusherServer from "pusher";

const pusher = new PusherServer({
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
    "SELECT messages.id AS id, messages.created_at, messages.content, messages.sender_id, messages.receiver_id FROM messages WHERE (messages.sender_id = $1 AND messages.receiver_id = $2) OR (messages.sender_id = $2 AND messages.receiver_id = $1) AND EXTRACT(epoch FROM messages.created_at) < $3 ORDER BY messages.created_at DESC LIMIT 20",
    [user.id, id, new Date(created_at || new Date().toString()).getTime()],
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

  const isFriends = await sql(
    "SELECT * FROM friends WHERE (sender_id = $1 AND receiver_id = $2) OR (sender_id = $2 AND receiver_id = $1)",
    [user.id, receiver_id],
  );

  if (!isFriends.length) {
    return new Response(null, { status: 403 });
  }

  const [message] = await sql(
    "INSERT INTO messages (sender_id, receiver_id, content) VALUES ($1, $2, $3) RETURNING *",
    [user.id, receiver_id, content],
  );

  await pusher.trigger(`${user.id}_${receiver_id}`, "message", {
    ...message,
    username: user.username,
    image_url: user.image_url,
  });

  return new Response(null, { status: 200 });
}
