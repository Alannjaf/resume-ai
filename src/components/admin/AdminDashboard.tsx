'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { AppHeader } from '@/components/shared/AppHeader'
import { 
  Users, 
  FileText, 
  Settings, 
  DollarSign,
  Save,
  RefreshCw
} from 'lucide-react'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { getTemplateIds } from '@/lib/templates'
import { useLanguage } from '@/contexts/LanguageContext'

interface Stats {
  totalUsers: number
  totalResumes: number
  activeSubscriptions: number
  revenue: number
}

interface SystemSettings {
  // Free Plan Limits
  maxFreeResumes: number
  maxFreeAIUsage: number
  maxFreeExports: number
  maxFreeImports: number
  
  // Basic Plan Limits
  maxBasicResumes: number
  maxBasicAIUsage: number
  maxBasicExports: number
  maxBasicImports: number
  
  // Pro Plan Limits
  maxProResumes: number
  maxProAIUsage: number
  maxProExports: number
  maxProImports: number
  
  // Template Access Control
  freeTemplates: string[]
  basicTemplates: string[]
  proTemplates: string[]
  
  // Profile Photo Upload Access Control
  photoUploadPlans: string[]
  
  // Pricing
  basicPlanPrice: number
  proPlanPrice: number
  maintenanceMode: boolean
}

