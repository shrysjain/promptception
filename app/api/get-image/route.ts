import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(req: NextRequest) {
  try {
    const gptResponse = await client.chat.completions.create({
      model: "gpt-4-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are a creative writing assistant who specializes in developing detailed, engaging stories with rich characters and settings.",
        },
        {
          role: "user",
          content: "Describe a unique scene in one sentence.",
        },
      ],
      stream: true,
    });

    const promptChunks: string[] = [];

    for await (const chunk of gptResponse) {
      promptChunks.push(chunk.choices[0].delta.content as string);
    }

    const prompt = promptChunks.join("");

    const dalleResponse = await client.images.generate({
      model: "dall-e-3",
      prompt,
      n: 1,
      size: "1024x1024",
      response_format: "url",
    });

    const imageUrl = dalleResponse.data[0].url;

    const hints = prompt
      .match(/\b(\w+)\b/g)
      ?.sort(() => Math.random() - 0.5)
      .slice(0, 3);

    return NextResponse.json(
      {
        prompt,
        imageUrl,
        hints,
      },
      { status: 200 }
    );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error in /api/get-image:", error.message);
    return NextResponse.json(
      {
        error: error.message || "An unexpected error occurred.",
      },
      { status: 500 }
    );
  }
}
