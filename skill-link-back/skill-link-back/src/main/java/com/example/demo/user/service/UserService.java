package com.example.demo.user.service;

import com.example.demo.user.dto.UserRegisterRequest;
import com.example.demo.user.dto.UserUpdateRequest;
import com.example.demo.user.dto.UserUpdateResponse;
import com.example.demo.user.dto.UserResponse;
import com.example.demo.user.model.User;
import com.example.demo.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class UserService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public User register(UserRegisterRequest userRegisterRequest) {
        if(userRepository.existsByEmail(userRegisterRequest.email())) {
            throw new RuntimeException("El email ya está registrado");
        }

        String hashedPassword = passwordEncoder.encode(userRegisterRequest.password());
        User user = new User(userRegisterRequest);
        user.setPassword(hashedPassword);

        return userRepository.save(user);
    }

    public UserResponse getPublicProfile(Long userId) {
        try {
            Optional<User> userOptional = userRepository.findById(userId);
            if (userOptional.isEmpty()) {
                return null;
            }

            User user = userOptional.get();

            if (!user.isActive()) {
                return null;
            }

            return new UserResponse(
                    user.getId(),
                    user.getName(),
                    user.getSecondName(),
                    user.getEmail(),
                    user.getRole(),
                    user.getInterests()
            );
        } catch (Exception e) {
            System.err.println("Error al obtener perfil público: " + e.getMessage());
            e.printStackTrace();
            return null;
        }
    }

    @Transactional
    public UserUpdateResponse updateProfile(Long userId, UserUpdateRequest updateRequest) {
        try {
            Optional<User> userOptional = userRepository.findById(userId);
            if (userOptional.isEmpty()) {
                return UserUpdateResponse.error("Usuario no encontrado.");
            }

            User user = userOptional.get();

            if (!user.getEmail().equals(updateRequest.email()) &&
                    userRepository.existsByEmail(updateRequest.email())) {
                return UserUpdateResponse.error("El email ya está registrado por otro usuario.");
            }

            user.setName(updateRequest.name());
            user.setSecondName(updateRequest.secondName());
            user.setEmail(updateRequest.email());
            user.setRole(updateRequest.role());
            user.setInterests(updateRequest.interests());

            User updatedUser = userRepository.save(user);

            UserUpdateResponse.UserData userData = new UserUpdateResponse.UserData(
                    updatedUser.getId(),
                    updatedUser.getName(),
                    updatedUser.getSecondName(),
                    updatedUser.getEmail(),
                    updatedUser.getRole(),
                    updatedUser.getInterests()
            );

            return UserUpdateResponse.exito("Perfil actualizado exitosamente.", userData);

        } catch (Exception e) {
            System.err.println("Error al actualizar perfil: " + e.getMessage());
            e.printStackTrace();
            return UserUpdateResponse.error("Error interno del servidor.");
        }
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        UserDetails user = userRepository.findByEmail(email);
        if(user == null) {
            throw new UsernameNotFoundException("Usuario no encontrado con email: " + email);
        }
        return user;
    }
}