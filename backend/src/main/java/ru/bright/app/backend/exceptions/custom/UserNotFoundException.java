package ru.bright.app.backend.exceptions.custom;

public class UserNotFoundException extends CustomException {
    public UserNotFoundException() {
        super("Пользователь не найден");
    }
}
