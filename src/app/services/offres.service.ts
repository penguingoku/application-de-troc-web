import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../config/api-config';
import { Annonce } from './annonces.service';

export interface OffreUser {
  id: number;
  username: string;
  nomComplet: string;
}

export interface Offre {
  id: number;
  annonce: Annonce;
  user: OffreUser;
  message?: string;
  statut: 'EN_ATTENTE' | 'ACCEPTEE' | 'REFUSEE' | 'ANNULEE';
  nomProduit?: string;
  photoProduit?: string;
  etatProduit?: string;
  valeurEstimee?: number;
  dateCreation?: string;
  dateModification?: string;
}

export interface CreateOffrePayload {
  annonceId: number;
  message?: string;
  nomProduit?: string;
  photoProduit?: string;
  etatProduit?: string;
  valeurEstimee?: number;
}

export interface UpdateOffrePayload {
  message?: string;
  nomProduit?: string;
  photoProduit?: string;
  etatProduit?: string;
  valeurEstimee?: number;
}

@Injectable({
  providedIn: 'root'
})
export class OffresService {
  private readonly baseUrl = `${API_BASE_URL}/offres`;

  constructor(private http: HttpClient) {}

  // Get user's own offres (offres they made)
  getMesOffres(): Observable<Offre[]> {
    return this.http.get<Offre[]>(`${this.baseUrl}/mes-offres`, { withCredentials: true });
  }

  // Get offres received on user's annonces
  getOffresRecues(): Observable<Offre[]> {
    return this.http.get<Offre[]>(`${this.baseUrl}/offres-recues`, { withCredentials: true });
  }

  // Get all offres (admin only)
  getAllOffres(): Observable<Offre[]> {
    return this.http.get<Offre[]>(`${this.baseUrl}/all`, { withCredentials: true });
  }

  // Get offres for a specific annonce
  getOffresForAnnonce(annonceId: number): Observable<Offre[]> {
    return this.http.get<Offre[]>(`${this.baseUrl}/annonce/${annonceId}`, { withCredentials: true });
  }

  // Get offre by ID
  getOffreById(id: number): Observable<Offre> {
    return this.http.get<Offre>(`${this.baseUrl}/${id}`, { withCredentials: true });
  }

  // Create offre
  createOffre(payload: CreateOffrePayload): Observable<Offre> {
    return this.http.post<Offre>(this.baseUrl, payload, { withCredentials: true });
  }

  // Update offre
  updateOffre(id: number, payload: UpdateOffrePayload): Observable<Offre> {
    return this.http.put<Offre>(`${this.baseUrl}/${id}`, payload, { withCredentials: true });
  }

  // Delete offre
  deleteOffre(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`, { withCredentials: true });
  }

  // Accept offre
  accepterOffre(id: number): Observable<Offre> {
    return this.http.put<Offre>(`${this.baseUrl}/${id}/accepter`, {}, { withCredentials: true });
  }

  // Refuse offre
  refuserOffre(id: number): Observable<Offre> {
    return this.http.put<Offre>(`${this.baseUrl}/${id}/refuser`, {}, { withCredentials: true });
  }
}

