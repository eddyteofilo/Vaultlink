import { AppLayout } from '@/components/layout/AppLayout';
import { useAuthStore } from '@/store/authStore';
import { Shield, Mail, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const SettingsPage = () => {
  const { user, signOut } = useAuthStore();

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
                <div>
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="text-sm text-foreground">{user?.email}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Subscription */}
          <div className="glass-card p-6">
            <h2 className="font-display font-semibold text-lg mb-4 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-primary" />
              Assinatura
            </h2>
            <p className="text-sm text-muted-foreground mb-4">
              Gerencie seu plano e método de pagamento.
            </p>
            <Button variant="outline" className="border-border text-muted-foreground hover:text-foreground">
              Gerenciar assinatura
            </Button>
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
