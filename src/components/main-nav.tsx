import Link from "next/link";
import { cn } from "@/lib/utils";

export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4">
        <nav
          className={cn("flex items-center space-x-4 lg:space-x-6", className)}
          {...props}
        >
          <Link
            href="/"
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            Carousel Generator
          </Link>
        </nav>
      </div>
    </div>
  );
}
