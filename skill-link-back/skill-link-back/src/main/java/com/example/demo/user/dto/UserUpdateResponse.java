package com.example.demo.user.dto;

import com.example.demo.common.Role;
import com.example.demo.common.UserInterest;

import java.util.List;

public record UserUpdateResponse(
        String mensaje,
        boolean exito,
        UserData usuario
) {
    public record UserData(
            Long id,
            String name,
            String secondName,
            String email,
            Role role,
            List<UserInterest> interests
    ) {}

    // Métodos de utilidad para crear respuestas
    public static UserUpdateResponse exito(String mensaje, UserData usuario) {
        return new UserUpdateResponse(mensaje, true, usuario);
    }

    public static UserUpdateResponse error(String mensaje) {
        return new UserUpdateResponse(mensaje, false, null);
    }
}