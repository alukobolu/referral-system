# Vercel Deployment Debugging Guide

## Common Issues and Solutions

### 1. CORS Issues
**Problem**: API returns CORS errors on Vercel but works locally
**Solution**: 
- Updated CORS configuration to be more flexible
- Added environment variable support for frontend URL
- Set `FRONTEND_URL` environment variable in Vercel dashboard

### 2. Environment Variables
**Problem**: Missing environment variables causing server errors
**Solution**: 
- Set `NODE_ENV=production` in Vercel dashboard
- Set `FRONTEND_URL` to your frontend domain
- Ensure all required environment variables are configured

### 3. File Path Issues
**Problem**: Error handler trying to serve files that don't exist
**Solution**: 
- Removed file serving logic from error handler
- Always return JSON responses for serverless environment

### 4. Module Resolution Issues
**Problem**: Import errors in serverless environment
**Solution**: 
- Ensure all dependencies are in `package.json`
- Use relative paths for imports
- Test with `node test-vercel.js` locally

## Debugging Steps

### 1. Test Locally
```bash
node test-vercel.js
```

### 2. Check Vercel Logs
- Go to Vercel dashboard
- Navigate to your project
- Check Function Logs for errors

### 3. Test Health Endpoint
```bash
curl https://your-vercel-domain.vercel.app/health
```

### 4. Check Environment Variables
- Verify `NODE_ENV=production` is set
- Set `FRONTEND_URL` to your frontend domain
- Add any other required environment variables

### 5. Test API Endpoints
```bash
# Test root endpoint
curl https://your-vercel-domain.vercel.app/

# Test API info
curl https://your-vercel-domain.vercel.app/api

# Test users endpoint
curl https://your-vercel-domain.vercel.app/api/users
```

## Environment Variables to Set in Vercel

1. `NODE_ENV=production`
2. `FRONTEND_URL=https://your-frontend-domain.vercel.app`

## Common Error Messages and Solutions

### "Module not found"
- Ensure all dependencies are in `package.json`
- Check import paths are correct
- Verify file structure matches imports

### "CORS error"
- Check `FRONTEND_URL` environment variable
- Verify frontend domain is in allowed origins
- Test with different browsers/devices

### "Internal server error"
- Check Vercel function logs
- Verify all required environment variables are set
- Test endpoints individually

### "Function timeout"
- Increase `maxDuration` in `vercel.json`
- Optimize code for faster execution
- Consider breaking large operations into smaller functions

## Testing Checklist

- [ ] Local development works (`npm start`)
- [ ] Serverless function works locally (`node test-vercel.js`)
- [ ] Health endpoint responds correctly
- [ ] API endpoints return expected data
- [ ] CORS is configured correctly
- [ ] Environment variables are set
- [ ] Error handling works properly
- [ ] Logs are being generated correctly

## Deployment Commands

```bash
# Deploy to Vercel
vercel --prod

# Deploy to preview
vercel

# Check deployment status
vercel ls
```

## Monitoring

- Use Vercel Analytics to monitor performance
- Check Function Logs for errors
- Monitor response times and error rates
- Set up alerts for critical errors 