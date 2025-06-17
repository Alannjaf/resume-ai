'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { AppHeader } from '@/components/shared/AppHeader'
import { 
  Search, 
  RefreshCw, 
  User, 
  Mail, 
  Calendar,
  Crown,
  CreditCard,
  MoreVertical,
  Check,
  X
} from 'lucide-react'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'

interface UserData {
  id: string
  clerkId: string
  email: string
  name: string | null
  role: string
  createdAt: string
  subscription: {
    plan: string
    status: string
    resumeCount: number
    aiUsageCount: number
  } | null
}

export function UserManagement() {
  const router = useRouter()
  const [users, setUsers] = useState<UserData[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [upgrading, setUpgrading] = useState(false)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/users')
      if (response.ok) {
        const data = await response.json()
        setUsers(data.users)
      }
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setLoading(false)
    }
  }

  const upgradeUserPlan = async (userId: string, newPlan: string) => {
    setUpgrading(true)
    try {
      const response = await fetch(`/api/admin/users/${userId}/upgrade`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: newPlan })
      })

      if (response.ok) {
        toast.success('User plan upgraded successfully!')
        setShowUpgradeModal(false)
        setSelectedUser(null)
        fetchUsers()
      } else {
        toast.error('Failed to upgrade user plan')
      }
    } catch (error) {
      toast.error('Error upgrading user plan')
    } finally {
      setUpgrading(false)
    }
  }

  const filteredUsers = users.filter(user => 
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.name?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader 
        title="User Management"
        showBackButton={true}
        backButtonText="Back to Admin Dashboard"
        backButtonHref="/admin"
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600 mt-2">Manage users and their subscriptions</p>
        </div>

        {/* Search and Actions */}
        <Card className="p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by email or name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button onClick={fetchUsers} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </Card>

        {/* Users List */}
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto" />
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredUsers.map((user) => (
              <Card key={user.id} className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                      <User className="h-6 w-6 text-gray-600" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold text-gray-900">
                          {user.name || 'No name'}
                        </h3>
                        {user.role === 'ADMIN' && (
                          <Badge variant="secondary" className="flex items-center gap-1">
                            <Crown className="h-3 w-3" />
                            Admin
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span className="flex items-center">
                          <Mail className="h-3 w-3 mr-1" />
                          {user.email}
                        </span>
                        <span className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          Joined {new Date(user.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <Badge variant={user.subscription?.plan === 'PRO' ? 'default' : 'outline'}>
                        {user.subscription?.plan || 'NO PLAN'}
                      </Badge>
                      <div className="text-xs text-gray-600 mt-1">
                        {user.subscription && (
                          <>
                            {user.subscription.resumeCount} resumes • 
                            {user.subscription.aiUsageCount} AI uses
                          </>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedUser(user)
                        setShowUpgradeModal(true)
                      }}
                    >
                      <CreditCard className="h-4 w-4 mr-2" />
                      Manage Plan
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Upgrade Modal */}
        {showUpgradeModal && selectedUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Card className="w-full max-w-md p-6">
              <h3 className="text-lg font-semibold mb-4">Manage User Subscription</h3>
              
              <div className="mb-4">
                <p className="text-sm text-gray-600">User: {selectedUser.email}</p>
                <div className="text-sm text-gray-600 flex items-center gap-2">
                  <span>Current Plan:</span>
                  <Badge variant="outline">{selectedUser.subscription?.plan || 'NONE'}</Badge>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <Button
                  className="w-full justify-start"
                  variant={selectedUser.subscription?.plan === 'FREE' ? 'default' : 'outline'}
                  onClick={() => upgradeUserPlan(selectedUser.id, 'FREE')}
                  disabled={upgrading || selectedUser.subscription?.plan === 'FREE'}
                >
                  {selectedUser.subscription?.plan === 'FREE' && <Check className="h-4 w-4 mr-2" />}
                  Free Plan
                </Button>
                
                <Button
                  className="w-full justify-start"
                  variant={selectedUser.subscription?.plan === 'BASIC' ? 'default' : 'outline'}
                  onClick={() => upgradeUserPlan(selectedUser.id, 'BASIC')}
                  disabled={upgrading || selectedUser.subscription?.plan === 'BASIC'}
                >
                  {selectedUser.subscription?.plan === 'BASIC' && <Check className="h-4 w-4 mr-2" />}
                  Basic Plan (5,000 IQD/mo)
                </Button>
                
                <Button
                  className="w-full justify-start"
                  variant={selectedUser.subscription?.plan === 'PRO' ? 'default' : 'outline'}
                  onClick={() => upgradeUserPlan(selectedUser.id, 'PRO')}
                  disabled={upgrading || selectedUser.subscription?.plan === 'PRO'}
                >
                  {selectedUser.subscription?.plan === 'PRO' && <Check className="h-4 w-4 mr-2" />}
                  Pro Plan (10,000 IQD/mo)
                </Button>
              </div>

              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowUpgradeModal(false)
                    setSelectedUser(null)
                  }}
                  disabled={upgrading}
                >
                  Cancel
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}