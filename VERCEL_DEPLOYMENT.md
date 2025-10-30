# ViScan Vercel Deployment Guide

This guide will walk you through deploying ViScan to Vercel.

## Prerequisites

- Vercel account (https://vercel.com)
- GitHub account
- PostgreSQL database (can use Vercel Postgres or external provider)

## Step 1: Prepare Your Repository

1. **Initialize Git Repository** (if not already done):
```bash
cd /path/to/viscan-app
git init
git add .
git commit -m "Initial commit: ViScan medical image analysis platform"
```

2. **Create GitHub Repository**:
   - Go to https://github.com/new
   - Name: `viscan-app`
   - Description: "AI-Powered Medical Image Analysis Platform"
   - Keep it private (for now)
   - Click "Create repository"

3. **Push to GitHub**:
```bash
git remote add origin https://github.com/YOUR_USERNAME/viscan-app.git
git branch -M main
git push -u origin main
```

## Step 2: Deploy to Vercel

### Option A: Deploy via Vercel Dashboard (Recommended)

1. **Go to Vercel Dashboard**:
   - Visit https://vercel.com/dashboard
   - Click "Add New" → "Project"

2. **Import Git Repository**:
   - Select "Import Git Repository"
   - Choose your GitHub account
   - Select `viscan-app` repository
   - Click "Import"

3. **Configure Project**:
   - **Framework Preset**: Other
   - **Root Directory**: `./`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist/public`
   - **Install Command**: `npm install`

4. **Add Environment Variables**:
   Click "Environment Variables" and add the following:

   ```env
   # Database
   DATABASE_URL=your_postgresql_connection_string
   
   # Authentication
   JWT_SECRET=your_jwt_secret_here
   OAUTH_SERVER_URL=https://api.manus.im
   OWNER_OPEN_ID=your_owner_openid
   OWNER_NAME=Your Name
   
   # Application
   VITE_APP_ID=your_app_id
   VITE_APP_TITLE=ViScan
   VITE_APP_LOGO=https://i.imgur.com/CKmuNYI.png
   VITE_OAUTH_PORTAL_URL=https://portal.manus.im
   
   # AI Services
   BUILT_IN_FORGE_API_URL=https://api.manus.im
   BUILT_IN_FORGE_API_KEY=your_ai_api_key
   
   # Analytics (Optional)
   VITE_ANALYTICS_ENDPOINT=your_analytics_endpoint
   VITE_ANALYTICS_WEBSITE_ID=your_website_id
   
   # Node Environment
   NODE_ENV=production
   ```

5. **Deploy**:
   - Click "Deploy"
   - Wait for the build to complete (2-5 minutes)
   - Your app will be live at `https://your-project.vercel.app`

### Option B: Deploy via Vercel CLI

1. **Install Vercel CLI**:
```bash
npm install -g vercel
```

2. **Login to Vercel**:
```bash
vercel login
```

3. **Deploy**:
```bash
cd /path/to/viscan-app
vercel
```

4. **Follow the prompts**:
   - Set up and deploy? `Y`
   - Which scope? Select your account
   - Link to existing project? `N`
   - What's your project's name? `viscan-app`
   - In which directory is your code located? `./`
   - Want to override the settings? `N`

5. **Deploy to Production**:
```bash
vercel --prod
```

## Step 3: Configure Database

### Option A: Use Vercel Postgres

1. **Go to your project in Vercel Dashboard**
2. **Click "Storage" tab**
3. **Click "Create Database"**
4. **Select "Postgres"**
5. **Choose a region close to your users**
6. **Click "Create"**
7. **Copy the connection string**
8. **Update `DATABASE_URL` environment variable**

### Option B: Use External PostgreSQL

If you're using an external PostgreSQL database (like Supabase, Railway, or your own):

1. Make sure your database is accessible from the internet
2. Update the `DATABASE_URL` environment variable with your connection string
3. Run migrations:
```bash
npm run db:push
```

## Step 4: Configure Custom Domain

1. **Go to Project Settings**:
   - Vercel Dashboard → Your Project → Settings → Domains

2. **Add Domain**:
   - Enter your domain (e.g., `viscan.app` or `www.viscan.app`)
   - Click "Add"

3. **Configure DNS**:
   - Add the following DNS records at your domain registrar:
   
   **For root domain (viscan.app)**:
   ```
   Type: A
   Name: @
   Value: 76.76.21.21
   ```
   
   **For www subdomain**:
   ```
   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```

4. **Wait for DNS propagation** (can take up to 48 hours, usually 5-10 minutes)

5. **SSL Certificate**:
   - Vercel automatically provisions SSL certificates
   - Your site will be available at `https://viscan.app`

## Step 5: Set Up Automatic Deployments

Vercel automatically deploys when you push to your GitHub repository:

- **Production**: Pushes to `main` branch → Deploy to production
- **Preview**: Pushes to other branches → Deploy preview environments
- **Pull Requests**: Automatically create preview deployments

## Step 6: Post-Deployment Checks

1. **Test the Application**:
   - Visit your deployed URL
   - Test user registration and login
   - Upload a test image
   - Run an analysis
   - Check all AI models work correctly

2. **Check Logs**:
   - Vercel Dashboard → Your Project → Deployments → View Function Logs
   - Look for any errors or warnings

3. **Monitor Performance**:
   - Vercel Dashboard → Your Project → Analytics
   - Check response times and error rates

## Step 7: Environment-Specific Configuration

### Development
```bash
vercel env add VARIABLE_NAME development
```

### Preview
```bash
vercel env add VARIABLE_NAME preview
```

### Production
```bash
vercel env add VARIABLE_NAME production
```

## Troubleshooting

### Build Fails

1. **Check build logs** in Vercel Dashboard
2. **Common issues**:
   - Missing environment variables
   - TypeScript errors
   - Dependency installation failures

**Solution**: Fix the errors locally first, then push to GitHub

### Database Connection Issues

1. **Check `DATABASE_URL`** is correctly set
2. **Verify database is accessible** from Vercel's IP ranges
3. **Check firewall rules** if using external database

### API Routes Not Working

1. **Check `vercel.json`** configuration
2. **Verify serverless function** is correctly exported
3. **Check function logs** for errors

### Slow Performance

1. **Enable caching** for static assets
2. **Optimize images** and reduce bundle size
3. **Use Vercel Edge Network** for faster delivery

## Advanced Configuration

### Custom Build Settings

Edit `vercel.json`:
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist/public",
  "framework": null,
  "functions": {
    "api/**/*.js": {
      "runtime": "nodejs20.x",
      "maxDuration": 60,
      "memory": 1024
    }
  }
}
```

### Environment Variables via CLI

```bash
# Add a new environment variable
vercel env add DATABASE_URL

