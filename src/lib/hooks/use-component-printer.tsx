import React, { useState } from "react";
import { useReactToPrint } from "react-to-print";
import { useFieldArrayValues } from "@/lib/hooks/use-field-array-values";
import { useFormContext } from "react-hook-form";
import { DocumentFormReturn } from "@/lib/document-form-types";
import { toCanvas } from "html-to-image";
import { Options as HtmlToImageOptions } from "html-to-image/lib/types";
import { jsPDF, jsPDFOptions } from "jspdf";
import { toast } from "sonner";

type HtmlToPdfOptions = {
  margin: [number, number, number, number];
  filename: string;
  image: { type: string; quality: number };
  htmlToImage: HtmlToImageOptions;
  jsPDF: jsPDFOptions;
};

// Convert units to px using the conversion value 'k' from jsPDF.
export const toPx = function toPx(val: number, k: number) {
  return Math.floor(((val * k) / 72) * 96);
};

function getPdfPageSize(opt: HtmlToPdfOptions) {
  // Retrieve page-size based on jsPDF settings, if not explicitly provided.
  // @ts-ignore function not explicitly exported
  const pageSize = jsPDF.getPageSize(opt.jsPDF);

  // Add 'inner' field if not present.
  if (!pageSize.hasOwnProperty("inner")) {
    pageSize.inner = {
      width: pageSize.width - opt.margin[1] - opt.margin[3],
      height: pageSize.height - opt.margin[0] - opt.margin[2],
    };
    pageSize.inner.px = {
      width: toPx(pageSize.inner.width, pageSize.k),
      height: toPx(pageSize.inner.height, pageSize.k),
    };
    pageSize.inner.ratio = pageSize.inner.height / pageSize.inner.width;
  }

  // Attach pageSize to this.
  return pageSize;
}

function canvasToPdf(canvas: HTMLCanvasElement, opt: HtmlToPdfOptions) {
  const pdfPageSize = getPdfPageSize(opt);

  // Calculate the number of pages.
  var pxFullHeight = canvas.height;
  var pxPageHeight = Math.floor(canvas.width * pdfPageSize.inner.ratio);
  var nPages = Math.ceil(pxFullHeight / pxPageHeight);

  // Define pageHeight separately so it can be trimmed on the final page.
  var pageHeight = pdfPageSize.inner.height;

  // Create a one-page canvas to split up the full image.
  var pageCanvas = document.createElement("canvas");
  var pageCtx = pageCanvas.getContext("2d");
  if (!pageCtx) {
    throw Error("Canvas context of created element not found");
  }
  pageCanvas.width = canvas.width;
  pageCanvas.height = pxPageHeight;

  // Initialize the PDF.
  const pdf = new jsPDF(opt.jsPDF);

  for (var page = 0; page < nPages; page++) {
    // Trim the final page to reduce file size.
    if (page === nPages - 1 && pxFullHeight % pxPageHeight !== 0) {
      pageCanvas.height = pxFullHeight % pxPageHeight;
      pageHeight = (pageCanvas.height * pdfPageSize.inner.width) / pageCanvas.width;
    }

    // Display the page.
    var w = pageCanvas.width;
    var h = pageCanvas.height;

    pageCtx.fillStyle = "white";
    pageCtx.fillRect(0, 0, w, h);
    pageCtx.drawImage(canvas, 0, page * pxPageHeight, w, h, 0, 0, w, h);

    // Add the page to the PDF.
    if (page) pdf.addPage();
    var imgData = pageCanvas.toDataURL("image/" + opt.image.type, opt.image.quality);
    pdf.addImage(imgData, opt.image.type, opt.margin[1], opt.margin[0], pdfPageSize.inner.width, pageHeight);
  }
  return pdf;
}

async function waitForImagesLoaded(element: HTMLElement) {
  const images = Array.from(element.getElementsByTagName('img')) as HTMLImageElement[];
  const loadPromises = images.map(img => {
    if (img.complete) return Promise.resolve();
    return new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
    });
  });
  await Promise.all(loadPromises);
}

