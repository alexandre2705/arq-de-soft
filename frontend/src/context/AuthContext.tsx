import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { loginUser, LoginCredentials, LoginResponse } from '../services/authService';
// Se a resposta do login incluir dados do usuário, defina uma interface para eles
interface User {
  id: string;
  email: string; // Ou username
  name?: string; // Opcional
  role?: string; // Papel/Permissão (ex: 'admin', 'professor') - Importante para autorização
  // Adicione outros campos conforme necessário
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  isLoading: boolean; // Para indicar se está verificando o token inicial
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

// Função para verificar se um token JWT está expirado
const isTokenExpired = (token: string): boolean => {
  try {
    // Decodifica o payload do token (segunda parte do JWT)
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(window.atob(base64));
    
    // Verifica a expiração
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

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('authToken'));
  const [user, setUser] = useState<User | null>(null); // Inicialmente null
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!token);
  const [isLoading, setIsLoading] = useState<boolean>(true); // Começa carregando

  useEffect(() => {
    const initializeAuth = () => {
      const storedToken = localStorage.getItem('authToken');
      console.log("Token no localStorage:", storedToken);
      
      if (storedToken) {
        // Verifica se o token está expirado
        if (isTokenExpired(storedToken)) {
          console.warn("Token expirado, fazendo logout");
          logout();
        } else {
          setToken(storedToken);
          setIsAuthenticated(true);
          console.log("Token válido, usuário autenticado");
        }
        // TODO: Idealmente, validar o token com o backend ou decodificar para obter dados do usuário
      } else {
          setIsAuthenticated(false);
          setUser(null);
      }
      setIsLoading(false); // Finaliza o carregamento inicial
    };
    initializeAuth();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      console.log("Tentando fazer login com credentials:", credentials);
      const response = await loginUser(credentials);
      console.log("Resposta do login:", response);
      
      if (response && response.token) {
        localStorage.setItem('authToken', response.token);
        setToken(response.token);
        setIsAuthenticated(true);
        console.log("Token armazenado:", response.token);
      } else {
        console.error("Resposta do login não contém token");
        throw new Error("Resposta do login não contém token");
      }
      
      // TODO: Obter/decodificar dados do usuário a partir da resposta ou token
      // setUser(dadosDoUsuario);
      console.log("Login bem-sucedido no Context");
    } catch (error) {
      console.error("Falha no login (Context):", error);
      logout(); // Limpa qualquer estado inválido
      throw error; // Relança para o componente LoginPage tratar (ex: mostrar erro)
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    console.log("Logout realizado");
    // Opcional: redirecionar para /login aqui ou deixar o componente de rota fazer isso
  };

  const value = {
    isAuthenticated,
    user,
    token,
    login,
    logout,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}; 