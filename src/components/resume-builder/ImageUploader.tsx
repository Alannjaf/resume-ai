'use client'

import { useState, useRef } from 'react'
import { Upload, X, User } from 'lucide-react'
import Image from 'next/image'

interface ImageUploaderProps {
  currentImage?: string
  onImageUpload: (imageDataUrl: string) => void
  onImageRemove: () => void
}

export default function ImageUploader({ currentImage, onImageUpload, onImageRemove }: ImageUploaderProps) {
  const [dragActive, setDragActive] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const handleFile = (file: File) => {
    if (file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        onImageUpload(result)
      }
      reader.readAsDataURL(file)
    }
  }

  const onButtonClick = () => {
    inputRef.current?.click()
  }

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Profile Photo
      </label>
      
      {currentImage ? (
        <div className="relative w-32 h-32 mx-auto mb-4">
          <Image
            src={currentImage}
            alt="Profile"
            fill
            className="rounded-full object-cover border-4 border-gray-200"
          />
          <button
            onClick={onImageRemove}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <div
          className={`relative w-32 h-32 mx-auto mb-4 border-2 border-dashed rounded-full flex items-center justify-center cursor-pointer transition-colors ${
            dragActive 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={onButtonClick}
        >
          <User size={48} className="text-gray-400" />
        </div>
      )}

      <div className="text-center">
        <button
          onClick={onButtonClick}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Upload size={16} className="mr-2" />
          {currentImage ? 'Change Photo' : 'Upload Photo'}
        </button>
      </div>

      <input
        ref={inputRef}
        type="file"
        className="hidden"
        accept="image/*"
        onChange={handleChange}
      />

      <p className="text-xs text-gray-500 text-center mt-2">
        Drag and drop or click to upload. Supports JPG, PNG, GIF (max 5MB)
      </p>
    </div>
  )
}