import { useState } from 'react';
import { Copy, Eye, EyeOff, Edit3, Trash2, Check, Key, Hash, Code } from 'lucide-react';
import { cryptoService } from '@/services/cryptoService';
import { useDeleteSecret } from '@/hooks/useSecrets';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface Secret {
  id: string;
  project_id: string;
  label: string;
  type: string;
  value_encrypted: string;
  notes: string | null;
}

const typeIcons: Record<string, typeof Key> = {
  api_key: Key,
  token: Code,
  hash: Hash,
};

const typeLabels: Record<string, string> = {
  api_key: 'API Key',
  token: 'Token',
  hash: 'Hash',
};

const CopyButton = ({ text, label }: { text: string; label: string }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success(`${label} copiado!`);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button onClick={handleCopy} className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
      {copied ? <Check className="w-3.5 h-3.5 text-primary" /> : <Copy className="w-3.5 h-3.5" />}
    </button>
  );
};

export const SecretCard = ({ secret, onEdit }: { secret: Secret; onEdit: () => void }) => {
  const [showValue, setShowValue] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const deleteSecret = useDeleteSecret();

  const decryptedValue = showValue ? cryptoService.decrypt(secret.value_encrypted) : '';
  const Icon = typeIcons[secret.type] || Key;

  return (
    <>
      <div className="glass-card-hover group p-4">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg gradient-bg flex items-center justify-center">
              <Icon className="w-3.5 h-3.5 text-primary-foreground" />
            </div>
            <div>
              <h3 className="font-display font-semibold text-foreground text-sm">{secret.label}</h3>
              <span className="text-xs text-muted-foreground">{typeLabels[secret.type] || secret.type}</span>
            </div>
          </div>
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={onEdit} className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
              <Edit3 className="w-3.5 h-3.5" />
            </button>
            <button onClick={() => setShowDeleteDialog(true)} className="p-1.5 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between py-1.5">
          <span className="text-sm text-muted-foreground">Valor</span>
          <div className="flex items-center gap-1">
            <code className="text-xs text-foreground bg-muted px-2 py-0.5 rounded font-mono max-w-[200px] truncate">
              {showValue ? decryptedValue : '••••••••••••••••'}
            </code>
            <button onClick={() => setShowValue(!showValue)} className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
              {showValue ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            </button>
            <CopyButton text={cryptoService.decrypt(secret.value_encrypted)} label="Valor" />
          </div>
        </div>

        {secret.notes && (
          <div className="pt-2 border-t border-border/50">
            <p className="text-xs text-muted-foreground">{secret.notes}</p>
          </div>
        )}
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="bg-card border-border">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display">Excluir credencial?</AlertDialogTitle>
            <AlertDialogDescription>A credencial "{secret.label}" será excluída permanentemente.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-border">Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteSecret.mutate({ id: secret.id, projectId: secret.project_id })}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
