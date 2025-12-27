/**
 * Admin API Service
 * Centralized API calls for all admin endpoints
 */

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// Helper function to get auth token
const getAuthToken = () => localStorage.getItem('token');

// Helper function for API calls
const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  const token = getAuthToken();
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }

  return response.json();
};

// ==================== AUDIT LOGS ====================
export const getAuditLogs = async (filters?: {
  action?: string;
  user?: number;
  model?: string;
  limit?: number;
}) => {
  const params = new URLSearchParams();
  if (filters?.action) params.append('action', filters.action);
  if (filters?.user) params.append('user', filters.user.toString());
  if (filters?.model) params.append('model', filters.model);
  if (filters?.limit) params.append('limit', filters.limit.toString());

  return apiCall(`/admin/audit-logs/?${params.toString()}`);
};

// ==================== CMS - EXERCISES ====================
export const getExercises = () => apiCall('/admin/cms/exercises/');

export const createExercise = (data: {
  name: string;
  description: string;
  difficulty: string;
  target_joints: string;
}) => apiCall('/admin/cms/exercises/', {
  method: 'POST',
  body: JSON.stringify(data),
});

export const updateExercise = (id: number, data: Partial<{
  name: string;
  description: string;
  difficulty: string;
  target_joints: string;
}>) => apiCall(`/admin/cms/exercises/${id}/`, {
  method: 'PUT',
  body: JSON.stringify(data),
});

export const deleteExercise = (id: number) =>
  apiCall(`/admin/cms/exercises/${id}/`, { method: 'DELETE' });

// ==================== CMS - NUTRITION ====================
export const getNutritionFoods = () => apiCall('/admin/cms/nutrition/foods/');

export const createNutritionFood = (data: any) =>
  apiCall('/admin/cms/nutrition/foods/', {
    method: 'POST',
    body: JSON.stringify(data),
  });

export const updateNutritionFood = (id: number, data: any) =>
  apiCall(`/admin/cms/nutrition/foods/${id}/`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });

export const deleteNutritionFood = (id: number) =>
  apiCall(`/admin/cms/nutrition/foods/${id}/`, { method: 'DELETE' });

// ==================== CMS - GUIDANCE ====================
export const getGuidanceArticles = () => apiCall('/admin/cms/guidance/articles/');

export const createGuidanceArticle = (data: any) =>
  apiCall('/admin/cms/guidance/articles/', {
    method: 'POST',
    body: JSON.stringify(data),
  });

export const updateGuidanceArticle = (id: number, data: any) =>
  apiCall(`/admin/cms/guidance/articles/${id}/`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });

export const deleteGuidanceArticle = (id: number) =>
  apiCall(`/admin/cms/guidance/articles/${id}/`, { method: 'DELETE' });

export const getFAQs = () => apiCall('/admin/cms/faqs/');

export const createFAQ = (data: any) =>
  apiCall('/admin/cms/faqs/', {
    method: 'POST',
    body: JSON.stringify(data),
  });

export const updateFAQ = (id: number, data: any) =>
  apiCall(`/admin/cms/faqs/${id}/`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });

export const deleteFAQ = (id: number) =>
  apiCall(`/admin/cms/faqs/${id}/`, { method: 'DELETE' });

// ==================== EMAIL CAMPAIGNS ====================
export const getCampaigns = () => apiCall('/admin/campaigns/');

export const getCampaign = (id: number) => apiCall(`/admin/campaigns/${id}/`);

export const createCampaign = (data: {
  title: string;
  subject: string;
  message: string;
  segment: string;
}) => apiCall('/admin/campaigns/', {
  method: 'POST',
  body: JSON.stringify(data),
});

export const updateCampaign = (id: number, data: Partial<{
  title: string;
  subject: string;
  message: string;
  segment: string;
}>) => apiCall(`/admin/campaigns/${id}/`, {
  method: 'PUT',
  body: JSON.stringify(data),
});

export const deleteCampaign = (id: number) =>
  apiCall(`/admin/campaigns/${id}/`, { method: 'DELETE' });

export const sendCampaign = (id: number) =>
  apiCall(`/admin/campaigns/${id}/send/`, { method: 'POST' });

// ==================== ANALYTICS ====================
export const getRetentionMetrics = () =>
  apiCall('/admin/analytics/retention/');

export const getFeatureAdoption = () =>
  apiCall('/admin/analytics/feature-adoption/');

export const getEngagementMetrics = () =>
  apiCall('/admin/analytics/engagement/');

// ==================== SYSTEM HEALTH ====================
export const getSystemHealth = () => apiCall('/admin/system-health/');

// ==================== ADMIN ANALYTICS (Overview) ====================
export const getAdminAnalytics = () => apiCall('/admin-analytics/');

export const getUserList = () => apiCall('/user-list/');

// ==================== USER MANAGEMENT ====================
export const changeUserRole = (userId: number, role: string) =>
  apiCall(`/admin/users/${userId}/change-role/`, {
    method: 'POST',
    body: JSON.stringify({ role }),
  });

export const deleteUser = (userId: number) =>
  apiCall(`/admin/users/${userId}/delete/`, { method: 'DELETE' });
