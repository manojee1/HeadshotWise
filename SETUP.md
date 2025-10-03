# HeadshotWise Setup Instructions

## Environment Variables Setup

### 1. Create Environment File
Create a `.env` file in the `backend/` directory with the following content:

```bash
# Google Gemini API Configuration
GOOGLE_API_KEY=your_google_api_key_here

# Server Configuration
PORT=3001
NODE_ENV=development

# CORS Configuration
CORS_ORIGIN=http://localhost:5173
```

### 2. Get Your Google API Key
1. Go to [Google AI Studio](https://ai.google.dev/)
2. Sign in with your Google account
3. Create a new API key
4. Copy the API key and replace `your_google_api_key_here` in the `.env` file

### 3. Install Dependencies
```bash
# Backend
cd backend
npm install

# Frontend
cd ../headshot-ai
npm install
```

### 4. Run the Application
```bash
# Start backend (from backend directory)
npm run dev

# Start frontend (from headshot-ai directory)
npm run dev
```

## Security Notes
- Never commit the `.env` file to version control
- The `.env` file is already included in `.gitignore`
- Keep your API key secure and don't share it publicly

## Troubleshooting
- Make sure your Google API key has billing enabled for image generation
- Ensure the API key has access to the Gemini API
- Check that both servers are running on the correct ports (3001 for backend, 5173 for frontend)
