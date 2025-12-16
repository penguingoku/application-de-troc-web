import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../config/api-config';

export interface AnnonceUser {
  id: number;
  username: string;
  nomComplet: string;
}

export interface Annonce {
  id: number;
  nomProduit: string;
  description: string;
  type: string;
  etat?: string;
  valeurEstimee?: number;
  photoProduit?: string;
  valide: boolean;
  actif: boolean;
  ouverte: boolean;
  produitRecherche?: string;
  dateCreation?: string;
  dateModification?: string;
  user?: AnnonceUser;
}

export interface SaveAnnoncePayload {
  nomProduit: string;
  description: string;
  type: string;
  etat?: string;
  valeurEstimee?: number | null;
  photoProduit?: string;
  ouverte?: boolean;
  produitRecherche?: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class AnnoncesService {
  private readonly baseUrl = `${API_BASE_URL}/annonces`;

  constructor(private http: HttpClient) {}

  getAnnonces(): Observable<Annonce[]> {
    return this.http.get<Annonce[]>(this.baseUrl, { withCredentials: true });
  }

  createAnnonce(payload: SaveAnnoncePayload): Observable<Annonce> {
    return this.http.post<Annonce>(this.baseUrl, payload, { withCredentials: true });
  }

  updateAnnonce(id: number, payload: SaveAnnoncePayload): Observable<Annonce> {
    return this.http.put<Annonce>(`${this.baseUrl}/${id}`, payload, { withCredentials: true });
  }

  deleteAnnonce(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`, { withCredentials: true });
  }

  // Get user's own annonces
  getMesAnnonces(): Observable<Annonce[]> {
    return this.http.get<Annonce[]>(`${this.baseUrl}/mes-annonces`, { withCredentials: true });
  }

  // Get all annonces (admin only)
  getAllAnnonces(): Observable<Annonce[]> {
    return this.http.get<Annonce[]>(`${this.baseUrl}/all`, { withCredentials: true });
  }

  // Get annonce by ID
  getAnnonceById(id: number): Observable<Annonce> {
    return this.http.get<Annonce>(`${this.baseUrl}/${id}`, { withCredentials: true });
  }

  // Validate annonce (admin only)
  validerAnnonce(id: number): Observable<Annonce> {
    return this.http.put<Annonce>(`${this.baseUrl}/${id}/valider`, {}, { withCredentials: true });
  }

  // Get annonces by type
  getAnnoncesByType(type: string): Observable<Annonce[]> {
    return this.http.get<Annonce[]>(`${this.baseUrl}/type/${type}`, { withCredentials: true });
  }
}
