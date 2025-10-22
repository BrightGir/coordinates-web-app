package ru.bright.app.backend.filters;

import io.jsonwebtoken.JwtException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import ru.bright.app.backend.entity.User;
import ru.bright.app.backend.repository.UserRepository;
import ru.bright.app.backend.utils.TokenManager;

import java.io.IOException;
import java.util.Collections;

@Component
@RequiredArgsConstructor
public class AuthFilter extends OncePerRequestFilter {

    private final TokenManager tokenManager;

    private final UserRepository userRepository;

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        return request.getRequestURI().startsWith("/api/auth/");
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        String authHeader = request.getHeader("Authorization");
        String username = null;

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            writeTokenExceptionResponse(response);
            return;
        }

        String key = authHeader.substring(7);
        if (key.trim().isEmpty()) {
            writeTokenExceptionResponse(response);
            return;
        }
        try {
            username = tokenManager.getUserByToken(key);
        } catch (JwtException e) {
            writeTokenExceptionResponse(response);
            return;
        }
        if (tokenManager.isTokenExpired(key)) {
            writeTokenExceptionResponse(response);
            return;
        }

        User user = userRepository.findByUsername(username);
        if (user == null) {
            writeTokenExceptionResponse(response);
            return;
        }
        UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                username, null, Collections.emptyList());
        SecurityContextHolder.getContext().setAuthentication(authToken);
        filterChain.doFilter(request, response);
    }

    private void writeTokenExceptionResponse(HttpServletResponse response) {
        response.setStatus(HttpStatus.UNAUTHORIZED.value());
    }
}