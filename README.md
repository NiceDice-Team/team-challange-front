# NiceDice Frontend

A Next.js e-commerce frontend application for the NiceDice project.

## 🚀 Quick Start

### Local Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 🐳 Docker Usage

We use a single, flexible Dockerfile that can handle both development and production scenarios through build arguments and environment variables.

### Development with Docker

```bash
# Build and run development container
docker-compose up --build

# Or run individual container
docker build -t nicedice-frontend .
docker run -p 3000:3000 -v $(pwd):/app -v /app/node_modules nicedice-frontend
```

### Production Build

```bash
# Build for production
docker build \
  --build-arg NODE_ENV=production \
  --build-arg NEXT_PUBLIC_BACKEND_URL=https://your-api.com/api/ \
  -t nicedice-frontend-prod .

# Run production container
docker run -p 3000:3000 \
  -e NODE_ENV=production \
  nicedice-frontend-prod \
  sh -c "npm run build && npm start"
```

### CI/CD Production

```bash
# Use the CI-specific docker-compose file
docker-compose -f docker-compose-ci-stage-frontend.yml up --build
```

## 🔧 Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `NODE_ENV` | Environment mode | `development` | No |
| `NEXT_PUBLIC_BACKEND_URL` | Backend API URL | `http://localhost:8000/api/` | No |
| `NEXT_TELEMETRY_DISABLED` | Disable Next.js telemetry | `1` | No |

### Setting Environment Variables

**For development:**
```bash
export NEXT_PUBLIC_BACKEND_URL=http://localhost:8000/api/
docker-compose up --build
```

**For production:**
```bash
export NEXT_PUBLIC_BACKEND_URL=https://your-production-api.com/api/
docker-compose -f docker-compose-ci-stage-frontend.yml up --build
```

## 📁 Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── (auth)/            # Authentication pages
│   ├── (cart)/            # Shopping cart pages
│   ├── (catalog)/         # Product catalog
│   └── ...
├── components/            # Reusable components
├── hooks/                 # Custom React hooks
├── lib/                   # Utility libraries
├── services/              # API services
└── utils/                 # Helper functions
```

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run Playwright E2E tests (requires Docker services)
npx playwright test
```

## 🏗️ Build Commands

```bash
# Development
npm run dev

# Production build
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

## 🐛 Troubleshooting

### Docker Build Issues

1. **Environment variable not found**: Ensure `NEXT_PUBLIC_BACKEND_URL` is set before building
2. **SSR errors**: Make sure client-side only code is wrapped with `typeof window !== 'undefined'`
3. **Build fails**: Clear Docker cache with `docker system prune -a`

### Common Solutions

```bash
# Clear everything and rebuild
docker-compose down --volumes --remove-orphans
docker system prune -a
docker-compose up --build

# Check logs
docker-compose logs frontend

# Access container shell
docker-compose exec frontend sh
```

## 🔗 Related Documentation

- [Next.js Documentation](https://nextjs.org/docs)
- [Docker Documentation](https://docs.docker.com/)
- [Backend API Documentation](../backend/README.md)

## 🚀 Deployment

The application is automatically deployed via GitHub Actions when code is pushed to the main branch. The workflow:

1. Builds the Docker container with production settings
2. Runs E2E tests with Playwright
3. Deploys to the staging/production environment

For manual deployment, use the production docker-compose configuration:

```bash
# Production deployment
docker-compose -f docker-compose-ci-stage-frontend.yml up -d --build
```