package com.academicspaces.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ProfessorCadastroDTO {

    @NotBlank(message = "Nome não pode ser vazio")
    @Size(max = 150, message = "Nome deve ter no máximo 150 caracteres")
    private String nome;

    @NotBlank(message = "Escola não pode ser vazia")
    @Size(max = 100, message = "Escola deve ter no máximo 100 caracteres")
    private String escola;

    // Adicionar email e senha se for necessário para autenticação
    // @Email
    // private String email;
    // private String senha;
} 