"use client";

import { useEffect, useState } from "react";

import Input from "@/components/input";
import Loading from "@/components/loading";
import Results from "@/components/results";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export type OrginalGuess = {
  imageUrl: string;
  hints: string[];
  prompt: string;
};

export type GuessScore = {
  imageUrl: string;
  similarityScore: number;
};

export default function Home() {
  const [userPrompt, setUserPrompt] = useState("");
  const [originalGuess, setOriginalGuess] = useState<OrginalGuess>();
  const [guessScore, setGuessScore] = useState<GuessScore>();
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string>();

  const handleSubmit = async (prompt: string) => {
    try {
      setError(undefined);
      setGenerating(true);
      setUserPrompt(prompt);

      const response = await fetch("/api/calculate-score", {
        method: "POST",
        body: JSON.stringify({
          guessedPrompt: prompt,
          originalPrompt: originalGuess?.prompt,
        }),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to calculate score");
      }

      const data = await response.json();
      setGuessScore(data);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setGenerating(false);
    }
  };

  const fetchData = async () => {
    try {
      setError(undefined);
      const response = await fetch("/api/get-image");

      if (!response.ok) {
        throw new Error("Failed to fetch image");
      }

      const data = await response.json();
      setOriginalGuess(data);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to fetch data");
      console.error("Failed to fetch data:", error);
    }
  };

  const reset = () => {
    setUserPrompt("");
    setOriginalGuess(undefined);
    setGuessScore(undefined);
    setError(undefined);
    fetchData();
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-6 md:py-8 lg:py-12">
        {error ? (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : generating && originalGuess ? (
          <Loading originalImage={originalGuess.imageUrl} />
        ) : guessScore && originalGuess ? (
          <Results
            score={guessScore}
            originalGuess={originalGuess}
            userPrompt={userPrompt}
            reset={reset}
          />
        ) : (
          <Input onSubmit={handleSubmit} imageData={originalGuess} />
        )}
      </main>
      <Footer />
    </div>
  );
}
