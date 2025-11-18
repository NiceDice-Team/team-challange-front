#!/bin/bash

# 🚀 GitHub Workflow Setup Script
# Use this script to quickly activate workflow templates

set -e

WORKFLOWS_DIR=".github/workflows"
TEMPLATES_DIR=".github/workflow-templates"

echo "🚀 GitHub Workflow Setup"
echo "======================="
echo ""

# Check if we're in the right directory
if [ ! -d "$TEMPLATES_DIR" ]; then
    echo "❌ Error: Run this script from the project root directory"
    exit 1
fi

echo "Available workflow templates:"
echo ""
echo "1. CI Pipeline (ci.yml.template)"
echo "   - Unit tests, build validation, linting"
echo "   - Runs on all branches and PRs"
echo ""
echo "2. Production Deployment (deploy.yml.template)"
echo "   - Vercel deployment for main branch"
echo "   - Requires Vercel secrets configuration"
echo ""
echo "3. Staging Deployment (staging.yml.template)"
echo "   - Jenkins + AWS deployment for staging branch"
echo "   - Requires Jenkins webhook configuration"
echo ""

read -p "Which workflow would you like to activate? (1/2/3 or 'all'): " choice

activate_workflow() {
    local template_name=$1
    local workflow_name=$2
    local description=$3
    
    if [ -f "$WORKFLOWS_DIR/$workflow_name" ]; then
        echo "⚠️  $workflow_name already exists. Overwrite? (y/N)"
        read -r overwrite
        if [[ ! $overwrite =~ ^[Yy]$ ]]; then
            echo "⏭️  Skipping $workflow_name"
            return
        fi
    fi
    
    cp "$TEMPLATES_DIR/$template_name" "$WORKFLOWS_DIR/$workflow_name"
    echo "✅ Activated: $description"
}

case $choice in
    1)
        activate_workflow "ci.yml.template" "ci.yml" "CI Pipeline"
        ;;
    2)
        activate_workflow "deploy.yml.template" "deploy.yml" "Production Deployment"
        echo ""
        echo "🔧 Next steps for Vercel deployment:"
        echo "   1. Set up Vercel secrets in GitHub repository settings:"
        echo "      - VERCEL_TOKEN"
        echo "      - VERCEL_ORG_ID" 
        echo "      - VERCEL_PROJECT_ID"
        ;;
    3)
        activate_workflow "staging.yml.template" "staging.yml" "Staging Deployment"
        echo ""
        echo "🔧 Next steps for staging deployment:"
        echo "   1. Set up Jenkins webhook URL in GitHub repository settings:"
        echo "      - JENKINS_WEBHOOK_URL"
        ;;
    "all")
        activate_workflow "ci.yml.template" "ci.yml" "CI Pipeline"
        activate_workflow "deploy.yml.template" "deploy.yml" "Production Deployment"
        activate_workflow "staging.yml.template" "staging.yml" "Staging Deployment"
        echo ""
        echo "🔧 Next steps:"
        echo "   1. Configure GitHub repository secrets (see templates/README.md)"
        echo "   2. Update branch names in workflows if needed"
        echo "   3. Test workflows with pushes to respective branches"
        ;;
    *)
        echo "❌ Invalid choice. Exiting."
        exit 1
        ;;
esac

echo ""
echo "🎉 Workflow setup complete!"
echo ""
echo "📁 Current active workflows:"
ls -la "$WORKFLOWS_DIR"
echo ""
echo "📖 For more details, see: $TEMPLATES_DIR/README.md"