'use client'

import { Card } from '@/components/ui/card'
import { Users, DollarSign, FileText } from 'lucide-react'

interface Stats {
  totalUsers: number
  totalResumes: number
  activeSubscriptions: number
  revenue: number
}

interface AdminStatsCardsProps {
  stats: Stats | null
}

export function AdminStatsCards({ stats }: AdminStatsCardsProps) {
  return (
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
  )
}

