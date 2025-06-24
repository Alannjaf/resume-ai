export type SubscriptionPlan = 'FREE' | 'BASIC' | 'PRO';

export interface SubscriptionData {
  plan: SubscriptionPlan;
  resumeCount: number;
  resumeLimit: number;
  photoUploadsCount: number;
  photoUploadsLimit: number;
  aiUsageCount: number;
  aiUsageLimit: number;
  exportCount: number;
  exportLimit: number;
  isActive: boolean;
}

export interface SubscriptionPermissions {
  canCreateResume: boolean;
  canUploadPhoto: boolean;
  canAccessProTemplates: boolean;
  canExportToPDF: boolean;
  canUseAI: boolean;
}

export interface SubscriptionContextType {
  subscription: SubscriptionData | null;
  permissions: SubscriptionPermissions | null;
  availableTemplates: string[];
  isLoading: boolean;
  error: string | null;
  refreshSubscription: () => Promise<void>;
  checkPermission: (permission: keyof SubscriptionPermissions) => boolean;
}

export interface SubscriptionResponse {
  currentPlan: SubscriptionPlan;
  resumesUsed: number;
  resumesLimit: number;
  aiUsageCount: number;
  aiUsageLimit: number;
  exportCount: number;
  exportLimit: number;
  importCount: number;
  importLimit: number;
}