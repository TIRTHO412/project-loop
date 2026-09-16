export type SentimentType = "positive" | "neutral" | "negative";

export type FeedbackCategory = "performance" | "support" | "pricing" | "ux" | "feature_request" | "bug";

export interface FeedbackItem {
  id: string;
  organizationId?: string;
  customerName: string;
  customerEmail: string;
  customerCompany?: string;
  title: string;
  content: string;
  rating: number; // 1 to 5
  sentiment: SentimentType;
  sentimentScore: number; // 0.00 to 1.00
  category: FeedbackCategory;
  theme: string;
  source: "Intercom" | "Zendesk" | "G2" | "App Store" | "Email" | "Survey" | "Trustpilot";
  status: "new" | "reviewed" | "in_progress" | "resolved";
  createdAt: string;
}

export interface KpiMetric {
  title: string;
  value: string | number;
  change: string;
  changeType: "positive" | "negative" | "neutral";
  subtitle?: string;
}

export interface SentimentDistribution {
  name: string;
  value: number;
  color: string;
  percentage: number;
}

export interface ThemeMetric {
  theme: string;
  count: number;
  sentimentScore: number;
  trend: string;
  category: string;
}

export interface TimeSeriesPoint {
  date: string;
  total: number;
  positive: number;
  neutral: number;
  negative: number;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: "Admin" | "Analyst" | "Viewer";
  organization: string;
}
