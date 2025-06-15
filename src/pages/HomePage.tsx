import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import { mockArticles, categories, allTags } from '../data/mockArticles';
import { SearchFilters } from '../types';
import { useAuth } from '../contexts/AuthContext';
import ArticleCard from '../components/Articles/ArticleCard';
import SearchBar from '../components/Articles/SearchBar';

const HomePage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    category: 'All',
    tags: []
  });

  const filteredArticles = useMemo(() => {
    return mockArticles.filter(article => {
      const matchesQuery = filters.query === '' || 
        article.title.toLowerCase().includes(filters.query.toLowerCase()) ||
        article.summary.toLowerCase().includes(filters.query.toLowerCase()) ||
        article.content.toLowerCase().includes(filters.query.toLowerCase());

      const matchesCategory = filters.category === 'All' || article.category === filters.category;

      const matchesTags = filters.tags.length === 0 || 
        filters.tags.every(tag => article.tags.includes(tag));

      return matchesQuery && matchesCategory && matchesTags;
    });
  }, [filters]);

  return (
    <div className="space-y-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
          Mathematical Articles
        </h1>
        <p className="text-xl text-white/80 max-w-2xl mx-auto mb-6">
          Explore cutting-edge research and discoveries in mathematics, physics, and beyond
        </p>
        
        {/* Admin Login Button - Only show if not authenticated */}
        {!isAuthenticated && (
          <div className="flex justify-center">
            <Link
              to="/login"
              className="inline-flex items-center space-x-2 glass-button px-6 py-3 text-lg font-medium hover:scale-105 transform transition-all duration-300"
            >
              <LogIn size={20} />
              <span>Admin Login</span>
            </Link>
          </div>
        )}
      </div>

      <SearchBar
        filters={filters}
        onFiltersChange={setFilters}
        categories={categories}
        tags={allTags}
      />

      {filteredArticles.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <p className="text-white/60 text-lg">
            No articles found matching your search criteria.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredArticles.map((article, index) => (
            <div key={article.id} style={{ animationDelay: `${index * 0.1}s` }}>
              <ArticleCard article={article} />
            </div>
          ))}
        </div>
      )}

      <div className="text-center mt-12">
        <p className="text-white/60">
          Showing {filteredArticles.length} of {mockArticles.length} articles
        </p>
      </div>
    </div>
  );
};

export default HomePage;