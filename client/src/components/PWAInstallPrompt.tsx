import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { X, Download, Smartphone } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if running as PWA
    const standalone = window.matchMedia('(display-mode: standalone)').matches;
    setIsStandalone(standalone);

    // Check if iOS
    const ios = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(ios);

    // Listen for beforeinstallprompt event (Android/Desktop)
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    // Show iOS install prompt if not standalone
    if (ios && !standalone) {
      setShowPrompt(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) {
      return;
    }

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
      setShowPrompt(false);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('pwa-install-dismissed', 'true');
  };

  // Don't show if already installed or dismissed
  if (isStandalone || !showPrompt) {
    return null;
  }

  // Check if dismissed before
  if (localStorage.getItem('pwa-install-dismissed')) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50 animate-fadeIn">
      <div className="bg-gradient-to-r from-primary to-blue-600 text-white rounded-lg shadow-2xl p-4">
        <button
          onClick={handleDismiss}
          className="absolute top-2 right-2 text-white/80 hover:text-white transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-start gap-3">
          <div className="bg-white/20 p-2 rounded-lg">
            <Smartphone className="h-6 w-6" />
          </div>
          
          <div className="flex-1">
            <h3 className="font-bold text-lg mb-1">Install ViScan</h3>
            <p className="text-sm text-white/90 mb-3">
              {isIOS
                ? 'Install this app on your iPhone: tap Share then "Add to Home Screen"'
                : 'Install ViScan on your device for quick access and offline use'}
            </p>

            {!isIOS && deferredPrompt && (
              <Button
                onClick={handleInstall}
                variant="secondary"
                size="sm"
                className="w-full bg-white text-primary hover:bg-white/90"
              >
                <Download className="h-4 w-4 mr-2" />
                Install Now
              </Button>
            )}

            {isIOS && (
              <div className="text-xs text-white/80 space-y-1">
                <p>1. Tap the Share button <span className="inline-block">📤</span></p>
                <p>2. Scroll and tap "Add to Home Screen"</p>
                <p>3. Tap "Add" to install</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
