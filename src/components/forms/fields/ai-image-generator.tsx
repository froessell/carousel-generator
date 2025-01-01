"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Sparkles } from "lucide-react";
import { uploadAiGeneratedImage, getCurrentUser } from "@/lib/supabase";
import { toast } from "sonner";

export function AIImageGenerator({
  onImageGenerated,
}: {
  onImageGenerated: (url: string) => void;
}) {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt) return;

    setIsGenerating(true);
    try {
      // Get current user (we know they're authenticated)
      const user = await getCurrentUser();
      if (!user) {
        throw new Error("User not found");
      }

      // Generate image with OpenAI
      const response = await fetch("/api/generate/image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate image");
      }

      const { url } = await response.json();

      // Upload to Supabase storage
      const storedUrl = await uploadAiGeneratedImage(url, user.id);
      if (!storedUrl) {
        throw new Error("Failed to store image");
      }

      // Use the stored URL instead of the temporary OpenAI URL
      onImageGenerated(storedUrl);
      setPrompt("");
      toast.success("Image generated successfully!");
    } catch (error) {
      console.error("Error generating image:", error);
      toast.error("Failed to generate image");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <Input
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Describe the image you want to generate..."
        disabled={isGenerating}
      />
      <Button
        type="submit"
        disabled={!prompt || isGenerating}
        className="w-full"
      >
        {isGenerating ? (
          <Sparkles className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Sparkles className="mr-2 h-4 w-4" />
        )}
        Generate
      </Button>
    </form>
  );
} 