package ru.bright.app.backend.dto;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

public record CheckRequestDTO(
        @NotNull(message = "X не может быть null.")
        @DecimalMin(value = "-5.0", message = "X должен быть не меньше -5")
        @DecimalMax(value = "5.0", message = "X должен быть не больше 5")
        Double x,
        @NotNull(message = "Y не может быть null.")
        @DecimalMin(value = "-5.0", message = "Y должен быть не меньше -5")
        @DecimalMax(value = "5.0", message = "Y должен быть не больше 5")
        Double y,

        @NotNull(message = "R не может быть null.")
        @DecimalMin(value = "0.0", inclusive = false, message = "R должен быть положительным")
        @DecimalMax(value = "2.0", message = "R должен быть не больше 2")
        Double r,

        @NotNull(message = "ClientTimestamp не может быть null.")
        Long clientTimestamp,

        @NotBlank(message = "ClientTimezone не может быть пустым или null.")
        String clientTimezone) {
}
