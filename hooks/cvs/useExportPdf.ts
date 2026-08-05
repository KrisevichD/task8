import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { useRef, useState } from "react";

export default function useExportPdf() {
  const printRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);

  const handleDownloadPdf = async (): Promise<void> => {
    const element = printRef.current;
    if (!element) return;

    await document.fonts.ready;

    try {
      setIsExporting(true);
      const canvas = await html2canvas(element, {
        scale: 2, 
        useCORS: true, 
        logging: false,
      });

      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const imgWidth = 210; 
      const pageHeight = 295; 
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save("resume-or-report.pdf");
    } catch (error) {
      console.error("Ошибка при генерации PDF:", error);
    } finally {
      setIsExporting(false);
    }
  };

  return {
    printRef,
    isExporting,
    handleDownloadPdf,
  };
}
