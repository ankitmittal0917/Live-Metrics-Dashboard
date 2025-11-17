export interface ServiceMetric {
  serviceName: string;
  cpu: number;
  memory: number;
  errorRate: number;
  timestamp: number;
}

export interface ServiceConfig {
  name: string;
  baselineCpu: number;
  baselineMemory: number;
  baselineErrorRate: number;
}

export interface AppConfig {
  serviceCount: number;
  services: ServiceConfig[];
  updateInterval: number;
}

