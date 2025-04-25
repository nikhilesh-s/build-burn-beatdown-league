
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '@/components/ui/button';
import { Car, Flag, LogOut } from 'lucide-react';
import AuthDialog from './Auth/AuthDialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const Header = () => {
  const { user, profile, signOut } = useAuth();
  const [authDialogOpen, setAuthDialogOpen] = useState(false);

  return (
    <header className="border-b border-border bg-card shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center space-x-4">
          <Link to="/" className="flex items-center space-x-2">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-primary">
              <Flag className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">DragBuild</span>
          </Link>
        </div>

        <nav className="hidden md:block">
          <ul className="flex space-x-6">
            <li>
              <Link to="/garage" className="nav-link">
                <Car size={18} />
                <span>Garage</span>
              </Link>
            </li>
            <li>
              <Link to="/customize" className="nav-link">
                <span>Customize</span>
              </Link>
            </li>
            <li>
              <Link to="/race" className="nav-link">
                <span>Race</span>
              </Link>
            </li>
            <li>
              <Link to="/leaderboard" className="nav-link">
                <span>Leaderboard</span>
              </Link>
            </li>
          </ul>
        </nav>

        <div className="flex items-center space-x-4">
          {profile ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={profile.avatar} alt={profile.username} />
                    <AvatarFallback>{profile.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>{profile.username}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={signOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sign Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button 
              variant="secondary" 
              size="sm" 
              onClick={() => setAuthDialogOpen(true)}
            >
              Sign In
            </Button>
          )}
        </div>
      </div>
      <AuthDialog open={authDialogOpen} onOpenChange={setAuthDialogOpen} />
    </header>
  );
};

export default Header;
