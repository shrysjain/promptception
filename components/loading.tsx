import { Loader2 } from "lucide-react";
import Image from "next/image";

type Props = {
  originalImage: string;
};

export default function Loading({ originalImage }: Props) {
  return (
    <div>
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
            <Image
              src={originalImage}
              alt="AI-generated image"
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Loading Section */}
          <div className="space-y-6">
            <div className="aspect-square min-h-[120px] w-full rounded-md bg-muted/80 flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
