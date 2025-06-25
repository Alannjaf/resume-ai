'use client';

import { useState } from 'react';
import { X, Eye } from 'lucide-react';
import { ResumeStatus } from '@prisma/client';
import { AdminResumePreview } from './AdminResumePreview';
import { ResumeData } from '@/types/resume';

interface ResumeWithUser {
  id: string;
  title: string;
  status: ResumeStatus;
  template: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    email: string;
    name: string | null;
  };
  _count: {
    sections: number;
  };
}

interface ResumeDetailsModalProps {
  resume: ResumeWithUser;
  onClose: () => void;
}

export function ResumeDetailsModal({ resume, onClose }: ResumeDetailsModalProps) {
  const [showPreview, setShowPreview] = useState(false);
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [loading, setLoading] = useState(false);

  const getStatusColor = (status: ResumeStatus) => {
    switch (status) {
      case 'DRAFT':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
      case 'PUBLISHED':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'ARCHIVED':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
    }
  };

  const handlePreviewResume = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/resumes/${resume.id}/preview`);
      if (!response.ok) throw new Error('Failed to fetch resume data');
      
      const data = await response.json();
      setResumeData(data);
      setShowPreview(true);
    } catch (error) {
      console.error('Error fetching resume preview:', error);
      // Fallback to opening in new tab
      window.open(`/resumes/${resume.id}`, '_blank');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Resume Details</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Title</dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-white">{resume.title}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</dt>
                <dd className="mt-1">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(resume.status)}`}>
                    {resume.status}
                  </span>
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Template</dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-white capitalize">{resume.template}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Resume ID</dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-white font-mono">{resume.id}</dd>
              </div>
            </dl>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">User Information</h3>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Name</dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-white">{resume.user.name || 'N/A'}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-white">{resume.user.email}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">User ID</dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-white font-mono">{resume.user.id}</dd>
              </div>
            </dl>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Content Overview</h3>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Sections</dt>
                <dd className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">{resume._count.sections}</dd>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Template</dt>
                <dd className="mt-1 text-lg font-semibold text-gray-900 dark:text-white capitalize">{resume.template}</dd>
              </div>
            </dl>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Timeline</h3>
            <dl className="space-y-2">
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Created</dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                  {new Date(resume.createdAt).toLocaleString()}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Last Updated</dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                  {new Date(resume.updatedAt).toLocaleString()}
                </dd>
              </div>
            </dl>
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
            >
              Close
            </button>
            <button
              onClick={handlePreviewResume}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                  Loading...
                </>
              ) : (
                <>
                  <Eye className="h-4 w-4" />
                  Preview Resume
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Resume Preview Modal */}
      {showPreview && resumeData && (
        <AdminResumePreview
          isOpen={showPreview}
          onClose={() => setShowPreview(false)}
          data={resumeData}
          template={resume.template}
          resumeTitle={resume.title}
        />
      )}
    </div>
  );
}