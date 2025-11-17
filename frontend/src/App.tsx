import React, { useState, useCallback, useMemo } from 'react';
import { Header } from './components/Header';
import { ServiceCard } from './components/ServiceCard';
import { ServiceModal } from './components/ServiceModal';
import { useMetricsStream } from './hooks/useMetricsStream';
import { useMetricsStore } from './store/metricsStore';
import { ServiceMetric } from './types/metrics';
import styles from './App.module.css';

function App() {
  useMetricsStream();
  
  const services = useMetricsStore((state) => state.services);
  const [selectedService, setSelectedService] = useState<ServiceMetric | null>(null);
  
  const servicesList = useMemo(() => Array.from(services.values()), [services]);
  
  const handleCardClick = useCallback((service: ServiceMetric) => {
    setSelectedService(service);
  }, []);
  
  const handleCloseModal = useCallback(() => {
    setSelectedService(null);
  }, []);
  
  return (
    <div className={styles.app}>
      <Header />
      
      <main className={styles.main}>
        <div className={styles.container}>
          {servicesList.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.spinner} />
              <p>Connecting to metrics stream...</p>
            </div>
          ) : (
            <div className={styles.grid}>
              {servicesList.map((service) => (
                <ServiceCard
                  key={service.serviceName}
                  metric={service}
                  onClick={() => handleCardClick(service)}
                />
              ))}
            </div>
          )}
        </div>
      </main>
      
      <ServiceModal
        isOpen={selectedService !== null}
        onClose={handleCloseModal}
        service={selectedService}
      />
    </div>
  );
}

export default App;

