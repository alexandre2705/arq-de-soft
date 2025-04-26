package com.academicspaces.config;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.io.Serializable;

@Component
public class JwtAuthenticationEntryPoint implements AuthenticationEntryPoint, Serializable {

    private static final long serialVersionUID = -7858869558953243875L;

    @Override
    public void commence(HttpServletRequest request,
                         HttpServletResponse response,
                         AuthenticationException authException) throws IOException, ServletException {
        
        // Define o status da resposta como 401 Unauthorized
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        
        // Define o tipo de conteúdo da resposta como JSON
        response.setContentType("application/json");
        
        // Cria uma mensagem de erro simples em formato JSON
        // Você pode personalizar esta mensagem ou usar um objeto de erro mais complexo
        String jsonPayload = String.format("{\"error\": \"Unauthorized\", \"message\": \"%s\"}", authException.getMessage());
        
        // Escreve a resposta JSON no corpo da resposta
        response.getWriter().write(jsonPayload);
    }
} 