// import { NextResponse } from "next/server";

// export async function GET() {
//   const res = await fetch("https://generativelanguage.googleapis.com/v1beta/openai/chat/completions", {
//     method: "POST",
//     headers: {
//       Authorization: `Bearer ${process.env.GEMINI_API_KEY}`,
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({
//       model: "gemini-1.5-flash", // or gpt-4, etc.
//       messages: [
//         {
//           role: "user",
//           content: "What is artificial intelligence?",
//         },
//       ],
//     }),
//   });

//   let data;
//   try {
//     data = await res.json();
//   } catch (err) {
//     const text = await res.text();
//     data = { error: "Invalid JSON response", status: res.status, text };
//   }

//   return NextResponse.json({ data });
// }
