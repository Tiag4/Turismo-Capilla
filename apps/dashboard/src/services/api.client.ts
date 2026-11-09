const API_BASE_URL =
  (typeof import.meta !== 'undefined' &&
    (import.meta.env?.VITE_API_URL || import.meta.env?.PUBLIC_API_URL)) ||
  (import.meta.env?.DEV
    ? 'http://localhost:8080/api/v1'
    : 'https://turismo-capilla-backend.onrender.com/api/v1');

const DEFAULT_TIMEOUT_MS = 6000;
// Uploads can carry files up to 5 MB; allow more time than JSON requests.
const UPLOAD_TIMEOUT_MS = 30000;

class ApiClient {
  private getHeaders(): HeadersInit {
    const token = localStorage.getItem('turismo_capilla_token');
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    // Solo enviar el encabezado si el token tiene el formato válido de un JWT (3 partes separadas por '.')
    if (token && token.split('.').length === 3) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  }

  private handleAuthError(status: number) {
    if (status === 401) {
      // Limpiar credenciales residuales o inválidas
      localStorage.removeItem('turismo_capilla_token');
      localStorage.removeItem('turismo_capilla_user');
      // Notificar a la capa de UI para que cierre la sesión sin esperar un reload
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('auth:unauthorized'));
      }
    }
  }

  async get<T>(path: string): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      method: 'GET',
      headers: this.getHeaders(),
      signal: AbortSignal.timeout(DEFAULT_TIMEOUT_MS),
    });
    if (!response.ok) {
      this.handleAuthError(response.status);
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Request failed with status ${response.status}`);
    }
    return response.json();
  }

  async post<T>(path: string, body: unknown): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(DEFAULT_TIMEOUT_MS),
    });
    if (!response.ok) {
      this.handleAuthError(response.status);
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Request failed with status ${response.status}`);
    }
    return response.json();
  }

  async put<T>(path: string, body: unknown): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(DEFAULT_TIMEOUT_MS),
    });
    if (!response.ok) {
      this.handleAuthError(response.status);
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Request failed with status ${response.status}`);
    }
    return response.json();
  }

  async patch<T>(path: string, body: unknown): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      method: 'PATCH',
      headers: this.getHeaders(),
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(DEFAULT_TIMEOUT_MS),
    });
    if (!response.ok) {
      this.handleAuthError(response.status);
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Request failed with status ${response.status}`);
    }
    return response.json();
  }

  async postMultipart<T>(path: string, formData: FormData): Promise<T> {
    const token = localStorage.getItem('turismo_capilla_token');
    // Never set Content-Type for multipart: the browser must add the boundary.
    const headers: Record<string, string> = {};
    // Solo enviar el encabezado si el token tiene el formato válido de un JWT (3 partes separadas por '.')
    if (token && token.split('.').length === 3) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${path}`, {
      method: 'POST',
      headers,
      body: formData,
      signal: AbortSignal.timeout(UPLOAD_TIMEOUT_MS),
    });
    if (!response.ok) {
      this.handleAuthError(response.status);
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Request failed with status ${response.status}`);
    }
    return response.json();
  }

  async delete<T>(path: string): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
      signal: AbortSignal.timeout(DEFAULT_TIMEOUT_MS),
    });
    if (!response.ok) {
      this.handleAuthError(response.status);
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Request failed with status ${response.status}`);
    }
    if (response.status === 204) {
      return {} as T;
    }
    return response.json().catch(() => ({} as T));
  }
}

export const apiClient = new ApiClient();
