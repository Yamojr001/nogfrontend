'use client';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';
import { getTourConfig } from '@/lib/tourConfig';
import { fetchUserTourStatus, completeUserTour } from '@/lib/api';

interface TourContextType {
  startTour: () => void;
}

const TourContext = createContext<TourContextType | undefined>(undefined);

export const TourProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    checkTourStatus();
  }, []);

  const checkTourStatus = async () => {
    try {
      const role = localStorage.getItem('user_role');
      const token = localStorage.getItem('access_token');
      if (!role || !token) return;

      const status = await fetchUserTourStatus('onboarding');
      if (status && !status.isCompleted) {
        // Delay slightly to ensure elements are rendered
        setTimeout(() => {
          startTour();
        }, 1500);
      }
    } catch (error) {
      console.error('Failed to check tour status', error);
    }
  };

  const startTour = () => {
    const role = localStorage.getItem('user_role') || 'member';
    const driverObj = driver(getTourConfig(role, async () => {
      await completeUserTour('onboarding');
    }));
    driverObj.drive();
  };

  if (!mounted) return <>{children}</>;

  return (
    <TourContext.Provider value={{ startTour }}>
      {children}
    </TourContext.Provider>
  );
};

export const useTour = () => {
  const context = useContext(TourContext);
  if (!context) throw new Error('useTour must be used within a TourProvider');
  return context;
};
