package com.academicspaces.service;

import com.academicspaces.dto.ProfessorCadastroDTO;
import com.academicspaces.entity.Professor;
import com.academicspaces.repository.ProfessorRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class ProfessorService {

    @Autowired
    private ProfessorRepository professorRepository;

    @Transactional(readOnly = true)
    public List<Professor> listarTodos() {
        return professorRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Professor buscarPorId(UUID id) {
        return professorRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Professor não encontrado com ID: " + id));
    }

    @Transactional
    public Professor cadastrarProfessor(ProfessorCadastroDTO dto) {
        Professor professor = new Professor();
        professor.setNome(dto.getNome());
        professor.setEscola(dto.getEscola());
        // Adicionar lógica para email/senha se necessário
        return professorRepository.save(professor);
    }

    @Transactional
    public Professor atualizarProfessor(UUID id, ProfessorCadastroDTO dto) {
        Professor professorExistente = buscarPorId(id);
        professorExistente.setNome(dto.getNome());
        professorExistente.setEscola(dto.getEscola());
        return professorRepository.save(professorExistente);
    }

    @Transactional
    public void deletarProfessor(UUID id) {
        Professor professor = buscarPorId(id);
        // Adicionar lógica para verificar se professor tem reservas associadas
        professorRepository.delete(professor);
    }
} 