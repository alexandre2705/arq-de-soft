import axiosInstance from '../utils/axiosInstance';

// Interface para as credenciais de login
export interface LoginCredentials {
  email: string; // Ou username, dependendo do backend
  password: string;
}

// Interface para a resposta esperada do backend após login bem-sucedido
// Ajuste conforme a resposta real da sua API (pode incluir dados do usuário, etc.)
export interface LoginResponse {
  token: string; // Assumindo que o backend retorna um token JWT
  // Outros campos podem ser retornados, ex: user: { id: string, name: string, role: string }
}

/**
 * Envia as credenciais de login para a API.
 * @param credentials - Objeto contendo email e password.
 * @returns Promise com a resposta da API (ex: token).
 */
export const loginUser = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  try {
    console.log('Enviando requisição de login para /auth/login com:', {
      email: credentials.email,
      senha: credentials.password
    });
    
    // Ajustado para usar o mesmo endpoint que o LoginPage está usando
    const response = await axiosInstance.post<LoginResponse>('/auth/login', {
      email: credentials.email,
      senha: credentials.password // Usando 'senha' como no LoginPage em vez de 'password'
    });
    
    console.log('Resposta de login completa:', response);
    
    // Garantir que o token seja extraído corretamente da resposta
    if (!response.data || !response.data.token) {
      console.error('Resposta não contém token:', response.data);
      throw new Error('Resposta não contém token');
    }
    
    console.log('Token recebido:', response.data.token);
    return response.data;
  } catch (error: any) {
    // O interceptor em axiosInstance já loga o erro, mas podemos tratar especificamente aqui se necessário
    console.error('Erro no serviço de login:', error.message);
    console.error('Detalhes do erro:', error.response?.data);
    // Relança o erro para que o componente possa tratá-lo (ex: mostrar mensagem ao usuário)
    throw error;
  }
}; 