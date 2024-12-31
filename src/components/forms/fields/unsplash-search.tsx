"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { LoadingSpinner } from "@/components/loading-spinner";

interface UnsplashImage {
  id: string;
  urls: {
    regular: string;
    small: string;
  };
  alt_description: string;
}

interface UnsplashSearchProps {
  onSelect: (imageUrl: string) => void;
}

export function UnsplashSearch({ onSelect }: UnsplashSearchProps) {
  const [query, setQuery] = useState("");
  const [images, setImages] = useState<UnsplashImage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const searchImages = async () => {
    if (!query) return;
    
    setIsLoading(true);
    try {
      const response = await fetch(`/api/unsplash/search?query=${encodeURIComponent(query)}`);
      const data = await response.json();
      setImages(data.results);
    } catch (error) {
      console.error("Failed to search Unsplash:", error);
    }
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2">
        <Input
          placeholder="Search Unsplash photos..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              searchImages();
            }
          }}
        />
        <Button onClick={searchImages} className="flex-0">
          {isLoading ? <LoadingSpinner /> : <Search className="w-4 h-4" />}
        </Button>
      </div>
      
      <div className="grid grid-cols-2 gap-2 max-h-[300px] overflow-y-auto">
        {images.map((image) => (
          <button
            key={image.id}
            onClick={() => onSelect(image.urls.regular)}
            className="relative aspect-square overflow-hidden rounded-md hover:opacity-90 transition-opacity"
          >
            <img
              src={image.urls.small}
              alt={image.alt_description}
              className="object-cover w-full h-full"
            />
          </button>
        ))}
      </div>
    </div>
  );
} 