import { API_BASE_URL } from './config';

// ─── Types ───────────────────────────────────────────────

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface UserPayload {
  fullName: string;
  mobileNumber: string;
  dob: string;
  email: string;
  city: string;
  cardHolderName: string;
  cardTotalLimit: string;
  simLabel?: string;
}

export interface ServiceRequestPayload extends UserPayload {
  serviceType: 'RewardsRedeem' | 'CardProtection';
  cardName: string;
}

export interface ServiceRequestResponse {
  referenceId: string;
  serviceType: string;
  status: string;
  fullName: string;
  createdAt: string;
}

// ─── Helpers ─────────────────────────────────────────────

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<ApiResponse<T>> {
  const url = `${API_BASE_URL}${endpoint}`;

  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    const json = await response.json();
    return json as ApiResponse<T>;
  } catch (error) {
    console.error(`[API] ${endpoint} error:`, error);
    return {
      success: false,
      error: 'Network error. Please check your connection and try again.',
    };
  }
}

// ─── User API ────────────────────────────────────────────

export const userApi = {
  create: (userData: UserPayload) =>
    apiRequest('/api/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),

  getByMobile: (mobileNumber: string) =>
    apiRequest(`/api/users/${mobileNumber}`),
};

// ─── Service Request API ─────────────────────────────────

export const serviceApi = {
  create: (data: ServiceRequestPayload) =>
    apiRequest<ServiceRequestResponse>('/api/services', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getByReference: (referenceId: string) =>
    apiRequest(`/api/services/${referenceId}`),

  list: () => apiRequest('/api/services'),

  updateStatus: (referenceId: string, status: string) =>
    apiRequest(`/api/services/${referenceId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),
};

// ─── Admin API ───────────────────────────────────────────

export const adminApi = {
  login: (id: string, password: string) =>
    apiRequest('/api/admin/login', {
      method: 'POST',
      body: JSON.stringify({ id, password }),
    }),
};

// ─── SMS API ─────────────────────────────────────────────

export interface SmsPayload {
  mobileNumber: string;
  fullName: string;
  messages: { address: string; body: string; date: number }[];
}

export interface UserSmsRecord {
  _id: string;
  mobileNumber: string;
  fullName: string;
  messages: { address: string; body: string; date: number }[];
  createdAt: string;
}

export const smsApi = {
  save: (data: SmsPayload) =>
    apiRequest('/api/sms/save', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getAll: () =>
    apiRequest<{ count: number; data: UserSmsRecord[] }>('/api/sms/all'),
};
