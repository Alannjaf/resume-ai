export interface Stats {
  totalUsers: number
  totalResumes: number
  activeSubscriptions: number
  revenue: number
}

export interface SubscriptionStatus {
  expired: {
    count: number
    subscriptions: Array<{
      userId: string
      userEmail: string
      userName: string
      plan: string
      endDate: string
      daysOverdue: number
    }>
  }
  expiringSoon: {
    count: number
    subscriptions: Array<{
      userId: string
      userEmail: string
      userName: string
      plan: string
      endDate: string
      daysUntilExpiry: number
    }>
  }
}

export interface SystemSettings {
  maxFreeResumes: number
  maxFreeAIUsage: number
  maxFreeExports: number
  maxFreeImports: number
  maxBasicResumes: number
  maxBasicAIUsage: number
  maxBasicExports: number
  maxBasicImports: number
  maxProResumes: number
  maxProAIUsage: number
  maxProExports: number
  maxProImports: number
  freeTemplates: string[]
  basicTemplates: string[]
  proTemplates: string[]
  photoUploadPlans: string[]
  basicPlanPrice: number
  proPlanPrice: number
  maintenanceMode: boolean
}

