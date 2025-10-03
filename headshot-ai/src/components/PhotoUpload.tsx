import { useState, useRef } from 'react'
import { Upload, X } from 'lucide-react'

interface PhotoUploadProps {
  onImageSelect: (file: File) => void
  selectedImage?: string | null
  onRemoveImage: () => void
}

export default function PhotoUpload({ onImageSelect, selectedImage, onRemoveImage }: PhotoUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    
    const files = Array.from(e.dataTransfer.files)
    const imageFile = files.find(file => file.type.startsWith('image/'))
    
    if (imageFile) {
      validateAndSetImage(imageFile)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      validateAndSetImage(file)
    }
  }

  const validateAndSetImage = (file: File) => {
    // Check file type
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file (JPG or PNG)')
      return
    }

    // Check file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB')
      return
    }

    // Check image dimensions
    const img = new Image()
    img.onload = () => {
      if (img.width < 512 || img.height < 512) {
        alert('Image must be at least 512x512 pixels')
        return
      }
      onImageSelect(file)
    }
    img.onerror = () => {
      alert('Invalid image file')
    }
    img.src = URL.createObjectURL(file)
  }

  const openFileDialog = () => {
    fileInputRef.current?.click()
  }

  if (selectedImage) {
    return (
      <div className="relative">
        <div className="border-2 border-dashed border-primary-200 rounded-lg p-6 bg-primary-50">
          <div className="text-center">
            <img
              src={selectedImage}
              alt="Selected photo"
              className="w-32 h-32 object-cover rounded-lg mx-auto mb-4"
            />
            <p className="text-sm text-gray-600 mb-2">Photo uploaded successfully</p>
            <button
              onClick={onRemoveImage}
              className="inline-flex items-center gap-2 text-red-600 hover:text-red-700 text-sm"
            >
              <X size={16} />
              Remove photo
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      className={`
        border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
        ${isDragOver 
          ? 'border-primary-400 bg-primary-50' 
          : 'border-gray-300 hover:border-primary-400 hover:bg-primary-50'
        }
      `}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={openFileDialog}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png"
        onChange={handleFileSelect}
        className="hidden"
      />
      
      <div className="flex flex-col items-center">
        <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-4">
          <Upload className="w-8 h-8 text-primary-600" />
        </div>
        
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Upload your photo
        </h3>
        
        <p className="text-gray-600 mb-4">
          Drag and drop your image here, or click to browse
        </p>
        
        <div className="text-sm text-gray-500 space-y-1">
          <p>• Supported formats: JPG, PNG</p>
          <p>• Minimum size: 512x512 pixels</p>
          <p>• Maximum file size: 10MB</p>
        </div>
        
        <button
          type="button"
          className="mt-4 bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
        >
          Choose File
        </button>
      </div>
    </div>
  )
}

