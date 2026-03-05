export type UserRole = 'super_admin' | 'investor';

export interface Profile {
  id: string;
  role: UserRole;
  full_name: string;
  email: string;
  phone: string;
  created_at: string;
  updated_at: string;
}
