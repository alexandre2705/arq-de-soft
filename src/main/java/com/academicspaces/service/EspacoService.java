package com.academicspaces.service;

import com.academicspaces.dto.EspacoCadastroDTO;
import com.academicspaces.entity.Espaco;
import com.academicspaces.enums.StatusEspaco;
import com.academicspaces.repository.EspacoRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class EspacoService {

    @Autowired
    private EspacoRepository espacoRepository;

    @Transactional(readOnly = true)
    public List<Espaco> listarTodos() {
        return espacoRepository.findAll();
    }

    @Transactional(readOnly = true)
    public List<Espaco> listarDisponiveis() {
        return espacoRepository.findByStatus(StatusEspaco.DISPONIVEL);
    }

    @Transactional(readOnly = true)
    public Espaco buscarPorId(UUID id) {
        return espacoRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Espaço não encontrado com ID: " + id));
    }

    @Transactional
    public Espaco cadastrarEspaco(EspacoCadastroDTO dto) {
        // Adicionar validação para sigla única se necessário
        // if (espacoRepository.findBySigla(dto.getSigla()).isPresent()) {
        //     throw new IllegalArgumentException("Sigla já cadastrada.");
        // }
        Espaco espaco = new Espaco();
        espaco.setSigla(dto.getSigla());
        espaco.setNome(dto.getNome());
        espaco.setDescricao(dto.getDescricao());
        espaco.setCapacidade(dto.getCapacidade());
        espaco.setStatus(StatusEspaco.DISPONIVEL); // Status inicial
        return espacoRepository.save(espaco);
    }

    @Transactional
    public Espaco atualizarEspaco(UUID id, EspacoCadastroDTO dto) {
        Espaco espacoExistente = buscarPorId(id);
        // Atualizar apenas os campos permitidos
        espacoExistente.setSigla(dto.getSigla()); // Considerar validação de sigla única na atualização
        espacoExistente.setNome(dto.getNome());
        espacoExistente.setDescricao(dto.getDescricao());
        espacoExistente.setCapacidade(dto.getCapacidade());
        // Não permitir atualização direta do status aqui, pode ter regra específica
        return espacoRepository.save(espacoExistente);
    }

     @Transactional
     public void deletarEspaco(UUID id) {
         Espaco espaco = buscarPorId(id);
         // Adicionar lógica para verificar se há reservas futuras antes de excluir
         espacoRepository.delete(espaco);
     }

    // Método para tornar espaço indisponível (Requisito 3 da seção "Sobre o Controle")
    @Transactional
    public Espaco tornarIndisponivel(UUID id) {
        Espaco espaco = buscarPorId(id);
        espaco.setStatus(StatusEspaco.INDISPONIVEL);
        return espacoRepository.save(espaco);
    }

    // Método para tornar espaço disponível (pode ser necessário)
    @Transactional
    public Espaco tornarDisponivel(UUID id) {
        Espaco espaco = buscarPorId(id);
        espaco.setStatus(StatusEspaco.DISPONIVEL);
        return espacoRepository.save(espaco);
    }

} 