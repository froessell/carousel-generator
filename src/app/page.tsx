"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect, useMemo, useState } from "react";
import * as z from "zod";
import { SidebarMenu } from "@/components/menu-bar";
import { SlidesForm } from "@/components/slides-form";
import { MultiSlideSchema, SlideSchema } from "@/lib/validation/slide-schema";
import { CarouselSlide } from "@/components/carousel-slide";
import { SettingsSchema } from "@/lib/validation/settings-schema";
import { SettingsForm } from "@/components/settings-form";
import { usePersistFormWithKey } from "@/lib/hooks/use-persist-form-with-key";
import { ThemeSchema } from "@/lib/validation/theme-schema";
import { ThemeForm } from "@/components/theme-form";
import { PdfSlide } from "@/components/pdf-slide";
import { PDFViewer } from "@/components/PDFViewer";
import {
  BlobProvider,
  PDFDownloadLink,
  usePDF,
  // @ts-ignore: Library import from inner module to avoid thinking we are on node
} from "@react-pdf/renderer/lib/react-pdf.browser.es";
import Pager from "@/components/pager";
import { DocumentSchema } from "@/lib/validation/document-schema";

const ALL_FORMS = ["slide", "settings", "theme"];

export default function Home() {
  const [selectedForm, setSelectedForm] = useState(ALL_FORMS[0]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const documentForm = useForm<z.infer<typeof DocumentSchema>>({
    resolver: zodResolver(DocumentSchema),
    defaultValues: {
      slides: Array.from({ length: 5 }).fill({
        title: "YOUR TITLE",
        subtitle: "Your awesome subtitle",
        description:
          "Lorem ipsum dolor sit amet consectetur adipisicing elit. Expedita, dolorum.",
      }) as (typeof SlideSchema)[],
      settings: {
        avatar: "https://thispersondoesnotexist.com",
        name: "My name",
        handle: "@name",
      },
      theme: {
        primary: "#005B8C",
        secondary: "#FFCC4A",
        accent: "#FDF8EC",
      },
    },
  });

  usePersistFormWithKey(documentForm, "documentKey");
  const documentValues = documentForm.watch();

  const settingsForm = useForm<z.infer<typeof SettingsSchema>>({
    resolver: zodResolver(SettingsSchema),
    defaultValues: {
      avatar: "https://thispersondoesnotexist.com",
      name: "My name",
      handle: "@name",
    },
  });
  usePersistFormWithKey(settingsForm, "settingsFormKey");
  const settingsValues = settingsForm.watch();

  const themeForm = useForm<z.infer<typeof ThemeSchema>>({
    resolver: zodResolver(ThemeSchema),
    defaultValues: {
      primary: "#005B8C",
      secondary: "#FFCC4A",
      accent: "#FDF8EC",
    },
  });
  usePersistFormWithKey(themeForm, "settingsFormKey");
  const themeValues = themeForm.watch();
  const pdfDocument = useMemo(
    () => (
      <PdfSlide
        slides={documentValues.slides}
        settings={settingsValues}
        theme={themeValues}
      />
    ),
    [documentValues.slides, settingsValues, themeValues]
  );
  const [instance, updateInstance] = usePDF({ document: pdfDocument });
  const { loading: instanceLoading, url: isntanceUrl } = instance;

  useEffect(() => {
    updateInstance(pdfDocument);
  }, [pdfDocument, updateInstance]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl flex flex-col items-center justify-start gap-8 font-mono text-sm ">
        {/* React Slide for debug purposes */}
        {/* <div className="border p-4 rounded shadow flex flex-col items-center ">
          <CarouselSlide
            slide={slidesValues.slides[1]}
            settings={settingsValues}
            theme={themeValues}
          />
        </div> */}
        <div className=" border p-4 rounded shadow overflow-clip w-[1024px]">
          {/* TODO: Make the width responsive */}
          <PDFViewer pdfUrl={isntanceUrl} currentPage={currentSlide} />
        </div>
        <div className=" border p-4 flex flex-col gap-6 rounded shadow w-[448px] h-[560px]">
          <SidebarMenu
            items={ALL_FORMS}
            selectedForm={selectedForm}
            setSelectedForm={setSelectedForm}
          />
          {selectedForm == "slide" && (
            <SlidesForm form={documentForm} currentSlide={currentSlide} />
          )}
          {selectedForm == "settings" && <SettingsForm form={settingsForm} />}
          {selectedForm == "theme" && <ThemeForm form={themeForm} />}
        </div>
      </div>
      <FooterLink documentUrl={instance.url} />
      <Pager
        currentPage={currentSlide}
        numPages={documentValues.slides.length} // TODO: Replace with num pages state
        onPreviousClick={() => setCurrentSlide(currentSlide - 1)}
        onNextClick={() => setCurrentSlide(currentSlide + 1)}
      />
    </main>
  );
}

function FooterLink({ documentUrl }: { documentUrl: string | null }) {
  return (
    <a href={documentUrl || ""} download="document.pdf">
      <button>Download</button>
    </a>
  );
}
