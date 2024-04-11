import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "About Acme";
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function Image() {
  const bogart = fetch(
    new URL("../../public/BogartSemibold-Italic.ttf", import.meta.url),
  ).then((res) => res.arrayBuffer());

  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 186,
          background: "transparent",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#335CFF",
          padding: "20px",
        }}
      >
        memo
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "Bogart",
          data: await bogart,
          style: "italic",
          weight: 600,
        },
      ],
    },
  );
}
