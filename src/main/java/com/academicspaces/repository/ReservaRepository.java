package com.academicspaces.repository;

import com.academicspaces.entity.Espaco;
import com.academicspaces.entity.Reserva;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface ReservaRepository extends JpaRepository<Reserva, UUID> {

    // Sobrescreve findAll para garantir o carregamento EAGER das associações necessárias para o DTO
    @Override
    @Query("SELECT r FROM Reserva r JOIN FETCH r.espaco JOIN FETCH r.professor")
    List<Reserva> findAll();

    // Método para verificar sobreposição de reservas para um espaço específico
    List<Reserva> findByEspacoAndDataReservaAndHoraInicioLessThanAndHoraFimGreaterThan(
            Espaco espaco,
            LocalDate dataReserva,
            LocalTime horaFim,
            LocalTime horaInicio
    );

     // Método para encontrar reservas por data e espaço (útil para verificar disponibilidade)
     List<Reserva> findByEspacoAndDataReserva(Espaco espaco, LocalDate dataReserva);
} 