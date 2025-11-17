import express, { Request, Response } from 'express';
import cors from 'cors';
import compression from 'compression';
import { MetricsGenerator } from './utils/metricsGenerator';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
  origin: '*',
  credentials: false,
  exposedHeaders: ['Content-Type', 'Cache-Control', 'Connection']
}));
// Don't compress SSE streams
app.use(compression({
  filter: (req, res) => {
    if (req.url.includes('/metrics/stream')) {
      return false;
    }
    return compression.filter(req, res);
  }
}));
app.use(express.json());

const metricsGenerator = new MetricsGenerator(5);
app.get('/config', (req: Request, res: Response) => {
  res.json({
    serviceCount: metricsGenerator.getServiceCount(),
    updateInterval: 1000,
    services: metricsGenerator.getServices().map(s => s.name)
  });
});

app.post('/config', (req: Request, res: Response) => {
  const { serviceCount } = req.body;
  
  if (typeof serviceCount !== 'number' || serviceCount < 1 || serviceCount > 100) {
    return res.status(400).json({ 
      error: 'Invalid service count. Must be between 1 and 100.' 
    });
  }

  metricsGenerator.updateServiceCount(serviceCount);
  
  res.json({
    success: true,
    serviceCount: metricsGenerator.getServiceCount(),
    services: metricsGenerator.getServices().map(s => s.name)
  });
});

app.get('/metrics/stream', (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');
  res.flushHeaders(); // Flush headers immediately
  
  // Send initial comment to establish connection
  res.write(': connected\n\n');
  
  // Send first metrics immediately
  const initialMetrics = metricsGenerator.generateMetrics();
  res.write(`data: ${JSON.stringify(initialMetrics)}\n\n`);

  const intervalId = setInterval(() => {
    const metrics = metricsGenerator.generateMetrics();
    res.write(`data: ${JSON.stringify(metrics)}\n\n`);
  }, 1000);

  req.on('close', () => {
    clearInterval(intervalId);
    res.end();
  });
});

app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'healthy', timestamp: Date.now() });
});

app.listen(PORT, () => {
  console.log(`Metrics server running on port ${PORT}`);
  console.log(`Simulating ${metricsGenerator.getServiceCount()} services`);
});

