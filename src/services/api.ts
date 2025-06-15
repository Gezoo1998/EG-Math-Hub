const API_BASE_URL = 'http://localhost:3001/api';

// Types for API responses
export interface LoginResponse {
  message: string;
  token: string;
  user: {
    id: number;
    username: string;
    email: string;
  };
}

export interface ArticleResponse {
  id: number;
  title: string;
  content: string;
  author_id: number;
  author_name: string;
  category: string;
  tags: string;
  created_at: string;
  updated_at: string;
  attachments?: AttachmentResponse[];
}

export interface AttachmentResponse {
  id: number;
  article_id: number;
  filename: string;
  original_name: string;
  file_path: string;
  file_size: number;
  mime_type: string;
  created_at: string;
}

export interface CreateArticleRequest {
  title: string;
  content: string;
  category?: string;
  tags?: string;
}

class ApiService {
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('auth_token');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  }

  // Authentication
  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Login failed');
    }

    return response.json();
  }

  async register(username: string, email: string, password: string): Promise<LoginResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Registration failed');
    }

    return response.json();
  }

  // Articles
  async getArticles(search?: string, category?: string): Promise<ArticleResponse[]> {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (category && category !== 'All') params.append('category', category);

    const response = await fetch(`${API_BASE_URL}/articles?${params}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch articles');
    }

    return response.json();
  }

  async getArticle(id: string): Promise<ArticleResponse> {
    const response = await fetch(`${API_BASE_URL}/articles/${id}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch article');
    }

    return response.json();
  }

  async createArticle(article: CreateArticleRequest): Promise<{ message: string; articleId: number }> {
    const response = await fetch(`${API_BASE_URL}/articles`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(article)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create article');
    }

    return response.json();
  }

  async updateArticle(id: string, article: CreateArticleRequest): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/articles/${id}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(article)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update article');
    }

    return response.json();
  }

  async deleteArticle(id: string): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/articles/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders()
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to delete article');
    }

    return response.json();
  }

  // File uploads
  async uploadFile(articleId: string, file: File): Promise<{ message: string; attachment: any }> {
    const formData = new FormData();
    formData.append('file', file);

    const token = localStorage.getItem('auth_token');
    const response = await fetch(`${API_BASE_URL}/upload/${articleId}`, {
      method: 'POST',
      headers: {
        ...(token && { 'Authorization': `Bearer ${token}` })
      },
      body: formData
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to upload file');
    }

    return response.json();
  }

  async deleteAttachment(attachmentId: string): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/upload/attachment/${attachmentId}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders()
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to delete attachment');
    }

    return response.json();
  }
}

export const apiService = new ApiService();