export function AdminDashboard() {
  const router = useRouter()
  const { t } = useLanguage()
  const availableTemplates = getTemplateIds() // Get all templates dynamically
  const [stats, setStats] = useState<Stats | null>(null)
  const [settings, setSettings] = useState<SystemSettings>({
    // Free Plan Limits
    maxFreeResumes: 10,
    maxFreeAIUsage: 100,
    maxFreeExports: 20,
    maxFreeImports: 0,
    
    // Basic Plan Limits
    maxBasicResumes: 50,
    maxBasicAIUsage: 500,
    maxBasicExports: 100,
    maxBasicImports: 0,
    
    // Pro Plan Limits
    maxProResumes: -1,
    maxProAIUsage: -1,
    maxProExports: -1,
    maxProImports: -1,
    
    // Template Access Control
    freeTemplates: ['modern'],
    basicTemplates: ['modern', 'creative'],
    proTemplates: availableTemplates, // All templates for PRO by default
    
    // Profile Photo Upload Access Control
    photoUploadPlans: ['BASIC', 'PRO'],
    
    // Pricing
    basicPlanPrice: 5000,
    proPlanPrice: 10000,
    maintenanceMode: false
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchStats()
    fetchSettings()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/stats')
      const data = await response.json()
      setStats(data)
    } catch (error) {
      // Silent error handling
    }
  }

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/admin/settings')
      const data = await response.json()
      
      // Ensure all fields are defined with fallback values
      const newSettings = {
        // Free Plan Limits
        maxFreeResumes: data.maxFreeResumes ?? 10,
        maxFreeAIUsage: data.maxFreeAIUsage ?? 100,
        maxFreeExports: data.maxFreeExports ?? 20,
        maxFreeImports: data.maxFreeImports ?? 0,
        
        // Basic Plan Limits
        maxBasicResumes: data.maxBasicResumes ?? 50,
        maxBasicAIUsage: data.maxBasicAIUsage ?? 500,
        maxBasicExports: data.maxBasicExports ?? 100,
        maxBasicImports: data.maxBasicImports ?? 0,
        
        // Pro Plan Limits
        maxProResumes: data.maxProResumes ?? -1,
        maxProAIUsage: data.maxProAIUsage ?? -1,
        maxProExports: data.maxProExports ?? -1,
        maxProImports: data.maxProImports ?? -1,
        
        // Template Access Control
        freeTemplates: Array.isArray(data.freeTemplates) ? data.freeTemplates : 
          (data.freeTemplates ? JSON.parse(data.freeTemplates) : ['modern']),
        basicTemplates: Array.isArray(data.basicTemplates) ? data.basicTemplates : 
          (data.basicTemplates ? JSON.parse(data.basicTemplates) : ['modern', 'creative']),
        proTemplates: Array.isArray(data.proTemplates) ? data.proTemplates : 
          (data.proTemplates ? JSON.parse(data.proTemplates) : availableTemplates),
        
        // Profile Photo Upload Access Control
        photoUploadPlans: Array.isArray(data.photoUploadPlans) ? data.photoUploadPlans : 
          (data.photoUploadPlans ? JSON.parse(data.photoUploadPlans) : ['BASIC', 'PRO']),
        
        // Pricing
        basicPlanPrice: data.basicPlanPrice ?? 5000,
        proPlanPrice: data.proPlanPrice ?? 10000,
        maintenanceMode: data.maintenanceMode ?? false
      }
      setSettings(newSettings)
    } catch (error) {
      // Silent error handling
    } finally {
      setLoading(false)
    }
  }

  const saveSettings = async () => {
    setSaving(true)
    try {
      const response = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      })
      if (response.ok) {
        toast.success('Settings saved successfully!')
      } else {
        toast.error('Failed to save settings')
      }
    } catch (error) {
      toast.error('Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader 
        title="Admin Dashboard"
        showBackButton={true}
        backButtonText={t('pages.resumeBuilder.backToDashboard')}
        backButtonHref="/dashboard"
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage your Work.krd platform</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Users</p>
                <p className="text-2xl font-bold">{stats?.totalUsers || 0}</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Resumes</p>
                <p className="text-2xl font-bold">{stats?.totalResumes || 0}</p>
              </div>
              <FileText className="h-8 w-8 text-green-500" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Subscriptions</p>
                <p className="text-2xl font-bold">{stats?.activeSubscriptions || 0}</p>
              </div>
              <DollarSign className="h-8 w-8 text-purple-500" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Monthly Revenue</p>
                <p className="text-2xl font-bold">{(stats?.revenue || 0).toLocaleString()} IQD</p>
              </div>
              <DollarSign className="h-8 w-8 text-yellow-500" />
            </div>
          </Card>
        </div>

        {/* Settings Section */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Settings className="h-5 w-5" />
              System Settings
            </h2>
            <Button 
              onClick={fetchStats}
              variant="outline"
              size="sm"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>

          <div className="space-y-8">
            {/* Free Plan Settings */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4 pb-2 border-b">Free Plan Limits</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Max Resumes</label>
                  <Input
                    type="number"
                    min="0"
                    value={settings.maxFreeResumes}
                    onChange={(e) => setSettings({
                      ...settings,
                      maxFreeResumes: e.target.value === '' ? 0 : parseInt(e.target.value) || 0
                    })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Max AI Usage</label>
                  <Input
                    type="number"
                    min="0"
                    value={settings.maxFreeAIUsage}
                    onChange={(e) => setSettings({
                      ...settings,
                      maxFreeAIUsage: e.target.value === '' ? 0 : parseInt(e.target.value) || 0
                    })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Max Exports</label>
                  <Input
                    type="number"
                    min="0"
                    value={settings.maxFreeExports.toString()}
                    onChange={(e) => {
                      const value = e.target.value === '' ? '0' : e.target.value;
                      const numValue = parseInt(value, 10);
                      if (!isNaN(numValue) && numValue >= 0) {
                        setSettings({
                          ...settings,
                          maxFreeExports: numValue
                        });
                      }
                    }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Max Imports</label>
                  <Input
                    type="number"
                    min="0"
                    value={settings.maxFreeImports}
                    onChange={(e) => setSettings({
                      ...settings,
                      maxFreeImports: e.target.value === '' ? 0 : parseInt(e.target.value) || 0
                    })}
                  />
                </div>
              </div>
            </div>

            {/* Basic Plan Settings */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4 pb-2 border-b">Basic Plan Limits</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Max Resumes</label>
                  <Input
                    type="number"
                    min="0"
                    value={settings.maxBasicResumes}
                    onChange={(e) => setSettings({
                      ...settings,
                      maxBasicResumes: e.target.value === '' ? 0 : parseInt(e.target.value) || 0
                    })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Max AI Usage</label>
                  <Input
                    type="number"
                    min="0"
                    value={settings.maxBasicAIUsage}
                    onChange={(e) => setSettings({
                      ...settings,
                      maxBasicAIUsage: e.target.value === '' ? 0 : parseInt(e.target.value) || 0
                    })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Max Exports</label>
                  <Input
                    type="number"
                    min="0"
                    value={settings.maxBasicExports}
                    onChange={(e) => setSettings({
                      ...settings,
                      maxBasicExports: e.target.value === '' ? 0 : parseInt(e.target.value) || 0
                    })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Max Imports</label>
                  <Input
                    type="number"
                    min="0"
                    value={settings.maxBasicImports}
                    onChange={(e) => setSettings({
                      ...settings,
                      maxBasicImports: e.target.value === '' ? 0 : parseInt(e.target.value) || 0
                    })}
                  />
                </div>
              </div>
            </div>

            {/* Pro Plan Settings */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4 pb-2 border-b">Pro Plan Limits</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Max Resumes (-1 = Unlimited)</label>
                  <Input
                    type="number"
                    min="-1"
                    value={settings.maxProResumes}
                    onChange={(e) => setSettings({
                      ...settings,
                      maxProResumes: e.target.value === '' ? 0 : parseInt(e.target.value) || 0
                    })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Max AI Usage (-1 = Unlimited)</label>
                  <Input
                    type="number"
                    min="-1"
                    value={settings.maxProAIUsage}
                    onChange={(e) => setSettings({
                      ...settings,
                      maxProAIUsage: e.target.value === '' ? 0 : parseInt(e.target.value) || 0
                    })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Max Exports (-1 = Unlimited)</label>
                  <Input
                    type="number"
                    min="-1"
                    value={settings.maxProExports}
                    onChange={(e) => setSettings({
                      ...settings,
                      maxProExports: e.target.value === '' ? 0 : parseInt(e.target.value) || 0
                    })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Max Imports (-1 = Unlimited)</label>
                  <Input
                    type="number"
                    min="-1"
                    value={settings.maxProImports}
                    onChange={(e) => setSettings({
                      ...settings,
                      maxProImports: e.target.value === '' ? 0 : parseInt(e.target.value) || 0
                    })}
                  />
                </div>
              </div>
            </div>

            {/* Template Access Control */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4 pb-2 border-b">Template Access Control</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Free Plan Templates</label>
                  <div className="space-y-2">
                    {availableTemplates.map(template => (
                      <label key={template} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={settings.freeTemplates.includes(template)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSettings({
                                ...settings,
                                freeTemplates: [...settings.freeTemplates, template]
                              })
                            } else {
                              setSettings({
                                ...settings,
                                freeTemplates: settings.freeTemplates.filter(t => t !== template)
                              })
                            }
                          }}
                          className="rounded"
                        />
                        <span className="text-sm capitalize">{template}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Basic Plan Templates</label>
                  <div className="space-y-2">
                    {availableTemplates.map(template => (
                      <label key={template} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={settings.basicTemplates.includes(template)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSettings({
                                ...settings,
                                basicTemplates: [...settings.basicTemplates, template]
                              })
                            } else {
                              setSettings({
                                ...settings,
                                basicTemplates: settings.basicTemplates.filter(t => t !== template)
                              })
                            }
                          }}
                          className="rounded"
                        />
                        <span className="text-sm capitalize">{template}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Pro Plan Templates</label>
                  <div className="space-y-2">
                    {availableTemplates.map(template => (
                      <label key={template} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={settings.proTemplates.includes(template)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSettings({
                                ...settings,
                                proTemplates: [...settings.proTemplates, template]
                              })
                            } else {
                              setSettings({
                                ...settings,
                                proTemplates: settings.proTemplates.filter(t => t !== template)
                              })
                            }
                          }}
                          className="rounded"
                        />
                        <span className="text-sm capitalize">{template}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Photo Upload Access Control */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4 pb-2 border-b">Profile Photo Upload Access</h3>
              <div>
                <label className="block text-sm font-medium mb-2">Plans with Photo Upload Access</label>
                <div className="space-y-2">
                  {['FREE', 'BASIC', 'PRO'].map(plan => (
                    <label key={plan} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={settings.photoUploadPlans.includes(plan)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSettings({
                              ...settings,
                              photoUploadPlans: [...settings.photoUploadPlans, plan]
                            })
                          } else {
                            setSettings({
                              ...settings,
                              photoUploadPlans: settings.photoUploadPlans.filter(p => p !== plan)
                            })
                          }
                        }}
                        className="rounded"
                      />
                      <span className="text-sm">{plan}</span>
                    </label>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Select which subscription plans can upload profile photos
                </p>
              </div>
            </div>

            {/* Pricing Settings */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4 pb-2 border-b">Pricing Settings</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Basic Plan Price (IQD)</label>
                  <Input
                    type="number"
                    min="0"
                    value={settings.basicPlanPrice}
                    onChange={(e) => setSettings({
                      ...settings,
                      basicPlanPrice: e.target.value === '' ? 0 : parseInt(e.target.value) || 0
                    })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Pro Plan Price (IQD)</label>
                  <Input
                    type="number"
                    min="0"
                    value={settings.proPlanPrice}
                    onChange={(e) => setSettings({
                      ...settings,
                      proPlanPrice: e.target.value === '' ? 0 : parseInt(e.target.value) || 0
                    })}
                  />
                </div>
              </div>
            </div>

            {/* System Settings */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4 pb-2 border-b">System Settings</h3>
              <div>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={settings.maintenanceMode}
                    onChange={(e) => setSettings({
                      ...settings,
                      maintenanceMode: e.target.checked
                    })}
                    className="rounded"
                  />
                  <span className="text-sm font-medium">Maintenance Mode</span>
                </label>
                <p className="text-xs text-gray-500 mt-1">
                  When enabled, only admins can access the site
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <Button onClick={saveSettings} disabled={saving}>
              {saving ? (
                <>
                  <div className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Settings
                </>
              )}
            </Button>
          </div>
        </Card>

        {/* Quick Actions */}
        <Card className="p-6 mt-6">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button 
              variant="outline"
              onClick={() => window.location.href = '/admin/users'}
            >
              <Users className="h-4 w-4 mr-2" />
              Manage Users
            </Button>
            <Button 
              variant="outline"
              onClick={() => window.location.href = '/admin/resumes'}
            >
              <FileText className="h-4 w-4 mr-2" />
              View All Resumes
            </Button>
            <Button 
              variant="outline"
              onClick={() => window.location.href = '/admin/subscriptions'}
            >
              <DollarSign className="h-4 w-4 mr-2" />
              Manage Subscriptions
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}