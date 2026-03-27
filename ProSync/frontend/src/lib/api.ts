import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Redirect to login if unauthorized (but not if already on login/register page)
      if (typeof window !== 'undefined') {
        const currentPath = window.location.pathname
        if (currentPath !== '/login' && currentPath !== '/register') {
          window.location.href = '/login'
        }
      }
    }
    return Promise.reject(error)
  }
)

// Auth API
export const authAPI = {
  register: (data: any) => api.post('/auth/register', data),
  login: (data: any) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data: any) => api.put('/auth/profile', data),
}

// Users API
export const usersAPI = {
  getAll: (params?: any) => api.get('/users', { params }),
  getById: (id: string) => api.get(`/users/${id}`),
}

// Projects API
export const projectsAPI = {
  getAll: (params?: any) => api.get('/projects', { params }),
  getById: (id: string) => api.get(`/projects/${id}`),
  create: (data: any) => api.post('/projects', data),
  update: (id: string, data: any) => api.put(`/projects/${id}`, data),
  delete: (id: string) => api.delete(`/projects/${id}`),
  updateProgress: (id: string) => api.put(`/projects/${id}/progress`),
}

// Milestones API
export const milestonesAPI = {
  create: (data: any) => api.post('/milestones', data),
  getByProject: (projectId: string) => api.get(`/milestones/project/${projectId}`),
  update: (id: string, data: any) => api.put(`/milestones/${id}`, data),
  approve: (id: string) => api.post(`/milestones/${id}/approve`),
  reject: (id: string, data: any) => api.post(`/milestones/${id}/reject`, data),
  addDeliverable: (id: string, data: any) => api.post(`/milestones/${id}/deliverables`, data),
}

// Tasks API
export const tasksAPI = {
  create: (data: any) => api.post('/tasks', data),
  getByProject: (projectId: string, params?: any) => api.get(`/tasks/project/${projectId}`, { params }),
  getById: (id: string) => api.get(`/tasks/${id}`),
  update: (id: string, data: any) => api.put(`/tasks/${id}`, data),
  delete: (id: string) => api.delete(`/tasks/${id}`),
  addComment: (id: string, data: any) => api.post(`/tasks/${id}/comments`, data),
}

// Notifications API
export const notificationsAPI = {
  getAll: (params?: any) => api.get('/notifications', { params }),
  markAsRead: (id: string) => api.put(`/notifications/${id}/read`),
  markAllAsRead: () => api.put('/notifications/read-all'),
  delete: (id: string) => api.delete(`/notifications/${id}`),
}
