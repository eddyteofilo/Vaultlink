import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, FolderOpen, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AppLayout } from '@/components/layout/AppLayout';
import { ProjectCard } from '@/components/projects/ProjectCard';
import { ProjectModal } from '@/components/projects/ProjectModal';
import { useProjects } from '@/hooks/useProjects';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.23, 1, 0.32, 1] as const } },
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const { data: projects, isLoading } = useProjects();

  useEffect(() => {
    if (searchParams.get('new') === '1') {
      setShowModal(true);
      setSearchParams({});
    }
  }, [searchParams, setSearchParams]);

  const filtered = projects?.filter(
    (p) => p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AppLayout>
      <div className="p-6 md:p-8 max-w-6xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display text-2xl md:text-3xl font-bold">Seus Projetos</h1>
            <p className="text-sm text-muted-foreground mt-1">Organize seus acessos por contexto</p>
          </div>
          <Button
            onClick={() => setShowModal(true)}
            className="gradient-bg text-primary-foreground border-0 hover:opacity-90 glow-shadow"
          >
            <Plus className="w-4 h-4 mr-2" />
            Novo Projeto
          </Button>
        </div>

        {/* Search */}
        {projects && projects.length > 0 && (
          <div className="relative mb-6 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar projetos..."
              className="pl-10 bg-card border-border"
            />
          </div>
        )}

        {/* Grid */}
        {isLoading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="glass-card p-6 animate-pulse">
                <div className="w-10 h-10 rounded-xl bg-muted mb-4" />
                <div className="h-4 bg-muted rounded w-2/3 mb-2" />
                <div className="h-3 bg-muted rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : filtered && filtered.length > 0 ? (
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {filtered.map((project) => (
              <motion.div key={project.id} variants={item}>
                <ProjectCard
                  project={project}
                  onClick={() => navigate(`/project/${project.id}`)}
                />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
              <FolderOpen className="w-7 h-7 text-muted-foreground/50" />
            </div>
            <h3 className="font-display font-semibold text-lg mb-1">Nenhum projeto ainda</h3>
            <p className="text-sm text-muted-foreground mb-4">Crie seu primeiro projeto para começar</p>
            <Button
              onClick={() => setShowModal(true)}
              className="gradient-bg text-primary-foreground border-0 hover:opacity-90"
            >
              <Plus className="w-4 h-4 mr-2" />
              Criar Projeto
            </Button>
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {showModal && <ProjectModal onClose={() => setShowModal(false)} />}
      </AnimatePresence>
    </AppLayout>
  );
};

export default Dashboard;
