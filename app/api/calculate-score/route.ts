import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

function calculateJaroWinkler(s1: string, s2: string): number {
  const m = getMatchingCharacters(s1, s2);
  if (m === 0) return 0;

  const t = getTranspositions(s1, s2) / 2;
  const j = (m / s1.length + m / s2.length + (m - t) / m) / 3;

  const prefixLength = getCommonPrefixLength(s1, s2);
  const p = 0.1;
  const jw = j + Math.min(prefixLength, 4) * p * (1 - j);

  return Math.round(jw * 100);
}

function getMatchingCharacters(s1: string, s2: string): number {
  const matchWindow = Math.max(s1.length, s2.length) / 2 - 1;
  const matched1 = Array(s1.length).fill(false);
  const matched2 = Array(s2.length).fill(false);

  let matches = 0;
  for (let i = 0; i < s1.length; i++) {
    for (
      let j = Math.max(0, i - matchWindow);
      j < Math.min(s2.length, i + matchWindow + 1);
      j++
    ) {
      if (s1[i] === s2[j] && !matched2[j]) {
        matched1[i] = true;
        matched2[j] = true;
        matches++;
        break;
      }
    }
  }

  return matches;
}

function getTranspositions(s1: string, s2: string): number {
  const s1Matches = [];
  const s2Matches = [];
  const matchWindow = Math.max(s1.length, s2.length) / 2 - 1;

  for (let i = 0; i < s1.length; i++) {
    for (
      let j = Math.max(0, i - matchWindow);
      j < Math.min(s2.length, i + matchWindow + 1);
      j++
    ) {
      if (s1[i] === s2[j] && !s2Matches.includes(j)) {
        s1Matches.push(i);
        s2Matches.push(j);
        break;
      }
    }
  }

  let transpositions = 0;
  for (let i = 0; i < s1Matches.length; i++) {
    if (s1[s1Matches[i]] !== s2[s2Matches[i]]) {
      transpositions++;
    }
  }

  return transpositions;
}

function getCommonPrefixLength(s1: string, s2: string): number {
  let length = 0;
  for (let i = 0; i < Math.min(s1.length, s2.length); i++) {
    if (s1[i] !== s2[i]) break;
    length++;
  }
  return length;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { guessedPrompt, originalPrompt } = body;

    if (!guessedPrompt || !originalPrompt) {
      return NextResponse.json(
        { error: "Both 'guessedPrompt' and 'originalPrompt' are required." },
        { status: 400 }
      );
    }

    const dalleResponse = await client.images.generate({
      model: "dall-e-3",
      prompt: guessedPrompt,
      n: 1,
      size: "1024x1024",
      response_format: "url",
    });

    const imageUrl = dalleResponse.data[0]?.url;
    if (!imageUrl)
      throw new Error("Failed to generate image from guessed prompt.");

    let similarityScore = calculateJaroWinkler(guessedPrompt, originalPrompt);
    similarityScore = 10 * Math.sqrt(similarityScore); // Square root curve

    return NextResponse.json(
      {
        imageUrl,
        similarityScore,
      },
      { status: 200 }
    );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error in /api/calculate-score", error.message);
    return NextResponse.json(
      {
        error: error.message || "An unexpected error occurred.",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(`Cannot GET /api/calculate-score`, { status: 404 });
}
