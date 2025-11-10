import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le user_id automatiquement
api.interceptors.request.use((config) => {
  const user = localStorage.getItem('user');
  if (user) {
    const userData = JSON.parse(user);
    // Ajouter user_id aux params si la requête le nécessite
    if (config.method === 'get' && config.url?.includes('/files')) {
      if (!config.params) config.params = {};
      config.params.user_id = userData.id;
    }
  }
  return config;
});

// Intercepteur de réponse pour gérer les erreurs globalement
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Redirection vers login si non authentifié
      localStorage.removeItem('user');
      localStorage.removeItem('userId');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ==================== AUTH API ====================
export const authAPI = {
  /**
   * Connexion utilisateur
   */
  login: (email: string, password: string) =>
    api.post('/login', { email, password }),

  /**
   * Inscription utilisateur
   */
  register: (data: {
    email: string;
    password: string;
    firstname: string;
    lastname: string;
  }) => api.post('/register', data),
};

// ==================== FILES API ====================
export const filesAPI = {
  /**
   * Récupérer tous les fichiers d'un utilisateur
   */
  getFiles: (userId: number) =>
    api.get('/files', { params: { user_id: userId } }),

  /**
   * Uploader un nouveau fichier
   */
  uploadFile: (file: File, userId: number, dateCreation: string) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post(
      `/upload?user_id=${userId}&date_creation=${dateCreation}`,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    );
  },

  /**
   * Supprimer un fichier
   */
  deleteFile: (fileId: number, userId: number) =>
    api.delete(`/delete-file/${fileId}`, { params: { user_id: userId } }),

  /**
   * Obtenir l'URL de téléchargement d'un fichier
   */
  getDownloadUrl: (filename: string) => `${API_URL}/uploads/${filename}`,
};

// ==================== EXTRACTION API ====================
export const extractionAPI = {
  /**
   * Lancer l'extraction d'un fichier
   */
  extract: () => api.get('/extract'),
};

// ==================== ANALYTICS API ====================
export const analyticsAPI = {
  /**
   * Récupérer les filtres disponibles
   */
  getFilters: () => api.get('/get-filters'),

  /**
   * Récupérer les statistiques avec filtres
   */
  getStatistics: (filters: {
    date: string;
    sub_zone?: string;
    affiliate?: string;
    station_code?: string;
    station_name?: string;
    management_mode?: string;
    segmentation?: string;
  }) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
    return api.get(`/get-statistics-by-filter?${params.toString()}`);
  },
};

export { api };
export default api;
