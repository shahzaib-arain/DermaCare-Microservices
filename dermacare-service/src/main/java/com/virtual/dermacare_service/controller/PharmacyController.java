package com.virtual.dermacare_service.controller;
import com.virtual.dermacare_service.dto.MedicineDTO;
import com.virtual.dermacare_service.dto.PrescriptionDTO;
import com.virtual.dermacare_service.service.PharmacyService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pharmacy")
@RequiredArgsConstructor
public class PharmacyController {

    private final PharmacyService pharmacyService;

    @PostMapping("/prescription")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<PrescriptionDTO> createPrescription(@RequestBody PrescriptionDTO prescriptionDTO) {
        return ResponseEntity.ok(pharmacyService.createPrescription(prescriptionDTO));
    }

    @GetMapping("/prescription/{id}")
    @PreAuthorize("hasAnyRole('PATIENT', 'DOCTOR', 'ADMIN')")
    public ResponseEntity<PrescriptionDTO> getPrescription(@PathVariable Long id) {
        return ResponseEntity.ok(pharmacyService.getPrescription(id));
    }

    @GetMapping("/prescription/patient/{patientId}")
    @PreAuthorize("hasAnyRole('PATIENT', 'DOCTOR', 'ADMIN')")
    public ResponseEntity<List<PrescriptionDTO>> getPatientPrescriptions(@PathVariable Long patientId) {
        return ResponseEntity.ok(pharmacyService.getPatientPrescriptions(patientId));
    }

    @PostMapping("/order/{prescriptionId}")
    @PreAuthorize("hasRole('PATIENT')")
    public ResponseEntity<String> orderMedicines(@PathVariable Long prescriptionId) {
        return ResponseEntity.ok(pharmacyService.orderMedicines(prescriptionId));
    }

    @GetMapping("/medicines")
    public ResponseEntity<List<MedicineDTO>> getAllMedicines() {
        return ResponseEntity.ok(pharmacyService.getAllMedicines());
    }
}