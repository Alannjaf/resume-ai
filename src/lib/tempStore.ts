import { ResumeData } from '@/types/resume';

// Shared temporary store for PDF generation
export const tempStore = new Map<string, { 
  data: ResumeData; 
  template: string; 
  userId: string; 
  createdAt: number 
}>();

// Clean up old entries every hour
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of tempStore.entries()) {
    if (now - value.createdAt > 3600000) { // 1 hour
      tempStore.delete(key);
    }
  }
}, 3600000);