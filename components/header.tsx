import React from "react";

const Header = () => {
  return (
    <main className="flex-1 container mx-auto px-4 pt-8 md:pt-12 lg:pt-16">
      <div className="text-center mb-6">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter mb-4">
          PROMPTCEPTION
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
          Test your prompt engineering skills by guessing the prompts behind
          AI-generated images. How close can you get?
        </p>
      </div>
    </main>
  );
};

export default Header;
