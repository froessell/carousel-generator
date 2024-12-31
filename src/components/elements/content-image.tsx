/* eslint-disable @next/next/no-img-element */
import React from "react";
import * as z from "zod";
import { cn } from "@/lib/utils";
import {
  ObjectFitType,
  ImageSchema,
  ContentImageSchema,
  ImageSizeOption,
} from "@/lib/validation/image-schema";
import { useSelectionContext } from "@/lib/providers/selection-context";
import { getSlideNumber } from "@/lib/field-path";
import { usePagerContext } from "@/lib/providers/pager-context";
import { useFormContext } from "react-hook-form";
import {
  DocumentFormReturn,
  ElementFieldPath,
} from "@/lib/document-form-types";
import { Image } from "lucide-react";

export function ContentImage({
  fieldName,
  className,
}: {
  fieldName: ElementFieldPath;
  className?: string;
}) {
  const { watch, setValue } = useFormContext();
  const { setCurrentSelection } = useSelectionContext();
  const { setCurrentPage } = usePagerContext();
  const image = watch(`${fieldName}.source`);
  const size = watch(`${fieldName}.size`) as ImageSizeOption;
  const style = watch(`${fieldName}.style`);
  const objectFit = style?.objectFit || "Cover";
  const pageNumber = getSlideNumber(fieldName);

  // Initialize style with objectFit if it doesn't exist
  React.useEffect(() => {
    if (!style?.objectFit) {
      setValue(`${fieldName}.style`, { ...style, objectFit: "Cover" });
    }
  }, [style, fieldName, setValue]);

  const sizeStyles = {
    Default: "w-auto max-w-full",
    FullWidth: "w-full",
    AlmostFullWidth: "w-[98%] mx-auto",
  };

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    setCurrentSelection(fieldName, event);
    setCurrentPage(pageNumber);
  };

  if (!image?.src) {
    return (
      <div 
        className={cn(
          "flex flex-col justify-center items-center h-32 gap-2 cursor-pointer hover:bg-muted/50 rounded-lg transition-colors", 
          className
        )}
        onClick={handleClick}
      >
        <Image className="w-8 h-8 text-muted-foreground" />
        <div className="text-muted-foreground text-sm">Click to add image</div>
      </div>
    );
  }

  return (
    <div 
      className={cn("flex justify-center", className)}
      onClick={handleClick}
    >
      <img
        src={image.src}
        alt="Content"
        className={cn(
          "cursor-pointer", 
          sizeStyles[size]
        )}
        style={{
          objectFit: objectFit.toLowerCase()
        }}
      />
    </div>
  );
}
