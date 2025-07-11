package com.munipayback.service;

import com.munipayback.entity.ChartsData;
import com.munipayback.entity.RowData;
import com.munipayback.repository.ChartsDataRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@Slf4j
@RequiredArgsConstructor
public class ChartsDataService {
    private final ChartsDataRepository chartsDataRepository;

    public ChartsData saveChartsData(ChartsData chartsData) {
        if (chartsData.getName() == null || chartsData.getName().isEmpty()) {
            throw new IllegalArgumentException("ChartsData name cannot be null or empty");
        }
        return chartsDataRepository.save(chartsData);
    }

    @Transactional
    public ChartsData getChartsDataByName(String name) {
        if (name == null || name.isEmpty()) {
            throw new IllegalArgumentException("Name cannot be null or empty");
        }

        Optional<ChartsData> existingChart = chartsDataRepository.findByName(name);
        if (existingChart.isPresent()) {
            return existingChart.get();
        } else {
            var newChart = ChartsData.builder()
                    .name(name)
                    .data(setChartsData())
                    .build();
            try {
                return chartsDataRepository.save(newChart);
            } catch (DataIntegrityViolationException e) {
                log.warn("Concorrência detectada ao criar ChartsData com nome {} Tentando buscar novamente.", name);
                return chartsDataRepository.findByName(name)
                        .orElseThrow(() -> new RuntimeException("Erro ao recuperar ChartsData após concorrência."));
            }
        }
    }

    public void deleteChartsDataById(Long id) {
        chartsDataRepository.deleteById(id);
    }

    @Transactional
    public ChartsData updateChartsData(ChartsData chartsData) {
        chartsData.getData().removeIf(rowData -> rowData.getName() == null || rowData.getName().isEmpty());

        ChartsData existingChartsData = chartsDataRepository.findByName(chartsData.getName())
                .orElseThrow(() -> new RuntimeException("ChartsData not found for name: " + chartsData.getName()));

        BeanUtils.copyProperties(chartsData, existingChartsData, "id", "data");

        existingChartsData.getData().clear();
        for (RowData newRow : chartsData.getData()) {
            RowData existingRow = existingChartsData.getData().stream()
                    .filter(r -> r.getName().equals(newRow.getName()))
                    .findFirst()
                    .orElseGet(() -> RowData.builder()
                            .name(newRow.getName())
                            .meses(new ArrayList<>())
                            .valores(new ArrayList<>())
                            .build());

            existingRow.setMeses(newRow.getMeses());

            if (newRow.getValores() != null) {
                List<Double> valores = new ArrayList<>(newRow.getValores());
                while (valores.size() < 12) {
                    valores.add(0.0);
                }
                existingRow.setValores(valores);
            }

            existingChartsData.getData().add(existingRow);
        }

        return chartsDataRepository.save(existingChartsData);
    }

    public List<ChartsData> getAllChartsData() {
        return chartsDataRepository.findAll();
    }

    private List<RowData> setChartsData() {
        List<RowData> rowDataList = new ArrayList<>();
        rowDataList.add(RowData.builder().name("Mesquita").meses(List.of(0)).valores(List.of(0.0)).build());
        rowDataList.add(RowData.builder().name("Nilópolis").meses(List.of(0)).valores(List.of(0.0)).build());
        rowDataList.add(RowData.builder().name("Nova Iguaçu").meses(List.of(0)).valores(List.of(0.0)).build());
        rowDataList.add(RowData.builder().name("Queimados").meses(List.of(0)).valores(List.of(0.0)).build());
        rowDataList.add(RowData.builder().name("Japeri").meses(List.of(0)).valores(List.of(0.0)).build());
        rowDataList.add(RowData.builder().name("Belford Roxo").meses(List.of(0)).valores(List.of(0.0)).build());
        rowDataList.add(RowData.builder().name("Itaguaí").meses(List.of(0)).valores(List.of(0.0)).build());
        rowDataList.add(RowData.builder().name("Paracambi").meses(List.of(0)).valores(List.of(0.0)).build());
        return rowDataList;
    }
}
