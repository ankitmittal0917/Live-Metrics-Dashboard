import { useEffect, useRef, useCallback } from 'react';
import { useMetricsStore } from '../store/metricsStore';
import { ServiceMetric } from '../types/metrics';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export function useMetricsStream() {
  const eventSourceRef = useRef<EventSource | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();
  const { updateMetrics, setConnectionStatus } = useMetricsStore();
  
  const connect = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }
    
    const eventSource = new EventSource(`${API_BASE_URL}/metrics/stream`);
    eventSourceRef.current = eventSource;
    
    eventSource.onopen = () => {
      setConnectionStatus(true);
    };
    
    eventSource.onmessage = (event) => {
      try {
        const metrics: ServiceMetric[] = JSON.parse(event.data);
        updateMetrics(metrics);
      } catch (error) {
        console.error('Failed to parse metrics:', error);
      }
    };
    
    eventSource.onerror = () => {
      setConnectionStatus(false);
      eventSource.close();
      
      reconnectTimeoutRef.current = setTimeout(connect, 3000);
    };
  }, [updateMetrics, setConnectionStatus]);
  
  useEffect(() => {
    connect();
    
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, [connect]);
  
  return { reconnect: connect };
}

