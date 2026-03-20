import { Edit3, Trash2 } from 'lucide-react';
import { useDeleteProject } from '@/hooks/useProjects';
import { useEntries } from '@/hooks/useEntries';

interface Project {
  id: string;
  name: string;
  description: string | null;
  color: string;
  icon: string;
}

export const ProjectCard = ({
  project,
  onClick,
}: {
  project: Project;
  onClick: () => void;
}) => {
  const { data: entries } = useEntries(project.id);

  return (
    <div
      onClick={onClick}
      className="glass-card-hover p-5 cursor-pointer group"
    >
      <div className="flex items-start justify-between mb-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
          style={{
            backgroundColor: project.color + '20',
            borderColor: project.color + '40',
            borderWidth: 1,
          }}
        >
          {project.icon}
        </div>
      </div>
      <h3 className="font-display font-semibold text-foreground mb-1">{project.name}</h3>
      {project.description && (
        <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{project.description}</p>
      )}
      <p className="text-xs text-muted-foreground">
        {entries?.length ?? 0} {entries?.length === 1 ? 'acesso' : 'acessos'}
      </p>
    </div>
  );
};
