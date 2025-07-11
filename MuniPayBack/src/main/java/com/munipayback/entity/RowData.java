package com.munipayback.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Entity
@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class RowData {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    private String name;
    @ElementCollection
    private List<Integer> meses;
    @ElementCollection
    @Builder.Default
    private List<Double> valores = new ArrayList<>();

    @PrePersist
    @PreUpdate
    private void ensureValoresSize() {
        if (valores == null) {
            valores = new ArrayList<>(Collections.nCopies(12, 0.0));
        } else if (valores.size() < 12) {
            for (int i = valores.size(); i < 12; i++) {
                valores.add(0.0);
            }
        }
    }
}