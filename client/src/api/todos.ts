import axios from 'axios';

// --- 1. ĐỊNH NGHĨA TYPES ---
export type TodoPriority = 'low' | 'medium' | 'high';

export type Todo = {
  _id: string;
  title: string;
  description: string;
  completed: boolean;
  priority: TodoPriority;
  createdAt?: string;
  updatedAt?: string;
};

export type TodoPayload = {
  title: string;
  description: string;
  completed: boolean;
  priority: TodoPriority;
};

export type ApiError = {
  message?: string | string[];
  error?: string;
};

// --- 2. CẤU HÌNH AXIOS INSTANCE ---
const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_URL,
});

// Tự động gắn Token vào Header của mọi yêu cầu gửi đi
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Xử lý lỗi tập trung
export const getErrorMessage = (error: unknown) => {
  if (axios.isAxiosError<ApiError>(error)) {
    const data = error.response?.data;
    if (Array.isArray(data?.message)) {
      return data.message.join(', ');
    }
    return data?.message ?? data?.error ?? error.message;
  }
  return 'Có lỗi xảy ra. Vui lòng thử lại.';
};

export default api;

// --- 3. API DÀNH CHO AUTH (Đăng nhập/Đăng ký) ---
export const authApi = {
  login: async (payload: any) => {
    const { data } = await api.post('/auth/login', payload);
    return data; // Trả về { token, user }
  },
  register: async (payload: any) => {
    const { data } = await api.post('/auth/register', payload);
    return data;
  },
};

// --- 4. API DÀNH CHO TODO (Đã có token bảo vệ) ---
export const todoApi = {
  getAll: async () => {
    const { data } = await api.get<Todo[]>('/todos');
    return data;
  },

  getOne: async (id: string) => {
    const { data } = await api.get<Todo>(`/todos/${id}`);
    return data;
  },

  create: async (payload: TodoPayload) => {
    const { data } = await api.post<Todo>('/todos', payload);
    return data;
  },

  update: async (id: string, payload: TodoPayload) => {
    const { data } = await api.put<Todo>(`/todos/${id}`, payload);
    return data;
  },

  remove: async (id: string) => {
    const { data } = await api.delete<{ message: string; deletedTodo: Todo }>(
      `/todos/${id}`,
    );
    return data;
  },
};