export function useComponentPrinter() {
  const form = useFormContext<DocumentFormReturn>();
  const { numPages } = useFieldArrayValues("slides");
  const [isPrinting, setIsPrinting] = React.useState(false);
  const componentRef = React.useRef(null);

  const reactToPrintContent = React.useCallback(() => {
    const current = componentRef.current;

    if (current && typeof current === "object") {
      // @ts-ignore should type narrow more precisely
      const clone = current.cloneNode(true);
      // Change from horizontal to vertical for printing and remove gap
      proxyImgSources(clone);
      removeSelectionStyleById(clone, "page-base-");
      removeSelectionStyleById(clone, "content-image-");
      removePaddingStyleById(clone, "carousel-item-");
      removeStyleById(clone, "slide-wrapper-", "px-2");
      removeAllById(clone, "add-slide-");
      removeAllById(clone, "add-element-");
      removeAllById(clone, "element-menubar-");
      removeAllById(clone, "slide-menubar-");
      insertFonts(clone);
      // Remove styling from container
      clone.className = "flex flex-col";
      clone.style = {};

      return clone;
    }

    return componentRef.current;
  }, []);

  const handlePrint = useReactToPrint({
    content: reactToPrintContent,
    removeAfterPrint: true,
    onBeforePrint: () => setIsPrinting(true),
    onAfterPrint: () => setIsPrinting(false),
    pageStyle: `@page { size: ${form.watch("config.size.width")}px ${form.watch("config.size.height")}px;  margin: 0; } @media print { body { -webkit-print-color-adjust: exact; }}`,
    print: async (printIframe) => {
      const contentDocument = printIframe.contentDocument;
      if (!contentDocument) {
        console.error("iFrame does not have a document content");
        return;
      }

      const html = contentDocument.getElementById("element-to-download-as-pdf");
      if (!html) {
        console.error("Couldn't find element to convert to PDF");
        return;
      }

      // Wait for all images to load
      await waitForImagesLoaded(html);

      const SCALE_TO_LINKEDIN_INTRINSIC_SIZE = 1.8;
      const size = form.watch("config.size");
      const options: HtmlToPdfOptions = {
        margin: [0, 0, 0, 0],
        filename: form.watch("filename"),
        image: { type: "webp", quality: 0.98 },
        htmlToImage: {
          height: size.height * numPages,
          width: size.width,
          canvasHeight: size.height * numPages * SCALE_TO_LINKEDIN_INTRINSIC_SIZE,
          canvasWidth: size.width * SCALE_TO_LINKEDIN_INTRINSIC_SIZE,
          cacheBust: true
        },
        jsPDF: { unit: "px", format: [size.width, size.height] },
      };

      const canvas = await toCanvas(html, options.htmlToImage).catch((err) => {
        console.error(err);
      });
      if (!canvas) {
        console.error("Failed to create canvas");
        return;
      }
      const pdf = canvasToPdf(canvas, options);
      pdf.save(options.filename);
    },
  });

  const handleExportJpgs = useReactToPrint({
    content: reactToPrintContent,
    removeAfterPrint: true,
    onBeforePrint: () => setIsPrinting(true),
    onAfterPrint: () => setIsPrinting(false),
    pageStyle: `@page { size: ${form.watch("config.size.width")}px ${form.watch("config.size.height")}px;  margin: 0; } @media print { body { -webkit-print-color-adjust: exact; }}`,
    print: async (printIframe) => {
      const contentDocument = printIframe.contentDocument;
      if (!contentDocument) {
        console.error("iFrame does not have a document content");
        return;
      }

      const html = contentDocument.getElementById("element-to-download-as-pdf");
      if (!html) {
        console.error("Couldn't find element to convert to PDF");
        return;
      }

      // Wait for all images to load
      await waitForImagesLoaded(html);

      const SCALE_TO_LINKEDIN_INTRINSIC_SIZE = 1.8;
      const size = form.watch("config.size");
      const options: HtmlToPdfOptions = {
        margin: [0, 0, 0, 0],
        filename: form.watch("filename"),
        image: { type: "webp", quality: 0.98 },
        htmlToImage: {
          height: size.height * numPages,
          width: size.width,
          canvasHeight: size.height * numPages * SCALE_TO_LINKEDIN_INTRINSIC_SIZE,
          canvasWidth: size.width * SCALE_TO_LINKEDIN_INTRINSIC_SIZE,
          cacheBust: true
        },
        jsPDF: { unit: "px", format: [size.width, size.height] },
      };

      // Convert to canvas using the same method as PDF
      const canvas = await toCanvas(html, options.htmlToImage).catch((err) => {
        console.error(err);
      });
      if (!canvas) {
        console.error("Failed to create canvas");
        return;
      }

      // Get the PDF page size (we'll use this for slicing the canvas)
      const pdfPageSize = getPdfPageSize(options);
      const pxPageHeight = Math.floor(canvas.width * pdfPageSize.inner.ratio);

      // Create a temporary canvas for individual slides
      const pageCanvas = document.createElement("canvas");
      const pageCtx = pageCanvas.getContext("2d");
      if (!pageCtx) {
        throw Error("Canvas context of created element not found");
      }
      pageCanvas.width = canvas.width;
      pageCanvas.height = pxPageHeight;

      // Extract each page as JPG using the same logic as PDF generation
      for (let page = 0; page < numPages; page++) {
        // Handle the last page height
        if (page === numPages - 1 && canvas.height % pxPageHeight !== 0) {
          pageCanvas.height = canvas.height % pxPageHeight;
        }

        // Use the same drawing logic as PDF generation
        const w = pageCanvas.width;
        const h = pageCanvas.height;
        pageCtx.fillStyle = "white";
        pageCtx.fillRect(0, 0, w, h);
        pageCtx.drawImage(canvas, 0, page * pxPageHeight, w, h, 0, 0, w, h);

        // Convert to JPG and save
        const imgData = pageCanvas.toDataURL("image/jpeg", 0.95);
        const link = document.createElement('a');
        link.download = `${form.watch("filename")}-slide-${page + 1}.jpg`;
        link.href = imgData;
        link.click();
      }
    },
  });

  return {
    componentRef,
    handlePrint,
    handleExportJpgs,
    isPrinting,
  };
}

