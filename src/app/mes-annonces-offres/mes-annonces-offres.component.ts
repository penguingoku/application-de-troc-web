




































































































































































































































































 import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth';
import { AnnoncesService, Annonce } from '../services/annonces.service';
import { OffresService, Offre } from '../services/offres.service';

@Component({
  selector: 'app-mes-annonces-offres',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './mes-annonces-offres.html',
  styleUrls: ['./mes-annonces-offres.css']
})
export class MesAnnoncesOffresComponent implements OnInit {
  activeTab: 'annonces' | 'mes-offres' | 'offres-recues' = 'annonces';
  
  mesAnnonces: Annonce[] = [];
  mesOffres: Offre[] = [];
  offresRecues: Offre[] = [];
  
  loading = false;
  error = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private annoncesService: AnnoncesService,
    private offresService: OffresService
  ) {}

  ngOnInit(): void {
    this.loadAnnonces();
  }

  switchTab(tab: 'annonces' | 'mes-offres' | 'offres-recues'): void {
    this.activeTab = tab;
    this.error = '';
    
    if (tab === 'annonces') {
      this.loadAnnonces();
    } else if (tab === 'mes-offres') {
      this.loadMesOffres();
    } else if (tab === 'offres-recues') {
      this.loadOffresRecues();
    }
  }

  loadAnnonces(): void {
    this.loading = true;
    this.error = '';
    this.annoncesService.getMesAnnonces().subscribe({
      next: (annonces: Annonce[]) => {
        this.mesAnnonces = annonces;
        this.loading = false;
      },
      error: (err: any) => {
        this.error = 'Impossible de charger vos annonces.';
        this.loading = false;
      }
    });
  }

  loadMesOffres(): void {
    this.loading = true;
    this.error = '';
    this.offresService.getMesOffres().subscribe({
      next: offres => {
        this.mesOffres = offres;
        this.loading = false;
      },
      error: err => {
        this.error = 'Impossible de charger vos offres.';
        this.loading = false;
      }
    });
  }

  loadOffresRecues(): void {
    this.loading = true;
    this.error = '';
    this.offresService.getOffresRecues().subscribe({
      next: offres => {
        this.offresRecues = offres;
        this.loading = false;
      },
      error: err => {
        this.error = 'Impossible de charger les offres reçues.';
        this.loading = false;
      }
    });
  }

  deleteAnnonce(id: number): void {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette annonce ?')) {
      return;
    }

    this.annoncesService.deleteAnnonce(id).subscribe({
      next: () => this.loadAnnonces(),
      error: () => alert('Suppression impossible pour le moment.')
    });
  }

  deleteOffre(id: number): void {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette offre ?')) {
      return;
    }

    this.offresService.deleteOffre(id).subscribe({
      next: () => {
        if (this.activeTab === 'mes-offres') {
          this.loadMesOffres();
        } else {
          this.loadOffresRecues();
        }
      },
      error: () => alert('Suppression impossible pour le moment.')
    });
  }

  accepterOffre(id: number): void {
    if (!confirm('Êtes-vous sûr de vouloir accepter cette offre ?')) {
      return;
    }

    this.offresService.accepterOffre(id).subscribe({
      next: () => {
        this.loadOffresRecues();
        alert('Offre acceptée avec succès !');
      },
      error: err => {
        alert(err?.error?.error || 'Impossible d\'accepter l\'offre.');
      }
    });
  }

  refuserOffre(id: number): void {
    if (!confirm('Êtes-vous sûr de vouloir refuser cette offre ?')) {
      return;
    }

    this.offresService.refuserOffre(id).subscribe({
      next: () => {
        this.loadOffresRecues();
        alert('Offre refusée.');
      },
      error: err => {
        alert(err?.error?.error || 'Impossible de refuser l\'offre.');
      }
    });
  }

  getStatutBadgeClass(statut: string): string {
    switch (statut) {
      case 'ACCEPTEE':
        return 'badge-success';
      case 'REFUSEE':
        return 'badge-danger';
      case 'ANNULEE':
        return 'badge-warning';
      default:
        return 'badge-info';
    }
  }

  getStatutLabel(statut: string): string {
    switch (statut) {
      case 'ACCEPTEE':
        return 'Acceptée';
      case 'REFUSEE':
        return 'Refusée';
      case 'ANNULEE':
        return 'Annulée';
      default:
        return 'En attente';
    }
  }

  formatDate(dateString?: string): string {
    if (!dateString) {
      return '';
    }
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  navigateToAnnonce(annonceId: number): void {
    this.router.navigate(['/'], { queryParams: { annonceId } });
  }

  logout(): void {
    this.authService.logout().subscribe(() => this.router.navigate(['/login']));
  }

  getUsername(): string | null {
    return this.authService.getUsername();
  }
}

