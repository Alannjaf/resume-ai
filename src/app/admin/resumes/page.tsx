import { redirect } from 'next/navigation';
import { isAdmin } from '@/lib/admin';
import { FileText } from 'lucide-react';
import { ResumeManagement } from '@/components/admin/ResumeManagement';

// Force dynamic rendering since this uses auth
export const dynamic = 'force-dynamic';

export default async function AdminResumesPage() {
  const admin = await isAdmin();
  
  if (!admin) {
    redirect('/dashboard');
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <FileText className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Resume Management
          </h1>
        </div>
        <p className="text-gray-600 dark:text-gray-400">
          View, manage, and export all user resumes
        </p>
      </div>

      <ResumeManagement />
    </div>
  );
}