
import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { RaceDistance, LeaderboardEntry } from '../types';
import { getCarModel } from '../utils/statCalculations';
import { Flag, Medal, Trophy, Award } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { supabase } from '@/lib/supabase';
import { useAuth } from '../context/AuthContext';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

const Leaderboard = () => {
  const { user } = useAuth();
  const [selectedDistance, setSelectedDistance] = useState<RaceDistance>(RaceDistance.QuarterMile);
  const [carFilter, setCarFilter] = useState<string>('all');
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchLeaderboardData = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('leaderboard_entries')
          .select(`
            id, 
            userId, 
            username, 
            time, 
            carModel, 
            distance, 
            date
          `)
          .eq('distance', selectedDistance)
          .order('time', { ascending: true });
        
        if (error) {
          console.error('Error fetching leaderboard data:', error);
          return;
        }
        
        if (data) {
          setLeaderboardData(data as LeaderboardEntry[]);
        }
      } catch (error) {
        console.error('Error in leaderboard fetch:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchLeaderboardData();
  }, [selectedDistance]);
  
  const filteredLeaderboard = leaderboardData.filter(entry => {
    const carMatch = carFilter === 'all' || entry.carModel === carFilter;
    return carMatch;
  });

  const getBadgeForRank = (index: number) => {
    if (index === 0) {
      return (
        <Badge className="ml-2 bg-yellow-500">
          <Trophy className="h-3 w-3 mr-1" /> Champion
        </Badge>
      );
    } else if (index === 1) {
      return (
        <Badge className="ml-2 bg-slate-400">
          <Medal className="h-3 w-3 mr-1" /> Silver
        </Badge>
      );
    } else if (index === 2) {
      return (
        <Badge className="ml-2 bg-amber-700">
          <Award className="h-3 w-3 mr-1" /> Bronze
        </Badge>
      );
    }
    return null;
  };
  
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
                {Array.from(new Set(leaderboardData.map(entry => entry.carModel))).map(carId => {
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
              {isLoading ? (
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
                    {[...Array(5)].map((_, i) => (
                      <TableRow key={i}>
                        <TableCell><Skeleton className="h-6 w-8" /></TableCell>
                        <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                        <TableCell><Skeleton className="h-10 w-36" /></TableCell>
                        <TableCell className="text-right"><Skeleton className="h-6 w-16 ml-auto" /></TableCell>
                        <TableCell className="text-right"><Skeleton className="h-6 w-20 ml-auto" /></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
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
                        const isCurrentUser = user && entry.userId === user.id;
                        
                        return (
                          <TableRow 
                            key={`${entry.userId}-${entry.carModel}-${entry.time}`}
                            className={isCurrentUser ? "bg-primary/10" : ""}
                          >
                            <TableCell className="font-medium">
                              {index === 0 && (
                                <div className="inline-flex items-center">
                                  <Flag className="h-4 w-4 mr-1 text-yellow-500" />
                                  {index + 1}
                                </div>
                              )}
                              {index !== 0 && index + 1}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                {entry.username}
                                {getBadgeForRank(index)}
                                {isCurrentUser && <Badge variant="outline" className="ml-2">You</Badge>}
                              </div>
                            </TableCell>
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
                            {!user ? (
                              <p className="text-sm mt-2">
                                <a href="#" className="text-primary hover:underline">Sign in</a> to submit your own race times
                              </p>
                            ) : (
                              <p className="text-sm">Try changing your filters</p>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Leaderboard;
