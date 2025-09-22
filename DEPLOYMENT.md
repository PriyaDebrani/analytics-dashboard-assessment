# Deployment Guide

## Quick Deploy to Netlify

1. **Build the project:**
   ```bash
   npm run build
   ```

2. **Deploy to Netlify:**
   - Go to [netlify.com](https://netlify.com)
   - Drag and drop the `build` folder to deploy
   - Or connect your GitHub repository for auto-deployment

## Deploy to Vercel

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Deploy:**
   ```bash
   vercel --prod
   ```

## GitHub Pages (Alternative)

1. **Install gh-pages:**
   ```bash
   npm install --save-dev gh-pages
   ```

2. **Add to package.json scripts:**
   ```json
   "homepage": "https://yourusername.github.io/analytics-dashboard-assessment",
   "predeploy": "npm run build",
   "deploy": "gh-pages -d build"
   ```

3. **Deploy:**
   ```bash
   npm run deploy
   ```

## Environment Setup

Make sure you have:
- Node.js 16+ installed
- npm or yarn package manager
- Git for version control

## Post-Deployment

1. Update the README.md with your live dashboard URL
2. Test all features on the deployed version
3. Ensure mobile responsiveness works correctly
