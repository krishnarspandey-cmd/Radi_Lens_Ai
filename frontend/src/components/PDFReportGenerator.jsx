import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

export default function PDFReportGenerator() {
  const generatePDF = async () => {
    const element = document.querySelector('.result-capture-zone');
    if (!element) return;

    element.classList.add('generating-pdf');

    try {
      const canvas = await html2canvas(element, {
        scale: 1.5,
        useCORS: true,
        backgroundColor: '#ffffff',
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.8);

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      // Header
      pdf.setFontSize(16);
      pdf.setTextColor(0, 93, 172); // Primary blue
      pdf.text('RadiLens AI — Pneumonia Detection Report', 10, 15);

      pdf.setFontSize(10);
      pdf.setTextColor(100, 100, 100);
      pdf.text(`Generated on: ${new Date().toLocaleString()}`, 10, 22);

      pdf.setDrawColor(193, 198, 212); // outline-variant
      pdf.line(10, 25, pdfWidth - 10, 25);

      // Content
      pdf.addImage(imgData, 'JPEG', 0, 30, pdfWidth, pdfHeight);

      // Footer
      const pageHeight = pdf.internal.pageSize.getHeight();
      pdf.setFontSize(8);
      pdf.setTextColor(186, 26, 26); // Error red
      pdf.text('DISCLAIMER: For research use only. Not for clinical use.', 10, pageHeight - 10);

      pdf.save(`radilens-report-${Date.now()}.pdf`);
    } catch (err) {
      console.error('Failed to generate PDF:', err);
      alert('Failed to generate PDF. See console for details.');
    } finally {
      element.classList.remove('generating-pdf');
    }
  };

  return (
    <button
      onClick={generatePDF}
      className="flex-1 bg-primary text-on-primary text-title-sm py-md rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
    >
      <span className="material-symbols-outlined">download</span>
      Download PDF
    </button>
  );
}
