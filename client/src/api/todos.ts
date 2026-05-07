import axios from 'axios';

export type Todo = {
  _id: string;
  title: string;
  description: string;
  completed: boolean;
  priority: TodoPriority;
  createdAt?: string;
  updatedAt?: string;
};

export type TodoPriority = 'low' | 'medium' | 'high';

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

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3001/api';

export const getErrorMessage = (error: unknown) => {
  if (axios.isAxiosError<ApiError>(error)) {
    const data = error.response?.data;

    if (Array.isArray(data?.message)) {
      return data.message.join(', ');
    }

    return data?.message ?? data?.error ?? error.message;
  }

  return 'Co loi xay ra. Vui long thu lai.';
};

export const todoApi = {
  getAll: async () => {
    const { data } = await axios.get<Todo[]>(`${API_URL}/todos`);
    return data;
  },

  getOne: async (id: string) => {
    const { data } = await axios.get<Todo>(`${API_URL}/todos/${id}`);
    return data;
  },

  create: async (payload: TodoPayload) => {
    const { data } = await axios.post<Todo>(`${API_URL}/todos`, payload);
    return data;
  },

  update: async (id: string, payload: TodoPayload) => {
    const { data } = await axios.put<Todo>(`${API_URL}/todos/${id}`, payload);
    return data;
  },

  remove: async (id: string) => {
    const { data } = await axios.delete<{ message: string; deletedTodo: Todo }>(
      `${API_URL}/todos/${id}`,
    );
    return data;
  },
};
