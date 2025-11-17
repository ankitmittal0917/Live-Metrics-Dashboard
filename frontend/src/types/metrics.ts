export interface ServiceMetric {
  serviceName: string;
  cpu: number;
  memory: number;
  errorRate: number;
  timestamp: number;
}

export type AlertStatus = 'healthy' | 'warning' | 'critical';

export interface MetricHistory {
  timestamp: number;
  cpu: number;
  memory: number;
  errorRate: number;
}

