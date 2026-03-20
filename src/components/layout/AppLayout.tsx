import { ReactNode } from 'react';
import { AppSidebar } from './AppSidebar';
import { BottomNav } from './BottomNav';

export const AppLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex min-h-screen w-full">
      <div className="hidden md:block">
        <AppSidebar />
      </div>
      <main className="flex-1 overflow-x-hidden pb-20 md:pb-0">
        {children}
      </main>
      <BottomNav />
    </div>
  );
};
