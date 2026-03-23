FROM node:22-alpine AS base
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install

FROM base AS build
COPY . .
RUN npx prisma generate
RUN npm run build && echo "BUILD SUCCESS"

FROM node:22-alpine AS production
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/package.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/scripts ./scripts
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 CMD node -e "fetch('http://127.0.0.1:3000/api/v1/health/ready').then((response) => { if (!response.ok) process.exit(1) }).catch(() => process.exit(1))"
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/src/main.js"]
