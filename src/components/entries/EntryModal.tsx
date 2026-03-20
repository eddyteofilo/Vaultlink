import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Eye, EyeOff, Wand2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useCreateEntry, useUpdateEntry } from '@/hooks/useEntries';
import { cryptoService } from '@/services/cryptoService';

interface EntryModalProps {
  projectId: string;
  entryId?: string;
  entry?: {
    app_name: string;
    url: string | null;
    login: string | null;
    password_encrypted: string;
    notes: string | null;
  };
  onClose: () => void;
}

export const EntryModal = ({ projectId, entryId, entry, onClose }: EntryModalProps) => {
  const [appName, setAppName] = useState(entry?.app_name ?? '');
  const [url, setUrl] = useState(entry?.url ?? '');
  const [login, setLogin] = useState(entry?.login ?? '');
  const [password, setPassword] = useState(entry ? cryptoService.decrypt(entry.password_encrypted) : '');
  const [notes, setNotes] = useState(entry?.notes ?? '');
  const [showPassword, setShowPassword] = useState(false);

  const createEntry = useCreateEntry();
  const updateEntry = useUpdateEntry();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!appName.trim() || !password.trim()) return;

    if (entryId) {
      await updateEntry.mutateAsync({
        id: entryId,
        project_id: projectId,
        app_name: appName,
        url: url || undefined,
        login: login || undefined,
        password,
        notes: notes || undefined,
      });
    } else {
      await createEntry.mutateAsync({
        project_id: projectId,
        app_name: appName,
        url: url || undefined,
        login: login || undefined,
        password,
        notes: notes || undefined,
      });
    }
    onClose();
  };

  const [genLength, setGenLength] = useState(16);

  const generatePassword = () => {
    setPassword(cryptoService.generatePassword(genLength));
    setShowPassword(true);
  };

  const isLoading = createEntry.isPending || updateEntry.isPending;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="glass-card w-full max-w-md p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-lg font-bold">
            {entryId ? 'Editar Acesso' : 'Novo Acesso'}
          </h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground">Nome da aplicação *</Label>
            <Input
              value={appName}
              onChange={(e) => setAppName(e.target.value)}
              placeholder="Ex: Gmail Empresa"
              className="bg-background border-border"
              required
              maxLength={100}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground">URL / Link</Label>
            <Input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://..."
              className="bg-background border-border"
              type="url"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground">Login / Usuário</Label>
            <Input
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              placeholder="usuario@email.com"
              className="bg-background border-border"
              maxLength={255}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm text-muted-foreground">Senha *</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  min={1}
                  max={32}
                  value={genLength}
                  onChange={(e) => setGenLength(Math.min(32, Math.max(1, parseInt(e.target.value) || 1)))}
                  className="w-12 h-7 px-1 text-center text-xs bg-muted border-none rounded-md"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="bg-background border-border pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={generatePassword}
                className="border-border text-muted-foreground hover:text-foreground flex-shrink-0"
                title="Gerar senha forte"
              >
                <Wand2 className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground">Notas</Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Anotações opcionais..."
              className="bg-background border-border resize-none"
              rows={2}
              maxLength={1000}
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={onClose} className="text-muted-foreground">
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !appName.trim() || !password.trim()}
              className="gradient-bg text-primary-foreground border-0 hover:opacity-90"
            >
              {isLoading ? 'Salvando...' : entryId ? 'Salvar' : 'Adicionar'}
            </Button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};
