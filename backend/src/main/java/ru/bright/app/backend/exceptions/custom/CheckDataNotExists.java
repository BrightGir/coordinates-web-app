package ru.bright.app.backend.exceptions.custom;

public class CheckDataNotExists extends CustomException {
    public CheckDataNotExists() {
        super("Объект не найден");
    }
}
