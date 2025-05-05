export interface Paper {
  id: string;
  title: string;
  abstract: string;
  keywords: string[];
  status: 'submitted' | 'under-review' | 'accepted' | 'rejected';
  submissionDate: string;
  lastUpdated: string;
  reviewCount: number;
}

export interface Review {
  id: string;
  paperId: string;
  reviewerId: string;
  status: 'pending' | 'in-progress' | 'completed';
  dueDate: string;
  expertise: string[];
  comments: ReviewComment[];
  rating: number;
}

export interface ReviewComment {
  id: string;
  section: string;
  content: string;
  timestamp: string;
  isPrivate: boolean;
}

export interface User {
  id: string;
  email: string;
  expertise: string[];
  verified: boolean;
  role: 'author' | 'reviewer' | 'editor';
}

export interface ExpertiseVerification {
  id: string;
  userId: string;
  expertise: string[];
  verificationDate: string;
  proof: string;
}

export interface EmailVerification {
  id: string;
  userId: string;
  email: string;
  verificationDate: string;
  proof: string;
} 