package com.academicspaces.service;

import com.academicspaces.entity.Equipment; // Precisamos criar esta entidade
import com.academicspaces.repository.EquipmentRepository; // Precisamos criar este repositório
import com.academicspaces.dto.EquipmentDTO; // Importa o DTO
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class EquipmentService {

    @Autowired
    private EquipmentRepository equipmentRepository;

    @Transactional(readOnly = true)
    public List<Equipment> listAll() {
        return equipmentRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Equipment findById(UUID id) {
        return equipmentRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Equipamento não encontrado com ID: " + id));
    }

    @Transactional
    public Equipment createEquipment(EquipmentDTO dto) {
        Equipment equipment = new Equipment();
        equipment.setName(dto.getName());
        // Definir outros campos se houver (description, etc.)
        return equipmentRepository.save(equipment);
    }

    @Transactional
    public Equipment updateEquipment(UUID id, EquipmentDTO dto) {
        Equipment existingEquipment = findById(id); // Reusa findById para buscar ou lançar erro
        existingEquipment.setName(dto.getName());
        // Atualizar outros campos se houver
        return equipmentRepository.save(existingEquipment);
    }

    @Transactional
    public void deleteEquipment(UUID id) {
        Equipment equipment = findById(id); // Garante que o equipamento existe antes de deletar
        equipmentRepository.delete(equipment);
    }
} 