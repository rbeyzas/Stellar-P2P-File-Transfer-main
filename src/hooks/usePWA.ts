import { useState, useEffect } from 'react';

interface PWAState {
  isInstalled: boolean;
  isOnline: boolean;
  canInstall: boolean;
  deferredPrompt: any;
}

export const usePWA = () => {
  const [pwaState, setPwaState] = useState<PWAState>({
    isInstalled: false,
    isOnline: navigator.onLine,
    canInstall: false,
    deferredPrompt: null,
  });

  useEffect(() => {
    // Check if app is installed
    const checkIfInstalled = () => {
      const isInstalled =
        window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as any).standalone === true;
      console.log('PWA Debug - isInstalled:', isInstalled);
      setPwaState((prev) => ({ ...prev, isInstalled }));
    };

    // Handle online/offline status
    const handleOnline = () => setPwaState((prev) => ({ ...prev, isOnline: true }));
    const handleOffline = () => setPwaState((prev) => ({ ...prev, isOnline: false }));

    // Handle beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      console.log('PWA Debug - beforeinstallprompt event fired');
      e.preventDefault();
      setPwaState((prev) => ({
        ...prev,
        canInstall: true,
        deferredPrompt: e,
      }));
    };

    // Handle appinstalled event
    const handleAppInstalled = () => {
      console.log('PWA Debug - appinstalled event fired');
      setPwaState((prev) => ({
        ...prev,
        isInstalled: true,
        canInstall: false,
        deferredPrompt: null,
      }));
    };

    // Register service worker
    const registerServiceWorker = async () => {
      if ('serviceWorker' in navigator) {
        try {
          const registration = await navigator.serviceWorker.register('/sw.js');
          console.log('PWA Debug - SW registered: ', registration);
        } catch (registrationError) {
          console.log('PWA Debug - SW registration failed: ', registrationError);
        }
      } else {
        console.log('PWA Debug - Service Worker not supported');
      }
    };

    // Check PWA criteria
    const checkPWACriteria = () => {
      const hasManifest = !!document.querySelector('link[rel="manifest"]');
      const hasServiceWorker = 'serviceWorker' in navigator;
      const isHTTPS =
        window.location.protocol === 'https:' || window.location.hostname === 'localhost';

      console.log('PWA Debug - Criteria check:', {
        hasManifest,
        hasServiceWorker,
        isHTTPS,
        userAgent: navigator.userAgent,
      });
    };

    // Initialize
    checkIfInstalled();
    registerServiceWorker();
    checkPWACriteria();

    // Add event listeners
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // Cleanup
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const installApp = async () => {
    console.log('PWA Debug - installApp called, deferredPrompt:', !!pwaState.deferredPrompt);
    if (pwaState.deferredPrompt) {
      pwaState.deferredPrompt.prompt();
      const { outcome } = await pwaState.deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        console.log('PWA Debug - User accepted the install prompt');
      } else {
        console.log('PWA Debug - User dismissed the install prompt');
      }
      setPwaState((prev) => ({
        ...prev,
        deferredPrompt: null,
      }));
    }
  };

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    return false;
  };

  const sendNotification = (title: string, options?: NotificationOptions) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, options);
    }
  };

  // Debug logging
  console.log('PWA Debug - Current state:', pwaState);

  return {
    ...pwaState,
    installApp,
    requestNotificationPermission,
    sendNotification,
  };
};
