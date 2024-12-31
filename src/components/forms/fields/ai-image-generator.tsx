"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { LoadingSpinner } from "@/components/loading-spinner";

interface AIImageGeneratorProps {
  onGenerate: (imageUrl: string) => void;
}

export function AIImageGenerator({ onGenerate }: AIImageGeneratorProps) {
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const generateImage = async () => {
    if (!prompt) return;
    
    setIsLoading(true);
    try {
      const response = await fetch("/api/generate/image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });
      const data = await response.json();
      if (data.url) {
        onGenerate(data.url);
      }
    } catch (error) {
      console.error("Failed to generate image:", error);
    }
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2">
        <Input
          placeholder="Describe the image you want..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              generateImage();
            }
          }}
        />
        <Button onClick={generateImage} className="flex-0">
          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <span className="flex flex-row gap-1.5">
              <Sparkles className="w-4 h-4" /> Generate
            </span>
          )}
        </Button>
      </div>
    </div>
  );
} 