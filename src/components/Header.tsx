
import React from 'react';
import { Link } from 'react-router-dom';
import { useGarage } from '../context/GarageContext';
import { Button } from '@/components/ui/button';
import { Car, Flag } from 'lucide-react';

const Header = () => {
  const { user } = useGarage();

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
          {user && (
            <div className="flex items-center space-x-2">
              <span className="hidden sm:inline-block">
                {user.username}
              </span>
              <div className="h-8 w-8 rounded-full bg-secondary overflow-hidden">
                <img 
                  src={user.avatar} 
                  alt="Avatar" 
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://ui-avatars.com/api/?name=' + user.username;
                  }}
                />
              </div>
            </div>
          )}
          <Button variant="secondary" size="sm">
            Sign In
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
