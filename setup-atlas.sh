#!/bin/bash

# Interactive MongoDB Atlas Setup Script
# This script helps you configure your backend to use MongoDB Atlas

echo "========================================="
echo "🌐 MongoDB Atlas Configuration Setup"
echo "========================================="
echo ""

# Check if .env file exists
if [ ! -f "backend/.env" ]; then
    echo "Creating .env file from example..."
    cp backend/.env.example backend/.env
fi

echo "📋 Follow these steps to get your MongoDB Atlas connection string:"
echo ""
echo "1. Go to: https://www.mongodb.com/cloud/atlas/register"
echo "2. Create a FREE account and log in"
echo "3. Create a FREE cluster (M0 tier)"
echo "4. Create a database user and save the password"
echo "5. Allow network access (use 0.0.0.0/0 for development)"
echo "6. Click 'Connect' → 'Connect your application'"
echo "7. Copy your connection string"
echo ""
echo "⚠️  Your connection string should look like:"
echo "mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority"
echo ""
echo "📖 For detailed instructions, see: MONGODB_ATLAS_SETUP.md"
echo ""
echo "========================================="
echo ""

read -p "Do you have your MongoDB Atlas connection string ready? (y/n): " ready

if [ "$ready" != "y" ] && [ "$ready" != "Y" ]; then
    echo ""
    echo "No problem! Here's what to do:"
    echo ""
    echo "1. Open this guide for step-by-step instructions:"
    echo "   cat MONGODB_ATLAS_SETUP.md"
    echo ""
    echo "2. Or use the quick start guide:"
    echo "   cat QUICK_START_ATLAS.md"
    echo ""
    echo "3. Run this script again when you have your connection string"
    echo ""
    exit 0
fi

echo ""
echo "Great! Let's configure your backend."
echo ""
read -p "Paste your MongoDB Atlas connection string here: " connection_string

# Check if connection string looks valid
if [[ ! $connection_string =~ ^mongodb\+srv:// ]]; then
    echo ""
    echo "❌ That doesn't look like a MongoDB Atlas connection string."
    echo "   It should start with: mongodb+srv://"
    echo ""
    echo "Please run this script again with the correct connection string."
    exit 1
fi

# Check if it has <password> placeholder
if [[ $connection_string =~ \<password\> ]]; then
    echo ""
    echo "⚠️  Warning: Your connection string still has '<password>' placeholder!"
    echo "   You need to replace it with your actual password."
    echo ""
    read -p "Do you want to continue anyway? (y/n): " continue_anyway
    if [ "$continue_anyway" != "y" ] && [ "$continue_anyway" != "Y" ]; then
        exit 1
    fi
fi

# Add database name if not present
if [[ ! $connection_string =~ /appointment_management ]]; then
    # Add database name before the query parameters
    connection_string=$(echo "$connection_string" | sed 's/?/\/appointment_management?/')
    echo ""
    echo "✅ Added database name 'appointment_management' to your connection string"
fi

# Update .env file
echo "PORT=5000" > backend/.env
echo "MONGODB_URI=$connection_string" >> backend/.env
echo "NODE_ENV=development" >> backend/.env

echo ""
echo "========================================="
echo "✅ Configuration Updated!"
echo "========================================="
echo ""
echo "Your backend/.env file has been configured with:"
echo "- Port: 5000"
echo "- MongoDB: Atlas Cloud"
echo "- Database: appointment_management"
echo ""
echo "🚀 Next steps:"
echo ""
echo "1. Start the backend:"
echo "   cd backend"
echo "   npm start"
echo ""
echo "2. Wait for: 'MongoDB Connected: cluster0...'"
echo ""
echo "3. (Optional) Add sample data:"
echo "   node init-sample-data.js"
echo ""
echo "4. Open frontend in browser:"
echo "   http://localhost:3000"
echo ""
echo "========================================="
echo "🎉 Your app will be fully functional!"
echo "========================================="

