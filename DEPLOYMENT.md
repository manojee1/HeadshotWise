# HeadshotWise Deployment Guide

This guide will help you deploy HeadshotWise to production using Render (backend) and Vercel (frontend).

## Prerequisites

- GitHub account
- Render account (free)
- Vercel account (free)
- Google AI API key

## Step 1: Deploy Backend to Render

### 1.1 Sign up for Render
1. Go to [render.com](https://render.com)
2. Sign up using your GitHub account
3. Connect your GitHub repository

### 1.2 Create Web Service
1. Click "New +" → "Web Service"
2. Connect your GitHub repository: `manojee1/HeadshotWise`
3. Configure the service:
   - **Name**: `headshotwise-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: Free

### 1.3 Set Environment Variables
In the Render dashboard, add these environment variables:
- `GOOGLE_API_KEY`: Your Google AI API key
- `NODE_ENV`: `production`
- `CORS_ORIGINS`: `https://your-vercel-url.vercel.app,http://localhost:5173`

### 1.4 Deploy
1. Click "Create Web Service"
2. Wait for deployment to complete
3. Note the service URL (e.g., `https://headshotwise-backend.onrender.com`)

## Step 2: Deploy Frontend to Vercel

### 2.1 Sign up for Vercel
1. Go to [vercel.com](https://vercel.com)
2. Sign up using your GitHub account
3. Connect your GitHub repository

### 2.2 Import Project
1. Click "New Project"
2. Import `manojee1/HeadshotWise`
3. Configure the project:
   - **Framework Preset**: Vite
   - **Root Directory**: `headshot-ai`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### 2.3 Set Environment Variables
In the Vercel dashboard, add:
- `VITE_API_URL`: `https://your-render-backend-url.onrender.com/api/headshot`

### 2.4 Deploy
1. Click "Deploy"
2. Wait for deployment to complete
3. Note the frontend URL (e.g., `https://headshotwise.vercel.app`)

## Step 3: Update CORS Settings

### 3.1 Update Backend CORS
1. Go back to Render dashboard
2. Update the `CORS_ORIGINS` environment variable:
   ```
   https://your-vercel-url.vercel.app,http://localhost:5173
   ```
3. Redeploy the service

## Step 4: Test Deployment

### 4.1 Test Frontend
1. Visit your Vercel URL
2. Try uploading a photo and generating a headshot
3. Verify all three styles work

### 4.2 Test Backend
1. Visit `https://your-render-url.onrender.com/api/headshot/health`
2. Should return a healthy status

## Troubleshooting

### Common Issues

1. **CORS Errors**
   - Ensure `CORS_ORIGINS` includes your Vercel URL
   - Check that URLs don't have trailing slashes

2. **API Key Issues**
   - Verify `GOOGLE_API_KEY` is set correctly
   - Ensure billing is enabled on Google AI

3. **Build Failures**
   - Check build logs in Render/Vercel dashboards
   - Ensure all dependencies are in package.json

4. **Slow Cold Starts**
   - Render free tier has cold starts
   - Consider upgrading to paid plan for production

## URLs Structure

After deployment, you'll have:
- **Frontend**: `https://headshotwise.vercel.app`
- **Backend**: `https://headshotwise-backend.onrender.com`
- **API Health**: `https://headshotwise-backend.onrender.com/api/headshot/health`

## Custom Domains (Optional)

Both Render and Vercel support custom domains:
1. Purchase a domain (e.g., from Namecheap, GoDaddy)
2. Configure DNS settings
3. Add custom domain in Render/Vercel dashboards

## Monitoring

- **Render**: Built-in logs and metrics
- **Vercel**: Built-in analytics and performance monitoring
- **Google AI**: Monitor API usage in Google AI Studio

## Cost

- **Render Free Tier**: 750 hours/month (enough for 24/7)
- **Vercel Free Tier**: Unlimited static sites
- **Google AI**: Pay per API call (you control usage)
- **Total Monthly Cost**: $0 (within free tiers)
