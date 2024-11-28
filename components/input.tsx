import { useState } from "react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { OrginalGuess } from "@/app/page";
import { Loader2 } from "lucide-react";

type Props = {
  imageData?: OrginalGuess;
  onSubmit: (text: string) => void;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function Input({ imageData, onSubmit }: Props) {
  const [inputValue, setInputValue] = useState("");
  const hints = imageData?.hints.join(", ");

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(event.target.value);
  };

  const handleSubmit = () => {
    onSubmit(inputValue);
  };

  return (
    <div>
      {/* Game Section */}
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold mb-2">
          Guess the prompt
        </h2>
        <p className="text-muted-foreground mb-8">
          How accurately can you guess the prompt used to generate this
          AI-generated image?
        </p>

        <div className="grid md:grid-cols-2 gap-8 items-start">
          {/* Image Section */}
          <div className="relative aspect-square rounded-lg overflow-hidden bg-muted">
            {!imageData?.imageUrl ? (
              <div className="aspect-square min-h-[120px] w-full rounded-md bg-muted/80 flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <Image
                src={imageData?.imageUrl || "/placeholder.svg"}
                alt="AI-generated image"
                fill
                className="object-cover"
                priority
              />
            )}
          </div>

          {/* Prompt Input Section */}
          <div className="space-y-6">
            <div className="space-y-2">
              <label
                htmlFor="prompt"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Your guess
              </label>
              <textarea
                id="prompt"
                placeholder="Enter your prompt guess..."
                className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-y"
                value={inputValue}
                onChange={handleInputChange}
              />
            </div>
            <p className="text-sm text-gray-600 mb-4">
              <b>Hints: </b>
              {hints}
            </p>
            <Button
              className="w-full md:w-auto"
              size="lg"
              onClick={handleSubmit}
              disabled={!imageData}
            >
              Submit
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
