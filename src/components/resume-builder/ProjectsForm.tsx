'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Plus, Trash2, Calendar, Link } from 'lucide-react'
import { Project } from '@/types/resume'

interface ProjectsFormProps {
  projects: Project[]
  onChange: (projects: Project[]) => void
}

export function ProjectsForm({ projects, onChange }: ProjectsFormProps) {
  const addProject = () => {
    const newProject: Project = {
      id: Date.now().toString(),
      name: '',
      description: '',
      technologies: '',
      link: '',
      startDate: '',
      endDate: '',
    }
    onChange([...projects, newProject])
  }

  const removeProject = (id: string) => {
    onChange(projects.filter((project) => project.id !== id))
  }

  const updateProject = (id: string, field: keyof Project, value: string) => {
    onChange(
      projects.map((project) =>
        project.id === id ? { ...project, [field]: value } : project
      )
    )
  }

  return (
    <div className="space-y-4">
      {projects.length === 0 ? (
        <Card className="p-8 text-center">
          <div className="text-gray-400 mb-4">
            <span className="text-4xl">💼</span>
          </div>
          <h3 className="text-lg font-medium mb-2">No projects added</h3>
          <p className="text-gray-600 mb-4">
            Add your notable projects to showcase your practical experience
          </p>
          <Button onClick={addProject}>
            <Plus className="h-4 w-4 mr-2" />
            Add Project
          </Button>
        </Card>
      ) : (
        <>
          {projects.map((project, index) => (
            <Card key={project.id} className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-medium">Project {index + 1}</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeProject(project.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Project Name *
                  </label>
                  <Input
                    placeholder="E-commerce Platform"
                    value={project.name}
                    onChange={(e) => updateProject(project.id, 'name', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Technologies Used
                  </label>
                  <Input
                    placeholder="React, Node.js, MongoDB"
                    value={project.technologies}
                    onChange={(e) => updateProject(project.id, 'technologies', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    <Calendar className="inline h-3 w-3 mr-1" />
                    Start Date
                  </label>
                  <Input
                    type="month"
                    value={project.startDate}
                    onChange={(e) => updateProject(project.id, 'startDate', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    <Calendar className="inline h-3 w-3 mr-1" />
                    End Date
                  </label>
                  <Input
                    type="month"
                    value={project.endDate}
                    onChange={(e) => updateProject(project.id, 'endDate', e.target.value)}
                    placeholder="Leave empty if ongoing"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">
                    <Link className="inline h-3 w-3 mr-1" />
                    Project Link
                  </label>
                  <Input
                    placeholder="https://github.com/username/project"
                    value={project.link}
                    onChange={(e) => updateProject(project.id, 'link', e.target.value)}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">
                    Description
                  </label>
                  <textarea
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary"
                    rows={3}
                    placeholder="Describe the project, your role, and key achievements..."
                    value={project.description}
                    onChange={(e) => updateProject(project.id, 'description', e.target.value)}
                  />
                </div>
              </div>
            </Card>
          ))}
          <Button onClick={addProject} variant="outline" className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Add Another Project
          </Button>
        </>
      )}
      <div className="bg-blue-50 p-4 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>Tip:</strong> Include your most impactful projects that demonstrate your skills and experience.
        </p>
      </div>
    </div>
  )
}