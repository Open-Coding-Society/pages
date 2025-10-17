#!/bin/bash

################################################################################
# Flask Social Media Backend Setup Script
# 
# This script copies the necessary backend files from your pages repo
# to your Flask backend repo.
#
# Usage:
#   1. Copy this script to your Flask backend repo
#   2. Run: chmod +x setup_backend.sh
#   3. Run: ./setup_backend.sh
#
# Or run directly:
#   bash setup_backend.sh
################################################################################

# Colors for pretty output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Banner
echo -e "${CYAN}"
echo "╔════════════════════════════════════════════════════════════╗"
echo "║     Flask Social Media Backend Setup Script               ║"
echo "║     Copying files from pages repo to backend repo         ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo -e "${NC}"

# Configuration - UPDATE THESE PATHS
PAGES_REPO="$HOME/pages"
BACKEND_REPO="$(pwd)"  # Current directory (run this from your backend repo)

echo -e "${BLUE}📂 Configuration:${NC}"
echo -e "   Pages repo:   ${CYAN}$PAGES_REPO${NC}"
echo -e "   Backend repo: ${CYAN}$BACKEND_REPO${NC}"
echo ""

# Verify pages repo exists
if [ ! -d "$PAGES_REPO/navigation/social_media" ]; then
    echo -e "${RED}❌ Error: Pages repo not found at $PAGES_REPO${NC}"
    echo -e "${YELLOW}💡 Update the PAGES_REPO variable in this script to point to your pages directory${NC}"
    exit 1
fi

# Verify we're in a backend repo (check for model and api directories)
if [ ! -d "model" ] || [ ! -d "api" ]; then
    echo -e "${RED}❌ Error: This doesn't look like a Flask backend repo${NC}"
    echo -e "${YELLOW}💡 Make sure you're running this script from your Flask backend directory${NC}"
    echo -e "${YELLOW}   Expected directories: model/, api/, scripts/${NC}"
    exit 1
fi

# Create scripts directory if it doesn't exist
if [ ! -d "scripts" ]; then
    echo -e "${YELLOW}⚠️  scripts/ directory not found, creating it...${NC}"
    mkdir -p scripts
fi

echo -e "${GREEN}✅ All checks passed!${NC}"
echo ""

# File mapping
declare -A FILES=(
    ["model_post.py"]="model/post.py"
    ["api_post.py"]="api/post.py"
    ["init_posts.py"]="scripts/init_posts.py"
)

# Copy files
echo -e "${BLUE}📦 Copying backend files...${NC}"
echo ""

COPIED_COUNT=0
FAILED_COUNT=0

for source_file in "${!FILES[@]}"; do
    dest_file="${FILES[$source_file]}"
    source_path="$PAGES_REPO/navigation/social_media/$source_file"
    
    echo -e "${CYAN}→ Copying $source_file${NC}"
    echo -e "  From: $source_path"
    echo -e "  To:   $BACKEND_REPO/$dest_file"
    
    if [ ! -f "$source_path" ]; then
        echo -e "  ${RED}❌ Source file not found!${NC}"
        ((FAILED_COUNT++))
    else
        cp "$source_path" "$dest_file"
        if [ $? -eq 0 ]; then
            echo -e "  ${GREEN}✅ Copied successfully${NC}"
            ((COPIED_COUNT++))
            
            # Make init_posts.py executable
            if [ "$dest_file" == "scripts/init_posts.py" ]; then
                chmod +x "$dest_file"
                echo -e "  ${GREEN}✅ Made executable${NC}"
            fi
        else
            echo -e "  ${RED}❌ Copy failed!${NC}"
            ((FAILED_COUNT++))
        fi
    fi
    echo ""
done

# Summary
echo -e "${CYAN}═══════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}📊 Copy Summary:${NC}"
echo -e "   ✅ Copied: $COPIED_COUNT files"
echo -e "   ❌ Failed: $FAILED_COUNT files"
echo -e "${CYAN}═══════════════════════════════════════════════════════════${NC}"
echo ""

if [ $FAILED_COUNT -gt 0 ]; then
    echo -e "${RED}⚠️  Some files failed to copy. Please check the errors above.${NC}"
    exit 1
fi

# Check if post_api is registered in main.py
echo -e "${BLUE}🔍 Checking main.py configuration...${NC}"
echo ""

if [ ! -f "main.py" ]; then
    echo -e "${YELLOW}⚠️  main.py not found in current directory${NC}"
    echo -e "${YELLOW}   You'll need to manually register the post_api blueprint${NC}"
else
    if grep -q "from api.post import post_api" main.py; then
        echo -e "${GREEN}✅ Import found: from api.post import post_api${NC}"
    else
        echo -e "${YELLOW}⚠️  Import NOT found in main.py${NC}"
        echo -e "${CYAN}   Add this line to main.py:${NC}"
        echo -e "   ${YELLOW}from api.post import post_api${NC}"
    fi
    
    if grep -q "register_blueprint(post_api)" main.py; then
        echo -e "${GREEN}✅ Blueprint registration found${NC}"
    else
        echo -e "${YELLOW}⚠️  Blueprint registration NOT found in main.py${NC}"
        echo -e "${CYAN}   Add this line to main.py:${NC}"
        echo -e "   ${YELLOW}app.register_blueprint(post_api)${NC}"
    fi
fi

echo ""
echo -e "${CYAN}═══════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}🎉 Backend files copied successfully!${NC}"
echo -e "${CYAN}═══════════════════════════════════════════════════════════${NC}"
echo ""

# Next steps
echo -e "${BLUE}📋 Next Steps:${NC}"
echo ""
echo -e "${CYAN}1.${NC} Update main.py (if needed):"
echo -e "   ${YELLOW}from api.post import post_api${NC}"
echo -e "   ${YELLOW}app.register_blueprint(post_api)${NC}"
echo ""
echo -e "${CYAN}2.${NC} Initialize the database:"
echo -e "   ${YELLOW}python scripts/init_posts.py${NC}"
echo ""
echo -e "${CYAN}3.${NC} Start your Flask backend:"
echo -e "   ${YELLOW}python main.py${NC}"
echo ""
echo -e "${CYAN}4.${NC} Test the API:"
echo -e "   ${YELLOW}curl http://localhost:8887/api/post/all${NC}"
echo ""

# List copied files
echo -e "${BLUE}📁 Files now in your backend:${NC}"
echo -e "   ${GREEN}✓${NC} model/post.py"
echo -e "   ${GREEN}✓${NC} api/post.py"
echo -e "   ${GREEN}✓${NC} scripts/init_posts.py"
echo ""

echo -e "${GREEN}✨ Setup complete! Your backend is ready for social media posts!${NC}"
echo ""

