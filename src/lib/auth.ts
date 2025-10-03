export interface User {
  id: number;
  name: string;
  email: string;
  role: 'employee' | 'finance_manager' | 'admin' | 'manager';
  department?: string;
}

export const setAuth = (token: string, user: User) => {
  localStorage.setItem('auth_token', token);
  localStorage.setItem('user', JSON.stringify(user));
};

export const getAuth = (): { token: string | null; user: User | null } => {
  const token = localStorage.getItem('auth_token');
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  return { token, user };
};

export const clearAuth = () => {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('user');
};

export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem('auth_token');
};

export const hasRole = (role: string | string[]): boolean => {
  const { user } = getAuth();
  if (!user) return false;
  if (Array.isArray(role)) {
    return role.includes(user.role);
  }
  return user.role === role;
};
