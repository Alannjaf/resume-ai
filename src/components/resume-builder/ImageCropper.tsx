"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { Move, ZoomIn, ZoomOut, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CropData, loadImage } from "@/lib/image-utils";
import { CropConfig } from "@/lib/template-config";

interface ImageCropperProps {
  imageDataURL: string;
  cropConfig: CropConfig;
  onCropChange: (crop: CropData) => void;
  className?: string;
}

export function ImageCropper({
  imageDataURL,
  cropConfig,
  onCropChange,
  className = "",
}: ImageCropperProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);

  // Image position and scale (image moves, crop stays fixed)
  const [imageX, setImageX] = useState(0);
  const [imageY, setImageY] = useState(0);
  const [zoom, setZoom] = useState(1);

  // Drag state
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Canvas and crop dimensions
  const canvasSize = 350;
  const cropRadius = canvasSize * 0.42; // Circle takes 84% of canvas (diameter)
  const cropCenterX = canvasSize / 2;
  const cropCenterY = canvasSize / 2;

  // Draw the canvas
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const img = imageRef.current;
    if (!canvas || !img) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvasSize, canvasSize);

    // Calculate scaled image dimensions
    const scaledWidth = img.naturalWidth * zoom;
    const scaledHeight = img.naturalHeight * zoom;

    // Draw image at current position
    ctx.drawImage(img, imageX, imageY, scaledWidth, scaledHeight);

    // Draw dark overlay
    ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
    ctx.fillRect(0, 0, canvasSize, canvasSize);

    // Cut out the crop circle (reveal image underneath)
    ctx.globalCompositeOperation = "destination-out";

    if (cropConfig.shape === "circle") {
      ctx.beginPath();
      ctx.arc(cropCenterX, cropCenterY, cropRadius, 0, 2 * Math.PI);
      ctx.fill();
    } else {
      // For square/rounded shapes
      const cropSize = cropRadius * 2;
      const cropX = cropCenterX - cropRadius;
      const cropY = cropCenterY - cropRadius;

      if (cropConfig.shape === "rounded-square" && cropConfig.borderRadius) {
        drawRoundedRect(
          ctx,
          cropX,
          cropY,
          cropSize,
          cropSize,
          cropConfig.borderRadius
        );
        ctx.fill();
      } else {
        ctx.fillRect(cropX, cropY, cropSize, cropSize);
      }
    }

    ctx.globalCompositeOperation = "source-over";

    // Draw crop border
    ctx.strokeStyle = "#3b82f6";
    ctx.lineWidth = 3;

    if (cropConfig.shape === "circle") {
      ctx.beginPath();
      ctx.arc(cropCenterX, cropCenterY, cropRadius, 0, 2 * Math.PI);
      ctx.stroke();
    } else {
      const cropSize = cropRadius * 2;
      const cropX = cropCenterX - cropRadius;
      const cropY = cropCenterY - cropRadius;

      if (cropConfig.shape === "rounded-square" && cropConfig.borderRadius) {
        drawRoundedRect(
          ctx,
          cropX,
          cropY,
          cropSize,
          cropSize,
          cropConfig.borderRadius
        );
        ctx.stroke();
      } else {
        ctx.strokeRect(cropX, cropY, cropSize, cropSize);
      }
    }

    // Update crop data for parent component
    // Convert canvas coordinates to image coordinates
    const cropX = (cropCenterX - cropRadius - imageX) / zoom;
    const cropY = (cropCenterY - cropRadius - imageY) / zoom;
    const cropSize = (cropRadius * 2) / zoom;

    onCropChange({
      x: cropX,
      y: cropY,
      width: cropSize,
      height: cropSize / cropConfig.aspectRatio,
      scale: zoom,
    });
  }, [
    imageX,
    imageY,
    zoom,
    cropConfig,
    onCropChange,
    cropCenterX,
    cropCenterY,
    cropRadius,
  ]);

  // Helper function to draw rounded rectangle
  const drawRoundedRect = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    radius: number
  ) => {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
  };

  // Load image and center it
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = canvasSize;
    canvas.height = canvasSize;

    loadImage(imageDataURL).then((img) => {
      imageRef.current = img;

      // Calculate initial zoom to fit the smaller dimension to the crop circle
      const minDimension = Math.min(img.naturalWidth, img.naturalHeight);
      const initialZoom = (cropRadius * 2) / minDimension;

      // Center the image so the crop circle is in the middle
      const scaledWidth = img.naturalWidth * initialZoom;
      const scaledHeight = img.naturalHeight * initialZoom;
      const initialX = (canvasSize - scaledWidth) / 2;
      const initialY = (canvasSize - scaledHeight) / 2;

      setZoom(initialZoom);
      setImageX(initialX);
      setImageY(initialY);
    });
  }, [imageDataURL, cropRadius]);

  // Redraw when state changes
  useEffect(() => {
    draw();
  }, [draw]);

  // Handle pointer down
  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });

    if (e.currentTarget instanceof Element) {
      e.currentTarget.setPointerCapture(e.pointerId);
    }
  };

  // Handle pointer move (drag image)
  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    e.preventDefault();

    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;

    setImageX((prev) => prev + deltaX);
    setImageY((prev) => prev + deltaY);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  // Handle pointer up
  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);

    if (e.currentTarget instanceof Element) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
  };

  // Zoom in/out - zoom towards center of crop area
  const handleZoom = (zoomIn: boolean) => {
    const img = imageRef.current;
    if (!img) return;

    // Calculate minimum zoom so crop area doesn't exceed image dimensions
    const minDimension = Math.min(img.naturalWidth, img.naturalHeight);
    const minZoom = (cropRadius * 2) / minDimension;
    const maxZoom = 5;
    const zoomFactor = zoomIn ? 1.25 : 0.8;
    const newZoom = Math.max(minZoom, Math.min(maxZoom, zoom * zoomFactor));

    // Zoom towards the center of the crop circle
    const zoomRatio = newZoom / zoom;
    const newImageX = cropCenterX - (cropCenterX - imageX) * zoomRatio;
    const newImageY = cropCenterY - (cropCenterY - imageY) * zoomRatio;

    setZoom(newZoom);
    setImageX(newImageX);
    setImageY(newImageY);
  };

  // Reset to initial centered state
  const handleReset = () => {
    const img = imageRef.current;
    if (!img) return;

    const minDimension = Math.min(img.naturalWidth, img.naturalHeight);
    const initialZoom = (cropRadius * 2) / minDimension;

    const scaledWidth = img.naturalWidth * initialZoom;
    const scaledHeight = img.naturalHeight * initialZoom;
    const initialX = (canvasSize - scaledWidth) / 2;
    const initialY = (canvasSize - scaledHeight) / 2;

    setZoom(initialZoom);
    setImageX(initialX);
    setImageY(initialY);
  };

  return (
    <div className={`flex flex-col space-y-4 ${className}`}>
      {/* Zoom controls */}
      <div className="flex items-center justify-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleZoom(false)}
          title="Zoom out"
        >
          <ZoomOut className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleZoom(true)}
          title="Zoom in"
        >
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="sm" onClick={handleReset} title="Reset">
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>

      {/* Canvas area */}
      <div className="flex justify-center p-4 bg-gray-100 rounded-lg">
        <canvas
          ref={canvasRef}
          className="rounded-lg cursor-move touch-none shadow-md"
          style={{ maxWidth: "100%", height: "auto" }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
        />
      </div>

      {/* Instructions */}
      <div className="text-center">
        <p className="text-sm text-gray-600 mb-1">
          <Move className="inline h-4 w-4 mr-1" />
          Drag to reposition • Zoom to resize
        </p>
        <p className="text-xs text-gray-500">
          {cropConfig.shape === "circle"
            ? "Circular"
            : cropConfig.shape.replace("-", " ")}{" "}
          crop for optimal display
        </p>
      </div>
    </div>
  );
}
