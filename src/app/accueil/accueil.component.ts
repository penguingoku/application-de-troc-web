import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth';
import { AnnoncesService, Annonce } from '../services/annonces.service';
import { OffresService, CreateOffrePayload } from '../services/offres.service';

@Component({
  selector: 'app-accueil',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './accueil.html',
  styleUrls: ['./accueil.css']
})
export class AccueilComponent implements OnInit {
  annonces: Annonce[] = [];
  loading = false;
  saving = false;
  pageError = '';
  formError = '';
  showModal = false;
  showOfferModal = false;
  selectedAnnonceForOffer: Annonce | null = null;
  editingAnnonceId: number | null = null;
  nomProduit = '';
  description = '';
  type = 'AUTRE';
  etat = 'Bon état';
  valeurEstimee: number | null = null;
  photoProduit = '';
  ouverte = true;
  produitRecherche = '';
  imagePreview = '';
  
  // Offer form
  offerMessage = '';
  offerNomProduit = '';
  offerPhotoProduit = '';
  offerEtatProduit = 'Bon état';
  offerValeurEstimee: number | null = null;
  offerImagePreview = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private annoncesService: AnnoncesService,
    private offresService: OffresService
  ) {}

  ngOnInit(): void {
    this.fetchAnnonces();
    
    // Check if we need to scroll to a specific annonce
    this.route.queryParams.subscribe(params => {
      if (params['annonceId']) {
        setTimeout(() => {
          const element = document.querySelector(`[data-annonce-id="${params['annonceId']}"]`);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 500);
      }
    });
  }

  fetchAnnonces(): void {
    this.loading = true;
    this.pageError = '';

    this.annoncesService.getAnnonces().subscribe({
      next: annonces => {
        this.annonces = annonces;
        this.loading = false;
      },
      error: () => {
        this.pageError = 'Impossible de charger les annonces pour le moment.';
        this.loading = false;
      }
    });
  }

  isAnnonceOwner(annonce: Annonce): boolean {
    const currentUser = this.authService.getUsername();
    return annonce.user?.username === currentUser;
  }

  openAddAnnonceModal(): void {
    this.resetForm();
    this.showModal = true;
  }

  openEditAnnonceModal(annonce: Annonce): void {
    this.editingAnnonceId = annonce.id;
    this.nomProduit = annonce.nomProduit;
    this.description = annonce.description;
    this.type = annonce.type;
    this.etat = annonce.etat || 'Bon état';
    this.valeurEstimee = annonce.valeurEstimee ?? null;
    this.photoProduit = annonce.photoProduit || '';
    this.ouverte = annonce.ouverte;
    this.produitRecherche = annonce.produitRecherche || '';
    this.imagePreview = annonce.photoProduit || '';
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.editingAnnonceId = null;
  }

  resetForm(): void {
    this.editingAnnonceId = null;
    this.nomProduit = '';
    this.description = '';
    this.type = 'AUTRE';
    this.etat = 'Bon état';
    this.valeurEstimee = null;
    this.photoProduit = '';
    this.ouverte = true;
    this.produitRecherche = '';
    this.imagePreview = '';
    this.formError = '';
  }

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();

      reader.onload = (e: ProgressEvent<FileReader>) => {
        if (e.target?.result) {
          this.photoProduit = e.target.result as string;
          this.imagePreview = this.photoProduit;
        }
      };

      reader.readAsDataURL(file);
    }
  }

  saveAnnonce(): void {
    if (!this.nomProduit.trim() || !this.description.trim()) {
      this.formError = 'Veuillez remplir tous les champs obligatoires.';
      return;
    }

    this.saving = true;
    const payload = {
      nomProduit: this.nomProduit,
      description: this.description,
      type: this.type,
      etat: this.etat,
      valeurEstimee: this.valeurEstimee,
      photoProduit: this.photoProduit,
      ouverte: this.ouverte,
      produitRecherche: this.ouverte ? null : this.produitRecherche
    };

    const request$ = this.editingAnnonceId
      ? this.annoncesService.updateAnnonce(this.editingAnnonceId, payload)
      : this.annoncesService.createAnnonce(payload);

    request$.subscribe({
      next: () => {
        this.saving = false;
        this.fetchAnnonces();
        this.closeModal();
      },
      error: err => {
        this.saving = false;
        this.formError =
          err?.error?.message ?? 'Impossible de sauvegarder l\'annonce pour le moment.';
      }
    });
  }

  isEditMode(): boolean {
    return this.editingAnnonceId !== null;
  }

  deleteAnnonce(id: number): void {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette annonce ?')) {
      return;
    }

    this.annoncesService.deleteAnnonce(id).subscribe({
      next: () => this.fetchAnnonces(),
      error: () => alert('Suppression impossible pour le moment.')
    });
  }

  logout(): void {
    this.authService.logout().subscribe(() => this.router.navigate(['/login']));
  }

  getUsername(): string | null {
    return this.authService.getUsername();
  }

  getEmail(): string | null {
    return this.authService.getEmail();
  }

  openOfferModal(annonce: Annonce): void {
    // Don't allow users to make offers on their own annonces
    if (this.isAnnonceOwner(annonce)) {
      alert('Vous ne pouvez pas faire une offre sur votre propre annonce.');
      return;
    }
    
    this.selectedAnnonceForOffer = annonce;
    this.resetOfferForm();
    this.showOfferModal = true;
  }

  closeOfferModal(): void {
    this.showOfferModal = false;
    this.selectedAnnonceForOffer = null;
  }

  resetOfferForm(): void {
    this.offerMessage = '';
    this.offerNomProduit = '';
    this.offerPhotoProduit = '';
    this.offerEtatProduit = 'Bon état';
    this.offerValeurEstimee = null;
    this.offerImagePreview = '';
  }

  onOfferImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();

      reader.onload = (e: ProgressEvent<FileReader>) => {
        if (e.target?.result) {
          this.offerPhotoProduit = e.target.result as string;
          this.offerImagePreview = this.offerPhotoProduit;
        }
      };

      reader.readAsDataURL(file);
    }
  }

  submitOffer(): void {
    if (!this.selectedAnnonceForOffer) {
      return;
    }

    if (!this.offerMessage.trim() && !this.offerNomProduit.trim()) {
      alert('Veuillez remplir au moins le message ou le nom du produit proposé.');
      return;
    }

    const payload: CreateOffrePayload = {
      annonceId: this.selectedAnnonceForOffer.id,
      message: this.offerMessage || undefined,
      nomProduit: this.offerNomProduit || undefined,
      photoProduit: this.offerPhotoProduit || undefined,
      etatProduit: this.offerEtatProduit || undefined,
      valeurEstimee: this.offerValeurEstimee || undefined
    };

    this.offresService.createOffre(payload).subscribe({
      next: () => {
        alert('Offre créée avec succès !');
        this.closeOfferModal();
        this.fetchAnnonces();
      },
      error: err => {
        alert(err?.error?.error || 'Impossible de créer l\'offre pour le moment.');
      }
    });
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

  isAdmin(): boolean {
    return this.authService.isAdmin();
  }
}