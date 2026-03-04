export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  cover_image: string | null;
  meta_description: string;
  author: string;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  is_published: boolean;
  tags: string[];
  reading_time: number;
}

export interface BlogPostSummary {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  cover_image: string | null;
  author: string;
  published_at: string;
  tags: string[];
  reading_time: number;
}
