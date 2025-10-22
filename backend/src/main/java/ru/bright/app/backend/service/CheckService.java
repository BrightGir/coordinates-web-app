package ru.bright.app.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.util.Pair;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.bright.app.backend.dto.CheckRequestDTO;
import ru.bright.app.backend.dto.ResultResponseDTO;
import ru.bright.app.backend.entity.CheckData;
import ru.bright.app.backend.entity.User;
import ru.bright.app.backend.exceptions.custom.CheckDataNotExists;
import ru.bright.app.backend.exceptions.custom.UserNotFoundException;
import ru.bright.app.backend.repository.CheckDataRepository;
import ru.bright.app.backend.repository.UserRepository;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CheckService {
    
    private final CheckDataRepository checkDataRepository;
    private final UserRepository userRepository;

    public ResultResponseDTO check(CheckRequestDTO request) {
        long startTime = System.nanoTime();
        boolean hit = checkHit(request.x(), request.y(), request.r());
        long endTime = System.nanoTime();
        double executionTime = (endTime - startTime) / 1e6;
        CheckData result = new CheckData();
        result.setX(request.x());
        result.setY(request.y());
        result.setR(request.r());
        result.setHit(hit);
        result.setExecutionTime(executionTime);
        result.setClientTimestamp(request.clientTimestamp());
        result.setClientTimeZone(request.clientTimezone());
        result.setUser(getCurrentUser());
        CheckData savedResult = checkDataRepository.save(result);
        return new ResultResponseDTO(savedResult);
    }

    private User getCurrentUser() {
        User user = userRepository.findByUsername(
                SecurityContextHolder.getContext().getAuthentication().getName());
        if(user == null) {
            throw new UserNotFoundException();
        }
        return user;
    }
    
    public Pair<Integer, List<ResultResponseDTO>> getResults(int page, int pageSize) {
        User currentUser = getCurrentUser();
        Pageable pageable = PageRequest.of(page - 1, pageSize, Sort.Direction.DESC, "clientTimestamp");
        Page<CheckData> results = checkDataRepository.findByUserId(
                currentUser.getId(),
                pageable);
    //    List<CheckData> reversed = new ArrayList<>(results.toList());
       // Collections.reverse(reversed);
        
        List<ResultResponseDTO> list = new ArrayList<>();
        for (CheckData result : results.toList()) {
            list.add(new ResultResponseDTO(result));
        }
        return Pair.of(results.getTotalPages(), list);
    }

    @Transactional
    public void deleteResult(Long id) {
        if(!checkDataRepository.existsById(id)) {
            throw new CheckDataNotExists();
        }
        checkDataRepository.deleteById(id);
    }

    private boolean checkHit(Double x, Double y, Double r) {
        if(x == 0) {
            return y >= -r && y <= r/2;
        }
        if(y == 0) {
            return x >= -r && x <= r;
        }

        if (x >= 0 && y >= 0 && x <= r && y <= r/2) {
            return true;
        }

        if (x <= 0 && y <= 0 && x * x + y * y <= r*r) {
            return true;
        }

        if (x >= 0 && y <= 0 && y >= x-r) {
            return true;
        }
        return false;
    }

}
