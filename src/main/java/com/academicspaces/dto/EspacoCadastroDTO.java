package com.academicspaces.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class EspacoCadastroDTO {

    @NotBlank(message = "Sigla não pode ser vazia")
    @Size(max = 10, message = "Sigla deve ter no máximo 10 caracteres")
    private String sigla;

    @NotBlank(message = "Nome não pode ser vazio")
    @Size(max = 100, message = "Nome deve ter no máximo 100 caracteres")
    private String nome;

    @Size(max = 255, message = "Descrição deve ter no máximo 255 caracteres")
    private String descricao;

    @NotNull(message = "Capacidade não pode ser nula")
    @Min(value = 1, message = "Capacidade deve ser no mínimo 1")
    private Integer capacidade;
} 