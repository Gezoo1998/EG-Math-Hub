import React, { useState } from 'react';
import { Save, Upload, Plus, X, FileText, BarChart3, Users, BookOpen } from 'lucide-react';
import { categories } from '../data/mockArticles';
import { apiService } from '../services/api';
import { useArticles } from '../hooks/useArticles';

interface NewArticle {
  title: string;
  content: string;
  category: string;
  tags: string;
}

const DashboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'add-article'>('overview');
  const [article, setArticle] = useState<NewArticle>({
    title: '',
    content: '',
    category: categories[1], // Skip 'All'
    tags: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const { articles, refetch } = useArticles();

  const handleInputChange = (field: keyof NewArticle, value: string) => {
    setArticle(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      await apiService.createArticle({
        title: article.title,
        content: article.content,
        category: article.category,
        tags: article.tags
      });

      setSubmitMessage('Article created successfully!');
      
      // Reset form
      setArticle({
        title: '',
        content: '',
        category: categories[1],
        tags: ''
      });

      // Refresh articles list
      refetch();
      
      // Switch to overview tab to see the new article
      setTimeout(() => {
        setActiveTab('overview');
      }, 1500);

    } catch (error) {
      setSubmitMessage(`Error: ${error instanceof Error ? error.message : 'Failed to create article'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const stats = [
    { label: 'Total Articles', value: articles.length.toString(), icon: BookOpen, color: 'text-blue-400' },
    { label: 'Total Views', value: '1,234', icon: BarChart3, color: 'text-green-400' },
    { label: 'Active Readers', value: '89', icon: Users, color: 'text-purple-400' },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="glass-card p-8 slide-in">
        <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
        <p className="text-white/70">Manage your mathematical research platform</p>
      </div>

      {/* Tab Navigation */}
      <div className="glass-card p-2">
        <div className="flex space-x-1">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all duration-300 ${
              activeTab === 'overview'
                ? 'bg-white/20 text-white shadow-lg'
                : 'text-white/70 hover:text-white hover:bg-white/10'
            }`}
          >
            <BarChart3 size={18} className="inline mr-2" />
            Overview
          </button>
          <button
            onClick={() => setActiveTab('add-article')}
            className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all duration-300 ${
              activeTab === 'add-article'
                ? 'bg-white/20 text-white shadow-lg'
                : 'text-white/70 hover:text-white hover:bg-white/10'
            }`}
          >
            <Plus size={18} className="inline mr-2" />
            Add Article
          </button>
        </div>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Stats Grid */}
          <div className="grid md:grid-cols-3 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="glass-card p-6 slide-in">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/70 text-sm">{stat.label}</p>
                    <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                  </div>
                  <stat.icon size={32} className={stat.color} />
                </div>
              </div>
            ))}
          </div>

          {/* Recent Articles */}
          <div className="glass-card p-6 slide-in">
            <h2 className="text-xl font-bold text-white mb-4">Recent Articles</h2>
            <div className="space-y-3">
              {articles.slice(0, 5).map((article) => (
                <div key={article.id} className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-white">{article.title}</span>
                  </div>
                  <span className="text-white/60 text-sm">
                    {new Date(article.publishDate).toLocaleDateString()}
                  </span>
                </div>
              ))}
              {articles.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-white/60">No articles yet. Create your first article!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add Article Tab */}
      {activeTab === 'add-article' && (
        <div className="glass-card p-8 slide-in">
          <div className="flex items-center mb-8">
            <FileText size={32} className="text-blue-300 mr-4" />
            <h2 className="text-2xl font-bold text-white">Create New Article</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={article.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="Enter article title..."
                  required
                />
              </div>

              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  Category *
                </label>
                <select
                  value={article.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                >
                  {categories.slice(1).map((category) => (
                    <option key={category} value={category} className="bg-gray-800">
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                Tags (comma-separated)
              </label>
              <input
                type="text"
                value={article.tags}
                onChange={(e) => handleInputChange('tags', e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="calculus, integration, mathematics"
              />
            </div>

            {/* Content */}
            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                Content * (Supports LaTeX: use $...$ for inline math, $$...$$ for block math)
              </label>
              <textarea
                value={article.content}
                onChange={(e) => handleInputChange('content', e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none font-mono text-sm"
                rows={15}
                placeholder="# Article Title

## Introduction

Write your article content here...

Use LaTeX for equations:
- Inline: $E = mc^2$
- Block: $$\int_0^\infty e^{-x^2} dx = \frac{\sqrt{\pi}}{2}$$"
                required
              />
            </div>

            {/* Submit Message */}
            {submitMessage && (
              <div className={`p-3 rounded-lg ${
                submitMessage.includes('Error') 
                  ? 'bg-red-500/20 border border-red-400/30' 
                  : 'bg-green-500/20 border border-green-400/30'
              }`}>
                <p className={submitMessage.includes('Error') ? 'text-red-200' : 'text-green-200'}>
                  {submitMessage}
                </p>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-end pt-6 border-t border-white/10">
              <button
                type="submit"
                disabled={isSubmitting}
                className="glass-button px-8 py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                    Publishing...
                  </div>
                ) : (
                  <>
                    <Save size={20} className="mr-2" />
                    Publish Article
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;