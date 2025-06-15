import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, User, Tag, FileText } from 'lucide-react';
import { Article } from '../../types';

interface ArticleCardProps {
  article: Article;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article }) => {
  return (
    <Link
      to={`/article/${article.id}`}
      className="block glass-card p-6 hover:scale-105 transform transition-all duration-300 hover:shadow-2xl group slide-in"
    >
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <h3 className="text-xl font-semibold text-white group-hover:text-blue-200 transition-colors line-clamp-2">
            {article.title}
          </h3>
          <div className="flex items-center text-white/60 ml-4">
            <FileText size={16} />
          </div>
        </div>

        <p className="text-white/80 line-clamp-3 leading-relaxed">
          {article.summary}
        </p>

        <div className="flex flex-wrap gap-2">
          {article.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white/10 text-white/90 border border-white/20"
            >
              <Tag size={12} className="mr-1" />
              {tag}
            </span>
          ))}
          {article.tags.length > 3 && (
            <span className="text-white/60 text-xs">+{article.tags.length - 3} more</span>
          )}
        </div>

        <div className="flex items-center justify-between text-sm text-white/60 pt-2 border-t border-white/10">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <User size={14} className="mr-1" />
              {article.author}
            </div>
            <div className="flex items-center">
              <Calendar size={14} className="mr-1" />
              {new Date(article.publishDate).toLocaleDateString()}
            </div>
          </div>
          <div className="flex items-center">
            <Clock size={14} className="mr-1" />
            {article.readTime} min
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ArticleCard;