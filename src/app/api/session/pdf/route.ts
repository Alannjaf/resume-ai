import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { checkUserLimits } from '@/lib/db';
import { getTemplate } from '@/lib/getTemplate';
import { generateWatermarkedPDF } from '@/lib/watermarkedTemplate';
import { pdf } from '@react-pdf/renderer';
import React from 'react';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { resumeData, template } = body;

    if (!resumeData || !template) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Get user limits and available templates
    const limits = await checkUserLimits(userId);
    
    if (!limits.subscription) {
      return NextResponse.json({ error: 'User subscription not found' }, { status: 404 });
    }

    // Check if user has access to the template
    const hasAccess = limits.availableTemplates?.includes(template) || false;
    
    let buffer: ArrayBuffer;
    
    if (hasAccess) {
      // Generate clean PDF for accessible templates
      const templateComponent = getTemplate(template, resumeData);
      
      if (!templateComponent) {
        return NextResponse.json({ error: 'Template not found' }, { status: 404 });
      }

      const pdfDoc = pdf(React.createElement(templateComponent.type, templateComponent.props));
      const blob = await pdfDoc.toBlob();
      buffer = await blob.arrayBuffer();
    } else {
      // Generate watermarked PDF for restricted templates
      const watermarkedPDFBytes = await generateWatermarkedPDF(template, resumeData);
      buffer = watermarkedPDFBytes.buffer.slice() as ArrayBuffer;
    }
    
    // Convert buffer to base64 for secure transmission
    const base64 = Buffer.from(buffer).toString('base64');


    // Return base64 encoded PDF with access information
    return NextResponse.json({
      pdf: base64,
      hasAccess,
      template,
      mimeType: 'application/pdf'
    });
  } catch (error) {
    console.error('Session PDF generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate preview PDF' },
      { status: 500 }
    );
  }
}