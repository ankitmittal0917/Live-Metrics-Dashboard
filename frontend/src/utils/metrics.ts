import { AlertStatus } from '../types/metrics';
import { tokens } from '../styles/tokens';

export function getAlertStatus(cpu: number, errorRate: number): AlertStatus {
  if (cpu > 80 || errorRate > 5) {
    return 'critical';
  }
  if (cpu >= 60 && cpu <= 80) {
    return 'warning';
  }
  return 'healthy';
}

export function getStatusColor(status: AlertStatus): string {
  switch (status) {
    case 'critical':
      return tokens.colors.status.critical;
    case 'warning':
      return tokens.colors.status.warning;
    case 'healthy':
      return tokens.colors.status.healthy;
  }
}

export function formatTimestamp(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleTimeString();
}

