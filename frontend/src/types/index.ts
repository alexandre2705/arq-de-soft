export interface Room {
  id: number;
  sigla: string;
  nome: string;
  descricao?: string;
  capacidade: number;
  // Adicione outros campos se necessário (ex: description, location)
}

// Você pode adicionar outras interfaces aqui (Equipment, Reservation, etc.)

// DTO para criação/atualização de Sala (Espaço)
export interface RoomDTO {
  sigla: string; // Adicionado - Obrigatório no backend
  nome: string;
  descricao?: string; // Adicionado - Opcional
  capacidade: number;
}

// Interface para Equipamento
export interface Equipment {
  id: string;
  name: string;
  // Adicionar outros campos se necessário (ex: description, roomId)
}

// Adicionar EquipmentDTO se/quando necessário

// Interfaces aninhadas para Reserva (correspondendo aos DTOs do backend)
export interface EspacoSimpleDTO {
  id: string; // UUID é string
  sigla: string;
  nome: string;
}

export interface ProfessorSimpleDTO {
  id: string; // UUID é string
  nome: string;
}

// Interface completa para Professor (correspondendo à entidade do backend)
export interface Professor {
  id: string; // UUID
  nome: string;
  escola: string;
  // Adicionar outros campos se necessário
}

// DTO para criação/atualização de Professor
export interface ProfessorDTO {
  nome: string;
  escola: string;
}

// Interface para Reserva (correspondendo ao ReservaResponseDTO do backend)
export interface Reservation {
  id: string; // UUID é string
  espaco: EspacoSimpleDTO;
  professor: ProfessorSimpleDTO;
  dataReserva: string; // LocalDate como string
  horaInicio: string;  // LocalTime como string
  horaFim: string;     // LocalTime como string
  dataHoraSolicitacao: string; // LocalDateTime como string
  confirmada: boolean;
  utilizada: boolean;
}

// Adicionar ReservationDTO (para criação) se/quando necessário

// DTO para criação/atualização de Equipamento
export interface EquipmentDTO {
  name: string;
  // Adicionar outros campos se necessário (ex: description)
}

// DTO para criação de Reserva (correspondendo ao ReservaCadastroDTO do backend)
export interface ReservationDTO {
  espacoId: string; // UUID
  professorId: string; // UUID
  dataReserva: string; // Formato YYYY-MM-DD
  horaInicio: string; // Formato HH:MM ou HH:MM:SS
  horaFim: string; // Formato HH:MM ou HH:MM:SS
} 