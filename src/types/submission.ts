export interface Submission {
  id: string;
  name: string;
  role: string;
  advice: string;
  hiringTrait: string;
  votes: number;
  color: string;
  createdAt: Date;
}

export type SortOption = 'top' | 'latest';

export interface SubmissionFormData {
  name: string;
  role: string;
  advice: string;
  hiringTrait: string;
  consent: boolean;
}

export interface ValidationErrors {
  name?: string;
  role?: string;
  advice?: string;
  hiringTrait?: string;
  consent?: string;
}
