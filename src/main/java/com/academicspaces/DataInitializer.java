package com.academicspaces;

import com.academicspaces.entity.Administrador;
import com.academicspaces.repository.AdministradorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private AdministradorRepository administradorRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Verifica se o admin padrão já existe
        if (administradorRepository.findByEmail("alexandrevillarino27@gmail.com").isEmpty()) {
            Administrador admin = new Administrador();
            admin.setNome("Admin Padrão");
            admin.setEmail("alexandrevillarino27@gmail.com");
            // Hashear a senha antes de salvar!
            admin.setSenha(passwordEncoder.encode("password"));

            administradorRepository.save(admin);
            System.out.println("Usuário admin padrão criado com senha 'password'");
        }
    }
} 