package ru.bright.app.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RegisterRequestDTO(
                             @NotBlank(message = "Имя пользователя не может быть пустым.")
                             @Size(min=4, max=15, message = "Имя пользователя должно содержать от 4 до 15 символов")
                             String user,
                             @NotBlank(message = "Пароль не может быть пустым.")
                             @Size(min=6, max=30, message = "Пароль должен содержать от 6 до 30 символов")
                             String password) {
}
