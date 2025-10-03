# HeadshotWise - AI Professional Headshot Generator

Transform your photos into stunning professional headshots using AI technology powered by Google's Gemini API.

![HeadshotWise](https://img.shields.io/badge/HeadshotWise-AI%20Headshot%20Generator-blue)
![React](https://img.shields.io/badge/React-18.0+-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?logo=typescript)
![Node.js](https://img.shields.io/badge/Node.js-18.0+-339933?logo=node.js)

## 🚀 Features

- **AI-Powered Generation**: Uses Google Gemini API for high-quality headshot generation
- **Three Professional Styles**:
  - **Corporate Classic**: Traditional business headshot with studio lighting
  - **Creative Professional**: Modern, dynamic styling with artistic backgrounds
  - **Executive Portrait**: Dramatic black and white editorial style
- **Real-time Processing**: Fast generation with progress tracking
- **Before/After Comparison**: See the transformation side-by-side
- **High-Resolution Output**: Professional quality images ready for use
- **Responsive Design**: Works seamlessly on desktop and mobile

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **React Icons** for UI elements

### Backend
- **Node.js** with Express
- **TypeScript** for type safety
- **Google Gemini API** for AI image generation
- **Multer** for file uploads
- **Sharp** for image processing

## 📋 Prerequisites

- Node.js 18.0 or higher
- npm or yarn
- Google AI API key (Gemini API)

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/headshotwise.git
   cd headshotwise
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../headshot-ai
   npm install
   ```

4. **Set up environment variables**
   
   Create a `.env` file in the `backend` directory:
   ```bash
   cd ../backend
   touch .env
   ```
   
   Add your Google API key to the `.env` file:
   ```env
   # Google Gemini API Configuration
   GOOGLE_API_KEY=your_google_api_key_here
   
   # Server Configuration
   PORT=3001
   NODE_ENV=development
   
   # CORS Configuration
   CORS_ORIGIN=http://localhost:5173
   ```

## 🚀 Getting Started

1. **Start the backend server**
   ```bash
   cd backend
   npm run dev
   ```
   The backend will run on `http://localhost:3001`

2. **Start the frontend development server**
   ```bash
   cd headshot-ai
   npm run dev
   ```
   The frontend will run on `http://localhost:5173`

3. **Open your browser**
   Navigate to `http://localhost:5173` to start using HeadshotWise!

## 📖 How to Use

1. **Upload a Photo**: Click the upload area and select a clear photo of yourself
2. **Choose a Style**: Select from Corporate Classic, Creative Professional, or Executive Portrait
3. **Generate**: Click "Generate Professional Headshot" and wait for the AI to work its magic
4. **Download**: Once complete, download your professional headshot

## 🎨 Style Descriptions

### Corporate Classic
- Professional business attire
- Studio lighting with dark gray backdrop
- High-angle perspective showing head and shoulders
- Clean, traditional business aesthetic

### Creative Professional
- Casual, engaging style
- Warm, natural lighting
- Creative workspace or outdoor setting
- Modern, approachable professional look

### Executive Portrait
- Dramatic black and white treatment
- Editorial-style photography
- High contrast with cinematic lighting
- Sophisticated, artistic professional appearance

## 🔑 API Key Setup

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Add the key to your `.env` file as `GOOGLE_API_KEY`
4. Ensure billing is enabled for your Google Cloud project

## 📁 Project Structure

```
headshotwise/
├── backend/                 # Backend API server
│   ├── src/
│   │   ├── config/         # Configuration files
│   │   ├── middleware/     # Express middleware
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   └── types/          # TypeScript type definitions
│   ├── uploads/            # Temporary file storage
│   └── package.json
├── headshot-ai/            # Frontend React application
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── services/       # API service layer
│   │   └── App.tsx         # Main application component
│   └── package.json
├── prompt.md              # AI prompts for different styles
└── README.md
```

## 🚀 Deployment

### Backend Deployment
1. Build the backend:
   ```bash
   cd backend
   npm run build
   ```

2. Deploy to your preferred platform (Vercel, Railway, Heroku, etc.)

### Frontend Deployment
1. Build the frontend:
   ```bash
   cd headshot-ai
   npm run build
   ```

2. Deploy the `dist` folder to your hosting platform

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Google Gemini API for AI image generation capabilities
- React and Vite teams for excellent development tools
- Tailwind CSS for beautiful, utility-first styling

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/yourusername/headshotwise/issues) page
2. Create a new issue with detailed information
3. Include error messages and steps to reproduce

## 🔮 Future Enhancements

- [ ] Batch processing for multiple photos
- [ ] Additional style options
- [ ] User accounts and photo history
- [ ] Advanced customization options
- [ ] Mobile app development
- [ ] Integration with popular photo editing tools

---

**Made with ❤️ using AI technology**
