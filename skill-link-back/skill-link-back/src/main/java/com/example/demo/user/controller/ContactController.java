package com.example.demo.user.controller;

import com.example.demo.user.dto.SendEmailRequest;
import com.example.demo.user.dto.SendEmailResponse;
import com.example.demo.user.model.User;
import com.example.demo.user.service.ContactEmailService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/contact")
public class ContactController {

    @Autowired
    private ContactEmailService contactEmailService;

    @PostMapping("/send-email")
    public ResponseEntity<SendEmailResponse> enviarCorreo(@Valid @RequestBody SendEmailRequest request) {
        try {
            System.out.println("=== ENVÍO DE CORREO DE CONTACTO ===");
            System.out.println("Destinatario: " + request.destinatario());
            System.out.println("Asunto: " + request.asunto());

            // Obtener el usuario autenticado
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            User remitente = (User) authentication.getPrincipal();

            System.out.println("Remitente: " + remitente.getEmail());

            SendEmailResponse response = contactEmailService.enviarCorreoContacto(request, remitente);

            if (response.exito()) {
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.badRequest().body(response);
            }

        } catch (Exception e) {
            System.err.println("Error en endpoint de envío de correo: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500)
                    .body(SendEmailResponse.error("Error interno del servidor."));
        }
    }
}