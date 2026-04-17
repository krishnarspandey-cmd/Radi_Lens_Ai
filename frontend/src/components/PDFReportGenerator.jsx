import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import './PDFReportGenerator.css';

export default function PDFReportGenerator() {
  const generatePDF = async () => {
    // We will capture the whole .card which contains all the results
    const element = document.querySelector('.result-capture-zone');
    if (!element) return;
    
    // Optional: add a class to adjust styling for print if needed
    element.classList.add('generating-pdf');
    
    try {
      const canvas = await html2canvas(element, {
        scale: 1.5,
        useCORS: true,
        backgroundColor: '#060b18', // match site background
      });
      
      const imgData = canvas.toDataURL('image/jpeg', 0.8);
      
      // Calculate dimensions (A4 size)
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      // Add standard header
      pdf.setFontSize(16);
      pdf.setTextColor(40, 40, 40);
      pdf.text('RadiLens AI — Pneumonia Detection Report', 10, 15);
      
      pdf.setFontSize(10);
      pdf.setTextColor(100, 100, 100);
      pdf.text(`Generated on: ${new Date().toLocaleString()}`, 10, 22);
      
      pdf.line(10, 25, pdfWidth - 10, 25);
      
      // Add the captured image (offset by header)
      pdf.addImage(imgData, 'JPEG', 0, 30, pdfWidth, pdfHeight);
      
      // Add footer disclaimer
      const pageHeight = pdf.internal.pageSize.getHeight();
      pdf.setFontSize(8);
      pdf.setTextColor(150, 0, 0);
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
    <div className="pdf-generator-wrap">
      <button className="btn-secondary" onClick={generatePDF}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
           <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Download PDF Report
      </button>
    </div>
  );
}
