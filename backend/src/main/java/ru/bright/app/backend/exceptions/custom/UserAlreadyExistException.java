package ru.bright.app.backend.exceptions.custom;

public class UserAlreadyExistException extends CustomException {

    public UserAlreadyExistException() {
        super("Пользователь уже существует.");
    }
}
