"use client";
import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Info, Activity, Clock, Database, X, CheckCircle, Settings, AlertTriangle, Calendar, Server, Map } from 'lucide-react';

const mockGtfsPayload = {
  "header": {
    "gtfsRealtimeVersion": "2.0",
    "incrementality": "FULL_DATASET",
    "timestamp": "1698337500"
  },
  "entity": [
    {
      "id": "1",
      "vehicle": {
        "trip": { "tripId": "849302", "routeId": "STREETCAR" },
        "position": { "latitude": 39.0835, "longitude": -94.5839, "speed": 8.5 },
        "currentStopSequence": 4,
        "stopId": "UNION_STATION",
        "timestamp": "1698337498",
        "vehicle": { "id": "801" }
      }
    }
  ]
};

const staticHistoricalRidership = [
  { time: 'May W1', riders: 28500 },
  { time: 'May W2', riders: 31200 },
  { time: 'May W3', riders: 29800 },
  { time: 'May W4', riders: 34100 },
  { time: 'Jun W1', riders: 36500 },
  { time: 'Jun W2', riders: 38200 },
  { time: 'Jun W3', riders: 37900 },
  { time: 'Jun W4', riders: 39500 },
  { time: 'Jul W1', riders: 42100 },
  { time: 'Jul W2', riders: 38900 },
  { time: 'Jul W3', riders: 37500 },
  { time: 'Jul W4', riders: 36800 },
];
const total3MonthRidership = staticHistoricalRidership.reduce((sum, item) => sum + item.riders, 0);

const InfoTooltip = ({ text }: { text: string }) => (
  <div className="relative group flex-shrink-0 ml-2">
    <Info size={20} className="text-slate-500 group-hover:text-slate-300 transition-colors" />
    <div className="absolute right-0 top-full mt-2 w-64 p-3 text-sm font-normal text-slate-200 bg-slate-700 border border-slate-600 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
      {text}
    </div>
  </div>
);

