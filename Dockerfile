FROM node:20-bookworm-slim AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts

COPY . .
RUN npm run build

FROM node:20-bookworm-slim AS runtime

WORKDIR /app

COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./package.json

ENV PAM_HOST=0.0.0.0
ENV PAM_PORT=3000
ENV PAM_BASE_URL=https://pam.cultofjoey.com
ENV PAM_AUTH_TOKEN=
ENV PAM_DATA_DIR=/srv/pam/memory

EXPOSE 3000

CMD ["node", "dist/server/httpServer.js"]

