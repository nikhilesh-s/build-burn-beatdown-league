
import React from 'react';
import Header from './Header';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">{children}</main>
      <footer className="border-t border-border bg-card py-6">
        <div className="container mx-auto px-4 text-center space-y-2">
          <p className="text-sm text-primary font-medium">Powered by Tri-Valley Tech</p>
          <p className="text-xs text-muted-foreground">TVT Dev Vault Projects 2025 Nikhilesh Suravarjjala</p>
        </div>
      </footer>
      <Toaster />
      <Sonner />
    </div>
  );
};

export default Layout;
