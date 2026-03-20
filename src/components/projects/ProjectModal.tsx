import { useState } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useCreateProject, useUpdateProject } from '@/hooks/useProjects';

const COLORS = ['#6366F1', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981', '#3B82F6', '#EF4444', '#14B8A6'];
const ICONS = ['📁', '💼', '🏢', '🌐', '🔧', '📱', '🎯', '🚀', '💡', '🔒', '📊', '🎨'];

interface ProjectModalProps {
  project?: { id: string; name: string; description: string | null; color: string; icon: string };
  onClose: () => void;
}

export const ProjectModal = ({ project, onClose }: ProjectModalProps) => {
  const [name, setName] = useState(project?.name ?? '');
  const [description, setDescription] = useState(project?.description ?? '');
  const [color, setColor] = useState(project?.color ?? '#6366F1');
  const [icon, setIcon] = useState(project?.icon ?? '📁');

  const createProject = useCreateProject();
  const updateProject = useUpdateProject();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (project) {
      await updateProject.mutateAsync({ id: project.id, name, description: description || undefined, color, icon });
    } else {
      await createProject.mutateAsync({ name, description: description || undefined, color, icon });
    }
    onClose();
  };

  const isLoading = createProject.isPending || updateProject.isPending;

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
            {project ? 'Editar Projeto' : 'Novo Projeto'}
          </h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground">Nome *</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Cliente ABC"
              className="bg-background border-border"
              required
              maxLength={100}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground">Descrição</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descrição opcional..."
              className="bg-background border-border resize-none"
              rows={2}
              maxLength={500}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground">Ícone</Label>
            <div className="flex flex-wrap gap-2">
              {ICONS.map((i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setIcon(i)}
                  className={`w-9 h-9 rounded-lg flex items-center justify-center text-base transition-colors ${
                    icon === i ? 'bg-primary/20 ring-1 ring-primary' : 'bg-muted hover:bg-muted/80'
                  }`}
                >
                  {i}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground">Cor</Label>
            <div className="flex gap-2">
              {COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`w-7 h-7 rounded-full transition-transform ${
                    color === c ? 'ring-2 ring-foreground ring-offset-2 ring-offset-background scale-110' : 'hover:scale-110'
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={onClose} className="text-muted-foreground">
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !name.trim()}
              className="gradient-bg text-primary-foreground border-0 hover:opacity-90"
            >
              {isLoading ? 'Salvando...' : project ? 'Salvar' : 'Criar'}
            </Button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};
