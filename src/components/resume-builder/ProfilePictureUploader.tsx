'use client'

import React, { useState, useRef } from 'react'
import { Upload, X, User, Loader2, Crown } from 'lucide-react'
import { toast } from 'react-hot-toast'

interface ProfilePictureUploaderProps {
  resumeId: string
  currentProfilePicture?: string
  onProfilePictureUpdate: (url: string | null) => void
  isProUser: boolean
  onUpgradeClick?: () => void
}

export function ProfilePictureUploader({
  resumeId,
  currentProfilePicture,
  onProfilePictureUpdate,
  isProUser,
  onUpgradeClick
}: ProfilePictureUploaderProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (file: File) => {
    if (!isProUser) {
      toast.error('Profile pictures are only available for Pro subscribers')
      onUpgradeClick?.()
      return
    }

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file')
      return
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error('File size must be less than 2MB')
      return
    }

    setIsUploading(true)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch(`/api/resumes/${resumeId}/profile-picture`, {
        method: 'POST',
        body: formData
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Upload failed')
      }

      onProfilePictureUpdate(data.profilePictureUrl)
      toast.success('Profile picture uploaded successfully!')

    } catch (error: any) {
      console.error('Upload error:', error)
      toast.error(error.message || 'Failed to upload profile picture')
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemoveProfilePicture = async () => {
    if (!currentProfilePicture) return

    try {
      const response = await fetch(`/api/resumes/${resumeId}/profile-picture`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to remove profile picture')
      }

      onProfilePictureUpdate(null)
      toast.success('Profile picture removed successfully!')

    } catch (error: any) {
      console.error('Remove error:', error)
      toast.error(error.message || 'Failed to remove profile picture')
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0])
    }
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0])
    }
  }

  if (!isProUser) {
    return (
      <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
            <Crown className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Profile Pictures</h3>
          <p className="text-gray-600 mb-4">
            Add a professional profile picture to your resume with Pro subscription
          </p>
          <button
            onClick={onUpgradeClick}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Upgrade to Pro
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="border border-gray-200 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Picture</h3>
      
      {currentProfilePicture ? (
        <div className="flex items-start space-x-4">
          <div className="relative">
            <img
              src={currentProfilePicture}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
            />
            <button
              onClick={handleRemoveProfilePicture}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
              title="Remove profile picture"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="flex-1">
            <p className="text-sm text-gray-600 mb-2">
              Your profile picture is set. You can upload a new one to replace it.
            </p>
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2 inline" />
                  Uploading...
                </>
              ) : (
                'Change Picture'
              )}
            </button>
          </div>
        </div>
      ) : (
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragActive 
              ? 'border-blue-400 bg-blue-50' 
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            {isUploading ? (
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            ) : (
              <User className="w-8 h-8 text-gray-400" />
            )}
          </div>
          
          <h4 className="text-lg font-medium text-gray-900 mb-2">
            {isUploading ? 'Uploading...' : 'Add Profile Picture'}
          </h4>
          
          <p className="text-gray-600 mb-4">
            Drag and drop an image here, or click to select
          </p>
          
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            <Upload className="w-4 h-4 mr-2 inline" />
            Select Image
          </button>
          
          <p className="text-xs text-gray-500 mt-2">
            Supported formats: JPG, PNG, GIF, WebP • Max size: 2MB
          </p>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileInputChange}
        className="hidden"
      />
    </div>
  )
}