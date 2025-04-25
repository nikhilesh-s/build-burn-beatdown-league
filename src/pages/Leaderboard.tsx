
import React, { useState } from 'react';
import Layout from '../components/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { RaceDistance, LeaderboardEntry } from '../types';
import { getCarModel } from '../utils/statCalculations';
import { Flag } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

// Mock leaderboard data
const mockLeaderboardData: LeaderboardEntry[] = [
  {
    userId: 'user-001',
    username: 'SpeedDemon',
    time: 9.87,
    carModel: 'car-007',
    distance: RaceDistance.QuarterMile,
    date: new Date(2025, 3, 20).toISOString()
  },
  {
    userId: 'user-002',
    username: 'QuarterMileKing',
    time: 10.24,
    carModel: 'car-003',
    distance: RaceDistance.QuarterMile,
    date: new Date(2025, 3, 18).toISOString()
  },
  {
    userId: 'user-003',
    username: 'JDM_Lover',
    time: 10.56,
    carModel: 'car-001',
    distance: RaceDistance.QuarterMile,
    date: new Date(2025, 3, 15).toISOString()
  },
  {
    userId: 'user-004',
    username: 'MuscleManiac',
    time: 10.89,
    carModel: 'car-002',
    distance: RaceDistance.QuarterMile,
    date: new Date(2025, 3, 22).toISOString()
  },
  {
    userId: 'user-005',
    username: 'TunerGirl',
    time: 11.23,
    carModel: 'car-006',
    distance: RaceDistance.QuarterMile,
    date: new Date(2025, 3, 21).toISOString()
  },
  {
    userId: 'user-001',
    username: 'SpeedDemon',
    time: 6.42,
    carModel: 'car-007',
    distance: RaceDistance.EighthMile,
    date: new Date(2025, 3, 23).toISOString()
  },
  {
    userId: 'user-002',
    username: 'QuarterMileKing',
    time: 6.67,
    carModel: 'car-003',
    distance: RaceDistance.EighthMile,
    date: new Date(2025, 3, 19).toISOString()
  },
  {
    userId: 'user-003',
    username: 'JDM_Lover',
    time: 6.84,
    carModel: 'car-001',
    distance: RaceDistance.EighthMile,
    date: new Date(2025, 3, 16).toISOString()
  },
  {
    userId: 'user-004',
    username: 'MuscleManiac',
    time: 7.12,
    carModel: 'car-002',
    distance: RaceDistance.EighthMile,
    date: new Date(2025, 3, 22).toISOString()
  },
  {
    userId: 'user-005',
    username: 'TunerGirl',
    time: 7.31,
    carModel: 'car-006',
    distance: RaceDistance.EighthMile,
    date: new Date(2025, 3, 21).toISOString()
  }
];

const Leaderboard = () => {
  const [selectedDistance, setSelectedDistance] = useState<RaceDistance>(RaceDistance.QuarterMile);
  const [carFilter, setCarFilter] = useState<string>('all');
  
  const filteredLeaderboard = mockLeaderboardData.filter(entry => {
    const distanceMatch = entry.distance === selectedDistance;
    const carMatch = carFilter === 'all' || entry.carModel === carFilter;
    return distanceMatch && carMatch;
  }).sort((a, b) => a.time - b.time);
  
  return (
    <Layout>
      <div className="container mx-auto p-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold">Leaderboard</h1>
            <p className="text-muted-foreground">See who's fastest on the drag strip</p>
          </div>
          <div className="flex gap-3">
            <Select value={carFilter} onValueChange={setCarFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by car" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Cars</SelectItem>
                {Array.from(new Set(mockLeaderboardData.map(entry => entry.carModel))).map(carId => {
                  const carModel = getCarModel(carId);
                  return (
                    <SelectItem key={carId} value={carId}>
                      {carModel.make} {carModel.name}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <Tabs value={selectedDistance} onValueChange={(value) => setSelectedDistance(value as RaceDistance)}>
          <TabsList className="mb-8">
            <TabsTrigger value={RaceDistance.QuarterMile}>1/4 Mile</TabsTrigger>
            <TabsTrigger value={RaceDistance.EighthMile}>1/8 Mile</TabsTrigger>
          </TabsList>
          
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[80px]">Rank</TableHead>
                    <TableHead>Driver</TableHead>
                    <TableHead>Car</TableHead>
                    <TableHead className="text-right">Time</TableHead>
                    <TableHead className="text-right">Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLeaderboard.length > 0 ? (
                    filteredLeaderboard.map((entry, index) => {
                      const carModel = getCarModel(entry.carModel);
                      return (
                        <TableRow key={`${entry.userId}-${entry.carModel}-${entry.time}`}>
                          <TableCell className="font-medium">
                            {index === 0 && (
                              <div className="inline-flex items-center">
                                <Flag className="h-4 w-4 mr-1 text-yellow-500" />
                                {index + 1}
                              </div>
                            )}
                            {index !== 0 && index + 1}
                          </TableCell>
                          <TableCell>{entry.username}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="h-8 w-8 rounded overflow-hidden">
                                <img
                                  src={carModel.image}
                                  alt={carModel.name}
                                  className="h-full w-full object-cover"
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.src = '/placeholder.svg';
                                  }}
                                />
                              </div>
                              <div>
                                <div className="text-sm font-medium">{carModel.name}</div>
                                <div className="text-xs text-muted-foreground">{carModel.make}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-right font-mono">
                            {entry.time.toFixed(3)}s
                          </TableCell>
                          <TableCell className="text-right text-muted-foreground text-sm">
                            {formatDistanceToNow(new Date(entry.date), { addSuffix: true })}
                          </TableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center h-32">
                        <div className="flex flex-col items-center justify-center text-muted-foreground">
                          <div className="mb-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z"/><path d="M15 9h-6l2 2-2 2h6"/></svg>
                          </div>
                          <p>No records found</p>
                          <p className="text-sm">Try changing your filters</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Leaderboard;
