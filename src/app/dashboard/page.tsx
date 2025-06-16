'use client'

import { UserButton } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Plus, FileText, Settings, Edit, Trash2, Calendar, MoreVertical, Shield, ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { useAdmin } from '@/hooks/useAdmin'
import toast from 'react-hot-toast'

interface Resume {
  id: string
  title: string
  createdAt: string
  updatedAt: string
  personalInfo: {
    fullName: string
    email: string
  }
}

export default function Dashboard() {
  const router = useRouter()
  const [resumes, setResumes] = useState<Resume[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const { isAdmin } = useAdmin()

  // Fetch user's resumes
  useEffect(() => {
    const fetchResumes = async () => {
      try {
        const response = await fetch('/api/resumes')
        if (response.ok) {
          const data = await response.json()
          setResumes(data.resumes || [])
        } else {
          console.error('Failed to fetch resumes')
        }
      } catch (error) {
        console.error('Error fetching resumes:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchResumes()
  }, [])

  const handleDeleteResume = async (resumeId: string) => {
    // Show a warning toast with confirmation
    const toastId = toast.custom(
      (t) => (
        <div className={`${
          t.visible ? 'animate-enter' : 'animate-leave'
        } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}>
          <div className="flex-1 w-0 p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 pt-0.5">
                <div className="h-10 w-10 flex items-center justify-center rounded-full bg-red-100">
                  <Trash2 className="h-5 w-5 text-red-600" />
                </div>
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-gray-900">
                  Delete Resume?
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  This action cannot be undone. The resume will be permanently deleted.
                </p>
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={async () => {
                      toast.dismiss(t.id)
                      setDeletingId(resumeId)
                      try {
                        const response = await fetch(`/api/resumes/${resumeId}`, {
                          method: 'DELETE'
                        })

                        if (response.ok) {
                          setResumes(resumes.filter(resume => resume.id !== resumeId))
                          toast.success('Resume deleted successfully')
                        } else {
                          toast.error('Failed to delete resume. Please try again.')
                        }
                      } catch (error) {
                        toast.error('Error deleting resume. Please try again.')
                      } finally {
                        setDeletingId(null)
                      }
                    }}
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => toast.dismiss(t.id)}
                    className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
      {
        duration: 10000,
        position: 'top-center',
      }
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push('/')}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Home
              </Button>
              <div 
                className="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => router.push('/')}
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
                  <span className="text-sm font-bold">RA</span>
                </div>
                <span className="text-xl font-bold">ResumeAI</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {isAdmin && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push('/admin')}
                  className="flex items-center gap-2"
                >
                  <Shield className="h-4 w-4" />
                  Admin
                </Button>
              )}
              <UserButton />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome to your dashboard</h1>
          <p className="mt-2 text-gray-600">Create and manage your professional resumes</p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Button 
            className="h-32 flex flex-col items-center justify-center space-y-2"
            onClick={() => router.push('/resume-builder')}
          >
            <Plus className="h-8 w-8" />
            <span className="text-lg font-medium">Create New Resume</span>
          </Button>
          
          <Button variant="outline" className="h-32 flex flex-col items-center justify-center space-y-2">
            <FileText className="h-8 w-8" />
            <span className="text-lg font-medium">Browse Templates</span>
          </Button>
          
          <Button 
            variant="outline" 
            className="h-32 flex flex-col items-center justify-center space-y-2"
            onClick={() => router.push('/billing')}
          >
            <Settings className="h-8 w-8" />
            <span className="text-lg font-medium">Subscription & Billing</span>
          </Button>
        </div>

        {/* Recent Resumes */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Your Resumes</h2>
            <Button
              onClick={() => router.push('/resume-builder')}
              size="sm"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Resume
            </Button>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full" />
              <span className="ml-3 text-gray-600">Loading your resumes...</span>
            </div>
          ) : resumes.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No resumes yet</h3>
              <p className="mt-1 text-sm text-gray-500">Get started by creating your first resume</p>
              <div className="mt-6">
                <Button onClick={() => router.push('/resume-builder')}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Resume
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {resumes.map((resume) => (
                <Card key={resume.id} className="p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate">{resume.title}</h3>
                      <p className="text-sm text-gray-600 truncate">
                        {resume.personalInfo?.fullName || 'Untitled Resume'}
                      </p>
                    </div>
                    <div className="flex space-x-1 ml-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.push(`/resume-builder?id=${resume.id}`)}
                        className="h-8 w-8 p-0"
                        title="Edit resume"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteResume(resume.id)}
                        disabled={deletingId === resume.id}
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                        title="Delete resume"
                      >
                        {deletingId === resume.id ? (
                          <div className="animate-spin h-4 w-4 border-2 border-red-600 border-t-transparent rounded-full" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex items-center text-xs text-gray-500 mb-3">
                    <Calendar className="h-3 w-3 mr-1" />
                    <span>Updated {formatDate(resume.updatedAt)}</span>
                  </div>

                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => router.push(`/resume-builder?id=${resume.id}`)}
                      className="flex-1"
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        // Open preview modal with the resume data
                        router.push(`/resume-builder?id=${resume.id}&preview=true`)
                      }}
                      className="flex-1"
                    >
                      <FileText className="h-4 w-4 mr-1" />
                      Preview
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}