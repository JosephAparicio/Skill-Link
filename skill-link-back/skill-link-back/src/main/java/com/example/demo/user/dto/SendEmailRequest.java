package com.example.demo.user.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record SendEmailRequest(
        @NotBlank(message = "El email del destinatario es obligatorio")
        @Email(message = "El formato del email no es válido")
        String destinatario,

        @NotBlank(message = "El asunto es obligatorio")
        @Size(max = 100, message = "El asunto no puede exceder 100 caracteres")
        String asunto,

        @NotBlank(message = "El mensaje es obligatorio")
        @Size(max = 500, message = "El mensaje no puede exceder 500 caracteres")
        String mensaje
) {
}