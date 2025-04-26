package com.academicspaces.controller;

import com.academicspaces.dto.EspacoCadastroDTO;
import com.academicspaces.entity.Espaco;
import com.academicspaces.service.EspacoService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/espacos")
public class EspacoController {

    @Autowired
    private EspacoService espacoService;

    // Endpoint para listar todos os espaços
    @GetMapping
    public ResponseEntity<List<Espaco>> listarTodosEspacos() {
        List<Espaco> espacos = espacoService.listarTodos();
        return ResponseEntity.ok(espacos);
    }

    // Endpoint para listar espaços disponíveis (Requisito 2)
    @GetMapping("/disponiveis")
    public ResponseEntity<List<Espaco>> listarEspacosDisponiveis() {
        List<Espaco> espacos = espacoService.listarDisponiveis();
        return ResponseEntity.ok(espacos);
    }

    // Endpoint para buscar um espaço por ID
    @GetMapping("/{id}")
    public ResponseEntity<Espaco> buscarEspacoPorId(@PathVariable UUID id) {
        Espaco espaco = espacoService.buscarPorId(id);
        return ResponseEntity.ok(espaco);
    }

    // Endpoint para cadastrar um novo espaço (Requisito 1.1)
    @PostMapping
    public ResponseEntity<Espaco> cadastrarEspaco(@Valid @RequestBody EspacoCadastroDTO dto) {
        Espaco novoEspaco = espacoService.cadastrarEspaco(dto);
        // Retorna 201 Created com o objeto criado e o Location header
        return ResponseEntity.status(HttpStatus.CREATED).body(novoEspaco);
    }

    // Endpoint para atualizar um espaço (Requisito 1.3)
    @PutMapping("/{id}")
    public ResponseEntity<Espaco> atualizarEspaco(@PathVariable UUID id, @Valid @RequestBody EspacoCadastroDTO dto) {
        Espaco espacoAtualizado = espacoService.atualizarEspaco(id, dto);
        return ResponseEntity.ok(espacoAtualizado);
    }

    // Endpoint para deletar um espaço
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarEspaco(@PathVariable UUID id) {
        espacoService.deletarEspaco(id);
        return ResponseEntity.noContent().build(); // Retorna 204 No Content
    }

    // Endpoint para marcar um espaço como indisponível (Requisito 3 - Controle)
    @PatchMapping("/{id}/indisponivel")
    public ResponseEntity<Espaco> tornarEspacoIndisponivel(@PathVariable UUID id) {
        Espaco espaco = espacoService.tornarIndisponivel(id);
        return ResponseEntity.ok(espaco);
    }

    // Endpoint para marcar um espaço como disponível
     @PatchMapping("/{id}/disponivel")
     public ResponseEntity<Espaco> tornarEspacoDisponivel(@PathVariable UUID id) {
         Espaco espaco = espacoService.tornarDisponivel(id);
         return ResponseEntity.ok(espaco);
     }

} 