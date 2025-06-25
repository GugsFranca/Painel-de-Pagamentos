package com.munipayback.repository;

import com.munipayback.entity.ChartsData;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ChartsDataRepository extends JpaRepository<ChartsData, Long> {
    Optional<ChartsData> findByName(String name);

}
