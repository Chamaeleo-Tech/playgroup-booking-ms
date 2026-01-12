FROM node:20-alpine
WORKDIR /app

ENV NODE_ENV=production

# Don't run as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY .next/standalone ./
COPY .next/static ./.next/static
COPY public ./public

USER nextjs

EXPOSE 3000
ENV PORT=3000

# server.js is created automatically by "output: standalone"
CMD ["node", "server.js"]