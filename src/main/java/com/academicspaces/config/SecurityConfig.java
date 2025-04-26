package com.academicspaces.config;

import com.academicspaces.service.CustomUserDetailsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import static org.springframework.security.config.Customizer.withDefaults;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private CustomUserDetailsService customUserDetailsService;

    @Autowired
    private JwtRequestFilter jwtRequestFilter;

    @Autowired
    private JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint; // Precisamos criar este entry point

    // Configura o PasswordEncoder
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // Configura o AuthenticationManager
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    // Define as regras de segurança HTTP
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable()) // Desabilitar CSRF para APIs stateless
            .authorizeHttpRequests(authz -> authz
                .requestMatchers("/api/auth/login").permitAll() // Permite acesso ao endpoint de login
                .requestMatchers("/api/auth/register-admin").permitAll() // Permitir acesso ao registro inicial (se criarmos)
                // Exigir autenticação para qualquer outra requisição
                .anyRequest().authenticated()
            )
            // Define o entry point para erros de autenticação
             .exceptionHandling(exceptions -> exceptions
                 .authenticationEntryPoint(jwtAuthenticationEntryPoint)
             )
            // Garante que a sessão seja stateless (não armazena estado no servidor)
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )
            // Adiciona o filtro JWT antes do filtro de autenticação padrão
            .addFilterBefore(jwtRequestFilter, UsernamePasswordAuthenticationFilter.class)
             .httpBasic(withDefaults()); // Pode ser necessário ou não, dependendo da config

        return http.build();
    }
} 