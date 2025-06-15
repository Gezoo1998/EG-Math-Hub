export interface Article {
  id: string;
  title: string;
  summary: string;
  content: string;
  author: string;
  publishDate: string;
  tags: string[];
  category: string;
  readTime: number;
  attachments: Attachment[];
  equations: string[];
}

export interface Attachment {
  id: string;
  name: string;
  type: 'pdf' | 'zip' | 'image' | 'other';
  url: string;
  size: string;
}

export interface SearchFilters {
  query: string;
  category: string;
  tags: string[];
}