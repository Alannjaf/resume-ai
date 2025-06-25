'use client';

import { useState, useEffect, useCallback } from 'react';
import { ResumeStatus } from '@prisma/client';
import { toast } from 'react-hot-toast';
import { Loader2, Trash2, Download } from 'lucide-react';
import { ResumeFilters } from './ResumeFilters';
import { ResumeTable } from './ResumeTable';
import { Pagination } from '@/components/ui/Pagination';
import { ResumeDetailsModal } from './ResumeDetailsModal';
import { useDebounce } from '@/hooks/useDebounce';

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

export function ResumeManagement() {
  const [resumes, setResumes] = useState<ResumeWithUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<ResumeStatus | ''>('');
  const [template, setTemplate] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [selectedResume, setSelectedResume] = useState<ResumeWithUser | null>(null);
  
  const debouncedSearch = useDebounce(search, 500);

  const fetchResumes = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        ...(debouncedSearch && { search: debouncedSearch }),
        ...(status && { status }),
        ...(template && { template }),
      });

      const response = await fetch(`/api/admin/resumes?${params}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setResumes(data.resumes || []);
      setTotalPages(data.pagination?.totalPages || 1);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch resumes';
      toast.error(message);
      console.error('Error fetching resumes:', error);
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, status, template]);

  useEffect(() => {
    fetchResumes();
  }, [fetchResumes]);

  const handleSelectId = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id)
        ? prev.filter(selectedId => selectedId !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    setSelectedIds(
      selectedIds.length === resumes.length
        ? []
        : resumes.map(resume => resume.id)
    );
  };

  const handleDeleteResumes = async (ids: string[]) => {
    if (!confirm(`Are you sure you want to delete ${ids.length} resume(s)?`)) return;

    try {
      const response = await fetch('/api/admin/resumes', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids }),
      });

      if (!response.ok) throw new Error('Failed to delete resumes');

      toast.success(`Deleted ${ids.length} resume(s)`);
      setSelectedIds([]);
      fetchResumes();
    } catch (error) {
      toast.error('Failed to delete resumes');
      console.error(error);
    }
  };

  const handleExport = () => {
    const data = resumes.map(resume => ({
      title: resume.title,
      user: resume.user.email,
      status: resume.status,
      template: resume.template,
      sections: resume._count.sections,
      created: resume.createdAt,
    }));

    const csv = [
      ['Title', 'User', 'Status', 'Template', 'Sections', 'Created'],
      ...data.map(row => Object.values(row)),
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `resumes-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      <ResumeFilters
        search={search}
        status={status}
        template={template}
        onSearchChange={setSearch}
        onStatusChange={setStatus}
        onTemplateChange={setTemplate}
      />

      {selectedIds.length > 0 && (
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg flex items-center justify-between">
          <span className="text-blue-700 dark:text-blue-300">
            {selectedIds.length} resume(s) selected
          </span>
          <button
            onClick={() => handleDeleteResumes(selectedIds)}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            <Trash2 className="h-4 w-4" />
            Delete Selected
          </button>
        </div>
      )}

      <div className="flex justify-end">
        <button
          onClick={handleExport}
          className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
        >
          <Download className="h-4 w-4" />
          Export CSV
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
        </div>
      ) : resumes.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-8 text-center">
          <p className="text-gray-500 dark:text-gray-400">No resumes found</p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
            {search || status || template 
              ? 'Try adjusting your search filters' 
              : 'Resumes will appear here once users create them'}
          </p>
        </div>
      ) : (
        <>
          <ResumeTable
            resumes={resumes}
            selectedIds={selectedIds}
            onSelectId={handleSelectId}
            onSelectAll={handleSelectAll}
            onViewResume={setSelectedResume}
            onDeleteResume={(id) => handleDeleteResumes([id])}
          />

          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </>
      )}

      {selectedResume && (
        <ResumeDetailsModal
          resume={selectedResume}
          onClose={() => setSelectedResume(null)}
        />
      )}
    </div>
  );
}