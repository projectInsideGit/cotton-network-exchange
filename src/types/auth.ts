export type UserRole = 'admin' | 'seller' | 'buyer' | 'transporter';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  name: string;
  company?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}