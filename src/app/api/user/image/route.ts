import { validateRequest } from "@/lib/auth";
import sql from "@/lib/db";
import { BlobServiceClient } from "@azure/storage-blob";

export async function POST(req: Request) {
  const { user } = await validateRequest();

  if (!user) {
    return new Response(null, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("file") as File;
  const fileBuffer = await file.arrayBuffer();

  const accountName = "memoimg";
  const sasToken = process.env.SAS_TOKEN;
  const containerName = "container";

  if (!file) return new Response(JSON.stringify(null), { status: 400 });

  const blobServiceClient = new BlobServiceClient(
    `https://${accountName}.blob.core.windows.net/?${sasToken}`,
  );
  const containerClient = blobServiceClient.getContainerClient(containerName);
  const blockBlobClient = containerClient.getBlockBlobClient(user.username);

  await blockBlobClient.deleteIfExists();

  await blockBlobClient.uploadData(fileBuffer, {
    blobHTTPHeaders: {
      blobContentType: file.type,
    },
  });

  const url = blockBlobClient.url;

  await sql("UPDATE users SET image_url = $1 WHERE id = $2", [url, user.id]);

  return new Response(url, {
    status: 200,
  });
}
