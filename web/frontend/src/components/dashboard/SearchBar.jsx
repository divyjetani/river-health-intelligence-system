import { Search } from 'lucide-react';

export default function SearchBar() {
  return (
    <div className="flex justify-center w-full mb-6">
      <div className="relative w-full max-w-2xl">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-slate-500" />
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-full leading-5 bg-slate-100 placeholder-slate-500 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all shadow-sm"
          placeholder="Search river zones, sensors, or pollution types..."
        />
      </div>
    </div>
  );
}