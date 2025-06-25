'use client';

import { ResumeStatus } from '@prisma/client';
import { Search, Filter } from 'lucide-react';

interface ResumeFiltersProps {
  search: string;
  status: ResumeStatus | '';
  template: string;
  onSearchChange: (search: string) => void;
  onStatusChange: (status: ResumeStatus | '') => void;
  onTemplateChange: (template: string) => void;
}

export function ResumeFilters({
  search,
  status,
  template,
  onSearchChange,
  onStatusChange,
  onTemplateChange,
}: ResumeFiltersProps) {
  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        <input
          type="text"
          placeholder="Search by title, user email, or name..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg
                   bg-white text-gray-900
                   focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div className="flex flex-wrap gap-4">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            value={status}
            onChange={(e) => onStatusChange(e.target.value as ResumeStatus | '')}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg
                     bg-white text-gray-900
                     focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Status</option>
            <option value="DRAFT">Draft</option>
            <option value="PUBLISHED">Published</option>
            <option value="ARCHIVED">Archived</option>
          </select>
        </div>

        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Template
          </label>
          <select
            value={template}
            onChange={(e) => onTemplateChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg
                     bg-white text-gray-900
                     focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Templates</option>
            <option value="modern">Modern</option>
            <option value="classic">Classic</option>
            <option value="minimal">Minimal</option>
            <option value="creative">Creative</option>
            <option value="professional">Professional</option>
          </select>
        </div>
      </div>
    </div>
  );
}