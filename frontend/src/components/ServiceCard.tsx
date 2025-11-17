import React, { memo } from 'react';
import { ServiceMetric } from '../types/metrics';
import { getAlertStatus, getStatusColor } from '../utils/metrics';
import styles from './ServiceCard.module.css';

interface ServiceCardProps {
  metric: ServiceMetric;
  onClick: () => void;
}

export const ServiceCard = memo(({ metric, onClick }: ServiceCardProps) => {
  const status = getAlertStatus(metric.cpu, metric.errorRate);
  const statusColor = getStatusColor(status);
  
  return (
    <div className={styles.card} onClick={onClick} role="button" tabIndex={0}>
      <div className={styles.header}>
        <h3 className={styles.serviceName}>{metric.serviceName}</h3>
        <div 
          className={styles.statusIndicator}
          style={{ backgroundColor: statusColor }}
          title={status}
        />
      </div>
      
      <div className={styles.metrics}>
        <div className={styles.metricItem}>
          <span className={styles.metricLabel}>CPU</span>
          <span className={styles.metricValue}>{metric.cpu.toFixed(1)}%</span>
        </div>
        
        <div className={styles.metricItem}>
          <span className={styles.metricLabel}>Memory</span>
          <span className={styles.metricValue}>{metric.memory.toFixed(1)}%</span>
        </div>
        
        <div className={styles.metricItem}>
          <span className={styles.metricLabel}>Error Rate</span>
          <span className={styles.metricValue}>{metric.errorRate.toFixed(2)}%</span>
        </div>
      </div>
    </div>
  );
});

