package ru.bright.app.backend.repository;


import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ru.bright.app.backend.entity.CheckData;

import java.util.List;

@Repository
public interface CheckDataRepository extends JpaRepository<CheckData, Long> {

    Page<CheckData> findByUserId(Long userId, Pageable pageable);
}
