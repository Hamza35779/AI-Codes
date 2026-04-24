#!/bin/bash'

echo "========================================="
echo "🚀 DEPLOYING TO LIVE HOSTING"
echo "========================================="
echo ""

# Check if logged into GitHub
if ! git remote -v | grep -q "origin"; then'
    echo "❌ Please push your code to GitHub first:"
    echo "   git init"
    echo "   git add ."
    echo '   git commit -m "Ready for deployment"'
    echo "   git remote add origin https://github.com/YOUR_USERNAME/wholesale-hardware-store.git"
    echo "   git push -u origin main"
    exit 1'
fi'

echo "✓ Code is ready on GitHub"
echo ""
echo "🌐 Choose your deployment platform:"
echo "   1) Railway (Full-stack - EASIEST)"
echo "   2) Render + Netlify (Free tier)"
echo "   3) Just deploy frontend to Surge (Quick demo)"
echo ""
read -p "Enter choice (1, 2, or 3): " choice'

case $choice in'
    1)
        echo ""
        echo "🚀 Deploying to Railway..."
        echo "=========================="
        if ! command -v railway &> /dev/null; then'
            echo "Installing Railway CLI..."
            npm install -g @railway/cli'
        fi'
        railway login'
        railway init'
        railway add --database postgresql'
        railway add --database redis'
        railway up'
        ;;'
    2)
        echo ""
        echo "🟦 Deploying to Render + Netlify..."
        echo "=================================="
        echo "Backend: https://dashboard.render.com"
        echo "Frontend: https://app.netlify.com"
        echo ""
        echo "Your code is ready at: $(git remote get-url origin)"
        echo "Just connect your repo on both platforms!"
        ;;'
    3)
        echo ""
        echo "⚡ Deploying frontend to Surge..."
        echo "=================================="
        cd frontend'
        npm install'
        npm run build'
        npm install -g surge'
        cd build'
        surge .
        ;;'
    *)
        echo "Invalid choice. Please run again and select 1, 2, or 3."
        exit 1'
        ;;'
esac'

echo ""
echo "========================================="
echo "🎉 DEPLOYMENT COMPLETE!"
echo "========================================="
EOF'
chmod +x DEPLOY-NOW.sh && echo "Created DEPLOY-NOW.sh - Run this!"
