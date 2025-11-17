import { ServiceMetric, ServiceConfig } from '../types/metrics';

const SERVICE_NAMES = [
  'auth-service',
  'payment-service',
  'notification-service',
  'user-service',
  'analytics-service',
  'storage-service',
  'email-service',
  'search-service',
  'recommendation-service',
  'api-gateway'
];

function generateMetricValue(baseline: number, variance: number, min: number, max: number): number {
  const randomVariance = (Math.random() - 0.5) * 2 * variance;
  const value = baseline + randomVariance;
  return Math.max(min, Math.min(max, value));
}

export class MetricsGenerator {
  private services: ServiceConfig[] = [];
  private previousMetrics: Map<string, ServiceMetric> = new Map();

  constructor(serviceCount: number = 5) {
    this.initializeServices(serviceCount);
  }

  private initializeServices(count: number): void {
    this.services = [];
    for (let i = 0; i < count; i++) {
      const baseName = SERVICE_NAMES[i % SERVICE_NAMES.length];
      const name = i >= SERVICE_NAMES.length 
        ? `${baseName}-${Math.floor(i / SERVICE_NAMES.length) + 1}` 
        : baseName;
      
      this.services.push({
        name,
        baselineCpu: 30 + Math.random() * 40,
        baselineMemory: 40 + Math.random() * 30,
        baselineErrorRate: Math.random() * 2
      });
    }
  }

  public generateMetrics(): ServiceMetric[] {
    const timestamp = Date.now();
    
    return this.services.map(service => {
      const prevMetric = this.previousMetrics.get(service.name);
      const cpuBase = prevMetric ? prevMetric.cpu : service.baselineCpu;
      const memoryBase = prevMetric ? prevMetric.memory : service.baselineMemory;
      const errorBase = prevMetric ? prevMetric.errorRate : service.baselineErrorRate;

      const cpu = generateMetricValue(cpuBase, 10, 0, 100);
      const memory = generateMetricValue(memoryBase, 8, 0, 100);
      const errorRate = generateMetricValue(errorBase, 1.5, 0, 15);

      const metric: ServiceMetric = {
        serviceName: service.name,
        cpu: parseFloat(cpu.toFixed(1)),
        memory: parseFloat(memory.toFixed(1)),
        errorRate: parseFloat(errorRate.toFixed(2)),
        timestamp
      };

      this.previousMetrics.set(service.name, metric);
      return metric;
    });
  }

  public updateServiceCount(count: number): void {
    if (count > 0 && count <= 100) {
      this.initializeServices(count);
      this.previousMetrics.clear();
    }
  }

  public getServiceCount(): number {
    return this.services.length;
  }

  public getServices(): ServiceConfig[] {
    return this.services;
  }
}

