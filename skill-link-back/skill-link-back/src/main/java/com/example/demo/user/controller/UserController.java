package com.example.demo.user.controller;

import com.example.demo.user.service.UserService;
import com.example.demo.user.dto.*;
import com.example.demo.infra.security.TokenService;
import com.example.demo.user.model.User;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/usuarios")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private TokenService tokenService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody UserRegisterRequest userRegisterRequest){
        try{
            System.out.println("=== REGISTRO DE USUARIO ===");
            System.out.println("Datos recibidos: " + userRegisterRequest);

            if(userRegisterRequest.role().name().equals("Admin")) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "No se puede registrar un usuario con el rol ADMIN."));
            }

            User user = userService.register(userRegisterRequest);
            System.out.println("Usuario creado con ID: " + user.getId());

            String jwtToken = tokenService.generateToken(user);
            System.out.println("Token generado exitosamente");

            UserRegisterResponse.UserResponse userResponse = new UserRegisterResponse.UserResponse(
                    user.getId(),
                    user.getName(),
                    user.getSecondName(),
                    user.getEmail(),
                    user.getRole(),
                    user.getInterests()
            );

            UserRegisterResponse response = new UserRegisterResponse(jwtToken, userResponse);

            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            System.err.println("Error de runtime: " + e.getMessage());
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            System.err.println("Error general: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500)
                    .body(Map.of("error", "Error interno del servidor."));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@Valid @RequestBody UserLoginRequest userLoginRequest){
        try{
            System.out.println("=== LOGIN DE USUARIO ===");
            System.out.println("Email: " + userLoginRequest.email());

            UsernamePasswordAuthenticationToken authToken =
                    new UsernamePasswordAuthenticationToken(userLoginRequest.email(), userLoginRequest.password());

            Authentication authentication = authenticationManager.authenticate(authToken);
            User user = (User) authentication.getPrincipal();

            if (!user.isActive()) {
                return ResponseEntity.status(403)
                        .body(Map.of("error", "Tu cuenta está desactivada."));
            }

            String jwtToken = tokenService.generateToken(user);
            System.out.println("Login exitoso para usuario: " + user.getEmail());

            UserLoginResponse response = new UserLoginResponse(
                    jwtToken,
                    user.getId(),
                    user.getName(),
                    user.getSecondName(),
                    user.getEmail(),
                    user.getRole(),
                    user.getInterests()
            );

            return ResponseEntity.ok(response);
        } catch (BadCredentialsException e) {
            System.err.println("Credenciales incorrectas para: " + userLoginRequest.email());
            return ResponseEntity.status(401)
                    .body(Map.of("error", "Email o contraseña incorrectos."));
        } catch (AuthenticationException e) {
            System.err.println("Error de autenticación: " + e.getMessage());
            return ResponseEntity.status(401)
                    .body(Map.of("error", "Error de autenticación."));
        } catch (Exception e) {
            System.err.println("Error en login: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500)
                    .body(Map.of("error", "Error interno del servidor."));
        }
    }

    @GetMapping("/profile")
    public ResponseEntity<?> getUserProfile() {
        try {
            System.out.println("=== OBTENER PERFIL DE USUARIO ===");

            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            User user = (User) authentication.getPrincipal();

            System.out.println("Perfil solicitado para usuario: " + user.getEmail());

            UserResponse userResponse = new UserResponse(
                    user.getId(),
                    user.getName(),
                    user.getSecondName(),
                    user.getEmail(),
                    user.getRole(),
                    user.getInterests()
            );

            return ResponseEntity.ok(userResponse);
        } catch (Exception e) {
            System.err.println("Error al obtener perfil: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500)
                    .body(Map.of("error", "Error interno del servidor."));
        }
    }

    @GetMapping("/profile/{userId}")
    public ResponseEntity<?> getUserProfileById(@PathVariable Long userId) {
        try {
            System.out.println("=== OBTENER PERFIL PÚBLICO DE USUARIO ===");
            System.out.println("ID solicitado: " + userId);

            UserResponse userResponse = userService.getPublicProfile(userId);

            if (userResponse == null) {
                return ResponseEntity.notFound().build();
            }

            return ResponseEntity.ok(userResponse);
        } catch (Exception e) {
            System.err.println("Error al obtener perfil público: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500)
                    .body(Map.of("error", "Error interno del servidor."));
        }
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateUserProfile(@Valid @RequestBody UserUpdateRequest updateRequest) {
        try {
            System.out.println("=== ACTUALIZAR PERFIL DE USUARIO ===");
            System.out.println("Datos recibidos: " + updateRequest);

            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            User currentUser = (User) authentication.getPrincipal();

            System.out.println("Actualizando perfil para usuario: " + currentUser.getEmail());

            UserUpdateResponse response = userService.updateProfile(currentUser.getId(), updateRequest);

            if (response.exito()) {
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.badRequest().body(response);
            }
        } catch (RuntimeException e) {
            System.err.println("Error de runtime: " + e.getMessage());
            return ResponseEntity.badRequest()
                    .body(UserUpdateResponse.error(e.getMessage()));
        } catch (Exception e) {
            System.err.println("Error al actualizar perfil: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500)
                    .body(UserUpdateResponse.error("Error interno del servidor."));
        }
    }
}