# List all environment variables
vercel env ls

# Remove an environment variable
vercel env rm DATABASE_URL
```

### Rollback Deployment

```bash
# List all deployments
vercel ls

# Rollback to a specific deployment
vercel rollback [deployment-url]
```

## Security Best Practices

1. **Never commit `.env` files** to Git
2. **Use Vercel's environment variables** for sensitive data
3. **Enable HTTPS only** (automatic with Vercel)
4. **Set up CORS** properly in your API
5. **Use strong JWT secrets**
6. **Regularly update dependencies**

## Monitoring and Maintenance

1. **Set up monitoring**:
   - Vercel Analytics (built-in)
   - External monitoring (e.g., Sentry, LogRocket)

2. **Regular backups**:
   - Database backups (daily)
   - Code backups (GitHub)

3. **Update dependencies**:
```bash
npm update
npm audit fix
```

## Support

- **Vercel Documentation**: https://vercel.com/docs
- **Vercel Support**: https://vercel.com/support
- **ViScan Issues**: https://github.com/YOUR_USERNAME/viscan-app/issues

## Next Steps

After successful deployment:

1. ✅ Configure custom domain
2. ✅ Set up monitoring
3. ✅ Test all features
4. ✅ Enable automatic deployments
5. ✅ Set up staging environment
6. ✅ Configure CI/CD pipeline
7. ✅ Add team members
8. ✅ Set up analytics

---

**Congratulations! Your ViScan application is now live on Vercel! 🎉**
