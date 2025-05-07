import axios from 'axios';
import { auth } from '@/lib/firebase';

// Verificar a variável de ambiente
const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Log para debug
console.log('[API Service] API_URL:', API_URL || 'Não definida');

// Se não estiver definida, apenas log de aviso
if (!API_URL) {
  console.warn('[API Service] AVISO: NEXT_PUBLIC_API_URL não está definida. A API não funcionará corretamente.');
}

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar o token de autenticação
api.interceptors.request.use(async (config) => {
  try {
    const user = auth.currentUser;
    if (user) {
      const token = await user.getIdToken();
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  } catch (error) {
    console.error('Erro ao obter token:', error);
    return config;
  }
});

// Interceptor para tratamento de erros
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Verifica se o usuário está realmente deslogado
      const user = auth.currentUser;
      if (!user) {
        // Só redireciona se o usuário realmente não estiver autenticado
        window.location.href = '/login';
      } else {
        // Se o usuário está autenticado mas recebeu 401, pode ser token expirado
        try {
          // Tenta renovar o token
          const newToken = await user.getIdToken(true);
          // Refaz a requisição original com o novo token
          error.config.headers.Authorization = `Bearer ${newToken}`;
          return axios(error.config);
        } catch (refreshError) {
          console.error('Erro ao renovar token:', refreshError);
          window.location.href = '/login';
        }
      }
    }
    
    // Melhora o tratamento de erros para facilitar o consumo pelos componentes
    if (error.response && error.response.data) {
      const responseData = error.response.data;
      
      // Se o erro tiver uma mensagem específica da API, usamos ela
      if (responseData.message) {
        error.message = responseData.message;
      }
      
      // Adicionamos os detalhes da resposta ao objeto de erro para facilitar o diagnóstico
      error.apiResponse = responseData;
    }
    
    console.error('Erro na requisição API:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      data: error.response?.data
    });
    
    return Promise.reject(error);
  }
);

// Endpoints
export const endpoints = {
  events: '/events',
  event: (id: string) => `/events/${id}`,
  users: {
    profile: '/users',
    update: '/users'
  }
  // ... outros endpoints
}; 