import { GuessScore, OrginalGuess } from "@/app/page";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Share2, RefreshCw } from "lucide-react";
import Image from "next/image";

type Props = {
  score: GuessScore;
  originalGuess: OrginalGuess;
  userPrompt: string;
  reset: () => void;
};

export default function Results({
  score,
  originalGuess,
  userPrompt,
  reset,
}: Props) {
  const handleShare = () => {
    const gameUrl = window.location.href;
    const text = `I scored ${score.similarityScore.toFixed(
      0
    )}% in Promptception: the game where you reverse-engineer the prompts behind AI-generated images! Can you beat my score?\n\nPlay the game: ${gameUrl}`;
    const url = `https://x.com/intent/tweet/?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid md:grid-cols-2 gap-8 mb-14">
        {/* Original Image */}
        <div className="space-y-4">
          <div className="relative aspect-square rounded-lg overflow-hidden bg-muted">
            <Image
              src={originalGuess.imageUrl}
              alt="Original AI-generated image"
              fill
              className="object-cover"
              priority
            />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-muted-foreground mb-2">
              Original prompt
            </h3>
            <p className="text-lg">{originalGuess.prompt}</p>
          </div>
        </div>

        {/* User's Guess Image */}
        <div className="space-y-4">
          <div className="relative aspect-square rounded-lg overflow-hidden bg-muted">
            <Image
              src={score.imageUrl}
              alt="AI-generated image from user's guess"
              fill
              className="object-cover"
              priority
            />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-muted-foreground mb-2">
              Your prompt
            </h3>
            <p className="text-lg">{userPrompt}</p>
          </div>
        </div>
      </div>

      {/* Results Panel */}
      <Card className="p-8 bg-white/50 backdrop-blur-sm border-gray-100">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-4 text-center md:text-left flex-1">
            <h3 className="text-xl font-medium text-muted-foreground">
              Similarity score
            </h3>
            <div className="flex flex-col items-center md:items-start gap-4">
              <span className="text-6xl font-extrabold font-sans">
                {score.similarityScore.toFixed(0)}%
              </span>
              <div className="w-full max-w-md h-2 rounded-full bg-gray-200 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
                  style={{ width: `${score.similarityScore}%` }}
                />
              </div>
            </div>
          </div>
          <div className="flex gap-4 md:self-end">
            <Button
              variant="outline"
              className="gap-2 bg-white"
              onClick={handleShare}
            >
              <Share2 className="w-4 h-4" />
              Share My Results
            </Button>
            <Button
              variant="default"
              className="gap-2 bg-black text-white hover:bg-black/90"
              onClick={reset}
            >
              <RefreshCw className="w-4 h-4" />
              Play again
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
