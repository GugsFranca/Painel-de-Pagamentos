package com.munipayback.service;

import com.munipayback.entity.ChartsData;
import com.munipayback.repository.ChartsDataRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class RowDataService {
    private final ChartsDataRepository chartsDataRepository;
    private final ChartsDataService chartsDataService;

    public void deleteRowData(String rowName, Long chartsDataId) {
        ChartsData chartsData = chartsDataRepository.findById(chartsDataId)
                .orElseThrow(() -> new RuntimeException("Tabela não encontrada: " + chartsDataId));

        chartsData.getData().removeIf(rowData -> rowData.getName().equals(rowName));
        chartsDataService.saveChartsData(chartsData);
    }
}
