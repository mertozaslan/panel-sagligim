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
  excerpt?: string;
  authorId: string;
  author: {
    id: string;
    username: string;
    firstName: string;
    lastName: string;
    profilePicture?: string;
  };
  category: PostCategory;
  tags: string[];
  images: string[];
  isAnonymous: boolean;
  isSensitive: boolean;
  medicalAdvice: boolean;
  symptoms: string[];
  treatments: string[];
  likes: string[];
  dislikes: string[];
  views: number;
  isApproved: boolean;
  isReported: boolean;
  reportCount: number;
  likesCount: number;
  dislikesCount: number;
  commentCount: number;
  status: ContentStatus;
  moderationNotes?: string;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  comments?: Comment[];
}

export type PostCategory = 
  | 'diabetes'
  | 'heart-disease'
  | 'cancer'
  | 'mental-health'
  | 'arthritis'
  | 'asthma'
  | 'digestive'
  | 'neurological'
  | 'autoimmune'
  | 'other';

export interface PostFilters {
  page?: number;
  limit?: number;
  category?: string;
  sortBy?: 'createdAt' | 'likesCount' | 'views' | 'commentCount';
  sortOrder?: 'asc' | 'desc';
  search?: string;
}

export interface PostResponse {
  posts: Post[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalPosts: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface PostCreateData {
  title: string;
  content: string;
  category: PostCategory;
  tags: string[];
  images: string[];
  isAnonymous: boolean;
  isSensitive: boolean;
  medicalAdvice: boolean;
  symptoms: string[];
  treatments: string[];
}

export interface PostUpdateData {
  title?: string;
  content?: string;
  category?: PostCategory;
  tags?: string[];
  images?: string[];
  isAnonymous?: boolean;
  isSensitive?: boolean;
  medicalAdvice?: boolean;
  symptoms?: string[];
  treatments?: string[];
}

export interface PostReportData {
  reason: 'spam' | 'inappropriate' | 'harassment' | 'false_information' | 'other';
  description?: string;
}

// Comment Types
export interface Comment {
  id: string;
  postOrBlog: string;
  postType: 'Post' | 'Blog';
  author: {
    id: string;
    username: string;
    firstName: string;
    lastName: string;
    profilePicture?: string;
  };
  content: string;
  isAnonymous: boolean;
  likes: string[];
  dislikes: string[];
  isApproved: boolean;
  isReported: boolean;
  reportCount: number;
  parentComment?: string;
  replies?: string[];
  isHelpful: boolean;
  medicalAdvice: boolean;
  createdAt: Date;
  updatedAt: Date;
  // Virtual fields
  likeCount: number;
  dislikeCount: number;
  replyCount: number;
}

export interface CommentCreateData {
  content: string;
  isAnonymous?: boolean;
  parentComment?: string;
  postType?: 'Post' | 'Blog';
}

export interface CommentUpdateData {
  content?: string;
  isAnonymous?: boolean;
}

export interface CommentReportData {
  reason: string;
}

export interface CommentResponse {
  comments: Comment[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalComments: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface CommentFilters {
  page?: number;
  limit?: number;
  postType?: 'Post' | 'Blog';
}

// Blog Types
export interface Blog {
  id: string;
  author: {
    id: string;
    username: string;
    firstName: string;
    lastName: string;
    profilePicture?: string;
  };
  title: string;
  content: string;
  excerpt?: string;
  category: BlogCategory;
  tags: string[];
  images: string[];
  featuredImage?: string;
  isPublished: boolean;
  isFeatured: boolean;
  readingTime: number;
  likes: string[];
  dislikes: string[];
  views: number;
  commentCount: number;
  isApproved: boolean;
  isReported: boolean;
  reportCount: number;
  medicalDisclaimer?: string;
  references: {
    title: string;
    url: string;
  }[];
  seoTitle?: string;
  seoDescription?: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
  // Virtual fields
  likesCount: number;
  dislikesCount: number;
}

export type BlogCategory = 
  | 'medical-advice'
  | 'health-tips'
  | 'disease-information'
  | 'treatment-guides'
  | 'prevention'
  | 'nutrition'
  | 'mental-health'
  | 'pediatrics'
  | 'geriatrics'
  | 'emergency-care'
  | 'research'
  | 'other';

export interface BlogCreateData {
  title: string;
  content: string;
  excerpt?: string;
  category: BlogCategory;
  tags?: string[];
  images?: string[];
  featuredImage?: string;
  isPublished?: boolean;
  isFeatured?: boolean;
  medicalDisclaimer?: string;
  references?: {
    title: string;
    url: string;
  }[];
  seoTitle?: string;
  seoDescription?: string;
}

export interface BlogUpdateData {
  title?: string;
  content?: string;
  excerpt?: string;
  category?: BlogCategory;
  tags?: string[];
  images?: string[];
  featuredImage?: string;
  isPublished?: boolean;
  isFeatured?: boolean;
  medicalDisclaimer?: string;
  references?: {
    title: string;
    url: string;
  }[];
  seoTitle?: string;
  seoDescription?: string;
}

export interface BlogReportData {
  reason: string;
}

export interface BlogResponse {
  blogs: Blog[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalBlogs: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  trendCategories?: {
    name: string;
    count: number;
  }[];
}

export interface BlogFilters {
  page?: number;
  limit?: number;
  category?: BlogCategory;
  author?: string;
  search?: string;
  featured?: boolean;
  published?: boolean;
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
  author: {
    id: string;
    username: string;
    firstName: string;
    lastName: string;
    profilePicture?: string;
  };
  postId?: string;
  questionId?: string;
  parentId?: string; // for replies
  status: ContentStatus;
  createdAt: Date;
  updatedAt: Date;
  likes: string[];
  replies?: string[];
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

// Dashboard Types
export interface DashboardStats {
  general: {
    totalUsers: number;
    totalPosts: number;
    totalBlogs: number;
    totalEvents: number;
    totalComments: number;
    totalDiseases: number;
  };
  users: {
    activeUsers: number;
    verifiedUsers: number;
    doctors: number;
    patients: number;
    admins: number;
  };
  recent: {
    newUsers: number;
    newPosts: number;
    newBlogs: number;
    newEvents: number;
    newComments: number;
  };
  topContent: {
    topLikedPosts: any[];
    topViewedPosts: any[];
    topLikedBlogs: any[];
    topViewedBlogs: any[];
    topLikedComments: any[];
    topEvents: any[];
  };
  topUsers: {
    topPosters: any[];
    topBloggers: any[];
    topCommenters: any[];
    topEventParticipants: any[];
  };
  recentUsers: any[];
  categories: {
    postCategories: any[];
    blogCategories: any[];
    eventCategories: any[];
  };
  interactions: {
    totalPostLikes: number;
    totalBlogLikes: number;
    totalCommentLikes: number;
    totalPostViews: number;
    totalBlogViews: number;
  };
  recentActivity: {
    newUsers: number;
    newPosts: number;
    newBlogs: number;
    newEvents: number;
    newComments: number;
  };
}

export interface TopContentItem {
  _id: string;
  title: string;
  content: string;
  category: string;
  likes: string[];
  views: number;
  createdAt: string;
  author: {
    _id: string;
    username: string;
    firstName: string;
    lastName: string;
    role: string;
  };
}

export interface TopUser {
  userId: string;
  username: string;
  firstName: string;
  lastName: string;
  role: string;
  profilePicture?: string;
  postCount?: number;
  blogCount?: number;
  commentCount?: number;
  eventCount?: number;
  totalLikes?: number;
  totalViews?: number;
}

export interface CategoryStats {
  _id: string;
  count: number;
  totalLikes?: number;
  totalViews?: number;
  totalParticipants?: number;
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
