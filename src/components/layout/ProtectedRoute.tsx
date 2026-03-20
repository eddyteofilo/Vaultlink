import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { Shield, Lock } from 'lucide-react';
import { useSubscription } from '@/hooks/useSubscription';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export const ProtectedRoute = ({ children, allowWithoutSubscription = false }: { children: ReactNode, allowWithoutSubscription?: boolean }) => {
  const { user, loading } = useAuthStore();
  const { data: subscription, isLoading: loadingSub } = useSubscription();

  const isAdmin = user?.email === 'eddyteofilo@gmail.com';
  const hasActiveSubscription = isAdmin || subscription?.status === 'active';

  if (loading || loadingSub) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center animate-pulse">
            <Shield className="w-5 h-5 text-primary-foreground" />
          </div>
          <p className="text-sm text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If subscription required but none active, and it's not a page allowed without one
  if (!hasActiveSubscription && !allowWithoutSubscription) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4 text-center">
        <div className="glass-card p-8 max-w-md space-y-6">
          <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <Lock className="w-8 h-8 text-primary" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-display font-bold">Acesso Restrito</h2>
            <p className="text-muted-foreground">
              Você precisa de uma assinatura ativa para acessar esta área e criar projetos.
            </p>
          </div>
          <div className="flex flex-col gap-3 pt-4">
            <Link to="/settings">
              <Button className="w-full gradient-bg border-0">
                Ver Planos
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
