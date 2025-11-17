# Live Metrics Dashboard

Real-time monitoring dashboard for microservices. Track CPU, memory, and error rates across multiple services with live updates.

## Stack

- Frontend: React + TypeScript + Vite + Zustand + Recharts
- Backend: Node.js + Express + TypeScript
- Real-time: Server-Sent Events (SSE)
- Deployment: Docker

## Getting Started

### With Docker

```bash
docker-compose up --build
```

Open http://localhost:3000

### Local Development

Start the backend:
```bash
cd backend
npm install
npm run dev
```

In another terminal, start the frontend:
```bash
cd frontend
npm install
npm run dev
```

Backend → `localhost:3001`  
Frontend → `localhost:3000`

## Features

- Live metrics streaming every second
- Color-coded health status (green/yellow/red)
- Click any service to see historical charts
- Add or remove services on the fly
- Automatic reconnection

## API

**GET /metrics/stream** - SSE endpoint for live metrics  
**GET /config** - Current configuration  
**POST /config** - Update service count  
**GET /health** - Health check

Example config update:
```bash
curl -X POST http://localhost:3001/config \
  -H "Content-Type: application/json" \
  -d '{"serviceCount": 10}'
```

## Project Structure

```
├── backend/
│   └── src/
│       ├── server.ts
│       ├── types/metrics.ts
│       └── utils/metricsGenerator.ts
└── frontend/
    └── src/
        ├── App.tsx
        ├── components/
        ├── hooks/
        └── store/
```
