package com.munipayback.controller;

import com.munipayback.service.RowDataService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/row-data")
@RequiredArgsConstructor
public class RowDataController {
    private final RowDataService rowDataService;


    @DeleteMapping("/delete/{rowName}/{chartsDataId}")
    public ResponseEntity<Void> deleteRowData(@PathVariable String rowName, @PathVariable Long chartsDataId) {
        rowDataService.deleteRowData(rowName, chartsDataId);
        return ResponseEntity.noContent().build();
    }
}
