import React from 'react';
import { ResumeData } from '../types/resume';
import EnhancedModernTemplate from '../components/resume-pdf/EnhancedModernTemplate';
import { CreativeTemplate } from '../components/resume-pdf/CreativeTemplate';
import { ExecutiveProfessionalTemplate } from '../components/resume-pdf/ExecutiveProfessionalTemplate';
import { ElegantProfessionalTemplate } from '../components/resume-pdf/ElegantProfessionalTemplate';
import { MinimalistModernTemplate } from '../components/resume-pdf/MinimalistModernTemplate';
import { CreativeArtisticTemplate } from '../components/resume-pdf/CreativeArtisticTemplate';
import { DeveloperTemplate } from '../components/resume-pdf/DeveloperTemplate';

export const getTemplate = (template: string, data: ResumeData) => {
  // Note: watermarking is now handled at the API level using pdf-lib
  // This function always returns the clean template
  
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