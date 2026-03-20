import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, FolderOpen, Plus, Settings, LogOut, ChevronLeft, ChevronRight, Key, BarChart3 } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useProjects } from '@/hooks/useProjects';

export const AppSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuthStore();
  const { data: projects } = useProjects();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className={`h-screen sticky top-0 flex flex-col border-r border-border bg-sidebar transition-all duration-300 ${collapsed ? 'w-16' : 'w-64'}`}
    >
      {/* Logo */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        {!collapsed && (
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center">
              <Shield className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-foreground">VaultLink</span>
          </Link>
        )}
        {collapsed && (
          <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center mx-auto">
            <Shield className="w-4 h-4 text-primary-foreground" />
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* User */}
      {!collapsed && user && (
        <div className="px-4 py-3 border-b border-border">
          <p className="text-xs text-muted-foreground truncate">{user.email}</p>
        </div>
      )}

      {/* Projects */}
      <div className="flex-1 overflow-y-auto py-2">
        {!collapsed && (
          <div className="px-4 py-2 flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Projetos</span>
            <button
              onClick={() => navigate('/dashboard?new=1')}
              className="p-1 rounded-md text-muted-foreground hover:text-primary hover:bg-muted transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        <nav className="space-y-0.5 px-2">
          <AnimatePresence>
            {projects?.map((project) => {
              const isActive = location.pathname === `/project/${project.id}`;
              return (
                <motion.div key={project.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <Link
                    to={`/project/${project.id}`}
                    className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm transition-colors ${
                      isActive
                        ? 'bg-primary/10 text-primary'
                        : 'text-sidebar-foreground hover:bg-muted'
                    }`}
                  >
                    <span className="text-base flex-shrink-0">{project.icon}</span>
                    {!collapsed && <span className="truncate">{project.name}</span>}
                  </Link>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </nav>

        {!collapsed && (!projects || projects.length === 0) && (
          <div className="px-4 py-6 text-center">
            <FolderOpen className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
            <p className="text-xs text-muted-foreground">Nenhum projeto ainda</p>
          </div>
        )}
      </div>

      {/* Account limits info */}
      {!collapsed && (
        <div className="px-4 py-3 border-t border-border">
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Uso</span>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Projetos</span>
              <span className="text-foreground">{projects?.length ?? 0} / ∞</span>
            </div>
          </div>
        </div>
      )}

      {/* Bottom */}
      <div className="border-t border-border p-2 space-y-0.5">
        <Link
          to="/settings"
          className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm text-sidebar-foreground hover:bg-muted transition-colors ${
            location.pathname === '/settings' ? 'bg-primary/10 text-primary' : ''
          }`}
        >
          <Settings className="w-4 h-4 flex-shrink-0" />
          {!collapsed && <span>Configurações</span>}
        </Link>
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm text-sidebar-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          {!collapsed && <span>Sair</span>}
        </button>
      </div>
    </motion.aside>
  );
};
