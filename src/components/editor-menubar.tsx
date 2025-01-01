import { useFormContext } from "react-hook-form";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from "@/components/ui/menubar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FileInputForm } from "@/components/forms/file-input-form";
import { JsonExporter } from "@/components/json-exporter";
import { DocumentFormReturn } from "@/lib/document-form-types";
import { defaultValues } from "@/lib/default-document";
import { Loader2Icon } from "lucide-react";
import { useState } from "react";
import { CarouselLibrary } from "@/components/carousel-library";
import { saveCarousel } from "@/lib/supabase";
import { toast } from "sonner";
import { FilenameForm } from "@/components/forms/filename-form";

export function EditorMenubar({ 
  handlePrint, 
  handleExportJpgs, 
  isPrinting 
}: { 
  handlePrint?: () => void; 
  handleExportJpgs?: () => void;
  isPrinting?: boolean; 
}) {
  const form: DocumentFormReturn = useFormContext();
  const { reset, watch } = form;
  const [isContentDialogOpen, setIsContentDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleContentFileSubmission = async (files: FileList) => {
    const file = files[0];
    if (!file) return;

    try {
      const content = await file.text();
      const data = JSON.parse(content);
      
      // Create a new document with default values but override slides with imported data
      const newDocument = {
        ...defaultValues,
        slides: data
      };

      reset(newDocument);
      toast.success("Content imported successfully");
    } catch (error) {
      console.error("Failed to parse file:", error);
      toast.error("Failed to parse file");
    }
  };

  const handleSaveToLibrary = async () => {
    setIsSaving(true);
    try {
      const formData = form.getValues();
      await saveCarousel(formData);
      toast.success('Carousel saved to library');
    } catch (error) {
      console.error('Error saving carousel:', error);
      toast.error('Failed to save carousel');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="border-b">
      <Menubar className="border-0 px-2">
        <MenubarMenu>
          <MenubarTrigger>File</MenubarTrigger>
          <MenubarContent>
            <FilenameForm className="text-left my-1" />
            <MenubarSeparator />
            <MenubarItem onClick={handleSaveToLibrary} disabled={isSaving}>
              {isSaving ? (
                <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Save to Library
            </MenubarItem>
            <CarouselLibrary 
              onLoadCarousel={(carousel) => {
                reset(carousel);
                toast.success('Carousel loaded from library');
              }} 
            />
            <MenubarSeparator />
            <JsonExporter
              values={watch("slides")}
              filename={"carousel-content.json"}
            >
              <MenubarItem>Export Content</MenubarItem>
            </JsonExporter>
            <Dialog
              open={isContentDialogOpen}
              onOpenChange={setIsContentDialogOpen}
            >
              <DialogTrigger asChild>
                <MenubarItem onSelect={(e) => e.preventDefault()}>
                  Import Content
                </MenubarItem>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Load a file with content</DialogTitle>
                </DialogHeader>
                <FileInputForm
                  handleSubmit={handleContentFileSubmission}
                  label={"Content File"}
                  description="Select a json file to load"
                />
              </DialogContent>
            </Dialog>

            <MenubarSeparator />
            {handlePrint && (
              <MenubarItem onClick={handlePrint} disabled={isPrinting}>
                {isPrinting ? (
                  <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                Export as PDF
              </MenubarItem>
            )}
            {handleExportJpgs && (
              <MenubarItem onClick={handleExportJpgs} disabled={isPrinting}>
                {isPrinting ? (
                  <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                Export as JPGs
              </MenubarItem>
            )}
            <MenubarSeparator />

            <MenubarItem
              onClick={() => {
                reset(defaultValues);
                toast.success('Reset to defaults');
              }}
            >
              Reset to defaults
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    </div>
  );
}
