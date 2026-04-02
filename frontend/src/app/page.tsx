"use client";

import { useState } from 'react';
import SearchBar from '@/components/SearchBar';
import SafetyScorecard from '@/components/SafetyScorecard';
import ThreatBadges from '@/components/ThreatBadges';
import { Shield, ShieldAlert, Zap } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [scanResult, setScanResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (domain: string) => {
    setIsLoading(true);
    setError(null);
    setScanResult(null);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/api/scan`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ domain }),
      });

      if (!response.ok) {
        throw new Error('Failed to scan domain');
      }

      const data = await response.json();
      setScanResult(data);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message || 'An error occurred during scanning');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center">
      {/* Navbar Placeholder */}
      <nav className="w-full bg-white shadow-sm p-4 flex justify-between items-center">
        <div className="flex items-center space-x-2 text-blue-600 font-bold text-xl ml-4">
          <ShieldAlert size={28} />
          <span>X-DNS Guardian+</span>
        </div>
        <Link href="/admin" className="mr-4 text-blue-600 hover:text-blue-800 font-medium">
          Admin Dashboard
        </Link>
      </nav>

      {/* Hero Section */}
      <div className="w-full bg-blue-600 text-white flex flex-col items-center py-20 px-4">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-6 text-center">
          Real-Time DNS Risk Intelligence
        </h1>
        <p className="text-xl text-blue-100 max-w-2xl text-center mb-10">
          Instantly profile domains, identify threats, and ensure safety before you connect.
        </p>
        <SearchBar onSearch={handleSearch} isLoading={isLoading} />
        {error && <div className="mt-4 text-red-200 bg-red-900/50 px-4 py-2 rounded-lg">{error}</div>}
      </div>

      {/* Results Section */}
      <div className="w-full max-w-5xl px-4 py-12">
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <Zap className="animate-pulse text-blue-500" size={48} />
            <p className="text-lg text-gray-600 font-medium">Analyzing DNS metadata...</p>
          </div>
        )}

        {scanResult && !isLoading && (
          <div className="animate-fade-in-up">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">
              Scan Results for: <span className="text-blue-600">{scanResult.domain}</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="col-span-1">
                <SafetyScorecard score={scanResult.safetyScore} />
              </div>
              <div className="col-span-1 md:col-span-2">
                <ThreatBadges threats={scanResult.threats} />
              </div>
            </div>

            {/* Technical Details */}
            <div className="mt-8 bg-white p-6 rounded-xl shadow-md border border-gray-100">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <Shield className="mr-2 text-gray-500" /> DNS Metadata
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <span className="text-sm text-gray-500 font-bold block mb-1">A Records</span>
                  {scanResult.aRecords?.length > 0 ? (
                    scanResult.aRecords.map((r: string, i: number) => <div key={i} className="text-gray-800 text-sm truncate">{r}</div>)
                  ) : <div className="text-gray-400 text-sm">None</div>}
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <span className="text-sm text-gray-500 font-bold block mb-1">MX Records</span>
                  {scanResult.mxRecords?.length > 0 ? (
                    scanResult.mxRecords.map((r: string, i: number) => <div key={i} className="text-gray-800 text-sm truncate">{r}</div>)
                  ) : <div className="text-gray-400 text-sm">None</div>}
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <span className="text-sm text-gray-500 font-bold block mb-1">NS Records</span>
                  {scanResult.nsRecords?.length > 0 ? (
                    scanResult.nsRecords.map((r: string, i: number) => <div key={i} className="text-gray-800 text-sm truncate">{r}</div>)
                  ) : <div className="text-gray-400 text-sm">None</div>}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
