import { Check, ArrowLeft, Briefcase, Palette, Award } from 'lucide-react'

export type StyleType = 'corporate' | 'creative' | 'executive'

interface Style {
  id: StyleType
  name: string
  description: string
  icon: React.ReactNode
  bgColor: string
}

interface StyleSelectionProps {
  selectedStyle: StyleType | null
  onStyleSelect: (style: StyleType) => void
}

const styles: Style[] = [
  {
    id: 'corporate',
    name: 'Corporate Classic',
    description: 'Traditional business headshot with neutral background',
    icon: <Briefcase className="w-8 h-8 text-white" />,
    bgColor: 'bg-gray-600'
  },
  {
    id: 'creative',
    name: 'Creative Professional',
    description: 'Modern, dynamic style with subtle creative elements',
    icon: <Palette className="w-8 h-8 text-white" />,
    bgColor: 'bg-gradient-to-br from-purple-500 to-pink-500'
  },
  {
    id: 'executive',
    name: 'Executive Portrait',
    description: 'Premium, formal style with sophisticated lighting',
    icon: <Award className="w-8 h-8 text-white" />,
    bgColor: 'bg-gradient-to-br from-blue-600 to-gray-800'
  }
]

interface StyleSelectionProps {
  selectedStyle: StyleType | null
  onStyleSelect: (style: StyleType) => void
  onBack?: () => void
  onGenerate?: () => void
}

export default function StyleSelection({ selectedStyle, onStyleSelect, onBack, onGenerate }: StyleSelectionProps) {
  return (
    <div className="space-y-8">
      {/* Back button */}
      {onBack && (
        <div className="flex items-center cursor-pointer text-gray-600 hover:text-gray-800 transition-colors" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          <span className="text-sm">Back to upload</span>
        </div>
      )}

      {/* Title */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Choose Your Professional Style
        </h2>
      </div>

      {/* Style cards */}
      <div className="flex justify-center gap-6">
        {styles.map((style) => (
          <div
            key={style.id}
            className={`
              relative bg-white rounded-xl shadow-sm border cursor-pointer transition-all duration-200 hover:shadow-md
              ${selectedStyle === style.id
                ? 'ring-2 ring-blue-500 shadow-lg'
                : 'border-gray-200'
              }
            `}
            onClick={() => onStyleSelect(style.id)}
            style={{ width: '280px' }}
          >
            {/* Icon */}
            <div className={`${style.bgColor} rounded-lg mx-4 mt-4 p-4 flex items-center justify-center`}>
              {style.icon}
            </div>

            {/* Style info */}
            <div className="p-6">
              <h3 className="font-bold text-gray-900 mb-2 text-lg">
                {style.name}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {style.description}
              </p>
            </div>

            {/* Selected indicator */}
            {selectedStyle === style.id && (
              <div className="absolute top-4 right-4">
                <div className="bg-blue-500 text-white rounded-full p-1">
                  <Check size={16} />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Generate button */}
      <div className="flex justify-center">
        <button
          onClick={onGenerate}
          disabled={!selectedStyle}
          className={`
            px-8 py-3 rounded-lg font-medium text-lg transition-colors
            ${selectedStyle 
              ? 'bg-blue-500 hover:bg-blue-600 text-white' 
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }
          `}
        >
          Generate Professional Headshot
        </button>
      </div>
    </div>
  )
}