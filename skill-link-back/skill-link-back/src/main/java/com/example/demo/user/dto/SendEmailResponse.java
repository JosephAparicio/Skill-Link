package com.example.demo.user.dto;

public record SendEmailResponse(
        String mensaje,
        boolean exito
) {
    public static SendEmailResponse exito(String mensaje) {
        return new SendEmailResponse(mensaje, true);
    }

    public static SendEmailResponse error(String mensaje) {
        return new SendEmailResponse(mensaje, false);
    }
}