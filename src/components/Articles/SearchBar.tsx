import React from 'react';
import { Search, Filter } from 'lucide-react';
import { SearchFilters } from '../../types';

interface SearchBarProps {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  categories: string[];
  tags: string[];
}

const SearchBar: React.FC<SearchBarProps> = ({ filters, onFiltersChange, categories, tags }) => {
  return (
    <div className="glass-card p-6 mb-8 space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60" size={20} />
        <input
          type="text"
          placeholder="Search articles..."
          value={filters.query}
          onChange={(e) => onFiltersChange({ ...filters, query: e.target.value })}
          className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
        />
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <label className="block text-white/80 text-sm font-medium mb-2">
            <Filter size={16} className="inline mr-1" />
            Category
          </label>
          <select
            value={filters.category}
            onChange={(e) => onFiltersChange({ ...filters, category: e.target.value })}
            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            {categories.map((category) => (
              <option key={category} value={category} className="bg-gray-800">
                {category}
              </option>
            ))}
          </select>
        </div>

        <div className="flex-2">
          <label className="block text-white/80 text-sm font-medium mb-2">Tags</label>
          <div className="flex flex-wrap gap-2 max-h-20 overflow-y-auto">
            {tags.map((tag) => (
              <button
                key={tag}
                onClick={() => {
                  const newTags = filters.tags.includes(tag)
                    ? filters.tags.filter(t => t !== tag)
                    : [...filters.tags, tag];
                  onFiltersChange({ ...filters, tags: newTags });
                }}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                  filters.tags.includes(tag)
                    ? 'bg-blue-500/30 text-blue-200 border border-blue-300/50'
                    : 'bg-white/10 text-white/70 border border-white/20 hover:bg-white/20'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;