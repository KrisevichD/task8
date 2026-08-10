import { useMutation } from "@apollo/client/react";
import { useRef } from "react";

import { toast } from "sonner";

import { useLanguage } from "@/context/language";
import { EXPORT_PDF } from "@/graphql/cv-constructor";

export default function useExportPdf() {
  const { t } = useLanguage();
  const printRef = useRef<HTMLDivElement>(null);

  const [getExportedPdf, { loading: isExporting }] = useMutation(EXPORT_PDF);

  const handleDownloadPdf = async (): Promise<void> => {
    const element = printRef.current;
    if (!element) return;

    try {
      const htmlContent = element.innerHTML;

      const styleElements = document.querySelectorAll(
        'style, link[rel="stylesheet"]',
      );
      let injectedStyles = "";

      styleElements.forEach((style) => {
        if (style.tagName === "STYLE") {
          injectedStyles += style.innerHTML;
        } else if (style.tagName === "LINK") {
          try {
            const sheet = (style as HTMLLinkElement).sheet;
            if (sheet) {
              const rules = Array.from(sheet.cssRules)
                .map((rule) => rule.cssText)
                .join("\n");
              injectedStyles += rules;
            }
          } catch (e) {
            console.warn("Не удалось прочитать внешние стили:", e);
          }
        }
      });

      const fullHtmlPayload = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
             @import url('https://googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap');
            
            * {
              font-family: 'Roboto', -apple-system, sans-serif !important;
            }

            body { 
              font-family: 'Roboto', -apple-system, sans-serif !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
              color-adjust: exact !important;
            }

            #export-pdf-btn { 
              display: none !important; 
              opacity: 0 !important;
              visibility: hidden !important;
              height: 0 !important;
              padding: 0 !important;
              margin: 0 !important;
            }
              ${injectedStyles}
            </style>
            <script src="https://tailwindcss.com"></script>
          </head>
          <body class="">
            <div class="p-6">${htmlContent}</div>
          </body>
        </html>
      `;

      const promise = getExportedPdf({
        variables: {
          pdf: {
            html: fullHtmlPayload,
            margin: {
              top: "15mm",
              bottom: "15mm",
              left: "15mm",
              right: "15mm",
            },
          },
        },
      });

      toast.promise(promise, {
        loading: `${t("downloading")} PDF...`,
        success: `PDF ${t("successfully")} ${t("downloaded")}!`,
        error: (err) => `${t("errorMessage")} ${err.message}`,
        position: "top-right",
      });

      const { data } = await promise;

      if (data?.exportPdf) {
        downloadPdfFromBase64(data?.exportPdf, "resume.pdf");
      }
    } catch (error) {
      console.error("PDF Error:", error);
      throw error;
    }
  };

  return {
    printRef,
    isExporting,
    handleDownloadPdf,
  };
}

function downloadPdfFromBase64(base64String: string, fileName: string) {
  const cleanBase64 = base64String.replace(
    /^data:application\/pdf;base64,/,
    "",
  );

  const byteCharacters = atob(cleanBase64);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);

  const blob = new Blob([byteArray], { type: "application/pdf" });
  const blobUrl = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = blobUrl;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();

  document.body.removeChild(link);
  URL.revokeObjectURL(blobUrl);
}
