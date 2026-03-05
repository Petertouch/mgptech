export type ProjectStatus = 'active' | 'completed' | 'paused';
export type InvestmentType = 'house_flipping' | 'new_construction';
export type PhaseStatus = 'pending' | 'in_progress' | 'completed';
export type DocumentType = 'contract' | 'legal' | 'report' | 'other';

export interface Project {
  id: string;
  name: string;
  slug: string;
  description: string;
  location: string;
  cover_image: string;
  current_phase: number;
  status: ProjectStatus;
  is_public: boolean;
  investment_type: InvestmentType;
  total_value: number;
  sqft: number | null;
  bedrooms: number | null;
  bathrooms: number | null;
  sale_value: number | null;
  created_at: string;
  updated_at: string;
}

export interface ProjectInvestor {
  id: string;
  project_id: string;
  investor_id: string;
  invested_amount: number;
  investment_date: string;
  notes: string;
  created_at: string;
}

export interface ProjectPhase {
  id: string;
  project_id: string;
  phase_number: number;
  phase_name: string;
  status: PhaseStatus;
  started_at: string | null;
  completed_at: string | null;
  report_url: string | null;
  notes: string;
  created_at: string;
  updated_at: string;
}

export interface PhasePhoto {
  id: string;
  phase_id: string;
  image_url: string;
  caption: string;
  uploaded_at: string;
}

export interface ProjectImage {
  id: string;
  project_id: string;
  image_url: string;
  sort_order: number;
  created_at: string;
}

export interface ProjectDocument {
  id: string;
  project_id: string;
  investor_id: string | null;
  name: string;
  document_url: string;
  document_type: DocumentType;
  uploaded_at: string;
}

export interface ProjectWithPhases extends Project {
  project_phases: ProjectPhase[];
  project_images?: ProjectImage[];
}

export interface ProjectWithInvestment extends Project {
  project_phases: ProjectPhase[];
  project_investors: ProjectInvestor[];
}

export interface PhaseWithPhotos extends ProjectPhase {
  phase_photos: PhasePhoto[];
}
