FROM node:18-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

FROM node:18-alpine AS backend-builder
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm install
COPY backend/ ./
RUN npm run build

FROM node:18-alpine
WORKDIR /app

RUN npm install -g serve concurrently

COPY --from=backend-builder /app/backend/dist ./backend/dist
COPY --from=backend-builder /app/backend/package*.json ./backend/
RUN cd backend && npm install --production

COPY --from=frontend-builder /app/frontend/dist ./frontend/dist

EXPOSE 3000 3001

RUN echo '#!/bin/sh' > /app/start.sh && \
    echo 'cd /app/backend && node dist/server.js &' >> /app/start.sh && \
    echo 'cd /app/frontend && serve -s dist -l 3000' >> /app/start.sh && \
    chmod +x /app/start.sh

CMD ["/app/start.sh"]
