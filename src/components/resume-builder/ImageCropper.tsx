'use client'

import { useRef, useEffect, useState, useCallback } from 'react'
import { Move, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CropData, loadImage, calculateInitialCrop, validateCropBounds } from '@/lib/image-utils'
import { CropConfig } from '@/lib/template-config'

interface ImageCropperProps {
  imageDataURL: string
  cropConfig: CropConfig
  onCropChange: (crop: CropData) => void
  className?: string
}

export function ImageCropper({ imageDataURL, cropConfig, onCropChange, className = '' }: ImageCropperProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [crop, setCrop] = useState<CropData | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 })
  const [scale, setScale] = useState(1)
  const [canvasTransform, setCanvasTransform] = useState({ 
    offsetX: 0, 
    offsetY: 0, 
    displayScale: 1 
  })

  // Load image and initialize crop
  useEffect(() => {
    const initializeImage = async () => {
      try {
        const img = await loadImage(imageDataURL)
        setImageDimensions({ width: img.naturalWidth, height: img.naturalHeight })
        
        // Calculate crop size as percentage of image for better proportions
        const canvasSize = 350 // Reduced from 400 to fit better in container
        const imageDisplaySize = Math.min(canvasSize / img.naturalWidth, canvasSize / img.naturalHeight) * img.naturalWidth
        
        // Make crop area about 40% of the displayed image size initially
        const cropDisplaySize = imageDisplaySize * 0.4
        
        // Convert back to actual image coordinates
        const imageSizeRatio = img.naturalWidth / imageDisplaySize
        const cropWidth = cropDisplaySize * imageSizeRatio
        const cropHeight = cropWidth / cropConfig.aspectRatio
        
        // Center the crop
        const x = (img.naturalWidth * scale - cropWidth) / 2
        const y = (img.naturalHeight * scale - cropHeight) / 2
        
        const initialCrop = {
          x: Math.max(0, x),
          y: Math.max(0, y),
          width: cropWidth,
          height: cropHeight,
          scale
        }
        
        setCrop(initialCrop)
        onCropChange(initialCrop)
        
        drawCanvas(img, initialCrop)
      } catch (error) {
        console.error('Failed to load image:', error)
      }
    }

    initializeImage()
  }, [imageDataURL, cropConfig.aspectRatio, cropConfig.defaultSize, scale, onCropChange])

  // Draw canvas with image and crop overlay
  const drawCanvas = (img: HTMLImageElement, currentCrop: CropData) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const canvasSize = 350 // Reduced from 400 to fit better in container
    canvas.width = canvasSize
    canvas.height = canvasSize

    // Calculate display dimensions based on crop scale
    const baseScale = Math.min(canvasSize / img.naturalWidth, canvasSize / img.naturalHeight)
    const displayScale = baseScale * currentCrop.scale
    const displayWidth = img.naturalWidth * displayScale
    const displayHeight = img.naturalHeight * displayScale
    const offsetX = (canvasSize - displayWidth) / 2
    const offsetY = (canvasSize - displayHeight) / 2

    // Store transform for coordinate conversion
    setCanvasTransform({ offsetX, offsetY, displayScale })

    // Clear canvas
    ctx.clearRect(0, 0, canvasSize, canvasSize)

    // Draw image
    ctx.drawImage(img, offsetX, offsetY, displayWidth, displayHeight)

    // Draw overlay
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)'
    ctx.fillRect(0, 0, canvasSize, canvasSize)

    // Calculate crop area on canvas - crop size should be independent of zoom
    const cropX = offsetX + (currentCrop.x / currentCrop.scale) * displayScale
    const cropY = offsetY + (currentCrop.y / currentCrop.scale) * displayScale
    
    // Crop area should scale with image but maintain aspect ratio
    const baseCropScale = Math.min(canvasSize / img.naturalWidth, canvasSize / img.naturalHeight)
    
    // Scale crop area with the base image scale but not with zoom
    const cropWidth = currentCrop.width * baseCropScale
    const cropHeight = currentCrop.height * baseCropScale

    // Clear crop area
    ctx.globalCompositeOperation = 'destination-out'
    
    if (cropConfig.shape === 'circle') {
      ctx.beginPath()
      ctx.arc(cropX + cropWidth / 2, cropY + cropHeight / 2, Math.min(cropWidth, cropHeight) / 2, 0, 2 * Math.PI)
      ctx.fill()
    } else if (cropConfig.shape === 'rounded-square' && cropConfig.borderRadius) {
      drawRoundedRect(ctx, cropX, cropY, cropWidth, cropHeight, (cropConfig.borderRadius || 16) * baseCropScale)
      ctx.fill()
    } else {
      ctx.fillRect(cropX, cropY, cropWidth, cropHeight)
    }

    ctx.globalCompositeOperation = 'source-over'

    // Draw crop border
    ctx.strokeStyle = cropConfig.safeArea.color
    ctx.lineWidth = 2
    
    if (cropConfig.shape === 'circle') {
      ctx.beginPath()
      ctx.arc(cropX + cropWidth / 2, cropY + cropHeight / 2, Math.min(cropWidth, cropHeight) / 2, 0, 2 * Math.PI)
      ctx.stroke()
    } else if (cropConfig.shape === 'rounded-square' && cropConfig.borderRadius) {
      drawRoundedRect(ctx, cropX, cropY, cropWidth, cropHeight, (cropConfig.borderRadius || 16) * baseCropScale)
      ctx.stroke()
    } else {
      ctx.strokeRect(cropX, cropY, cropWidth, cropHeight)
    }
  }

  // Helper function to draw rounded rectangle
  const drawRoundedRect = (ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number) => {
    ctx.beginPath()
    ctx.moveTo(x + radius, y)
    ctx.lineTo(x + width - radius, y)
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius)
    ctx.lineTo(x + width, y + height - radius)
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height)
    ctx.lineTo(x + radius, y + height)
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius)
    ctx.lineTo(x, y + radius)
    ctx.quadraticCurveTo(x, y, x + radius, y)
    ctx.closePath()
  }

  // Handle mouse and touch events for dragging
  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault()
    setIsDragging(true)
    setDragStart({ x: e.clientX, y: e.clientY })
    
    // Capture pointer for better mobile support
    if (e.currentTarget instanceof Element) {
      e.currentTarget.setPointerCapture(e.pointerId)
    }
  }

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || !crop) return
    e.preventDefault()

    const canvas = canvasRef.current
    if (!canvas) return

    // Get canvas-relative coordinates
    const rect = canvas.getBoundingClientRect()
    const canvasX = e.clientX - rect.left
    const canvasY = e.clientY - rect.top
    
    const prevCanvasX = dragStart.x - rect.left
    const prevCanvasY = dragStart.y - rect.top

    // Convert canvas pixels to crop coordinates
    const deltaCanvasX = canvasX - prevCanvasX
    const deltaCanvasY = canvasY - prevCanvasY
    
    // Convert to crop coordinate space
    const cropDeltaX = (deltaCanvasX / canvasTransform.displayScale) * crop.scale
    const cropDeltaY = (deltaCanvasY / canvasTransform.displayScale) * crop.scale

    // Apply movement with bounds checking
    const newX = Math.max(0, Math.min(crop.x + cropDeltaX, (imageDimensions.width * crop.scale) - crop.width))
    const newY = Math.max(0, Math.min(crop.y + cropDeltaY, (imageDimensions.height * crop.scale) - crop.height))

    const newCrop = { ...crop, x: newX, y: newY }

    setCrop(newCrop)
    onCropChange(newCrop)
    setDragStart({ x: e.clientX, y: e.clientY })

    loadImage(imageDataURL).then(img => drawCanvas(img, newCrop))
  }

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false)
    
    // Release pointer capture
    if (e.currentTarget instanceof Element) {
      e.currentTarget.releasePointerCapture(e.pointerId)
    }
  }

  // Handle zoom - only affects image scale, crop area stays same size
  const handleZoom = (zoomIn: boolean) => {
    if (!crop) return
    
    const newScale = zoomIn ? Math.min(scale * 1.2, 3) : Math.max(scale / 1.2, 0.5)
    
    // Keep crop area same size but adjust position for new image scale
    const centerX = crop.x + crop.width / 2
    const centerY = crop.y + crop.height / 2
    
    // Scale the center position
    const scaleFactor = newScale / crop.scale
    const newCenterX = centerX * scaleFactor
    const newCenterY = centerY * scaleFactor
    
    // Calculate new position maintaining crop size
    const maxX = (imageDimensions.width * newScale) - crop.width
    const maxY = (imageDimensions.height * newScale) - crop.height
    
    const newX = Math.max(0, Math.min(newCenterX - crop.width / 2, maxX))
    const newY = Math.max(0, Math.min(newCenterY - crop.height / 2, maxY))
    
    const newCrop = { 
      ...crop,
      x: newX, 
      y: newY, 
      scale: newScale 
    }
    
    setCrop(newCrop)
    onCropChange(newCrop)
    setScale(newScale)
    
    loadImage(imageDataURL).then(img => drawCanvas(img, newCrop))
  }

  // Reset crop to initial state
  const handleReset = () => {
    const resetScale = 1
    
    // Recalculate proportional crop size like in initialization
    const canvasSize = 350 // Reduced from 400 to fit better in container
    const imageDisplaySize = Math.min(canvasSize / imageDimensions.width, canvasSize / imageDimensions.height) * imageDimensions.width
    
    // Make crop area about 40% of the displayed image size
    const cropDisplaySize = imageDisplaySize * 0.4
    
    // Convert back to actual image coordinates
    const imageSizeRatio = imageDimensions.width / imageDisplaySize
    const cropWidth = cropDisplaySize * imageSizeRatio
    const cropHeight = cropWidth / cropConfig.aspectRatio
    
    // Center the crop
    const x = (imageDimensions.width * resetScale - cropWidth) / 2
    const y = (imageDimensions.height * resetScale - cropHeight) / 2
    
    const initialCrop = {
      x: Math.max(0, x),
      y: Math.max(0, y),
      width: cropWidth,
      height: cropHeight,
      scale: resetScale
    }
    
    setCrop(initialCrop)
    onCropChange(initialCrop)
    setScale(resetScale)
    
    loadImage(imageDataURL).then(img => drawCanvas(img, initialCrop))
  }

  return (
    <div className={`flex flex-col space-y-4 ${className}`}>
      {/* Controls at top */}
      <div className="flex items-center justify-center space-x-2">
        <Button variant="outline" size="sm" onClick={() => handleZoom(false)}>
          <ZoomOut className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="sm" onClick={() => handleZoom(true)}>
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="sm" onClick={handleReset}>
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>
      
      {/* Image area with padding */}
      <div className="flex justify-center p-6 bg-white border border-gray-200 rounded-lg">
        <div className="relative max-w-full overflow-hidden">
          <canvas
            ref={canvasRef}
            className="border border-gray-300 rounded-lg cursor-move touch-none shadow-sm max-w-full h-auto"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
          />
        </div>
      </div>
      
      <div className="text-center">
        <p className="text-sm text-gray-600 mb-1">
          <Move className="inline h-4 w-4 mr-1" />
          Drag to reposition • Zoom to resize
        </p>
        <p className="text-xs text-gray-500">
          {cropConfig.shape === 'circle' ? 'Circular' : cropConfig.shape.replace('-', ' ')} crop for {cropConfig.safeArea.showGuide ? 'optimal' : 'standard'} display
        </p>
      </div>
    </div>
  )
}