import { useState } from 'react'
import { Check, Download } from 'lucide-react'
import PhotoUpload from './components/PhotoUpload'
import StyleSelection from './components/StyleSelection'
import type { StyleType } from './components/StyleSelection'
import ApiService from './services/api'

type Step = 'upload' | 'style' | 'result'

function App() {
  const [currentStep, setCurrentStep] = useState<Step>('upload')
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [selectedStyle, setSelectedStyle] = useState<StyleType | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)
  const [processingError, setProcessingError] = useState<string | null>(null)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)

  const steps = [
    { id: 'upload', label: 'Upload', completed: currentStep !== 'upload' },
    { id: 'style', label: 'Style', completed: currentStep === 'result' },
    { id: 'result', label: 'Result', completed: false }
  ]

  const handleImageSelect = (file: File) => {
    setUploadedFile(file)
    const reader = new FileReader()
    reader.onload = (e) => {
      setSelectedImage(e.target?.result as string)
      setCurrentStep('style')
    }
    reader.readAsDataURL(file)
  }

  const handleRemoveImage = () => {
    setSelectedImage(null)
    setCurrentStep('upload')
  }

  const handleStyleSelect = (style: StyleType) => {
    setSelectedStyle(style)
  }

  const handleGenerateHeadshot = async () => {
    if (!uploadedFile || !selectedStyle) return
    
    setIsProcessing(true)
    setProcessingError(null)
    setCurrentStep('result')
    
    try {
      console.log('Generating headshot...')
      const response = await ApiService.generateHeadshot(uploadedFile, selectedStyle)
      
      if (response.success && response.data) {
        setGeneratedImage(response.data.generatedImage)
        console.log(`Headshot generated in ${response.data.processingTime}ms`)
      } else {
        throw new Error(response.error || 'Failed to generate headshot')
      }
    } catch (error) {
      console.error('Error generating headshot:', error)
      
      // Provide user-friendly error messages for common issues
      let errorMessage = 'Failed to generate headshot'
      if (error instanceof Error) {
        if (error.message.includes('quota') || error.message.includes('429')) {
          errorMessage = 'API quota exceeded. Please try again in a few minutes or contact support for quota upgrades.'
        } else if (error.message.includes('network') || error.message.includes('fetch')) {
          errorMessage = 'Network error. Please check your connection and try again.'
        } else {
          errorMessage = error.message
        }
      }
      
      setProcessingError(errorMessage)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDownload = () => {
    if (!generatedImage) return
    
    try {
      // Create a temporary link element to download the image
      const link = document.createElement('a')
      link.href = generatedImage
      link.download = `headshot-${selectedStyle}-${Date.now()}.jpg`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      console.log('Headshot downloaded successfully')
    } catch (error) {
      console.error('Error downloading headshot:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="text-center py-8">
        <h1 className="text-4xl font-bold text-primary-600 mb-2">
          HeadshotWise
        </h1>
        <p className="text-gray-600 text-lg">
          Transform any photo into a professional headshot in seconds
        </p>
      </div>

      {/* Progress Indicator */}
      <div className="max-w-2xl mx-auto px-4 mb-8">
        <div className="flex items-center justify-center gap-8">
          {steps.map((step, index) => (
            <div key={step.id} className="flex flex-col items-center">
              <div className={`
                w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                ${step.completed 
                  ? 'bg-primary-600 text-white' 
                  : step.id === currentStep 
                  ? 'bg-primary-600 text-white' 
                  : 'bg-gray-200 text-gray-500'
                }
              `}>
                {step.completed ? (
                  <Check size={14} />
                ) : step.id === currentStep ? (
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                ) : (
                  <span>{index + 1}</span>
                )}
              </div>
              <span className="text-xs text-gray-500 mt-2">{step.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4">
        {currentStep === 'upload' && (
          <div className="max-w-2xl mx-auto">
            <PhotoUpload
              onImageSelect={handleImageSelect}
              selectedImage={selectedImage}
              onRemoveImage={handleRemoveImage}
            />
          </div>
        )}

        {currentStep === 'style' && (
          <div className="max-w-4xl mx-auto">
            <StyleSelection
              selectedStyle={selectedStyle}
              onStyleSelect={handleStyleSelect}
              onBack={() => setCurrentStep('upload')}
              onGenerate={handleGenerateHeadshot}
            />
          </div>
        )}

        {currentStep === 'result' && (
          <>
            {/* Your Professional Headshot Section */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-1 text-center">
                Your Professional Headshot
              </h2>
              <p className="text-gray-600 mb-8 text-center">Here's your transformed image</p>
            </div>

            {/* Processing State */}
            {isProcessing && (
              <div className="text-center py-12">
                <div className="inline-flex items-center gap-3 text-primary-600">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                  <span className="text-lg font-medium">Generating your headshot with AI...</span>
                </div>
                <p className="text-gray-600 mt-2">This may take up to 30 seconds</p>
              </div>
            )}

            {/* Error State */}
            {processingError && (
              <div className="text-center py-12">
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
                  <h3 className="text-red-800 font-medium mb-2">Generation Failed</h3>
                  <p className="text-red-600 text-sm mb-4">{processingError}</p>
                  <button
                    onClick={() => {
                      setProcessingError(null)
                      setCurrentStep('style')
                    }}
                    className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            )}

            {/* Before & After Comparison */}
            {!isProcessing && !processingError && generatedImage && (
              <div className="flex justify-center gap-6 mb-8">
                {/* Before Image */}
                <div className="relative">
                  <div className="absolute top-2 left-2 bg-white px-2 py-1 rounded text-xs font-medium text-gray-700 z-10">
                    Before
                  </div>
                  <div className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
                    <img
                      src={selectedImage || ""}
                      alt="Original photo"
                      className="w-80 h-80 object-cover"
                    />
                  </div>
                </div>

                {/* After Image */}
                <div className="relative">
                  <div className="absolute top-2 left-2 bg-primary-600 text-white px-2 py-1 rounded text-xs font-medium z-10">
                    After
                  </div>
                  <div className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
                    <img
                      src={generatedImage}
                      alt="AI Generated Professional headshot"
                      className="w-80 h-80 object-cover"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Download Button */}
            {!isProcessing && !processingError && generatedImage && (
              <div className="text-center mb-12">
                <button
                  onClick={handleDownload}
                  className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-lg font-medium flex items-center gap-2 mx-auto transition-colors shadow-sm"
                >
                  <Download size={20} />
                  Download Headshot
                </button>
              </div>
            )}

          </>
        )}
      </div>
    </div>
  )
}

export default App
