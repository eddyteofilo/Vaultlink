import { Link, useLocation } from 'react-router-dom';
import { Shield, FolderOpen, Settings, Plus } from 'lucide-react';

export const BottomNav = () => {
  const location = useLocation();

  const items = [
    { to: '/dashboard', icon: FolderOpen, label: 'Projetos' },
    { to: '/dashboard?new=1', icon: Plus, label: 'Novo' },
    { to: '/settings', icon: Settings, label: 'Config' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-sidebar/95 backdrop-blur-xl md:hidden">
      <div className="flex items-center justify-around h-16 px-2">
        {items.map((item) => {
          const isActive = item.to === '/dashboard'
            ? location.pathname === '/dashboard'
            : item.to === '/settings'
              ? location.pathname === '/settings'
              : false;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-lg transition-colors ${
                isActive ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