// Make proxyImgSources async to ensure images are loaded
async function proxyImgSources(html: HTMLElement) {
  const images = Array.from(
    html.getElementsByTagName("img")
  ) as HTMLImageElement[];
  const url = process.env.NEXT_PUBLIC_APP_URL;

  const externalImages = images.filter(
    (image) => !image.src.startsWith("/") && !image.src.startsWith("data:")
  );

  // Wait for all images to load
  const loadPromises = externalImages.map(image => {
    return new Promise((resolve, reject) => {
      const newImage = new Image();
      newImage.onload = resolve;
      newImage.onerror = reject;
      const apiRequestURL = new URL(`${url}/api/proxy`);
      apiRequestURL.searchParams.set("url", image.src);
      newImage.src = apiRequestURL.toString();
      image.src = newImage.src;
    });
  });

  await Promise.all(loadPromises);
}

function removeAllById(html: HTMLElement, id: string) {
  const elements = Array.from(
    html.querySelectorAll(`[id^=${id}]`)
  ) as HTMLDivElement[];

  elements.forEach((element) => {
    element.remove();
  });
}

function removePaddingStyleById(html: HTMLElement, id: string) {
  const classNames = "pl-2 md:pl-4";
  removeStyleById(html, id, classNames);
}

function removeSelectionStyleById(html: HTMLElement, id: string) {
  const classNames = "outline-input ring-2 ring-offset-2 ring-ring";
  removeStyleById(html, id, classNames);
}

function removeStyleById(html: HTMLElement, id: string, classNames: string) {
  const elements = Array.from(
    html.querySelectorAll(`[id^=${id}]`)
  ) as HTMLDivElement[];
  elements.forEach((element) => {
    element.className = removeClassnames(element, classNames);
  });
}

function removeClassnames(element: HTMLDivElement, classNames: string): string {
  return element.className
    .split(" ")
    .filter((el) => !classNames.split(" ").includes(el))
    .join(" ");
}

function insertFonts(element: HTMLElement) {
  // Get all elements with font classes
  const allElements = Array.from(
    element.querySelectorAll(`[class*="font-"]`)
  ) as HTMLElement[];

  // Iterate through each element
  allElements.forEach(function (element) {
    let tailwindFonts = element.className
      .split(" ")
      .filter((cn) => cn.startsWith("font-"));

    // Get the computed style of the element
    tailwindFonts.forEach((font) => {
      const fontFaceValue = getComputedStyle(
        element.ownerDocument.body
      ).getPropertyValue("--" + font); // Font var name convention is starts with `--font`
      if (fontFaceValue) {
        element.style.fontFamily = fontFaceValue;
      }
    });
  });
}
