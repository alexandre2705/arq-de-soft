package com.academicspaces.dto;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.UUID;

@Data
public class ReservaCadastroDTO {

    @NotNull(message = "ID do espaço não pode ser nulo")
    private UUID espacoId;

    @NotNull(message = "ID do professor não pode ser nulo")
    private UUID professorId;

    @NotNull(message = "Data da reserva não pode ser nula")
    @FutureOrPresent(message = "Data da reserva deve ser hoje ou no futuro")
    private LocalDate dataReserva;

    @NotNull(message = "Hora de início não pode ser nula")
    private LocalTime horaInicio;

    @NotNull(message = "Hora de fim não pode ser nula")
    private LocalTime horaFim;
} 