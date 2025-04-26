package com.academicspaces.dto;

import com.academicspaces.entity.Reserva; // Para o construtor de conveniência
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReservaResponseDTO {

    private UUID id;
    private EspacoSimpleDTO espaco;
    private ProfessorSimpleDTO professor;
    private LocalDate dataReserva;
    private LocalTime horaInicio;
    private LocalTime horaFim;
    private LocalDateTime dataHoraSolicitacao;
    private boolean confirmada;
    private boolean utilizada;

    // Construtor de conveniência para facilitar a conversão
    public ReservaResponseDTO(Reserva reserva) {
        this.id = reserva.getId();
        // Verifica se espaco e professor não são nulos antes de criar os DTOs aninhados
        // Isso previne NullPointerException se a entidade for carregada sem as associações
        if (reserva.getEspaco() != null) {
            this.espaco = new EspacoSimpleDTO(reserva.getEspaco().getId(), reserva.getEspaco().getSigla(), reserva.getEspaco().getNome());
        }
        if (reserva.getProfessor() != null) {
            this.professor = new ProfessorSimpleDTO(reserva.getProfessor().getId(), reserva.getProfessor().getNome());
        }
        this.dataReserva = reserva.getDataReserva();
        this.horaInicio = reserva.getHoraInicio();
        this.horaFim = reserva.getHoraFim();
        this.dataHoraSolicitacao = reserva.getDataHoraSolicitacao();
        this.confirmada = reserva.isConfirmada();
        this.utilizada = reserva.isUtilizada();
    }
} 