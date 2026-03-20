import { useState } from 'react';
import { Copy, ExternalLink, Eye, EyeOff, Edit3, Trash2, Check } from 'lucide-react';
import { cryptoService } from '@/services/cryptoService';
import { useDeleteEntry } from '@/hooks/useEntries';
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

interface Entry {
  id: string;
  project_id: string;
  app_name: string;
  url: string | null;
  login: string | null;
  password_encrypted: string;
  notes: string | null;
}

const CopyButton = ({ text, label }: { text: string; label: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success(`${label} copiado!`);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
    >
      {copied ? <Check className="w-3.5 h-3.5 text-primary" /> : <Copy className="w-3.5 h-3.5" />}
    </button>
  );
};

export const EntryCard = ({
  entry,
  onEdit,
}: {
  entry: Entry;
  onEdit: () => void;
}) => {
  const [showPass, setShowPass] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const deleteEntry = useDeleteEntry();

  const decryptedPassword = showPass ? cryptoService.decrypt(entry.password_encrypted) : '';

  return (
    <>
      <div className="glass-card-hover group p-4">
        <div className="flex justify-between items-start mb-3">
          <h3 className="font-display font-semibold text-foreground">{entry.app_name}</h3>
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={onEdit}
              className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setShowDeleteDialog(true)}
              className="p-1.5 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="space-y-2 text-sm">
          {/* URL */}
          {entry.url && (
            <div className="flex items-center justify-between py-1.5 border-b border-border/50">
              <span className="text-muted-foreground">Link</span>
              <a
                href={entry.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary flex items-center gap-1 hover:underline text-xs"
              >
                Abrir <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          )}

          {/* Login */}
          {entry.login && (
            <div className="flex items-center justify-between py-1.5 border-b border-border/50">
              <span className="text-muted-foreground">Login</span>
              <div className="flex items-center gap-1">
                <code className="text-xs text-foreground bg-muted px-2 py-0.5 rounded">{entry.login}</code>
                <CopyButton text={entry.login} label="Login" />
              </div>
            </div>
          )}

          {/* Password */}
          <div className="flex items-center justify-between py-1.5">
            <span className="text-muted-foreground">Senha</span>
            <div className="flex items-center gap-1">
              <code className="text-xs text-foreground bg-muted px-2 py-0.5 rounded font-mono">
                {showPass ? decryptedPassword : '••••••••••••'}
              </code>
              <button
                onClick={() => setShowPass(!showPass)}
                className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                {showPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
              <CopyButton
                text={cryptoService.decrypt(entry.password_encrypted)}
                label="Senha"
              />
            </div>
          </div>

          {/* Notes */}
          {entry.notes && (
            <div className="pt-2 border-t border-border/50">
              <p className="text-xs text-muted-foreground">{entry.notes}</p>
            </div>
          )}
        </div>
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="bg-card border-border">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display">Excluir acesso?</AlertDialogTitle>
            <AlertDialogDescription>
              O acesso "{entry.app_name}" será excluído permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-border">Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteEntry.mutate({ id: entry.id, projectId: entry.project_id })}
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
