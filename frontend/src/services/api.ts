import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

export const authApi = {
  register: (email: string, password: string, name?: string) => api.post('/api/auth/register', { email, password, name }),
  login: (email: string, password: string) => api.post('/api/auth/login', { email, password }),
  getMe: () => api.get('/api/auth/me'),
  logout: () => api.post('/api/auth/logout'),
};

export const scannerApi = {
  getPresets: () => api.get('/api/scanner/presets'),
  scanPorts: (host: string, ports: string, timeout?: number) => api.post('/api/scanner/ports', { host, ports, timeout }),
  scanSingle: (host: string, port: number, timeout?: number) => api.post('/api/scanner/single', { host, port, timeout }),
};

export const xssApi = {
  getPatterns: () => api.get('/api/xss/patterns'),
  scanContent: (content: string) => api.post('/api/xss/scan-content', { content }),
  scanURL: (url: string) => api.post('/api/xss/scan-url', { url }),
};

export const sqliApi = {
  getPayloads: () => api.get('/api/sqli/payloads'),
  extractParams: (url: string) => api.post('/api/sqli/extract-params', { url }),
  test: (url: string, attackType?: string, method?: string) => api.post('/api/sqli/test', { url, attackType, method }),
};


export const honeypotApi = {
  getStats: (timeRange?: string) => api.get('/api/honeypot/stats', { params: { timeRange } }),
  getLogs: (limit?: number, offset?: number) => api.get('/api/honeypot/logs', { params: { limit, offset } }),
  clearLogs: () => api.post('/api/honeypot/clear'),
};


export const ratelimitApi = {
  getConfigs: () => api.get('/api/ratelimit/configs'),
  test: (ip?: string, endpoint?: string) => api.post('/api/ratelimit/test', { ip, endpoint }),
  simulate: (endpoint?: string, numRequests?: number, delayMs?: number) => 
    api.post('/api/ratelimit/simulate', { endpoint, numRequests, delayMs }),
  clear: () => api.post('/api/ratelimit/clear'),
};


export const botdetectorApi = {
  analyze: (metrics?: any) => api.post('/api/botdetector/analyze', { metrics }),
  analyzeUA: (userAgent: string) => api.post('/api/botdetector/analyze-ua', { userAgent }),
  getPatterns: () => api.get('/api/botdetector/patterns'),
  getTestAgents: () => api.get('/api/botdetector/test-agents'),
};


export const aiApi = {
  getLandscape: () => api.get('/api/ai/landscape'),
  analyzeIP: (ip: string) => api.get(`/api/ai/analyze-ip/${ip}`),
  getPredictions: () => api.get('/api/ai/predictions'),
};
