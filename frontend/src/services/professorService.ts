import apiClient from './api';
import { Professor, ProfessorDTO } from '../types';

/**
 * Busca a lista de professores da API.
 * TODO: Ajustar o endpoint conforme a definição da API backend.
 */
export const getProfessors = async (): Promise<Professor[]> => {
  try {
    // Substitua '/professores' pelo endpoint correto da sua API
    const response = await apiClient.get<Professor[]>('/professores');
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar professores:", error);
    // Você pode querer lançar o erro novamente ou retornar um array vazio
    // dependendo de como quer tratar erros na sua aplicação.
    // throw error;
    return []; // Retorna vazio em caso de erro para evitar quebrar a interface
  }
};

// Buscar um professor pelo ID
export const getProfessorById = async (id: string): Promise<Professor> => {
  const response = await apiClient.get<Professor>(`/professores/${id}`);
  return response.data;
};

// Criar um novo professor
export const createProfessor = async (professorData: ProfessorDTO): Promise<Professor> => {
  const response = await apiClient.post<Professor>('/professores', professorData);
  return response.data;
};

// Atualizar um professor existente
export const updateProfessor = async (id: string, professorData: ProfessorDTO): Promise<Professor> => {
  const response = await apiClient.put<Professor>(`/professores/${id}`, professorData);
  return response.data;
};

// Excluir um professor
export const deleteProfessor = async (id: string): Promise<void> => {
  await apiClient.delete(`/professores/${id}`);
};

// Adicione outras funções relacionadas a professores aqui, se necessário
// Ex: getProfessorById, createProfessor, etc. 