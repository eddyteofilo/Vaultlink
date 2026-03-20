import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Plus, Edit3, Trash2, MoreHorizontal, Key } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AppLayout } from '@/components/layout/AppLayout';
import { EntryCard } from '@/components/entries/EntryCard';
import { EntryModal } from '@/components/entries/EntryModal';
import { SecretCard } from '@/components/secrets/SecretCard';
import { SecretModal } from '@/components/secrets/SecretModal';
import { ProjectModal } from '@/components/projects/ProjectModal';
import { useProjects, useDeleteProject } from '@/hooks/useProjects';
import { useEntries } from '@/hooks/useEntries';
import { useSecrets } from '@/hooks/useSecrets';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.23, 1, 0.32, 1] as const } },
};

const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: projects } = useProjects();
  const { data: entries, isLoading } = useEntries(id);
  const { data: secrets, isLoading: secretsLoading } = useSecrets(id);
  const deleteProject = useDeleteProject();

  const [tab, setTab] = useState<'entries' | 'secrets'>('entries');
  const [showEntryModal, setShowEntryModal] = useState(false);
  const [editEntry, setEditEntry] = useState<string | null>(null);
  const [showSecretModal, setShowSecretModal] = useState(false);
  const [editSecret, setEditSecret] = useState<string | null>(null);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const project = projects?.find((p) => p.id === id);

  if (!project && !isLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-full p-8">
          <p className="text-muted-foreground">Projeto não encontrado</p>
        </div>
      </AppLayout>
    );
  }

  const handleDeleteProject = async () => {
    if (!id) return;
    await deleteProject.mutateAsync(id);
    navigate('/dashboard');
  };

  return (
    <AppLayout>
      <div className="p-4 md:p-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-start gap-3">
            <button
              onClick={() => navigate('/dashboard')}
              className="mt-1 p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <div className="flex items-center gap-3 mb-1">
                {project && (
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
                    style={{ backgroundColor: project.color + '20', borderColor: project.color + '40', borderWidth: 1 }}
                  >
                    {project.icon}
                  </div>
                )}
                <h1 className="font-display text-xl md:text-3xl font-bold">{project?.name}</h1>
              </div>
              {project?.description && (
                <p className="text-sm text-muted-foreground ml-[52px]">{project.description}</p>
              )}
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-card border-border">
              <DropdownMenuItem onClick={() => setShowProjectModal(true)} className="text-foreground">
                <Edit3 className="w-4 h-4 mr-2" />Editar projeto
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setShowDeleteDialog(true)} className="text-destructive focus:text-destructive">
                <Trash2 className="w-4 h-4 mr-2" />Excluir projeto
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 p-1 rounded-xl bg-muted/50 w-fit">
          <button
            onClick={() => setTab('entries')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              tab === 'entries' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Acessos {entries?.length ? `(${entries.length})` : ''}
          </button>
          <button
            onClick={() => setTab('secrets')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
              tab === 'secrets' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Key className="w-3.5 h-3.5" />
            Credenciais {secrets?.length ? `(${secrets.length})` : ''}
          </button>
        </div>

        {/* Entries tab */}
        {tab === 'entries' && (
          <>
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="glass-card p-4 animate-pulse">
                    <div className="h-4 bg-muted rounded w-1/3 mb-3" />
                    <div className="h-3 bg-muted rounded w-1/2 mb-2" />
                    <div className="h-3 bg-muted rounded w-1/4" />
                  </div>
                ))}
              </div>
            ) : entries && entries.length > 0 ? (
              <motion.div variants={container} initial="hidden" animate="show" className="space-y-3">
                {entries.map((entry) => (
                  <motion.div key={entry.id} variants={item}>
                    <EntryCard entry={entry} onEdit={() => setEditEntry(entry.id)} />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-16 text-center">
                <p className="text-muted-foreground mb-4">Nenhum acesso cadastrado neste projeto</p>
              </motion.div>
            )}
            <div className="mt-6">
              <Button
                onClick={() => setShowEntryModal(true)}
                variant="outline"
                className="border-dashed border-border text-muted-foreground hover:text-foreground hover:border-primary/50"
              >
                <Plus className="w-4 h-4 mr-2" />Adicionar Acesso
              </Button>
            </div>
          </>
        )}

        {/* Secrets tab */}
        {tab === 'secrets' && (
          <>
            {secretsLoading ? (
              <div className="space-y-3">
                {[1, 2].map((i) => (
                  <div key={i} className="glass-card p-4 animate-pulse">
                    <div className="h-4 bg-muted rounded w-1/3 mb-3" />
                    <div className="h-3 bg-muted rounded w-1/2" />
                  </div>
                ))}
              </div>
            ) : secrets && secrets.length > 0 ? (
              <motion.div variants={container} initial="hidden" animate="show" className="space-y-3">
                {secrets.map((secret) => (
                  <motion.div key={secret.id} variants={item}>
                    <SecretCard secret={secret} onEdit={() => setEditSecret(secret.id)} />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-16 text-center">
                <Key className="w-8 h-8 text-muted-foreground/30 mb-3" />
                <p className="text-muted-foreground mb-4">Nenhuma credencial (API Key, Token, Hash)</p>
              </motion.div>
            )}
            <div className="mt-6">
              <Button
                onClick={() => setShowSecretModal(true)}
                variant="outline"
                className="border-dashed border-border text-muted-foreground hover:text-foreground hover:border-primary/50"
              >
                <Plus className="w-4 h-4 mr-2" />Adicionar Credencial
              </Button>
            </div>
          </>
        )}
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showEntryModal && id && (
          <EntryModal projectId={id} onClose={() => setShowEntryModal(false)} />
        )}
        {editEntry && id && (
          <EntryModal
            projectId={id}
            entryId={editEntry}
            entry={entries?.find((e) => e.id === editEntry)}
            onClose={() => setEditEntry(null)}
          />
        )}
        {showSecretModal && id && (
          <SecretModal projectId={id} onClose={() => setShowSecretModal(false)} />
        )}
        {editSecret && id && (
          <SecretModal
            projectId={id}
            secretId={editSecret}
            secret={secrets?.find((s) => s.id === editSecret)}
            onClose={() => setEditSecret(null)}
          />
        )}
        {showProjectModal && project && (
          <ProjectModal project={project} onClose={() => setShowProjectModal(false)} />
        )}
      </AnimatePresence>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="bg-card border-border">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display">Excluir projeto?</AlertDialogTitle>
            <AlertDialogDescription>Todas as entradas deste projeto serão excluídas permanentemente.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-border">Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteProject} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppLayout>
  );
};

export default ProjectDetail;
