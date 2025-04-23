import React from 'react';
import { usePWA } from '../context/PWAContext';

export default function OfflineNotice() {
  const { isOnline, canInstall, installPWA, isUpdateAvailable, updateApp } = usePWA();

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2">
      {!isOnline && (
        <div className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg">
          You are currently offline. Some features may be limited.
        </div>
      )}
      
      {canInstall && (
        <button
          onClick={installPWA}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-600"
        >
          Install App
        </button>
      )}

      {isUpdateAvailable && (
        <button
          onClick={updateApp}
          className="bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-green-600"
        >
          Update Available
        </button>
      )}
    </div>
  );
}
