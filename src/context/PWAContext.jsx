import React, { createContext, useContext, useState, useEffect } from 'react';

const PWAContext = createContext();

export const usePWA = () => useContext(PWAContext);

export function PWAProvider({ children }) {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [installPrompt, setInstallPrompt] = useState(null);
  const [isUpdateAvailable, setIsUpdateAvailable] = useState(false);
  const [registration, setRegistration] = useState(null);

  useEffect(() => {
    console.log('PWAContext: Initializing...');
    
    // Handle online/offline status
    const handleOnline = () => {
      console.log('PWAContext: Device is online');
      setIsOnline(true);
    };
    const handleOffline = () => {
      console.log('PWAContext: Device is offline');
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Handle PWA installation
    window.addEventListener('beforeinstallprompt', (e) => {
      console.log('PWAContext: Install prompt captured');
      e.preventDefault();
      setInstallPrompt(e);
    });

    // Register service worker
    if ('serviceWorker' in navigator) {
      console.log('PWAContext: Service Worker is supported');
      
      navigator.serviceWorker.register('/sw.js')
        .then(reg => {
          console.log('PWAContext: Service Worker registered successfully', reg);
          setRegistration(reg);
          
          // Handle updates
          reg.addEventListener('updatefound', () => {
            console.log('PWAContext: Update found');
            const newWorker = reg.installing;
            newWorker.addEventListener('statechange', () => {
              console.log('PWAContext: Service Worker state changed to:', newWorker.state);
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                console.log('PWAContext: New content is available');
                setIsUpdateAvailable(true);
              }
            });
          });
        })
        .catch(error => {
          console.error('PWAContext: Service Worker registration failed:', error);
        });

      // Handle controller change
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        console.log('PWAContext: Service Worker controller changed');
        if (isUpdateAvailable) {
          console.log('PWAContext: Reloading page for update');
          window.location.reload();
        }
      });
    } else {
      console.log('PWAContext: Service Worker is not supported');
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [isUpdateAvailable]);

  const installPWA = async () => {
    if (!installPrompt) {
      console.log('PWAContext: No install prompt available');
      return;
    }
    
    try {
      console.log('PWAContext: Showing install prompt');
      const result = await installPrompt.prompt();
      console.log('PWAContext: Install prompt result:', result.outcome);
      setInstallPrompt(null);
    } catch (error) {
      console.error('PWAContext: Error installing PWA:', error);
    }
  };

  const updateApp = () => {
    if (registration && registration.waiting) {
      console.log('PWAContext: Sending skip waiting message');
      registration.waiting.postMessage({ type: 'SKIP_WAITING' });
    } else {
      console.log('PWAContext: No waiting worker found');
    }
  };

  return (
    <PWAContext.Provider 
      value={{
        isOnline,
        canInstall: !!installPrompt,
        installPWA,
        isUpdateAvailable,
        updateApp
      }}
    >
      {children}
    </PWAContext.Provider>
  );
}
