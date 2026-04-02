"use client";

import { useState, useEffect } from 'react';
import { HubConnectionBuilder } from '@microsoft/signalr';
import { ShieldAlert, Activity, LogOut } from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [scans, setScans] = useState<any[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  // Authentication Logic
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'judge' && password === 'Hackathon2025!') {
      setIsAuthenticated(true);
      setLoginError('');
    } else {
      setLoginError('Invalid credentials');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUsername('');
    setPassword('');
    setScans([]);
    setIsConnected(false);
  };

  // SignalR Logic
  useEffect(() => {
    if (!isAuthenticated) return;

    const connection = new HubConnectionBuilder()
      .withUrl(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/hubs/scan`)
      .withAutomaticReconnect()
      .build();

    connection.start()
      .then(() => {
        setIsConnected(true);
        console.log('Connected to SignalR hub');
      })
      .catch(err => console.error('SignalR Connection Error: ', err));

    connection.on('ReceiveScanResult', (result) => {
      setScans(prev => [result, ...prev].slice(0, 50)); // Keep last 50 scans
    });

    // Fetch history
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/api/scan/history?limit=20`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
           setScans(data);
        }
      })
      .catch(err => console.error('Failed to fetch history', err));

    return () => {
      connection.stop();
    };
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
          <div className="flex justify-center mb-6">
             <ShieldAlert size={48} className="text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">Admin Login</h2>
          {loginError && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm text-center">{loginError}</div>}
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Username</label>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                required
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
            >
              Sign In
            </button>
          </form>
          <div className="mt-4 text-center">
            <Link href="/" className="text-blue-600 hover:underline text-sm">Return to Home</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Navbar */}
      <nav className="w-full bg-gray-900 text-white p-4 flex justify-between items-center shadow-md">
        <div className="flex items-center space-x-2 font-bold text-xl ml-4">
          <Activity size={24} className={isConnected ? "text-green-400" : "text-gray-400"} />
          <span>Live Scan Monitor</span>
        </div>
        <div className="flex items-center space-x-6 mr-4">
          <Link href="/" className="text-gray-300 hover:text-white transition-colors">Client View</Link>
          <button onClick={handleLogout} className="flex items-center text-red-400 hover:text-red-300 transition-colors">
            <LogOut size={18} className="mr-1" /> Logout
          </button>
        </div>
      </nav>

      <div className="p-8 max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
             <h3 className="font-bold text-gray-800 text-lg">Recent Scan Activity</h3>
             <div className="flex items-center">
                <span className="relative flex h-3 w-3 mr-2">
                  {isConnected && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>}
                  <span className={`relative inline-flex rounded-full h-3 w-3 ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></span>
                </span>
                <span className="text-sm text-gray-600">{isConnected ? 'Live' : 'Disconnected'}</span>
             </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-100 text-gray-700 uppercase">
                <tr>
                  <th className="px-6 py-3">Time</th>
                  <th className="px-6 py-3">Domain</th>
                  <th className="px-6 py-3">Score</th>
                  <th className="px-6 py-3">Threats</th>
                </tr>
              </thead>
              <tbody>
                {scans.length === 0 ? (
                  <tr><td colSpan={4} className="text-center py-8 text-gray-500">No recent scans. Waiting for activity...</td></tr>
                ) : scans.map((scan, idx) => (
                  <tr key={scan.id || idx} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(scan.timestamp).toLocaleTimeString()}
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {scan.domain}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${
                        scan.safetyScore >= 80 ? 'bg-green-100 text-green-800' :
                        scan.safetyScore >= 50 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {scan.safetyScore}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {scan.threats && scan.threats.length > 0 && !(scan.threats.length === 1 && scan.threats[0].includes('No identified')) ? (
                        <div className="flex flex-wrap gap-1">
                          {scan.threats.map((t: string, i: number) => (
                            <span key={i} className="bg-red-50 text-red-600 text-xs px-2 py-1 border border-red-100 rounded">{t}</span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-green-600 text-xs flex items-center"><CheckCircle size={12} className="mr-1"/> Clean</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CheckCircle(props: any) {
  return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>
}
