package com.academicspaces.controller;

import com.academicspaces.entity.Equipment;
import com.academicspaces.service.EquipmentService;
import com.academicspaces.dto.EquipmentDTO;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.net.URI;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import java.util.UUID;

@RestController
@RequestMapping("/api/equipments") // Define o path base para equipamentos
@CrossOrigin(origins = "http://localhost:5173") // Mantendo CrossOrigin aqui por segurança
public class EquipmentController {

    @Autowired
    private EquipmentService equipmentService;

    // Endpoint para listar todos os equipamentos
    @GetMapping
    public ResponseEntity<List<Equipment>> listAllEquipments() {
        List<Equipment> equipments = equipmentService.listAll();
        return ResponseEntity.ok(equipments);
    }

    // Endpoint para buscar um equipamento por ID
    @GetMapping("/{id}")
    public ResponseEntity<Equipment> getEquipmentById(@PathVariable UUID id) {
        Equipment equipment = equipmentService.findById(id);
        return ResponseEntity.ok(equipment); // Retorna 200 OK com o equipamento
        // Tratamento de erro para EntityNotFoundException é feito pelo ExceptionHandler padrão do Spring (retorna 404)
    }

    // Endpoint para criar um novo equipamento (TESTE: retornando apenas status e location)
    @PostMapping
    public ResponseEntity<Void> createEquipment(@Valid @RequestBody EquipmentDTO dto) {
        Equipment newEquipment = equipmentService.createEquipment(dto);
        // Cria a URI para o novo recurso criado
        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(newEquipment.getId())
                .toUri();
        // Retorna 201 Created com o cabeçalho Location, sem corpo
        return ResponseEntity.created(location).build();
    }

    // Endpoint para atualizar um equipamento existente
    @PutMapping("/{id}")
    public ResponseEntity<Equipment> updateEquipment(@PathVariable UUID id, @Valid @RequestBody EquipmentDTO dto) {
        Equipment updatedEquipment = equipmentService.updateEquipment(id, dto);
        return ResponseEntity.ok(updatedEquipment); // Retorna 200 OK com o objeto atualizado
    }

    // Endpoint para deletar um equipamento
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEquipment(@PathVariable UUID id) {
        equipmentService.deleteEquipment(id);
        return ResponseEntity.noContent().build(); // Retorna 204 No Content
    }

    // Adicionar outros endpoints (GET by ID, PUT, DELETE) aqui posteriormente
} 