import { useState, useEffect } from 'react';
import { apiService, ArticleResponse } from '../services/api';
import { Article } from '../types';

// Transform API response to frontend Article type
const transformArticle = (apiArticle: ArticleResponse): Article => {
  const tags = apiArticle.tags ? apiArticle.tags.split(',').map(tag => tag.trim()) : [];
  
  return {
    id: apiArticle.id.toString(),
    title: apiArticle.title,
    summary: apiArticle.content.substring(0, 200) + '...', // Generate summary from content
    content: apiArticle.content,
    author: apiArticle.author_name,
    publishDate: apiArticle.created_at,
    tags,
    category: apiArticle.category || 'Uncategorized',
    readTime: Math.ceil(apiArticle.content.split(' ').length / 200), // Estimate read time
    attachments: (apiArticle.attachments || []).map(att => ({
      id: att.id.toString(),
      name: att.original_name,
      type: att.mime_type.includes('pdf') ? 'pdf' as const : 
            att.mime_type.includes('zip') ? 'zip' as const :
            att.mime_type.includes('image') ? 'image' as const : 'other' as const,
      url: `http://localhost:3001/uploads/${att.filename}`,
      size: `${(att.file_size / 1024).toFixed(1)} KB`
    })),
    equations: [] // Could be extracted from content if needed
  };
};

export const useArticles = (search?: string, category?: string) => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        setError(null);
        const apiArticles = await apiService.getArticles(search, category);
        const transformedArticles = apiArticles.map(transformArticle);
        setArticles(transformedArticles);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch articles');
        console.error('Error fetching articles:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [search, category]);

  return { articles, loading, error, refetch: () => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        setError(null);
        const apiArticles = await apiService.getArticles(search, category);
        const transformedArticles = apiArticles.map(transformArticle);
        setArticles(transformedArticles);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch articles');
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }};
};

export const useArticle = (id: string) => {
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true);
        setError(null);
        const apiArticle = await apiService.getArticle(id);
        const transformedArticle = transformArticle(apiArticle);
        setArticle(transformedArticle);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch article');
        console.error('Error fetching article:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchArticle();
    }
  }, [id]);

  return { article, loading, error };
};