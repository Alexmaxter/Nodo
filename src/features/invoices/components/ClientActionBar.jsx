import { Search } from "lucide-react";

export default function ClientActionBar({ searchTerm, setSearchTerm }) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-4">
      <div className="relative w-full md:max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#111]" />
        <input
          type="text"
          placeholder="Buscar cliente por nombre..."
          className="w-full bg-white border border-[#111] pl-11 pr-4 py-3 text-[11px] font-bold text-[#111] focus:border-[#111] focus:outline-none focus:ring-1 focus:ring-[#111] uppercase tracking-[0.15em] transition-colors rounded-none"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
    </div>
  );
}
