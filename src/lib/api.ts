import axios, { AxiosInstance } from 'axios';

// Create axios instance with base configuration
const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Mock data fallbacks
const mockUsers = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'employee', department: 'Marketing' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'finance_manager', department: 'Finance' },
  { id: 3, name: 'Admin User', email: 'admin@example.com', role: 'admin', department: 'Management' },
];

const mockRequests = [
  {
    id: 1,
    type: 'link_building',
    status: 'approved',
    vendorName: 'LinkCorp Solutions',
    invoiceNumber: 'INV-2024-001',
    invoiceDate: '2024-01-15',
    totalAmount: 2500,
    currency: 'USD',
    items: [
      { client: 'Client A', description: 'SEO Content Creation', amount: 1000 },
      { client: 'Client B', description: 'Link Building Campaign', amount: 1500 },
    ],
    note: 'Q1 2024 campaign',
    managerNote: 'Approved for payment',
    createdAt: '2024-01-10',
    createdBy: 1,
  },
  {
    id: 2,
    type: 'salary',
    status: 'pending',
    employeeName: 'John Doe',
    employeeAddress: '123 Main St, City, State',
    position: 'Senior Marketing Manager',
    invoiceNumber: 'SAL-2024-001',
    date: '2024-01-31',
    description: 'January 2024 Salary',
    amount: 5000,
    currency: 'USD',
    totalAmount: 5000,
    note: 'Regular monthly salary',
    createdAt: '2024-01-25',
    createdBy: 1,
  },
  {
    id: 3,
    type: 'tools',
    status: 'rejected',
    templateType: 'tools',
    toolName: 'SEMrush Pro',
    toolCategory: 'SEO Analytics',
    paymentFrequency: 'monthly',
    description: 'Professional SEO tool subscription',
    amount: 229,
    currency: 'USD',
    totalAmount: 229,
    note: 'Annual subscription requested',
    managerNote: 'Budget exceeded for this quarter',
    createdAt: '2024-01-20',
    createdBy: 1,
  },
];

// Auth API
export const authAPI = {
  login: async (email: string, password: string) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      return response.data;
    } catch (error) {
      // Mock fallback
      console.warn('API unavailable, using mock data');
      const user = mockUsers.find((u) => u.email === email);
      if (user && password === 'password') {
        return {
          token: 'mock-token-' + Date.now(),
          user,
        };
      }
      throw new Error('Invalid credentials');
    }
  },

  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.warn('API unavailable for logout');
    }
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
  },

  getCurrentUser: async () => {
    try {
      const response = await api.get('/auth/me');
      return response.data;
    } catch (error) {
      // Return mock user from localStorage
      const userStr = localStorage.getItem('user');
      if (userStr) {
        return JSON.parse(userStr);
      }
      throw error;
    }
  },
};

// Payment Requests API
export const requestsAPI = {
  getAll: async (filters?: any) => {
    try {
      const response = await api.get('/payment-requests', { params: filters });
      return response.data;
    } catch (error) {
      console.warn('API unavailable, using mock data');
      return { data: mockRequests, total: mockRequests.length };
    }
  },

  getById: async (id: number) => {
    try {
      const response = await api.get(`/payment-requests/${id}`);
      return response.data;
    } catch (error) {
      console.warn('API unavailable, using mock data');
      return mockRequests.find((r) => r.id === id);
    }
  },

  create: async (data: any) => {
    try {
      const response = await api.post('/payment-requests', data);
      return response.data;
    } catch (error) {
      console.warn('API unavailable, returning mock response');
      return {
        id: Math.floor(Math.random() * 10000),
        ...data,
        status: 'pending',
        createdAt: new Date().toISOString(),
      };
    }
  },

  update: async (id: number, data: any) => {
    try {
      const response = await api.put(`/payment-requests/${id}`, data);
      return response.data;
    } catch (error) {
      console.warn('API unavailable, returning mock response');
      return { ...data, id, updatedAt: new Date().toISOString() };
    }
  },

  approve: async (id: number, comment: string) => {
    try {
      const response = await api.post(`/payment-requests/${id}/approve`, { comment });
      return response.data;
    } catch (error) {
      console.warn('API unavailable, returning mock response');
      return { id, status: 'approved', managerNote: comment };
    }
  },

  reject: async (id: number, comment: string) => {
    try {
      const response = await api.post(`/payment-requests/${id}/reject`, { comment });
      return response.data;
    } catch (error) {
      console.warn('API unavailable, returning mock response');
      return { id, status: 'rejected', managerNote: comment };
    }
  },

  uploadFile: async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await api.post('/files/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (error) {
      console.warn('API unavailable, returning mock file URL');
      return { url: URL.createObjectURL(file), filename: file.name };
    }
  },
};

// Users API (Admin)
export const usersAPI = {
  getAll: async () => {
    try {
      const response = await api.get('/users');
      return response.data;
    } catch (error) {
      console.warn('API unavailable, using mock data');
      return mockUsers;
    }
  },

  updateRole: async (userId: number, role: string) => {
    try {
      const response = await api.put(`/users/${userId}/role`, { role });
      return response.data;
    } catch (error) {
      console.warn('API unavailable, returning mock response');
      return { userId, role, updatedAt: new Date().toISOString() };
    }
  },
};

export default api;
