import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, User, Tag } from 'lucide-react';
import { useArticle } from '../hooks/useArticles';
import ArticleContent from '../components/Articles/ArticleContent';
import AttachmentList from '../components/Articles/AttachmentList';

const ArticlePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { article, loading, error } = useArticle(id!);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-8">
        <Link
          to="/"
          className="inline-flex items-center text-white/80 hover:text-white transition-colors mb-6"
        >
          <ArrowLeft size={16} className="mr-2" />
          Back to Articles
        </Link>

        <div className="glass-card p-12 text-center">
          <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/60 text-lg">Loading article...</p>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="max-w-4xl mx-auto space-y-8">
        <Link
          to="/"
          className="inline-flex items-center text-white/80 hover:text-white transition-colors mb-6"
        >
          <ArrowLeft size={16} className="mr-2" />
          Back to Articles
        </Link>

        <div className="glass-card p-8 text-center">
          <h1 className="text-2xl font-bold text-white mb-4">
            {error ? 'Error Loading Article' : 'Article Not Found'}
          </h1>
          <p className="text-white/80 mb-6">
            {error || "The article you're looking for doesn't exist."}
          </p>
          <Link to="/" className="glass-button">
            <ArrowLeft size={16} className="mr-2" />
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Link
        to="/"
        className="inline-flex items-center text-white/80 hover:text-white transition-colors mb-6"
      >
        <ArrowLeft size={16} className="mr-2" />
        Back to Articles
      </Link>

      <article className="glass-card p-8 slide-in">
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
            {article.title}
          </h1>
          
          <div className="flex flex-wrap items-center gap-4 text-white/70 text-sm mb-6">
            <div className="flex items-center">
              <User size={16} className="mr-2" />
              {article.author}
            </div>
            <div className="flex items-center">
              <Calendar size={16} className="mr-2" />
              {new Date(article.publishDate).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </div>
            <div className="flex items-center">
              <Clock size={16} className="mr-2" />
              {article.readTime} min read
            </div>
            <span className="px-3 py-1 bg-white/10 rounded-full text-xs">
              {article.category}
            </span>
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            {article.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-200 border border-blue-300/30"
              >
                <Tag size={12} className="mr-1" />
                {tag}
              </span>
            ))}
          </div>

          <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
        </header>

        <div className="prose prose-lg prose-invert max-w-none">
          <ArticleContent content={article.content} />
        </div>
      </article>

      <AttachmentList attachments={article.attachments} />

      <div className="glass-card p-6 text-center">
        <p className="text-white/60 mb-4">Enjoyed this article?</p>
        <Link to="/" className="glass-button">
          Explore More Articles
        </Link>
      </div>
    </div>
  );
};

export default ArticlePage;