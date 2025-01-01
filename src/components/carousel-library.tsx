'use client';

import { useEffect, useState } from 'react';
import { getUserCarousels, deleteCarousel } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';
import { Loader2, Trash2 } from 'lucide-react';
import { defaultValues } from '@/lib/default-document';

interface SavedCarousel {
  id: string;
  name: string;
  data: typeof defaultValues;
  last_modified: string;
}

interface CarouselLibraryProps {
  onLoadCarousel: (carousel: typeof defaultValues) => void;
}

export function CarouselLibrary({ onLoadCarousel }: CarouselLibraryProps) {
  const [carousels, setCarousels] = useState<SavedCarousel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showLibrary, setShowLibrary] = useState(false);

  const loadCarousels = async () => {
    try {
      const data = await getUserCarousels();
      setCarousels(data);
    } catch (error) {
      console.error('Error loading carousels:', error);
      toast.error('Failed to load carousels');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (showLibrary) {
      loadCarousels();
    }
  }, [showLibrary]);

  const handleDelete = async (id: string) => {
    try {
      await deleteCarousel(id);
      setCarousels(carousels.filter(c => c.id !== id));
      toast.success('Carousel deleted');
    } catch (error) {
      console.error('Error deleting carousel:', error);
      toast.error('Failed to delete carousel');
    }
  };

  const handleLoad = (carousel: typeof defaultValues) => {
    onLoadCarousel(carousel);
    setShowLibrary(false);
    toast.success('Carousel loaded');
  };

  return (
    <>
      <Button variant="outline" onClick={() => setShowLibrary(true)}>
        Open Library
      </Button>

      <Dialog open={showLibrary} onOpenChange={setShowLibrary}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Your Carousels</DialogTitle>
            <DialogDescription>
              Select a carousel to load or manage your saved carousels
            </DialogDescription>
          </DialogHeader>

          {isLoading ? (
            <div className="flex justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : carousels.length === 0 ? (
            <div className="text-center p-8 text-muted-foreground">
              No saved carousels yet
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
              {carousels.map((carousel) => (
                <Card key={carousel.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">{carousel.name}</CardTitle>
                    <CardDescription>
                      Last modified {formatDistanceToNow(new Date(carousel.last_modified))} ago
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {carousel.data.slides.length} slides
                    </p>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button
                      variant="default"
                      onClick={() => handleLoad(carousel.data)}
                    >
                      Load
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive"
                      onClick={() => handleDelete(carousel.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
} 