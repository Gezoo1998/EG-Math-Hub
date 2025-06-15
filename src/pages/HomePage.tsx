import React, { useState, useMemo } from 'react';
import { categories, allTags } from '../data/mockArticles';
import { SearchFilters } from '../types';
import { useArticles } from '../hooks/useArticles';
import ArticleCard from '../components/Articles/ArticleCard';
import SearchBar from '../components/Articles/SearchBar';

const HomePage: React.FC = () => {
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    category: 'All',
    tags: []
  });

  const { articles, loading, error } = useArticles(
    filters.query || undefined,
    filters.category !== 'All' ? filters.category : undefined
  );

  const filteredArticles = useMemo(() => {
    return articles.filter(article => {
      const matchesTags = filters.tags.length === 0 || 
        filters.tags.every(tag => article.tags.includes(tag));
      return matchesTags;
    });
  }, [articles, filters.tags]);

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
            Mathematical Articles
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Explore cutting-edge research and discoveries in mathematics, physics, and beyond
          </p>
        </div>

        <div className="glass-card p-12 text-center">
          <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/60 text-lg">Loading articles...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
            Mathematical Articles
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Explore cutting-edge research and discoveries in mathematics, physics, and beyond
          </p>
        </div>

        <div className="glass-card p-12 text-center">
          <p className="text-red-200 text-lg mb-4">Error loading articles: {error}</p>
          <p className="text-white/60">Please make sure the backend server is running on port 3001.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
          Mathematical Articles
        </h1>
        <p className="text-xl text-white/80 max-w-2xl mx-auto">
          Explore cutting-edge research and discoveries in mathematics, physics, and beyond
        </p>
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
          Showing {filteredArticles.length} of {articles.length} articles
        </p>
      </div>
    </div>
  );
};

export default HomePage;