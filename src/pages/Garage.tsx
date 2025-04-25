
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import CarCard from '../components/CarCard';
import BuildCard from '../components/BuildCard';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/components/ui/use-toast';
import { useGarage } from '../context/GarageContext';
import { carModels } from '../data/cars';
import { CarModel } from '../types';

const Garage = () => {
  const navigate = useNavigate();
  const { user, createNewBuild, setCurrentBuild, duplicateBuild, deleteBuild } = useGarage();
  const [selectedCar, setSelectedCar] = useState<CarModel | null>(null);
  const [newBuildName, setNewBuildName] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [duplicateDialogOpen, setDuplicateDialogOpen] = useState(false);
  const [buildToDuplicate, setBuildToDuplicate] = useState<string | null>(null);
  const [duplicateName, setDuplicateName] = useState('');

  const handleCarSelect = (car: CarModel) => {
    setSelectedCar(car);
    setNewBuildName(`${car.make} ${car.name} Build`);
  };

  const handleCreateBuild = () => {
    if (!selectedCar) {
      toast({
        title: "Error",
        description: "Please select a car first.",
        variant: "destructive"
      });
      return;
    }

    if (!newBuildName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a name for your build.",
        variant: "destructive"
      });
      return;
    }

    createNewBuild(selectedCar.id, newBuildName);
    setDialogOpen(false);
    
    toast({
      title: "Build Created",
      description: `${newBuildName} has been added to your garage.`
    });

    navigate('/customize');
  };

  const handleBuildSelect = (build: any) => {
    setCurrentBuild(build);
    navigate('/customize');
  };

  const handleDuplicateBuild = (buildId: string) => {
    setBuildToDuplicate(buildId);
    const originalBuild = user?.garage.savedBuilds.find(build => build.id === buildId);
    if (originalBuild) {
      setDuplicateName(`${originalBuild.name} (Copy)`);
      setDuplicateDialogOpen(true);
    }
  };

  const handleConfirmDuplicate = () => {
    if (buildToDuplicate && duplicateName.trim()) {
      duplicateBuild(buildToDuplicate, duplicateName);
      setDuplicateDialogOpen(false);
      setBuildToDuplicate(null);
      toast({
        title: "Build Duplicated",
        description: `${duplicateName} has been added to your garage.`
      });
    }
  };

  const handleDeleteBuild = (buildId: string) => {
    deleteBuild(buildId);
    toast({
      title: "Build Deleted",
      description: "Your build has been deleted from your garage."
    });
  };

  return (
    <Layout>
      <div className="container mx-auto p-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold">Your Garage</h1>
            <p className="text-muted-foreground">Manage your car builds and start new projects</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M5 12h14" /><path d="M12 5v14" /></svg>
                New Build
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Start a New Build</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="car">Select a Car</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2 max-h-40 overflow-y-auto p-2 border rounded-md">
                    {carModels.map((car) => (
                      <div
                        key={car.id}
                        className={`p-2 rounded cursor-pointer ${
                          selectedCar?.id === car.id ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'
                        }`}
                        onClick={() => handleCarSelect(car)}
                      >
                        <div className="font-medium">{car.make} {car.name}</div>
                        <div className="text-xs opacity-80">{car.class}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <Label htmlFor="buildName">Build Name</Label>
                  <Input
                    id="buildName"
                    value={newBuildName}
                    onChange={(e) => setNewBuildName(e.target.value)}
                  />
                </div>
                <Button onClick={handleCreateBuild} className="w-full">
                  Create Build
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Tabs defaultValue="builds">
          <TabsList className="mb-8">
            <TabsTrigger value="builds">My Builds</TabsTrigger>
            <TabsTrigger value="cars">Available Cars</TabsTrigger>
          </TabsList>
          
          <TabsContent value="builds">
            {user?.garage.savedBuilds && user.garage.savedBuilds.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {user.garage.savedBuilds.map((build) => (
                  <BuildCard
                    key={build.id}
                    build={build}
                    onSelect={handleBuildSelect}
                    onDuplicate={handleDuplicateBuild}
                    onDelete={handleDeleteBuild}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                <div className="mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="5" r="3"/><path d="M12 22V8"/><path d="m5 12 14-7"/><path d="m5 12 14 7"/><path d="M5 12h14"/></svg>
                </div>
                <p className="text-xl mb-2">Your garage is empty</p>
                <p className="mb-4">Create your first build to get started</p>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M5 12h14" /><path d="M12 5v14" /></svg>
                      New Build
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    {/* Duplicate content from main Dialog */}
                    <DialogHeader>
                      <DialogTitle>Start a New Build</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="car">Select a Car</Label>
                        <div className="grid grid-cols-2 gap-2 mt-2 max-h-40 overflow-y-auto p-2 border rounded-md">
                          {carModels.map((car) => (
                            <div
                              key={car.id}
                              className={`p-2 rounded cursor-pointer ${
                                selectedCar?.id === car.id ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'
                              }`}
                              onClick={() => handleCarSelect(car)}
                            >
                              <div className="font-medium">{car.make} {car.name}</div>
                              <div className="text-xs opacity-80">{car.class}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="buildName">Build Name</Label>
                        <Input
                          id="buildName"
                          value={newBuildName}
                          onChange={(e) => setNewBuildName(e.target.value)}
                        />
                      </div>
                      <Button onClick={handleCreateBuild} className="w-full">
                        Create Build
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="cars">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {carModels.map((car) => (
                <CarCard
                  key={car.id}
                  car={car}
                  onSelect={(car) => {
                    setSelectedCar(car);
                    setNewBuildName(`${car.make} ${car.name} Build`);
                    setDialogOpen(true);
                  }}
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={duplicateDialogOpen} onOpenChange={setDuplicateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Duplicate Build</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="duplicateName">Build Name</Label>
              <Input
                id="duplicateName"
                value={duplicateName}
                onChange={(e) => setDuplicateName(e.target.value)}
              />
            </div>
            <Button onClick={handleConfirmDuplicate} className="w-full">
              Duplicate
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Garage;
