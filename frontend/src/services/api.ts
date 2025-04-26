import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:8080/api', // Ajuste se seu backend rodar em outra porta/URL
  headers: {
    'Content-Type': 'application/json',
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
    
    return currentTime > expirationTime;
  } catch (error) {
    console.error("Erro ao decodificar token:", error);
    return true; // Se não conseguir decodificar, considera expirado
  }
};

// Adiciona um interceptor de requisição
apiClient.interceptors.request.use(
  (config) => {
    // Pega o token do localStorage
    const token = localStorage.getItem('authToken'); 
    console.log('[apiClient] Token atual:', token);
    
    // Se o token existir e não estiver expirado, adiciona ao cabeçalho Authorization
    if (token) {
      if (!isTokenExpired(token)) {
        config.headers['Authorization'] = `Bearer ${token}`;
        console.log('[apiClient] Token válido, adicionado aos cabeçalhos');
      } else {
        console.warn('[apiClient] Token expirado, não adicionado aos cabeçalhos');
        // Opcional: redirecionar para login ou limpar o token
        localStorage.removeItem('authToken');
        window.location.href = '/login'; // Redireciona para o login
      }
    } else {
      console.warn('[apiClient] Não há token disponível');
    }
    
    return config;
  },
  (error) => {
    // Faz algo com erro da requisição
    console.error('[apiClient] Erro no interceptor:', error);
    return Promise.reject(error);
  }
);

export default apiClient; 