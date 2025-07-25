import { NextResponse } from "next/server";

export async function GET() {
  const res = await fetch("https://api.perplexity.ai/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.PERPLEXITY_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "sonar", // or gpt-4, etc.
      messages: [
        {
          role: "user",
          content: "What is artificial intelligence?",
        },
      ],
    }),
  });

  let data;
  try {
    data = await res.json();
  } catch (err) {
    const text = await res.text();
    data = { error: "Invalid JSON response", status: res.status, text };
  }

  return NextResponse.json({ data });
}
