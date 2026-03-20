import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const ObrigadoPage = () => {
  useEffect(() => {
    // Conversion tracking IDs from .env
    const adsId = import.meta.env.VITE_GOOGLE_ADS_ID;
    const adsLabel = import.meta.env.VITE_GOOGLE_ADS_CONVERSION_LABEL;

    if (adsId && adsLabel) {
      // Inject gtag.js if not already present
      if (!window.gtag) {
        const script = document.createElement('script');
        script.src = `https://www.googletagmanager.com/gtag/js?id=${adsId}`;
        script.async = true;
        document.head.appendChild(script);

        window.dataLayer = window.dataLayer || [];
        function gtag() { window.dataLayer.push(arguments); }
        window.gtag = gtag;
        window.gtag('js', new Date());
        window.gtag('config', adsId);
      }

      // Track conversion
      window.gtag('event', 'conversion', {
        'send_to': `${adsId}/${adsLabel}`,
        'transaction_id': ''
      });
      console.log('Conversion tracked for Google Ads:', adsId, adsLabel);
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full text-center space-y-6"
      >
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10 text-primary" />
          </div>
        </div>
        
        <div className="space-y-2">
          <h1 className="font-display text-3xl font-bold tracking-tight">Obrigado!</h1>
          <p className="text-muted-foreground">
            Sua assinatura foi processada com sucesso. Agora você tem acesso ilimitado aos recursos Pro do VaultLink.
          </p>
        </div>

        <div className="p-4 bg-muted/50 rounded-xl border border-border">
          <p className="text-sm">
            Seu plano será atualizado em instantes. Caso ocorra qualquer demora, tente recarregar a página.
          </p>
        </div>

        <div className="pt-4">
          <Link to="/dashboard">
            <Button className="w-full gradient-bg border-0 h-12 text-lg font-medium group">
              Ir para o Dashboard
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default ObrigadoPage;
