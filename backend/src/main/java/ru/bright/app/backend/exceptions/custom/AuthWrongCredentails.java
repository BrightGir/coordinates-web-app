package ru.bright.app.backend.exceptions.custom;

public class AuthWrongCredentails extends CustomException {

    public AuthWrongCredentails() {
        super("Неверный логин или пароль.");
    }
}
