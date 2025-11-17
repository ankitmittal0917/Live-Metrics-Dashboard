import { create } from 'zustand';
import { ServiceMetric, MetricHistory } from '../types/metrics';

interface MetricsState {
  services: Map<string, ServiceMetric>;
  history: Map<string, MetricHistory[]>;
  isConnected: boolean;
  serviceCount: number;
  
  updateMetrics: (metrics: ServiceMetric[]) => void;
  setConnectionStatus: (status: boolean) => void;
  setServiceCount: (count: number) => void;
  clearHistory: () => void;
  clearServices: () => void;
}

const MAX_HISTORY_POINTS = 30;

export const useMetricsStore = create<MetricsState>((set) => ({
  services: new Map(),
  history: new Map(),
  isConnected: false,
  serviceCount: 5,
  
  updateMetrics: (metrics: ServiceMetric[]) => {
    set((state) => {
      const newServices = new Map(state.services);
      const newHistory = new Map(state.history);
      
      metrics.forEach((metric) => {
        newServices.set(metric.serviceName, metric);
        
        const serviceHistory = newHistory.get(metric.serviceName) || [];
        const historyPoint: MetricHistory = {
          timestamp: metric.timestamp,
          cpu: metric.cpu,
          memory: metric.memory,
          errorRate: metric.errorRate
        };
        
        const updatedHistory = [...serviceHistory, historyPoint];
        if (updatedHistory.length > MAX_HISTORY_POINTS) {
          updatedHistory.shift();
        }
        
        newHistory.set(metric.serviceName, updatedHistory);
      });
      
      return {
        services: newServices,
        history: newHistory
      };
    });
  },
  
  setConnectionStatus: (status: boolean) => {
    set({ isConnected: status });
  },
  
  setServiceCount: (count: number) => {
    set({ serviceCount: count });
  },
  
  clearHistory: () => {
    set({ history: new Map() });
  },
  
  clearServices: () => {
    set({ services: new Map(), history: new Map() });
  }
}));

