import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { checkUserLimits } from '@/lib/db';
import { getTemplate } from '@/lib/getTemplate';
import { generateWatermarkedPDF } from '@/lib/watermarkedTemplate';
import { pdf } from '@react-pdf/renderer';
import { prisma } from '@/lib/prisma';
import { ResumeData } from '@/types/resume';
import React from 'react';

type Action = 'preview' | 'download';

interface RequestBody {
  resumeData: ResumeData;
  template: string;
  action: Action;
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body: RequestBody = await request.json();
    const { resumeData, template, action = 'preview' } = body;

    if (!resumeData || !template) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (!['preview', 'download'].includes(action)) {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    // Get user limits and available templates
    const limits = await checkUserLimits(userId);
    
    if (!limits.subscription) {
      return NextResponse.json({ error: 'User subscription not found' }, { status: 404 });
    }

    // Check if user has access to the template
    const hasAccess = limits.availableTemplates?.includes(template) || false;
    
    let buffer: ArrayBuffer;
    const shouldWatermark = !hasAccess;

    // For downloads, we need additional validation
    if (action === 'download') {
      // Block download for restricted templates - user must upgrade
      if (!hasAccess) {
        return NextResponse.json({ 
          error: 'Upgrade required to download this template. Please upgrade your plan.' 
        }, { status: 403 });
      }

      // Check export limits
      if (!limits.canExport) {
        return NextResponse.json({ 
          error: 'Export limit reached. Please upgrade your plan to download more resumes.' 
        }, { status: 403 });
      }

      // Increment export count for downloads
      await prisma.subscription.update({
        where: { id: limits.subscription.id },
        data: { exportCount: { increment: 1 } }
      });
    }

    // Generate PDF
    if (shouldWatermark) {
      // Generate watermarked PDF for restricted templates
      const watermarkedPDFBytes = await generateWatermarkedPDF(template, resumeData);
      buffer = watermarkedPDFBytes.buffer.slice(
        watermarkedPDFBytes.byteOffset,
        watermarkedPDFBytes.byteOffset + watermarkedPDFBytes.byteLength
      ) as ArrayBuffer;
    } else {
      // Generate clean PDF for accessible templates
      const templateComponent = getTemplate(template, resumeData);
      
      if (!templateComponent) {
        return NextResponse.json({ error: 'Template not found' }, { status: 404 });
      }

      const pdfDoc = pdf(React.createElement(templateComponent.type, templateComponent.props));
      const blob = await pdfDoc.toBlob();
      buffer = await blob.arrayBuffer();
    }
    
    // Convert buffer to base64 for secure transmission
    const base64 = Buffer.from(buffer).toString('base64');

    // Return base64 encoded PDF with access information
    return NextResponse.json({
      pdf: base64,
      hasAccess,
      template,
      action,
      watermarked: shouldWatermark,
      mimeType: 'application/pdf'
    });
  } catch {
    return NextResponse.json(
      { error: 'Failed to generate PDF' },
      { status: 500 }
    );
  }
}

