import { useFormContext } from "react-hook-form";

import { DocumentFormReturn } from "@/lib/document-form-types";
import { Loader2Icon } from "lucide-react";
import React, { useState } from "react";
import { JsonExporter } from "./json-exporter";
import { JsonImporter } from "./json-importer";
import { FilenameForm } from "./forms/filename-form";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "@/components/ui/menubar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import FileInputForm from "./forms/file-input-form";
import { useFieldsFileImporter } from "@/lib/hooks/use-fields-file-importer";
import { usePagerContext } from "@/lib/providers/pager-context";
import { defaultValues } from "@/lib/default-document";

export function EditorMenubar({ 
  handlePrint, 
  handleExportJpgs, 
  isPrinting 
}: { 
  handlePrint?: () => void; 
  handleExportJpgs?: () => void;
  isPrinting?: boolean; 
}) {
  const { reset, watch }: DocumentFormReturn = useFormContext(); // retrieve those props
  const { setCurrentPage } = usePagerContext();

  const [isConfigDialogOpen, setIsConfigDialogOpen] = useState(false);
  const { handleFileSubmission: handleConfigFileSubmission } =
    useFieldsFileImporter("config");
  const [isContentDialogOpen, setIsContentDialogOpen] = useState(false);

  const { handleFileSubmission: handleContentFileSubmission } =
    useFieldsFileImporter("slides");

  return (
    <div className="flex items-center flex-row gap-2">
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>File</MenubarTrigger>
          <MenubarContent>
            <FilenameForm className={"text-left my-1"} />
            <MenubarSeparator />
            <JsonExporter
              values={watch("config")}
              filename={"carousel-settings.json"}
            >
              <MenubarItem>Export Settings</MenubarItem>
            </JsonExporter>
            <Dialog
              open={isConfigDialogOpen}
              onOpenChange={setIsConfigDialogOpen}
            >
              <DialogTrigger asChild>
                <MenubarItem onSelect={(e) => e.preventDefault()}>
                  Import Settings
                </MenubarItem>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Load a file with Settings</DialogTitle>
                </DialogHeader>

                <FileInputForm
                  handleSubmit={(files) => {
                    handleConfigFileSubmission(files);
                    setIsConfigDialogOpen(false);
                  }}
                  label={"Settings File"}
                  description="Select a json file to load"
                />
              </DialogContent>
            </Dialog>
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
                  handleSubmit={(files) => {
                    handleContentFileSubmission(files);
                    setIsContentDialogOpen(false);
                  }}
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
                reset({
                  slides: defaultValues.slides,
                  config: {
                    ...defaultValues.config,
                    theme: {
                      ...defaultValues.config.theme,
                      layout: {
                        ...defaultValues.config.theme.layout,
                        alignment: defaultValues.config.theme.layout.alignment as "Center" | "Top" | "Bottom"
                      }
                    }
                  }
                });
                setCurrentPage(0);
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
