import React, { useState } from 'react';
import { Save, Upload, Plus, X, FileText, BarChart3, Users, BookOpen } from 'lucide-react';
import { allTags, categories } from '../data/mockArticles';

interface NewArticle {
  title: string;
  summary: string;
  content: string;
  author: string;
  category: string;
  tags: string[];
  attachments: File[];
}

const DashboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'add-article'>('overview');
  const [article, setArticle] = useState<NewArticle>({
    title: '',
    summary: '',
    content: '',
    author: '',
    category: categories[1], // Skip 'All'
    tags: [],
    attachments: []
  });

  const [newTag, setNewTag] = useState('');

  const handleInputChange = (field: keyof NewArticle, value: string) => {
    setArticle(prev => ({ ...prev, [field]: value }));
  };

  const handleTagAdd = (tag: string) => {
    if (tag && !article.tags.includes(tag)) {
      setArticle(prev => ({ ...prev, tags: [...prev.tags, tag] }));
    }
    setNewTag('');
  };

  const handleTagRemove = (tag: string) => {
    setArticle(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }));
  };

  const handleFileUpload = (files: FileList | null) => {
    if (files) {
      const newFiles = Array.from(files);
      setArticle(prev => ({ ...prev, attachments: [...prev.attachments, ...newFiles] }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitting article:', article);
    alert('Article submitted successfully! (This is a demo)');
    
    // Reset form
    setArticle({
      title: '',
      summary: '',
      content: '',
      author: '',
      category: categories[1],
      tags: [],
      attachments: []
    });
  };

  const stats = [
    { label: 'Total Articles', value: '12', icon: BookOpen, color: 'text-blue-400' },
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

          {/* Recent Activity */}
          <div className="glass-card p-6 slide-in">
            <h2 className="text-xl font-bold text-white mb-4">Recent Activity</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-white">New article published: "Advanced Calculus"</span>
                </div>
                <span className="text-white/60 text-sm">2 hours ago</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span className="text-white">Article updated: "Quantum Mechanics"</span>
                </div>
                <span className="text-white/60 text-sm">1 day ago</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  <span className="text-white">New reader milestone reached</span>
                </div>
                <span className="text-white/60 text-sm">3 days ago</span>
              </div>
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
                  Author *
                </label>
                <input
                  type="text"
                  value={article.author}
                  onChange={(e) => handleInputChange('author', e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="Author name..."
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                Summary *
              </label>
              <textarea
                value={article.summary}
                onChange={(e) => handleInputChange('summary', e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
                rows={3}
                placeholder="Brief summary of the article..."
                required
              />
            </div>

            {/* Category Selection */}
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

            {/* Tags */}
            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                Tags
              </label>
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  {allTags.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => handleTagAdd(tag)}
                      disabled={article.tags.includes(tag)}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                        article.tags.includes(tag)
                          ? 'bg-blue-500/30 text-blue-200 border border-blue-300/50 cursor-not-allowed'
                          : 'bg-white/10 text-white/70 border border-white/20 hover:bg-white/20 cursor-pointer'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
                
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="Add custom tag..."
                  />
                  <button
                    type="button"
                    onClick={() => handleTagAdd(newTag)}
                    className="glass-button py-2 px-4"
                  >
                    <Plus size={16} />
                  </button>
                </div>

                {article.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {article.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-200 border border-green-300/30"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleTagRemove(tag)}
                          className="ml-2 hover:text-green-100"
                        >
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
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

            {/* File Attachments */}
            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                Attachments
              </label>
              <div className="border-2 border-dashed border-white/20 rounded-xl p-6 text-center">
                <input
                  type="file"
                  multiple
                  onChange={(e) => handleFileUpload(e.target.files)}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <Upload size={32} className="mx-auto text-white/60 mb-2" />
                  <p className="text-white/70">Click to upload files</p>
                  <p className="text-white/50 text-sm">PDFs, images, archives...</p>
                </label>
              </div>

              {article.attachments.length > 0 && (
                <div className="mt-4 space-y-2">
                  {article.attachments.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <span className="text-white/80">{file.name}</span>
                      <button
                        type="button"
                        onClick={() => {
                          setArticle(prev => ({
                            ...prev,
                            attachments: prev.attachments.filter((_, i) => i !== index)
                          }));
                        }}
                        className="text-red-400 hover:text-red-300"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-6 border-t border-white/10">
              <button
                type="submit"
                className="glass-button px-8 py-3 text-lg"
              >
                <Save size={20} className="mr-2" />
                Publish Article
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;