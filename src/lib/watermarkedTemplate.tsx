import { pdf } from '@react-pdf/renderer';
import { ResumeData } from '../types/resume';
import { PDFDocument, rgb, degrees } from 'pdf-lib';
import React from 'react';
import EnhancedModernTemplate from '../components/resume-pdf/EnhancedModernTemplate';
import { CreativeTemplate } from '../components/resume-pdf/CreativeTemplate';
import { ExecutiveProfessionalTemplate } from '../components/resume-pdf/ExecutiveProfessionalTemplate';
import { ElegantProfessionalTemplate } from '../components/resume-pdf/ElegantProfessionalTemplate';
import { MinimalistModernTemplate } from '../components/resume-pdf/MinimalistModernTemplate';
import { CreativeArtisticTemplate } from '../components/resume-pdf/CreativeArtisticTemplate';
import { DeveloperTemplate } from '../components/resume-pdf/DeveloperTemplate';

// Get the actual template component
export const getTemplateComponent = (template: string, data: ResumeData) => {
  switch (template) {
    case 'creative':
      return <CreativeTemplate data={data} />;
    case 'executive':
      return <ExecutiveProfessionalTemplate data={data} />;
    case 'elegant':
      return <ElegantProfessionalTemplate data={data} />;
    case 'minimalist':
      return <MinimalistModernTemplate data={data} />;
    case 'creative-artistic':
      return <CreativeArtisticTemplate data={data} />;
    case 'developer':
      return <DeveloperTemplate data={data} />;
    case 'modern':
    default:
      return <EnhancedModernTemplate data={data} />;
  }
};

// Function to add watermarks to existing PDF using pdf-lib
export const addWatermarkToPDF = async (pdfBytes: Uint8Array): Promise<Uint8Array> => {
  const pdfDoc = await PDFDocument.load(pdfBytes);
  const pages = pdfDoc.getPages();

  // Watermark text
  const watermarkText = 'PREVIEW ONLY';
  const subText = 'Upgrade Required';

  for (const page of pages) {
    const { width, height } = page.getSize();
    
    // Add multiple watermark instances for better coverage
    const watermarkPositions = [
      { x: width * 0.25, y: height * 0.75, rotation: degrees(-45) },
      { x: width * 0.5, y: height * 0.5, rotation: degrees(-45) },
      { x: width * 0.75, y: height * 0.25, rotation: degrees(-45) },
      { x: width * 0.3, y: height * 0.3, rotation: degrees(-45) },
      { x: width * 0.7, y: height * 0.7, rotation: degrees(-45) },
    ];

    watermarkPositions.forEach(({ x, y, rotation }) => {
      // Main watermark text
      page.drawText(watermarkText, {
        x: x - 60,
        y: y,
        size: 28,
        color: rgb(1, 0, 0),
        opacity: 0.15,
        rotate: rotation,
      });

      // Sub text
      page.drawText(subText, {
        x: x - 45,
        y: y - 25,
        size: 14,
        color: rgb(1, 0, 0),
        opacity: 0.15,
        rotate: rotation,
      });
    });
  }

  return await pdfDoc.save();
};

// Generate watermarked PDF using actual template
export const generateWatermarkedPDF = async (template: string, data: ResumeData): Promise<Uint8Array> => {
  // Get the actual template component
  const templateComponent = getTemplateComponent(template, data);
  
  // Generate PDF from the actual template
  const pdfDoc = pdf(templateComponent);
  const pdfBlob = await pdfDoc.toBlob();
  const arrayBuffer = await pdfBlob.arrayBuffer();
  const uint8Array = new Uint8Array(arrayBuffer);
  
  // Add watermarks to the PDF
  const watermarkedPDF = await addWatermarkToPDF(uint8Array);
  
  return watermarkedPDF;
};