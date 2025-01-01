"use client";

import Editor from "@/components/editor";
import { MainNav } from "@/components/main-nav";
import { useComponentPrinter } from "@/lib/hooks/use-component-printer";
import { DocumentProvider } from "@/lib/providers/document-provider";
import { FormProvider, useForm } from "react-hook-form";
import { defaultValues } from "@/lib/default-document";

function EditorWithPrinter() {
  const { componentRef, handlePrint, handleExportJpgs, isPrinting } = useComponentPrinter();

  return (
    <div className="flex-1 h-full min-h-full flex flex-col justify-stretch">
      <MainNav 
        className="h-14 border-b px-6"
        handlePrint={handlePrint} 
        handleExportJpgs={handleExportJpgs} 
        isPrinting={isPrinting} 
      />
      <Editor componentRef={componentRef} />
    </div>
  );
}

export default function Home() {
  const methods = useForm({
    defaultValues,
  });

  return (
    <FormProvider {...methods}>
      <DocumentProvider>
        <EditorWithPrinter />
      </DocumentProvider>
    </FormProvider>
  );
}
