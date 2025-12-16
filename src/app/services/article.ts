import { Injectable } from '@angular/core';

export interface Article {
  id: string;
  name: string;
  description: string;
  image: string; // Base64 or URL
  author: string;
  createdAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class ArticleService {
  private readonly STORAGE_KEY = 'articles';

  constructor() {}

  getArticles(): Article[] {
    const articles = localStorage.getItem(this.STORAGE_KEY);
    return articles ? JSON.parse(articles) : [];
  }

  getArticlesByAuthor(author: string): Article[] {
    const articles = this.getArticles();
    return articles.filter(a => a.author === author);
  }

  isArticleOwner(articleId: string): boolean {
    const article = this.getArticleById(articleId);
    const currentUser = this.getCurrentUser();
    return article ? article.author === currentUser : false;
  }

  addArticle(article: Omit<Article, 'id' | 'author' | 'createdAt'>): boolean {
    try {
      const articles = this.getArticles();
      const newArticle: Article = {
        ...article,
        id: this.generateId(),
        author: this.getCurrentUser() || 'Anonymous',
        createdAt: new Date().toISOString()
      };
      articles.unshift(newArticle); // Add to beginning
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(articles));
      return true;
    } catch (error) {
      console.error('Error adding article:', error);
      return false;
    }
  }

  updateArticle(id: string, updates: Partial<Omit<Article, 'id' | 'author' | 'createdAt'>>): boolean {
    try {
      const articles = this.getArticles();
      const index = articles.findIndex(a => a.id === id);
      
      if (index === -1) {
        return false;
      }

      // Check if user owns this article
      const currentUser = this.getCurrentUser();
      if (articles[index].author !== currentUser) {
        console.error('User does not own this article');
        return false;
      }
      
      articles[index] = {
        ...articles[index],
        ...updates
      };
      
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(articles));
      return true;
    } catch (error) {
      console.error('Error updating article:', error);
      return false;
    }
  }

  getArticleById(id: string): Article | null {
    const articles = this.getArticles();
    return articles.find(a => a.id === id) || null;
  }

  deleteArticle(id: string): boolean {
    try {
      const articles = this.getArticles();
      const article = articles.find(a => a.id === id);
      
      if (!article) {
        return false;
      }

      // Check if user owns this article
      const currentUser = this.getCurrentUser();
      if (article.author !== currentUser) {
        console.error('User does not own this article');
        return false;
      }

      const filtered = articles.filter(a => a.id !== id);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filtered));
      return true;
    } catch (error) {
      console.error('Error deleting article:', error);
      return false;
    }
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  }

  private getCurrentUser(): string | null {
    return localStorage.getItem('username');
  }
}

