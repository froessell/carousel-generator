import Link from "next/link";
import { cn } from "@/lib/utils";
import { EditorMenubar } from "./editor-menubar";

export function MainNav({
  className,
  handlePrint,
  handleExportJpgs,
  isPrinting,
  ...props
}: React.HTMLAttributes<HTMLElement> & {
  handlePrint?: () => void;
  handleExportJpgs?: () => void;
  isPrinting?: boolean;
}) {
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
        <div className="ml-auto flex items-center space-x-4">
          <EditorMenubar 
            handlePrint={handlePrint} 
            handleExportJpgs={handleExportJpgs}
            isPrinting={isPrinting} 
          />
        </div>
      </div>
    </div>
  );
}
