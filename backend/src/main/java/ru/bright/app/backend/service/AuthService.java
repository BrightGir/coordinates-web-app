package ru.bright.app.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.bright.app.backend.entity.User;
import ru.bright.app.backend.exceptions.custom.UserAlreadyExistException;
import ru.bright.app.backend.exceptions.custom.AuthWrongCredentails;
import ru.bright.app.backend.repository.UserRepository;
import ru.bright.app.backend.utils.TokenManager;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final TokenManager tokenManager;

    @Transactional
    public void register(String username, String password) {
        if(userRepository.findByUsername(username) != null) {
            throw new UserAlreadyExistException();
        }
        User user = new User();
        user.setUsername(username);
        user.setPassword(passwordEncoder.encode(password));
        userRepository.save(user);
    }

    public String login(String username, String password) {
        User user = userRepository.findByUsername(username);
        if(user == null || !passwordEncoder.matches(password, user.getPassword())) {
            throw new AuthWrongCredentails();
        }
        return tokenManager.generateToken(username);
    }
}
