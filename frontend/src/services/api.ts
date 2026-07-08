import type {
  Materia,
  Tarea,
  Examen,
  CreateMateriaData,
  CreateTareaData,
  CreateExamenData,
  AuthResponse,
  AuthMeResponse,
  ErrorResponse
} from '../types';

export const API_URL = import.meta.env.VITE_API_URL || '/api';
console.log('🔍 MODE:', import.meta.env.MODE);
console.log('🔍 VITE_API_URL:', import.meta.env.VITE_API_URL);
console.log('🔍 API_URL final:', API_URL);

const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({
      error: 'Error desconocido'
    })) as ErrorResponse;
    throw new Error(error.error || error.message || `Error ${response.status}`);
  }
  return response.json() as Promise<T>;
};

// ============================================
// AUTH SERVICE
// ============================================

export const authService = {
  register: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
      credentials: 'include'
    });
    return handleResponse<AuthResponse>(response);
  },

  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
      credentials: 'include'
    });
    return handleResponse<AuthResponse>(response);
  },

  logout: async (): Promise<{ message: string }> => {
    const response = await fetch(`${API_URL}/auth/logout`, {
      method: 'POST',
      credentials: 'include'
    });
    return handleResponse<{ message: string }>(response);
  },

  getMe: async (): Promise<AuthMeResponse> => {
    const response = await fetch(`${API_URL}/auth/me`, {
      credentials: 'include'
    });
    return handleResponse<AuthMeResponse>(response);
  }
};

// ============================================
// MATERIAS SERVICE
// ============================================

export const materiasService = {
  getAll: async (): Promise<Materia[]> => {
    const response = await fetch(`${API_URL}/materias`, {
      credentials: 'include'
    });
    return handleResponse<Materia[]>(response);
  },

  create: async (data: CreateMateriaData): Promise<Materia> => {
    const response = await fetch(`${API_URL}/materias`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      credentials: 'include'
    });
    return handleResponse<Materia>(response);
  },

  update: async (id: string, data: Partial<CreateMateriaData>): Promise<Materia> => {
    const response = await fetch(`${API_URL}/materias/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      credentials: 'include'
    });
    return handleResponse<Materia>(response);
  },

  delete: async (id: string): Promise<{ message: string }> => {
    const response = await fetch(`${API_URL}/materias/${id}`, {
      method: 'DELETE',
      credentials: 'include'
    });
    return handleResponse<{ message: string }>(response);
  }
};

// ============================================
// TAREAS SERVICE
// ============================================

export const tareasService = {
  getAll: async (materiaId?: string): Promise<Tarea[]> => {
    const url = materiaId ? `${API_URL}/tareas?materiaId=${materiaId}` : `${API_URL}/tareas`;
    const response = await fetch(url, {
      credentials: 'include'
    });
    return handleResponse<Tarea[]>(response);
  },

  create: async (data: CreateTareaData): Promise<Tarea> => {
    const response = await fetch(`${API_URL}/tareas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      credentials: 'include'
    });
    return handleResponse<Tarea>(response);
  },

  completar: async (id: string): Promise<Tarea> => {
    const response = await fetch(`${API_URL}/tareas/${id}/completar`, {
      method: 'PATCH',
      credentials: 'include'
    });
    return handleResponse<Tarea>(response);
  },

  delete: async (id: string): Promise<{ message: string }> => {
    const response = await fetch(`${API_URL}/tareas/${id}`, {
      method: 'DELETE',
      credentials: 'include'
    });
    return handleResponse<{ message: string }>(response);
  }
};

// ============================================
// EXAMENES SERVICE
// ============================================

export const examenesService = {
  getAll: async (materiaId?: string): Promise<Examen[]> => {
    const url = materiaId ? `${API_URL}/examenes?materiaId=${materiaId}` : `${API_URL}/examenes`;
    const response = await fetch(url, {
      credentials: 'include'
    });
    return handleResponse<Examen[]>(response);
  },

  create: async (data: CreateExamenData): Promise<Examen> => {
    const response = await fetch(`${API_URL}/examenes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      credentials: 'include'
    });
    return handleResponse<Examen>(response);
  },

  update: async (id: string, data: Partial<CreateExamenData>): Promise<Examen> => {
    const response = await fetch(`${API_URL}/examenes/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      credentials: 'include'
    });
    return handleResponse<Examen>(response);
  },

  delete: async (id: string): Promise<{ message: string }> => {
    const response = await fetch(`${API_URL}/examenes/${id}`, {
      method: 'DELETE',
      credentials: 'include'
    });
    return handleResponse<{ message: string }>(response);
  }
};

// ============================================
// HEALTH CHECK
// ============================================

export const healthCheck = async (): Promise<{
  status: string;
  message: string;
  timestamp: string;
  environment: string;
  mongodb: string;
}> => {
  const response = await fetch(`${API_URL}/health`);
  return handleResponse(response);
};