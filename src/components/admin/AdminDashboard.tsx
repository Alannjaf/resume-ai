'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Users, 
  FileText, 
  Settings, 
  DollarSign,
  Save,
  RefreshCw
} from 'lucide-react'

interface Stats {
  totalUsers: number
  totalResumes: number
  activeSubscriptions: number
  revenue: number
}

interface SystemSettings {
  maxFreeResumes: number
  maxFreeAIUsage: number
  basicPlanPrice: number
  proPlanPrice: number
  maintenanceMode: boolean
}

export function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [settings, setSettings] = useState<SystemSettings>({
    maxFreeResumes: 3,
    maxFreeAIUsage: 10,
    basicPlanPrice: 9.99,
    proPlanPrice: 19.99,
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
      console.error('Error fetching stats:', error)
    }
  }

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/admin/settings')
      const data = await response.json()
      setSettings(data)
    } catch (error) {
      console.error('Error fetching settings:', error)
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
        alert('Settings saved successfully!')
      }
    } catch (error) {
      console.error('Error saving settings:', error)
      alert('Failed to save settings')
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage your ResumeAI platform</p>
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
                <p className="text-sm text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold">${stats?.revenue || 0}</p>
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Max Free Resumes
              </label>
              <Input
                type="number"
                value={settings.maxFreeResumes}
                onChange={(e) => setSettings({
                  ...settings,
                  maxFreeResumes: parseInt(e.target.value) || 0
                })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Max Free AI Usage
              </label>
              <Input
                type="number"
                value={settings.maxFreeAIUsage}
                onChange={(e) => setSettings({
                  ...settings,
                  maxFreeAIUsage: parseInt(e.target.value) || 0
                })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Basic Plan Price ($)
              </label>
              <Input
                type="number"
                step="0.01"
                value={settings.basicPlanPrice}
                onChange={(e) => setSettings({
                  ...settings,
                  basicPlanPrice: parseFloat(e.target.value) || 0
                })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Pro Plan Price ($)
              </label>
              <Input
                type="number"
                step="0.01"
                value={settings.proPlanPrice}
                onChange={(e) => setSettings({
                  ...settings,
                  proPlanPrice: parseFloat(e.target.value) || 0
                })}
              />
            </div>

            <div className="md:col-span-2">
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