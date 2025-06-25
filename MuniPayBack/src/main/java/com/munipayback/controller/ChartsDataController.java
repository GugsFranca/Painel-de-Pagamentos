package com.munipayback.controller;

import com.munipayback.entity.ChartsData;
import com.munipayback.service.ChartsDataService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/charts")
@RequiredArgsConstructor
public class ChartsDataController {
    private final ChartsDataService chartsDataService;

    @PostMapping
    public ResponseEntity<ChartsData> saveChartsData(@RequestBody ChartsData chartsData) {
        return ResponseEntity.ok(chartsDataService.saveChartsData(chartsData));
    }

    @GetMapping
    public ResponseEntity<List<ChartsData>> getAllChartsData() {
        return ResponseEntity.ok(chartsDataService.getAllChartsData());
    }

    @GetMapping("/{name}")
    public ResponseEntity<ChartsData> getChartsDataById(@PathVariable String name) {
        var table = chartsDataService.getChartsDataByName(name);
        if (table != null) {
            return ResponseEntity.ok(table);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteChartsDataById(@PathVariable Long id) {
        chartsDataService.deleteChartsDataById(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping
    public ResponseEntity<ChartsData> updateChartsData(@RequestBody List<ChartsData> chartsData) {
        return ResponseEntity.ok(chartsDataService.updateChartsData(chartsData.getLast()));
    }


}
