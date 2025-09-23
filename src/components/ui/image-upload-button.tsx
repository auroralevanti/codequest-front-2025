"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRef, useState } from "react"
import { Upload } from "lucide-react"

interface ImageUploadButtonProps {
  onFilesSelected: (files: File[]) => void
  disabled?: boolean
  uploading?: boolean
}

export function ImageUploadButton({
  onFilesSelected,
  disabled = false,
  uploading = false
}: ImageUploadButtonProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length > 0) {
      onFilesSelected(files)
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const files = Array.from(e.dataTransfer.files).filter(file => 
      file.type.startsWith("image/")
    )
    if (files.length > 0) {
      onFilesSelected(files)
    }
  }

  return (
    <div 
      className={`relative border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors ${
        isDragging 
          ? "border-primary bg-primary/10" 
          : "border-muted-foreground/25 hover:border-muted-foreground/50"
      } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => !disabled && !uploading && fileInputRef.current?.click()}
    >
      <Input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileChange}
        className="hidden"
        disabled={disabled || uploading}
      />
      <div className="flex flex-col items-center justify-center gap-2">
        <Upload className="h-5 w-5 text-muted-foreground" />
        <div className="text-sm font-medium text-muted-foreground">
          {uploading ? "Uploading..." : "Click to upload or drag and drop"}
        </div>
        <div className="text-xs text-muted-foreground">
          PNG, JPG, GIF up to 10MB
        </div>
      </div>
    </div>
  )
}