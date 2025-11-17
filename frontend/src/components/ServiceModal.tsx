import React from 'react';
import { Modal } from './Modal';
import { MetricsChart } from './MetricsChart';
import { useMetricsStore } from '../store/metricsStore';
import { ServiceMetric } from '../types/metrics';
import { getAlertStatus, getStatusColor } from '../utils/metrics';
import styles from './ServiceModal.module.css';

interface ServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: ServiceMetric | null;
}

export const ServiceModal: React.FC<ServiceModalProps> = ({ isOpen, onClose, service }) => {
  const history = useMetricsStore((state) => 
    service ? state.history.get(service.serviceName) || [] : []
  );
  
  if (!service) return null;
  
  const status = getAlertStatus(service.cpu, service.errorRate);
  const statusColor = getStatusColor(status);
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={service.serviceName}>
      <div className={styles.container}>
        <div className={styles.statusSection}>
          <div className={styles.statusBadge} style={{ backgroundColor: statusColor }}>
            {status.toUpperCase()}
          </div>
          <div className={styles.currentMetrics}>
            <div className={styles.metricBox}>
              <span className={styles.label}>CPU Usage</span>
              <span className={styles.value}>{service.cpu.toFixed(1)}%</span>
            </div>
            <div className={styles.metricBox}>
              <span className={styles.label}>Memory Usage</span>
              <span className={styles.value}>{service.memory.toFixed(1)}%</span>
            </div>
            <div className={styles.metricBox}>
              <span className={styles.label}>Error Rate</span>
              <span className={styles.value}>{service.errorRate.toFixed(2)}%</span>
            </div>
          </div>
        </div>
        
        <div className={styles.chartSection}>
          <h3 className={styles.chartTitle}>Last 30 Seconds</h3>
          <MetricsChart data={history} />
        </div>
      </div>
    </Modal>
  );
};

