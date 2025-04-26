import axios from 'axios';

// Define a URL base da sua API backend
// Certifique-se de que esta URL esteja acessível a partir do seu frontend
// Pode ser necessário configurar CORS no backend
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

console.log("URL da API:", API_BASE_URL);

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    // Você pode adicionar outros cabeçalhos aqui, como tokens de autenticação
  },
});

// Função para verificar se um token JWT está expirado
const isTokenExpired = (token: string): boolean => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(window.atob(base64));
    
    const expirationTime = payload.exp * 1000; // Converter para milissegundos
    const currentTime = Date.now();
    
    console.log("Tempo atual:", new Date(currentTime).toISOString());
    console.log("Tempo de expiração:", new Date(expirationTime).toISOString());
    
    return currentTime > expirationTime;
  } catch (error) {
    console.error("Erro ao decodificar token:", error);
    return true; // Se não conseguir decodificar, considera expirado
  }
};

// Adicionar interceptor de requisição para incluir o token JWT
axiosInstance.interceptors.request.use(
  (config) => {
    // Pega o token do localStorage
    const token = localStorage.getItem('authToken'); 
    console.log('Interceptor executando, token:', token);
    
    // Se o token existir, verifica se está expirado
    if (token) {
      if (!isTokenExpired(token)) {
        config.headers['Authorization'] = `Bearer ${token}`;
        console.log('Cabeçalho de autorização definido:', config.headers['Authorization']);
        console.log('URL da requisição:', config.url);
      } else {
        console.warn('Token expirado, redirecionando para login');
        localStorage.removeItem('authToken');
        // Redirecionar para login
        window.location.href = '/login';
        return Promise.reject('Token expirado');
      }
    } else {
      console.warn('Não há token no localStorage para incluir na requisição');
    }
    
    return config;
  },
  (error) => {
    console.error('Erro no interceptor de requisição:', error);
    return Promise.reject(error);
  }
);

// Opcional: Adicionar interceptors para tratamento de erros ou autenticação global
axiosInstance.interceptors.response.use(
  response => {
    console.log('Resposta recebida com sucesso:', response.status);
    return response;
  },
  error => {
    // Tratamento global de erros (opcional)
    console.error('Erro na requisição API:', error.response?.status, error.message);
    
    // Se o erro for 401 Unauthorized
    if (error.response && error.response.status === 401) {
      console.error('Erro de autenticação 401 - verifique o token');
      console.log('Cabeçalhos enviados:', error.config?.headers);
      
      // Limpar o token e redirecionar para login
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    
    // Você pode redirecionar para uma página de erro, mostrar uma notificação, etc.
    return Promise.reject(error); // Rejeita a promessa para que o erro possa ser tratado localmente também
  }
);

export default axiosInstance; 