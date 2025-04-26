import apiClient from './api';
import { Equipment, EquipmentDTO } from '../types';

// Função para buscar todos os equipamentos
export const getEquipments = async (): Promise<Equipment[]> => {
  const response = await apiClient.get<Equipment[]>('/equipments'); // Ajuste o endpoint se necessário
  return response.data;
};

// Função para criar um novo equipamento
export const createEquipment = async (equipmentData: EquipmentDTO): Promise<Equipment> => {
  const response = await apiClient.post<Equipment>('/equipments', equipmentData);
  return response.data;
};

// Função para buscar um equipamento pelo ID
export const getEquipmentById = async (id: string): Promise<Equipment> => {
  const response = await apiClient.get<Equipment>(`/equipments/${id}`);
  return response.data;
};

// Função para atualizar um equipamento
export const updateEquipment = async (id: string, equipmentData: EquipmentDTO): Promise<Equipment> => {
  const response = await apiClient.put<Equipment>(`/equipments/${id}`, equipmentData);
  return response.data;
};

// Função para excluir um equipamento
export const deleteEquipment = async (id: string): Promise<void> => {
  await apiClient.delete(`/equipments/${id}`);
};

// Adicionar funções para update, delete aqui posteriormente 