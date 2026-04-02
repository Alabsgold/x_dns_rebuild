"use client";

import { useState } from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps {
  onSearch: (domain: string) => void;
  isLoading: boolean;
}

export default function SearchBar({ onSearch, isLoading }: SearchBarProps) {
  const [domain, setDomain] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (domain.trim()) {
      onSearch(domain.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl relative">
      <div className="relative flex items-center">
        <div className="absolute left-4 text-gray-400">
          <Search size={20} />
        </div>
        <input
          type="text"
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
          placeholder="Enter a domain to scan (e.g., example.com)"
          className="w-full pl-12 pr-32 py-4 rounded-full bg-white shadow-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 text-lg"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !domain.trim()}
          className="absolute right-2 top-2 bottom-2 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-medium transition-colors disabled:opacity-50 flex items-center"
        >
          {isLoading ? 'Scanning...' : 'Scan Now'}
        </button>
      </div>
    </form>
  );
}
