package com.academicspaces.controller;

import com.academicspaces.dto.ReservaCadastroDTO;
import com.academicspaces.dto.ReservaResponseDTO;
import com.academicspaces.entity.Reserva;
import com.academicspaces.service.ReservaService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/booking")
@CrossOrigin(origins = "http://localhost:5173")
public class ReservaController {

    @Autowired
    private ReservaService reservaService;

    // Endpoint de Teste
    @GetMapping("/test-mapping")
    public ResponseEntity<String> testMapping() {
        System.out.println("DEBUG: Acessando /api/v1/booking/test-mapping (GET)");
        return ResponseEntity.ok("Reserva Test Endpoint OK - V1 Booking");
    }

    @GetMapping(path = "")
    public ResponseEntity<List<ReservaResponseDTO>> listarTodasReservas() {
        List<Reserva> reservas = reservaService.listarTodas();
        List<ReservaResponseDTO> dtos = reservas.stream()
                                                .map(ReservaResponseDTO::new)
                                                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ReservaResponseDTO> buscarReservaPorId(@PathVariable UUID id) {
        Reserva reserva = reservaService.buscarPorId(id);
        ReservaResponseDTO dto = new ReservaResponseDTO(reserva);
        return ResponseEntity.ok(dto);
    }

    // Endpoint para solicitar reserva (Requisito 1 - Reserva)
    @PostMapping
    public ResponseEntity<?> solicitarReserva(@Valid @RequestBody ReservaCadastroDTO dto) {
        try {
            Reserva novaReserva = reservaService.solicitarReserva(dto);
            ReservaResponseDTO responseDto = new ReservaResponseDTO(novaReserva);
            return ResponseEntity.status(HttpStatus.CREATED).body(responseDto);
        } catch (IllegalStateException | jakarta.persistence.EntityNotFoundException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
             return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erro ao processar a solicitação de reserva.");
        }
    }

    // Endpoint para confirmar utilização (Requisito 3 - Pós uso)
    @PatchMapping("/{id}/confirmar-utilizacao")
    public ResponseEntity<ReservaResponseDTO> confirmarUtilizacaoReserva(@PathVariable UUID id) {
        Reserva reserva = reservaService.confirmarUtilizacao(id);
        ReservaResponseDTO dto = new ReservaResponseDTO(reserva);
        return ResponseEntity.ok(dto);
    }

    // Endpoint para cancelar reserva (Requisito 2.4 - Admin)
    @DeleteMapping("/{id}")
    public ResponseEntity<?> cancelarReserva(@PathVariable UUID id) {
         try {
            reservaService.cancelarReserva(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalStateException | jakarta.persistence.EntityNotFoundException e) {
             if (e instanceof jakarta.persistence.EntityNotFoundException) {
                 return ResponseEntity.notFound().build();
             }
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
             return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erro ao cancelar a reserva.");
        }
    }

    // Nota: A alteração de reserva pelo admin (Req 2.4) não foi implementada, apenas exclusão.
    // A listagem de espaços disponíveis pelo professor (Req 1.1 Reserva) é feita pelo EspacoController.
} 