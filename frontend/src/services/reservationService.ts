import apiClient from './api';
import axiosInstance from '../utils/axiosInstance';
import { Reservation, ReservationDTO, EspacoSimpleDTO, ProfessorSimpleDTO } from '../types';

// Função para verificar se um token é válido
const isValidToken = (token: string | null): boolean => {
  if (!token) return false;
  
  try {
    // Decodificar o token para verificar a expiração
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(window.atob(base64));
    
    const expirationTime = payload.exp * 1000; // Converter para milissegundos
    const currentTime = Date.now();
    
    return currentTime < expirationTime;
  } catch (error) {
    console.error("Erro ao validar token:", error);
    return false;
  }
};

// Buscar todas as reservas
export const getReservations = async (): Promise<Reservation[]> => {
  console.log('Buscando reservas...');
  const token = localStorage.getItem('authToken');
  console.log('Token atual:', token);
  
  // Verifica se o token é válido antes de fazer a requisição
  if (!isValidToken(token)) {
    console.error('Token inválido ou expirado');
    throw new Error('Token inválido ou expirado. Faça login novamente.');
  }
  
  try {
    // Tentar com o axiosInstance atualizado
    const response = await axiosInstance.get<Reservation[]>('/reservas');
    console.log('Resposta recebida:', response);
    return response.data;
  } catch (error: any) {
    console.error('Erro ao buscar reservas:', error.message);
    
    if (error.response?.status === 401) {
      // Limpar o token se for erro de autenticação
      localStorage.removeItem('authToken');
      throw new Error('Sessão expirada. Por favor, faça login novamente.');
    }
    
    throw error;
  }
};

// Criar uma nova reserva
export const createReservation = async (reservationData: ReservationDTO): Promise<Reservation> => {
  const token = localStorage.getItem('authToken');
  
  // Verifica se o token é válido antes de fazer a requisição
  if (!isValidToken(token)) {
    throw new Error('Token inválido ou expirado. Faça login novamente.');
  }
  
  // O backend deve validar a disponibilidade e retornar a reserva criada ou um erro
  const response = await axiosInstance.post<Reservation>('/reservas', reservationData);
  return response.data;
};

// Excluir uma reserva (geralmente ação de admin)
export const deleteReservation = async (id: string): Promise<void> => {
  const token = localStorage.getItem('authToken');
  
  // Verifica se o token é válido antes de fazer a requisição
  if (!isValidToken(token)) {
    throw new Error('Token inválido ou expirado. Faça login novamente.');
  }
  
  await axiosInstance.delete(`/reservas/${id}`);
};

// Adicionar outras funções relacionadas a reservas conforme necessário
// Ex: getReservationById, updateReservation (se permitido), confirmUsage, etc.

// Adicionar getReservationById, updateReservation posteriormente se necessário 