import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { usePageSize } from "@/lib/page-size";
import { cn } from "@/lib/utils";

function SlideSkeleton({ className }: { className?: string }) {
  const pageSize = usePageSize();
  
  return (
    <Card
      className={cn("flex flex-col gap-12 ", className)}
      style={{
        width: `${pageSize.width}px`,
        height: `${pageSize.height}px`,
        minWidth: `${pageSize.width}px`,
        minHeight: `${pageSize.height}px`,
      }}
    >
      <CardHeader className="gap-2">
        <Skeleton className="h-10 w-3/5" />
        <Skeleton className="h-20 w-full" />
      </CardHeader>
      <CardContent className="flex flex-col gap-6 px-20">
        <Skeleton className="h-8 w-4/5" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-3/5" />
        <Skeleton className="h-8 w-2/5" />
      </CardContent>
      <CardFooter className=""></CardFooter>
    </Card>
  );
}

export function DocumentSkeleton() {
  // TODO: Fix layout spacing of skeleton. Ideally should look like carousel
  return (
    <div className="flex h-full w-full flex-row gap-2 mt-12 px-28">
      <SlideSkeleton />
      <SlideSkeleton className="hidden lg:flex" />
      <SlideSkeleton className="hidden 2xl:flex" />
    </div>
  );
}

export function EditorSkeleton() {
  const pageSize = usePageSize();
  
  return (
    <div
      className="relative bg-muted rounded-lg"
      style={{
        width: `${pageSize.width}px`,
        height: `${pageSize.height}px`,
        minWidth: `${pageSize.width}px`,
        minHeight: `${pageSize.height}px`,
      }}
    >
      {/* ... rest of the component ... */}
    </div>
  );
}
