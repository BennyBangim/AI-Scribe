import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

interface PDFContent {
  transcription: string;
  summary: {
    narrative: string;
    keyPoints: string[];
  };
  title: string;
}

export async function generatePDF(content: PDFContent): Promise<Blob> {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  const contentWidth = pageWidth - 2 * margin;

  // Set up fonts
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.setTextColor(0, 0, 0);

  // Add title
  const titleLines = doc.splitTextToSize(content.title, contentWidth);
  doc.text(titleLines, pageWidth / 2, 20, { align: 'center' });

  // Add date
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text(new Date().toLocaleDateString(), margin, 30);

  let yPosition = 40;

  // Add summary section
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('Summary', margin, yPosition);
  yPosition += 10;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(12);
  const summaryLines = doc.splitTextToSize(content.summary.narrative, contentWidth);
  doc.text(summaryLines, margin, yPosition);
  yPosition += summaryLines.length * 7 + 10;

  // Add key points section
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('Key Points', margin, yPosition);
  yPosition += 10;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(12);
  content.summary.keyPoints.forEach((point) => {
    const bulletPoint = '• ' + point;
    const pointLines = doc.splitTextToSize(bulletPoint, contentWidth);
    doc.text(pointLines, margin, yPosition);
    yPosition += pointLines.length * 7 + 5;

    // Add new page if needed
    if (yPosition > doc.internal.pageSize.getHeight() - margin) {
      doc.addPage();
      yPosition = margin + 10;
    }
  });

  // Add transcription section
  yPosition += 10;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('Transcription', margin, yPosition);
  yPosition += 10;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(12);
  const transcriptionLines = doc.splitTextToSize(content.transcription, contentWidth);
  
  // Split transcription into pages if needed
  for (let i = 0; i < transcriptionLines.length; i++) {
    if (yPosition > doc.internal.pageSize.getHeight() - margin) {
      doc.addPage();
      yPosition = margin + 10;
    }
    doc.text(transcriptionLines[i], margin, yPosition);
    yPosition += 7;
  }

  // Add page numbers
  const pageCount = doc.internal.getNumberOfPages();
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.text(`Page ${i} of ${pageCount}`, pageWidth / 2, doc.internal.pageSize.getHeight() - 10, {
      align: 'center'
    });
  }

  return doc.output('blob');
} 