import { AppLayout } from '@/components/layout/AppLayout';
import { useAuthStore } from '@/store/authStore';
import { Shield, Mail, CreditCard, ChevronRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { useSubscription, usePlans } from '@/hooks/useSubscription';
import { asaasService } from '@/services/asaasService';
import { toast } from 'sonner';

const SettingsPage = () => {
  const { user, signOut } = useAuthStore();
  const { data: subscription, isLoading: loadingSub } = useSubscription();
  const { data: plans } = usePlans();

  const handleUpgrade = async () => {
    toast.info('Redirecionando para o pagamento...');
    // In a real scenario, this would call an Edge Function to create a session
    const paymentLink = await asaasService.getPaymentLink(14.99, 'Plano Pro - VaultLink');
    window.open(paymentLink, '_blank');
  };

  return (
    <AppLayout>
      <div className="p-6 md:p-8 max-w-2xl">
        <h1 className="font-display text-2xl md:text-3xl font-bold mb-8">Configurações</h1>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Profile */}
          <div className="glass-card p-6">
            <h2 className="font-display font-semibold text-lg mb-4 flex items-center gap-2">
              <Shield className="w-4 h-4 text-primary" />
              Conta
            </h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3 py-2 border-b border-border">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="text-sm text-foreground">{user?.email}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Subscription */}
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-semibold text-lg flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-primary" />
                Assinatura
              </h2>
              {subscription?.plans && (
                <span className="px-2 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider">
                  Plano {subscription.plans.name}
                </span>
              )}
            </div>

            <div className="space-y-4">
              {loadingSub ? (
                <div className="h-20 animate-pulse bg-muted rounded-lg" />
              ) : subscription ? (
                <div className="space-y-3">
                  <div className="p-4 bg-muted/50 rounded-lg border border-border">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-semibold text-sm">Status: <span className={subscription.status === 'active' ? 'text-green-500' : 'text-yellow-500'}>{subscription.status}</span></p>
                    </div>
                    {subscription.status !== 'active' && (
                      <Button 
                        onClick={handleUpgrade}
                        className="w-full mt-2 gradient-bg border-0"
                      >
                        Ativar Plano Pro
                      </Button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="p-4 border border-dashed border-border rounded-lg text-center">
                  <p className="text-sm text-muted-foreground mb-4">Você ainda não possui um plano ativo.</p>
                  <Button onClick={handleUpgrade} className="gradient-bg border-0">
                    Escolher Plano
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Danger zone */}
          <div className="glass-card p-6 border-destructive/20">
            <h2 className="font-display font-semibold text-lg mb-4 text-destructive">Zona de Perigo</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Ações irreversíveis. Tenha cuidado.
            </p>
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="border-destructive/30 text-destructive hover:bg-destructive/10"
                onClick={signOut}
              >
                Sair da conta
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </AppLayout>
  );
};

export default SettingsPage;
