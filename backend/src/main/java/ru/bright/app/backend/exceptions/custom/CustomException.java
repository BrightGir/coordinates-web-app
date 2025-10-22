package ru.bright.app.backend.exceptions.custom;

public class CustomException extends RuntimeException {

    public CustomException(String message) {
        super(message);
    }
}
