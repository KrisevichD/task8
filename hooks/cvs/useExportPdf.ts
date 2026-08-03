import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { useRef, useState } from "react";

export default function useExportPdf() {
  // 1. Создаем ссылку на блок, который нужно экспортировать
  const printRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);

  // 2. Функция генерации PDF
  const handleDownloadPdf = async () => {
    const element = printRef.current;
    if (!element) return;

    await document.fonts.ready;

    try {
      setIsExporting(true);

      // Шаг А: Превращаем HTML-элемент в холст (Canvas)
      const canvas = await html2canvas(element, {
        scale: 2, // Повышаем качество/разрешение текста (2 или 3 оптимально)
        useCORS: true, // Разрешаем загрузку внешних картинок, если они есть
        logging: false,
      });

      const imgData = canvas.toDataURL("image/png");

      // Шаг Б: Создаем PDF документ формата A4
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      // Рассчитываем пропорции, чтобы контент вписался по ширине страницы A4
      const imgWidth = 210; // Ширина A4 в мм
      const pageHeight = 295; // Высота A4 в мм
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      // Добавляем изображение на первую страницу
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Если контент длинный, автоматически разбиваем его на несколько страниц
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // Шаг В: Скачиваем готовый файл
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
