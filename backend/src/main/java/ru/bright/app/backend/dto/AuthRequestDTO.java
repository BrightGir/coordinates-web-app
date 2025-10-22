package ru.bright.app.backend.dto;

import jakarta.validation.constraints.NotBlank;

public record AuthRequestDTO(@NotBlank(message = "User не может быть пустым.")
                             String user,
                             @NotBlank(message = "Пароль не может быть пустым.")
                             String password) {
}
