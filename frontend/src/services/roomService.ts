import apiClient from './api';
import { Room, RoomDTO } from '../types';

// Função para buscar todas as salas (espaços)
export const getRooms = async (): Promise<Room[]> => {
  const response = await apiClient.get<Room[]>('/espacos');
  return response.data;
};

// Função para buscar uma sala (espaço) pelo ID
export const getRoomById = async (id: string | number): Promise<Room> => {
  const response = await apiClient.get<Room>(`/espacos/${id}`);
  return response.data;
};

// Função para criar uma nova sala (espaço)
export const createRoom = async (roomData: RoomDTO): Promise<Room> => {
  const response = await apiClient.post<Room>('/espacos', roomData);
  return response.data;
};

// Função para atualizar uma sala (espaço) existente
export const updateRoom = async (id: string | number, roomData: RoomDTO): Promise<Room> => {
  const response = await apiClient.put<Room>(`/espacos/${id}`, roomData);
  return response.data;
};

// Função para excluir uma sala (espaço)
export const deleteRoom = async (id: string | number): Promise<void> => {
  await apiClient.delete(`/espacos/${id}`);
};

// Adicionar funções para getRoomById, updateRoom, deleteRoom aqui posteriormente 