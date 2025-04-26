package com.academicspaces.controller;

import com.academicspaces.dto.ProfessorCadastroDTO;
import com.academicspaces.entity.Professor;
import com.academicspaces.service.ProfessorService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/professores")
public class ProfessorController {

    @Autowired
    private ProfessorService professorService;

    @GetMapping
    public ResponseEntity<List<Professor>> listarTodosProfessores() {
        List<Professor> professores = professorService.listarTodos();
        return ResponseEntity.ok(professores);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Professor> buscarProfessorPorId(@PathVariable UUID id) {
        Professor professor = professorService.buscarPorId(id);
        return ResponseEntity.ok(professor);
    }

    // Endpoint para cadastrar professor (Requisito 1.2)
    @PostMapping
    public ResponseEntity<Professor> cadastrarProfessor(@Valid @RequestBody ProfessorCadastroDTO dto) {
        Professor novoProfessor = professorService.cadastrarProfessor(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(novoProfessor);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Professor> atualizarProfessor(@PathVariable UUID id, @Valid @RequestBody ProfessorCadastroDTO dto) {
        Professor professorAtualizado = professorService.atualizarProfessor(id, dto);
        return ResponseEntity.ok(professorAtualizado);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarProfessor(@PathVariable UUID id) {
        professorService.deletarProfessor(id);
        return ResponseEntity.noContent().build();
    }
} 