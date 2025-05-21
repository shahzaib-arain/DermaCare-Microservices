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
    @PreAuthorize("hasAuthority('ROLE_DOCTOR')")
    public ResponseEntity<PrescriptionDTO> createPrescription(@RequestBody PrescriptionDTO prescriptionDTO) {
        return ResponseEntity.ok(pharmacyService.createPrescription(prescriptionDTO));
    }

    @GetMapping("/prescription/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_PATIENT', 'ROLE_DOCTOR', 'ROLE_ADMIN')")
    public ResponseEntity<PrescriptionDTO> getPrescription(@PathVariable String id) {
        return ResponseEntity.ok(pharmacyService.getPrescription(id));
    }

    @GetMapping("/prescription/patient/{patientId}")
    @PreAuthorize("hasAnyAuthority('ROLE_PATIENT', 'ROLE_DOCTOR', 'ROLE_ADMIN')")
    public ResponseEntity<List<PrescriptionDTO>> getPatientPrescriptions(@PathVariable String patientId) {
        return ResponseEntity.ok(pharmacyService.getPatientPrescriptions(patientId));
    }

    @PostMapping("/order/{prescriptionId}")
    @PreAuthorize("hasAuthority('ROLE_PATIENT')")
    public ResponseEntity<String> orderMedicines(@PathVariable String prescriptionId) {
        return ResponseEntity.ok(pharmacyService.orderMedicines(prescriptionId));
    }

    @GetMapping("/medicines")
    public ResponseEntity<List<MedicineDTO>> getAllMedicines() {
        return ResponseEntity.ok(pharmacyService.getAllMedicines());
    }
    @PostMapping("/medicines")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<MedicineDTO> addMedicine(@RequestBody MedicineDTO medicineDTO) {
        return ResponseEntity.ok(pharmacyService.addMedicine(medicineDTO));
    }

}