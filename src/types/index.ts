export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: 'user' | 'expert' | 'admin';
  status: 'active' | 'blocked' | 'pending';
  createdAt: Date;
  lastLogin?: Date;
  profile?: UserProfile;
}

export interface UserProfile {
  bio?: string;
  location?: string;
  interests?: string[];
  healthConditions?: string[];
}

export interface Expert extends User {
  role: 'expert';
  specializations: Specialization[];
  certifications: Certification[];
  experience: number; // years
  rating: number;
  totalConsultations: number;
  verificationStatus: 'pending' | 'verified' | 'rejected';
  verificationDocuments: Document[];
}

export interface Specialization {
  id: string;
  name: string;
  description?: string;
  category: SpecializationCategory;
}

export type SpecializationCategory = 
  | 'nutrition'
  | 'fitness'
  | 'mental-health'
  | 'cardiology'
  | 'dermatology'
  | 'pediatrics'
  | 'general-medicine'
  | 'other';

export interface Certification {
  id: string;
  title: string;
  institution: string;
  year: number;
  documentUrl?: string;
  verified: boolean;
}

export interface Document {
  id: string;
  name: string;
  url: string;
  type: 'certificate' | 'diploma' | 'license' | 'other';
  uploadedAt: Date;
  verified: boolean;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  authorId: string;
  author: User;
  category: ContentCategory;
  tags: string[];
  status: ContentStatus;
  moderationNotes?: string;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  likes: number;
  views: number;
  comments: Comment[];
}

export interface Question {
  id: string;
  title: string;
  content: string;
  authorId: string;
  author: User;
  category: ContentCategory;
  tags: string[];
  status: QuestionStatus;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  expertId?: string;
  expert?: Expert;
  answers: Answer[];
  createdAt: Date;
  updatedAt: Date;
  deadline?: Date;
}

export interface Answer {
  id: string;
  questionId: string;
  content: string;
  authorId: string;
  author: Expert;
  status: 'draft' | 'published';
  helpful: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Comment {
  id: string;
  content: string;
  authorId: string;
  author: User;
  postId?: string;
  questionId?: string;
  parentId?: string; // for replies
  status: ContentStatus;
  createdAt: Date;
  updatedAt: Date;
  likes: number;
  replies?: Comment[];
}

export type ContentCategory = 
  | 'nutrition'
  | 'fitness'
  | 'mental-health'
  | 'lifestyle'
  | 'diseases'
  | 'prevention'
  | 'wellness'
  | 'other';

export type ContentStatus = 
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'draft'
  | 'published';

export type QuestionStatus = 
  | 'open'
  | 'assigned'
  | 'answered'
  | 'resolved'
  | 'closed';

export interface Event {
  id: string;
  title: string;
  description: string;
  category: string;
  instructor: string;
  instructorTitle?: string;
  date: string;
  endDate: string;
  location?: string;
  locationAddress?: string;
  maxParticipants: number;
  currentParticipants: number;
  price: number;
  isOnline: boolean;
  organizer: string;
  organizerType: 'government' | 'private' | 'ngo' | 'individual' | 'hospital' | 'university';
  tags: string[];
  requirements?: string;
  publishDate: string;
  status: 'pending' | 'active' | 'full' | 'completed' | 'cancelled' | 'rejected';
  authorId: string;
  image?: string;
  isRegistered?: boolean;
  canRegister?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface EventParticipant {
  userId: string;
  user: User;
  registeredAt: Date;
  attended?: boolean;
}

export type EventCategory = 
  | 'Meditasyon'
  | 'Yoga'
  | 'Beslenme'
  | 'Egzersiz'
  | 'Psikoloji'
  | 'Tıp'
  | 'Alternatif Tıp'
  | 'Sağlık Teknolojisi'
  | 'workshop'
  | 'seminar'
  | 'consultation'
  | 'group-therapy'
  | 'fitness-class'
  | 'nutrition-session'
  | 'other';

export interface Report {
  id: string;
  reporterId: string;
  reporter: User;
  contentType: 'post' | 'question' | 'comment' | 'user';
  contentId: string;
  reason: ReportReason;
  description?: string;
  status: 'pending' | 'reviewed' | 'resolved' | 'dismissed';
  reviewedBy?: string;
  reviewNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type ReportReason = 
  | 'spam'
  | 'inappropriate'
  | 'misinformation'
  | 'harassment'
  | 'copyright'
  | 'other';

export interface DashboardStats {
  totalUsers: number;
  totalExperts: number;
  newUsersThisWeek: number;
  postsThisMonth: number;
  questionsThisMonth: number;
  answersThisMonth: number;
  pendingExpertApplications: number;
  pendingContentModeration: number;
  unansweredQuestions: number;
  reportedContent: number;
  activeEvents: number;
}

export interface ActivityLog {
  id: string;
  userId: string;
  user: User;
  action: ActivityAction;
  description: string;
  metadata?: Record<string, any>;
  createdAt: Date;
}

export type ActivityAction = 
  | 'user_registered'
  | 'expert_applied'
  | 'expert_verified'
  | 'post_published'
  | 'question_asked'
  | 'question_answered'
  | 'event_created'
  | 'content_reported'
  | 'content_moderated';

export interface SystemSettings {
  id: string;
  categories: ContentCategory[];
  specializations: Specialization[];
  moderationRules: ModerationRule[];
  eventCategories: EventCategory[];
  autoApprovalEnabled: boolean;
  expertVerificationRequired: boolean;
  maxQuestionResponseTime: number; // hours
  updatedAt: Date;
}

export interface ModerationRule {
  id: string;
  name: string;
  description: string;
  contentType: 'post' | 'question' | 'comment';
  criteria: string[];
  action: 'flag' | 'auto_reject' | 'require_review';
  enabled: boolean;
}
