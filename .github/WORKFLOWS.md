# GitHub Actions Workflows Setup

This document describes the CI/CD workflows for the NiceDice frontend.

## Workflows

### 1. CI Pipeline (`ci.yml`)
**Triggers:** Push/PR to main, master, develop, ci_changes
**Jobs:**
- **Unit Tests & Coverage**: Runs Jest tests with coverage reporting
- **Build Validation**: Validates production build
- **Docker Build Test**: Tests both dev and prod Docker builds
- **Lint & Code Quality**: ESLint and TypeScript checks

### 2. E2E Tests (`playwright.yml`)
**Triggers:** Push/PR to main, master, develop, ci_changes
**Jobs:**
- **Playwright E2E Tests**: Full end-to-end testing with Docker services

### 3. Deploy (`deploy.yml`)
**Triggers:** Push to main/master, manual dispatch
**Jobs:**
- **Build and Deploy**: Production deployment with Docker registry

## Required GitHub Secrets

For the workflows to function properly, configure these secrets in your repository:

### For Deployment (Optional)
```
PRODUCTION_BACKEND_URL=https://your-api.com/api/
REGISTRY_URL=your-docker-registry.com
REGISTRY_USERNAME=your-username
REGISTRY_PASSWORD=your-password
```

### For E2E Tests (Optional)
```
NEXT_PUBLIC_BACKEND_URL=http://your-test-backend:8000/api/
```

## Workflow Status

Check the status of workflows:
- CI Pipeline: [![CI](https://github.com/NiceDice-Team/team-challange-front/actions/workflows/ci.yml/badge.svg)](https://github.com/NiceDice-Team/team-challange-front/actions/workflows/ci.yml)
- E2E Tests: [![E2E](https://github.com/NiceDice-Team/team-challange-front/actions/workflows/playwright.yml/badge.svg)](https://github.com/NiceDice-Team/team-challange-front/actions/workflows/playwright.yml)

## Local Testing

Before pushing, run the same checks locally:

```bash
# Unit tests with coverage
npm run test:ci

# Build validation
npm run build

# Linting
npm run lint

# E2E tests (requires Docker)
docker-compose up -d --build
npx playwright test
docker-compose down
```