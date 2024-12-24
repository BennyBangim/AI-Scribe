import { jsPDF } from 'jspdf';
import type { ExportOptions, TranscriptionSegment } from '../types';

export async function exportTranscription(
  segments: TranscriptionSegment[],
  summary: { narrative: string; keyPoints: string[] },
  options: ExportOptions
): Promise<Blob> {
  switch (options.format) {
    case 'pdf':
      return exportToPDF(segments, summary, options);
    case 'txt':
      return exportToTXT(segments, summary, options);
    case 'doc':
      return exportToDOC(segments, summary, options);
    default:
      throw new Error(`Unsupported format: ${options.format}`);
  }
}

async function exportToPDF(
  segments: TranscriptionSegment[],
  summary: { narrative: string; keyPoints: string[] },
  options: ExportOptions
): Promise<Blob> {
  const doc = new jsPDF();
  let y = 20;

  doc.setFontSize(20);
  doc.text('Transcription', 20, y);
  y += 20;

  doc.setFontSize(12);
  segments.forEach((segment) => {
    if (options.includeTimestamps) {
      const timestamp = new Date(segment.timestamp).toISOString().substr(11, 8);
      doc.text(`[${timestamp}] `, 20, y);
      doc.text(segment.text, 45, y);
    } else {
      doc.text(segment.text, 20, y);
    }
    y += 10;

    if (y > 280) {
      doc.addPage();
      y = 20;
    }
  });

  if (options.includeSummary && summary) {
    doc.addPage();
    y = 20;
    doc.setFontSize(20);
    doc.text('Summary', 20, y);
    y += 20;

    doc.setFontSize(12);
    doc.text(summary.narrative, 20, y);
    y += 20;

    doc.text('Key Points:', 20, y);
    y += 10;
    summary.keyPoints.forEach((point) => {
      doc.text(`• ${point}`, 25, y);
      y += 10;
    });
  }

  return doc.output('blob');
}

function exportToTXT(
  segments: TranscriptionSegment[],
  summary: { narrative: string; keyPoints: string[] },
  options: ExportOptions
): Promise<Blob> {
  let content = '';

  segments.forEach((segment) => {
    if (options.includeTimestamps) {
      const timestamp = new Date(segment.timestamp).toISOString().substr(11, 8);
      content += `[${timestamp}] `;
    }
    content += `${segment.text}\n`;
  });

  if (options.includeSummary && summary) {
    content += '\n\nSUMMARY\n\n';
    content += summary.narrative;
    content += '\n\nKey Points:\n';
    summary.keyPoints.forEach((point) => {
      content += `• ${point}\n`;
    });
  }

  return Promise.resolve(new Blob([content], { type: 'text/plain' }));
}

function exportToDOC(
  segments: TranscriptionSegment[],
  summary: { narrative: string; keyPoints: string[] },
  options: ExportOptions
): Promise<Blob> {
  let content = '<html><body>';

  content += '<h1>Transcription</h1>';
  segments.forEach((segment) => {
    content += '<p>';
    if (options.includeTimestamps) {
      const timestamp = new Date(segment.timestamp).toISOString().substr(11, 8);
      content += `<span style="color: #666">[${timestamp}]</span> `;
    }
    content += `${segment.text}</p>`;
  });

  if (options.includeSummary && summary) {
    content += '<h1>Summary</h1>';
    content += `<p>${summary.narrative}</p>`;
    content += '<h2>Key Points</h2><ul>';
    summary.keyPoints.forEach((point) => {
      content += `<li>${point}</li>`;
    });
    content += '</ul>';
  }

  content += '</body></html>';

  return Promise.resolve(
    new Blob([content], { type: 'application/msword' })
  );
}