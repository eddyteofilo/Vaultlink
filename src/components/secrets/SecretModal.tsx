import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCreateSecret, useUpdateSecret } from '@/hooks/useSecrets';
import { cryptoService } from '@/services/cryptoService';

interface SecretModalProps {
  projectId: string;
  secretId?: string;
  secret?: {
    label: string;
    type: string;
    value_encrypted: string;
    notes: string | null;
  };
  onClose: () => void;
}

export const SecretModal = ({ projectId, secretId, secret, onClose }: SecretModalProps) => {
  const [label, setLabel] = useState(secret?.label ?? '');
  const [type, setType] = useState(secret?.type ?? 'api_key');
  const [value, setValue] = useState(secret ? cryptoService.decrypt(secret.value_encrypted) : '');
  const [notes, setNotes] = useState(secret?.notes ?? '');
  const [showValue, setShowValue] = useState(false);

  const createSecret = useCreateSecret();
  const updateSecret = useUpdateSecret();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!label.trim() || !value.trim()) return;

    if (secretId) {
      await updateSecret.mutateAsync({
        id: secretId,
        project_id: projectId,
        label,
        type,
        value,
        notes: notes || undefined,
      });
    } else {
      await createSecret.mutateAsync({
        project_id: projectId,
        label,
        type,
        value,
        notes: notes || undefined,
      });
    }
    onClose();
  };

  const isLoading = createSecret.isPending || updateSecret.isPending;

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
            {secretId ? 'Editar Credencial' : 'Nova Credencial'}
          </h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground">Nome / Label *</Label>
            <Input
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="Ex: OpenAI API Key"
              className="bg-background border-border"
              required
              maxLength={100}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground">Tipo</Label>
            <Input
              value={type}
              onChange={(e) => setType(e.target.value)}
              placeholder="Ex: API Key, Token, Hash, OAuth..."
              className="bg-background border-border"
              maxLength={50}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground">Valor *</Label>
            <div className="relative">
              <Input
                value={value}
                onChange={(e) => setValue(e.target.value)}
                type={showValue ? 'text' : 'password'}
                placeholder="sk-..."
                className="bg-background border-border pr-10 font-mono text-xs"
                required
              />
              <button
                type="button"
                onClick={() => setShowValue(!showValue)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showValue ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground">Notas</Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Descrição, ambiente, etc..."
              className="bg-background border-border resize-none"
              rows={2}
              maxLength={1000}
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={onClose} className="text-muted-foreground">Cancelar</Button>
            <Button
              type="submit"
              disabled={isLoading || !label.trim() || !value.trim()}
              className="gradient-bg text-primary-foreground border-0 hover:opacity-90"
            >
              {isLoading ? 'Salvando...' : secretId ? 'Salvar' : 'Adicionar'}
            </Button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};
