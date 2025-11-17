import React, { useState, useCallback } from 'react';
import { useMetricsStore } from '../store/metricsStore';
import { updateServiceCount } from '../api/config';
import styles from './Header.module.css';

export const Header: React.FC = () => {
  const { isConnected, serviceCount, setServiceCount, clearServices } = useMetricsStore();
  const [isUpdating, setIsUpdating] = useState(false);
  
  const handleAddServices = useCallback(async () => {
    if (isUpdating) return;
    
    setIsUpdating(true);
    try {
      const newCount = serviceCount + 5;
      await updateServiceCount(newCount);
      setServiceCount(newCount);
      clearServices();
    } catch (error) {
      console.error('Failed to add services:', error);
    } finally {
      setIsUpdating(false);
    }
  }, [serviceCount, isUpdating, setServiceCount, clearServices]);
  
  const handleRemoveServices = useCallback(async () => {
    if (isUpdating || serviceCount <= 1) return;
    
    setIsUpdating(true);
    try {
      const newCount = Math.max(1, serviceCount - 5);
      await updateServiceCount(newCount);
      setServiceCount(newCount);
      clearServices();
    } catch (error) {
      console.error('Failed to remove services:', error);
    } finally {
      setIsUpdating(false);
    }
  }, [serviceCount, isUpdating, setServiceCount, clearServices]);
  
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.titleSection}>
          <h1 className={styles.title}>Live Metrics Dashboard</h1>
          <div className={styles.connectionStatus}>
            <div 
              className={`${styles.statusDot} ${isConnected ? styles.connected : styles.disconnected}`}
            />
            <span className={styles.statusText}>
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
        </div>
        
        <div className={styles.controls}>
          <div className={styles.serviceCount}>
            {serviceCount} {serviceCount === 1 ? 'Service' : 'Services'}
          </div>
          <button 
            className={styles.button}
            onClick={handleRemoveServices}
            disabled={isUpdating || serviceCount <= 1}
          >
            Remove 5
          </button>
          <button 
            className={styles.button}
            onClick={handleAddServices}
            disabled={isUpdating}
          >
            Add 5
          </button>
        </div>
      </div>
    </header>
  );
};