export default function Dashboard() {
  const [data, setData] = useState<any>(null);
  const [showRawData, setShowRawData] = useState(false);
  const [onTimeHistory, setOnTimeHistory] = useState<{name: string, value: number}[]>(
    Array.from({length: 20}, (_, i) => {
      const secondsAgo = (19 - i) * 3;
      return { 
        name: secondsAgo === 0 ? 'T-0' : `T-${secondsAgo}`, 
        value: 90 + Math.random() * 5 
      };
    })
  );

  useEffect(() => {
    const generateMockData = () => {
      const cars = ['801', '802', '803', '804', '805', '806'];
      const activeCarsCount = Math.floor(Math.random() * 2) + 4; 
      
      const activeFleet = cars.slice(0, activeCarsCount).map(id => {
        const isDelayed = Math.random() > 0.8;
        return {
          id,
          status: isDelayed ? 'Delayed' : 'In-Service',
          passengerLoad: Math.floor(Math.random() * 60) + 20, // 20% to 80% full
          scheduleVariance: isDelayed ? `+${Math.floor(Math.random() * 7) + 2} min` : 'On Time',
          location: ['Union Station', 'Crossroads', 'Power & Light', 'Metro Center', 'City Market'][Math.floor(Math.random() * 5)]
        };
      });

      const offlineFleet = cars.slice(activeCarsCount).map(id => ({
        id,
        status: 'Maintenance',
        passengerLoad: 0,
        scheduleVariance: 'N/A',
        location: 'Maintenance Facility'
      }));

      const live = {
        timestamp: new Date().toISOString(),
        systemHealth: {
          onTimePerformance: (90 + Math.random() * 8).toFixed(1),
          activeIncidents: activeFleet.filter(c => c.status === 'Delayed').length
        },
        fleet: [...activeFleet, ...offlineFleet]
      };

      return { live };
    };

    const updateData = () => {
      const newData = generateMockData();
      setData(newData);
      
      setOnTimeHistory(prev => {
        const values = [...prev.map(p => p.value), parseFloat(newData.live.systemHealth.onTimePerformance)].slice(-20);
        return values.map((val, i) => {
          const secondsAgo = (values.length - 1 - i) * 3;
          return { name: secondsAgo === 0 ? 'T-0' : `T-${secondsAgo}`, value: val };
        });
      });
    };

    updateData(); // initial load
    const interval = setInterval(updateData, 3000); // poll every 3 seconds
    return () => clearInterval(interval);
  }, []);

  if (!data) {
    return <div className="min-h-screen bg-slate-900 text-slate-100 p-8 flex items-center justify-center">Connecting to Transit Network...</div>;
  }

  const { live, historical } = data;
  const activeCount = live.fleet.filter((c: any) => c.status !== 'Maintenance').length;
  const maintenanceCount = live.fleet.length - activeCount;

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-8 font-sans">
      <header className="mb-8 border-b border-slate-700 pb-4 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Activity className="text-blue-400" size={32} />
            KC Streetcar Executive Dashboard
          </h1>
          <p className="text-slate-400 mt-2">Live Network Overview & Historical Context</p>
        </div>
      </header>

      {/* TOP ROW: LIVE CRITICAL METRICS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* On-Time Performance Trend */}
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-lg font-semibold text-slate-300">Live On-Time Performance</h2>
              <div className="text-4xl font-bold text-white mt-2">
                {live.systemHealth.onTimePerformance}% 
                <span className="text-sm font-normal text-slate-400 ml-2 animate-pulse text-blue-400">Live</span>
              </div>
            </div>
            <InfoTooltip text="Real-time network efficiency tracking the percentage of vehicles operating within expected schedule variances." />
          </div>
          <div className="h-32 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={onTimeHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} domain={[80, 100]} hide />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none' }} />
                <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} isAnimationActive={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Ridership Historical Curve */}
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-lg font-semibold text-slate-300">Historical Ridership (3 Months)</h2>
              <div className="text-3xl font-bold text-emerald-400 mt-2">
                {total3MonthRidership.toLocaleString()}
                <span className="text-sm font-normal text-slate-400 ml-2">Total Riders</span>
              </div>
            </div>
            <InfoTooltip text="Aggregated quarterly ridership volume to establish baseline network utilization." />
          </div>
          <div className="h-32 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={staticHistoricalRidership}>
                <XAxis dataKey="time" stroke="#94a3b8" fontSize={10} interval={2} />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none' }} cursor={{fill: '#334155'}} />
                <Bar dataKey="riders" fill="#10b981" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Active Fleet */}
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start">
              <h2 className="text-lg font-semibold text-slate-300">Active Fleet</h2>
              <InfoTooltip text="Live count of physical streetcars currently supplying telemetry data versus those offline for maintenance." />
            </div>
            <div className={`text-4xl font-bold mt-4 flex items-center gap-2 ${activeCount <= 4 ? 'text-amber-400' : 'text-emerald-400'}`}>
              {activeCount} / 6 <span className="text-lg font-normal text-slate-400">In Service</span>
            </div>
          </div>
          
          <div className="mt-4 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="flex items-center gap-2"><CheckCircle size={16} className="text-emerald-400"/> Operational</span>
              <span>{activeCount}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="flex items-center gap-2"><Settings size={16} className="text-red-400"/> Maintenance</span>
              <span>{maintenanceCount}</span>
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM ROW: LIVE FLEET POSITIONS & INCIDENTS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Live Fleet Health */}
        <div className="col-span-1 md:col-span-2 bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-slate-300">Live Fleet Positions & Health</h2>
            <InfoTooltip text="GPS-derived location, capacity utilization, and schedule adherence for all connected network assets." />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-slate-400 border-b border-slate-700">
                  <th className="pb-3 font-medium">Vehicle</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium">Location</th>
                  <th className="pb-3 font-medium">Occupancy</th>
                  <th className="pb-3 font-medium">Variance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50">
                {live.fleet.map((car: any) => {
                  let color = 'text-emerald-400';
                  if (car.status === 'Delayed') color = 'text-amber-400';
                  if (car.status === 'Maintenance') color = 'text-red-400';

                  return (
                    <tr key={car.id} className="transition-all duration-500">
                      <td className="py-4 font-medium">Car #{car.id}</td>
                      <td className={`py-4 flex items-center gap-2 ${color}`}>
                        <div className={`w-2 h-2 rounded-full ${color.replace('text', 'bg')}`}></div>
                        {car.status}
                      </td>
                      <td className="py-4 text-slate-300">{car.location}</td>
                      <td className="py-4 text-slate-300">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 bg-slate-700 rounded-full overflow-hidden">
                            <div 
                              className={`h-full ${car.passengerLoad > 70 ? 'bg-amber-400' : 'bg-blue-400'}`} 
                              style={{ width: `${car.passengerLoad}%` }}
                            ></div>
                          </div>
                          <span className="text-xs">{car.passengerLoad > 0 ? `${car.passengerLoad}%` : 'Empty'}</span>
                        </div>
                      </td>
                      <td className={`py-4 ${car.scheduleVariance === 'On Time' ? 'text-emerald-400' : (car.scheduleVariance === 'N/A' ? 'text-slate-500' : 'text-amber-400')}`}>
                        {car.scheduleVariance}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Real-Time Delay Tracking */}
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
           <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-slate-300">Live Incidents</h2>
            <InfoTooltip text="Automated anomaly detection highlighting active traffic delays or route impediments." />
          </div>
          
          <div className="space-y-4">
            {live.systemHealth.activeIncidents > 0 ? (
              <div className="p-4 bg-slate-700/30 rounded-lg border border-slate-700 border-l-4 border-l-amber-500">
                <div className="flex justify-between items-start">
                  <span className="text-amber-400 font-medium">Traffic Delay</span>
                  <span className="text-xs text-slate-400 animate-pulse text-amber-400">Live</span>
                </div>
                <p className="text-sm mt-1 text-slate-300">Vehicles are reporting delays along the route. Adjustments in progress.</p>
              </div>
            ) : (
              <div className="p-4 bg-slate-700/30 rounded-lg border border-slate-700 border-l-4 border-l-emerald-500">
                <div className="flex items-center gap-2 text-emerald-400 font-medium">
                  <CheckCircle size={16} /> All network segments clear
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Disclaimer Footer */}
      <div className="mt-8 text-center text-slate-600 text-xs opacity-40 hover:opacity-100 transition-opacity">
        Disclaimer: This dashboard is a portfolio demonstration. The telemetry data displayed is simulated and does not represent actual KC Streetcar operations.
      </div>
    </div>
  );
}
