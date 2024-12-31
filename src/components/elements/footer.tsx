import React from "react";
import * as z from "zod";
import { ConfigSchema, DocumentSchema } from "@/lib/validation/document-schema";
import { Signature } from "@/components/elements/signature";
import { PageNumber } from "@/components/elements/page-number";
import { cn } from "@/lib/utils";

const Footer = React.forwardRef<
  HTMLDivElement,
  {
    config: z.infer<typeof ConfigSchema>;
    number: number;
    className?: string;
  }
>(function Footer({ config, number, className }, ref) {
  const showSignature = config.brand.showBrand;
  const showPageNumber = config.pageNumber.showNumbers;

  // If nothing to show, return null to avoid empty space
  if (!showSignature && !showPageNumber) {
    return null;
  }

  return (
    <div
      ref={ref}
      className={cn(
        "flex flex-row justify-between items-center",
        className
      )}
    >
      {showSignature && <Signature config={config} />}
      {showPageNumber && <PageNumber config={config} number={number} />}
    </div>
  );
});

export default Footer;
