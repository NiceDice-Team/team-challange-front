FROM node:20-alpine

WORKDIR /app
COPY package*.json ./

# Встановлюємо ВСІ залежності (dev теж потрібні для lint/build/devserver)
RUN npm install

# Копіюємо решту проєкту
COPY . .

ENV NODE_ENV=development
ENV NEXT_TELEMETRY_DISABLED=1
ENV NEXT_PUBLIC_BACKEND_URL=${NEXT_PUBLIC_BACKEND_URL:-http://localhost:8000/api/}

EXPOSE 3000

# Використай npm ci якщо package-lock.json стабільний
CMD ["npm", "run", "dev"]