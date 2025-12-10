import { useState, useEffect } from 'react';
import { Download, X, Smartphone } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);

      const hasSeenPrompt = localStorage.getItem('pwa-install-prompt-seen');
      const lastPromptTime = localStorage.getItem('pwa-install-prompt-time');
      const now = Date.now();
      const threeDays = 3 * 24 * 60 * 60 * 1000;

      if (!hasSeenPrompt || (lastPromptTime && now - parseInt(lastPromptTime) > threeDays)) {
        setTimeout(() => setShowPrompt(true), 3000);
      }
    };

    window.addEventListener('beforeinstallprompt', handler);

    const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
                        (window.navigator as any).standalone === true;
    if (isStandalone) {
      setShowPrompt(false);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  async function handleInstallClick() {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();

    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
      localStorage.setItem('pwa-install-accepted', 'true');
    }

    setDeferredPrompt(null);
    setShowPrompt(false);
    localStorage.setItem('pwa-install-prompt-seen', 'true');
    localStorage.setItem('pwa-install-prompt-time', Date.now().toString());
  }

  function handleDismiss() {
    setShowPrompt(false);
    localStorage.setItem('pwa-install-prompt-seen', 'true');
    localStorage.setItem('pwa-install-prompt-time', Date.now().toString());
  }

  if (!showPrompt || !deferredPrompt) return null;

  return (
    <div className="fixed bottom-20 md:bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-md z-50 animate-slide-up">
      <div className="bg-gradient-to-br from-green-600 to-emerald-600 rounded-2xl shadow-2xl p-5 text-white">
        <button
          onClick={handleDismiss}
          className="absolute top-3 right-3 p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors touch-manipulation"
          aria-label="Close"
        >
          <X size={20} />
        </button>

        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 p-3 bg-white bg-opacity-20 rounded-xl">
            <Smartphone size={28} />
          </div>

          <div className="flex-1 pr-8">
            <h3 className="font-bold text-lg mb-1">Ana Ekrana Ekle</h3>
            <p className="text-green-50 text-sm mb-4">
              Telefonunuzda uygulama gibi kullanın. Offline çalışır, hızlı açılır!
            </p>

            <button
              onClick={handleInstallClick}
              className="w-full bg-white text-green-700 px-4 py-3 rounded-xl font-bold hover:bg-green-50 transition-colors shadow-lg touch-manipulation flex items-center justify-center gap-2"
            >
              <Download size={20} />
              Şimdi Kur
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
