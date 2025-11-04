# 🚀 GitHub Workflow Templates

This directory contains ready-to-use GitHub workflow templates for CI/CD pipeline.

## 📁 Available Templates

### 1. **CI Pipeline** (`ci.yml.template`)

- **Purpose**: Continuous Integration with unit tests, build validation, and linting
- **Triggers**: All branches and pull requests
- **Features**:
  - Unit tests with coverage reporting
  - Build validation
  - ESLint and TypeScript checks
  - Codecov integration

### 2. **Production Deployment** (`deploy.yml.template`)

- **Purpose**: Automated deployment to Vercel production
- **Triggers**: Push to `main` branch
- **Features**:
  - Pre-deployment testing
  - Vercel deployment
  - Environment variable configuration

### 3. **Staging Deployment** (`staging.yml.template`)

- **Purpose**: Deployment to staging environment via Jenkins + AWS
- **Triggers**: Push to `staging` branch
- **Features**:
  - Docker image building
  - Jenkins webhook integration
  - Staging environment deployment

## 🔧 How to Use Templates

1. **Copy the template** you want to use:

   ```bash
   cp .github/workflow-templates/ci.yml.template .github/workflows/ci.yml
   ```

2. **Customize the workflow**:

   - Update branch names
   - Configure environment variables
   - Adjust trigger conditions
   - Set up secrets (Vercel tokens, webhook URLs, etc.)

3. **Configure required secrets** in GitHub repository settings:

   - `VERCEL_TOKEN` (for deploy.yml)
   - `VERCEL_ORG_ID` (for deploy.yml)
   - `VERCEL_PROJECT_ID` (for deploy.yml)
   - `JENKINS_WEBHOOK_URL` (for staging.yml)

## 🎯 Current Active Workflows

- **Playwright E2E Testing**: `.github/workflows/playwright.yml` ✅ Active

## 📝 Notes

- Templates are pre-configured with best practices
- All workflows include proper error handling
- Environment variables are externalized for flexibility
- Workflows are designed to work together as a complete CI/CD pipeline

## 🚀 Deployment Architecture

```text
main branch → Vercel (Production)
     ↓
   CI checks
     ↓
staging branch → Jenkins + AWS (Staging)
     ↓
  Docker build
     ↓
  Full E2E tests (Playwright)
```

When you're ready to implement CI/CD, simply copy the relevant templates to the `workflows` directory and customize them for your needs!
