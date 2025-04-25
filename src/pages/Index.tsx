import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';

const Index = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-16 md:py-24 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight">
                Build. <span className="text-primary">Tune.</span> Race.
              </h1>
              <p className="text-xl text-muted-foreground">
                Create your dream car, fine-tune every component, and prove yourself on the drag strip.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button asChild size="lg">
                  <Link to="/garage">Start Building</Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link to="/leaderboard">View Leaderboards</Link>
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-[1/1] overflow-hidden rounded-lg bg-muted/30 shadow-xl">
                <img 
                  src="/lovable-uploads/191086ee-2231-41a9-99da-1d349f133293.png" 
                  alt="DragBuild Racing Car" 
                  className="h-full w-full object-cover transform hover:scale-105 transition-transform duration-300"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-muted/30 py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Customize Every Component
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-card p-6 rounded-lg shadow-md">
              <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><circle cx="12" cy="12" r="10"/><path d="m4.9 4.9 14.2 14.2"/></svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Performance Tuning</h3>
              <p className="text-muted-foreground">
                Modify engine, suspension, tires, and more to achieve the perfect balance of power and control.
              </p>
            </div>
            <div className="bg-card p-6 rounded-lg shadow-md">
              <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Drag Racing</h3>
              <p className="text-muted-foreground">
                Test your builds on the strip with realistic physics and competitive racing against skilled opponents.
              </p>
            </div>
            <div className="bg-card p-6 rounded-lg shadow-md">
              <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M12 7a8 8 0 1 1 0 16 8 8 0 0 1 0-16Z"/><path d="M21.5 15 16 10"/><path d="M15 16 8 9"/><path d="M11 6 3 3l3 8"/></svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Virtual Garage</h3>
              <p className="text-muted-foreground">
                Save multiple builds, compare stats, and showcase your collection to the community.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Build Your Dream?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Start with a base model and transform it into a drag racing beast. Save your builds and compete for the top spot on our leaderboards.
          </p>
          <Button asChild size="lg">
            <Link to="/garage">Enter the Garage</Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
