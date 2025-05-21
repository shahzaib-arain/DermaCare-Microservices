package com.virtual.dermacare_service.impl;

import com.virtual.dermacare_service.dto.MedicineDTO;
import com.virtual.dermacare_service.dto.PrescriptionDTO;
import com.virtual.dermacare_service.exception.ResourceNotFoundException;
import com.virtual.dermacare_service.exception.UnauthorizedAccessException;
import com.virtual.dermacare_service.model.Medicine;
import com.virtual.dermacare_service.model.Prescription;
import com.virtual.dermacare_service.model.PrescriptionItem;
import com.virtual.dermacare_service.repository.MedicineRepository;
import com.virtual.dermacare_service.repository.PrescriptionRepository;
import com.virtual.dermacare_service.service.PharmacyService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PharmacyServiceImpl implements PharmacyService {

    private final PrescriptionRepository prescriptionRepository;
    private final MedicineRepository medicineRepository;
    private final ModelMapper modelMapper;

    @Override
    @Transactional
    public PrescriptionDTO createPrescription(PrescriptionDTO prescriptionDTO) {
        JwtAuthenticationToken authentication = (JwtAuthenticationToken) SecurityContextHolder.getContext().getAuthentication();
        List<String> roles = authentication.getToken().getClaimAsStringList("roles");
        String userId = authentication.getToken().getClaimAsString("sub");

        if (roles == null || !roles.contains("ROLE_DOCTOR")) {
            throw new UnauthorizedAccessException("Only doctors can create prescriptions");
        }

        Prescription prescription = modelMapper.map(prescriptionDTO, Prescription.class);
        prescription.setDoctorId(userId);

        List<PrescriptionItem> items = prescriptionDTO.getItems().stream()
                .map(itemDTO -> {
                    Medicine medicine = medicineRepository.findById(itemDTO.getMedicineId())
                            .orElseThrow(() -> new ResourceNotFoundException("Medicine not found with id: " + itemDTO.getMedicineId()));

                    PrescriptionItem item = new PrescriptionItem();
                    item.setMedicine(medicine);
                    item.setDosage(itemDTO.getDosage());
                    item.setDuration(itemDTO.getDuration());
                    item.setInstructions(itemDTO.getInstructions());
                    return item;
                })
                .collect(Collectors.toList());

        prescription.setItems(items);
        Prescription savedPrescription = prescriptionRepository.save(prescription);
        return modelMapper.map(savedPrescription, PrescriptionDTO.class);
    }

    @Override
    public PrescriptionDTO getPrescription(String id) {
        Prescription prescription = prescriptionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Prescription not found"));

        checkPrescriptionAccess(prescription);

        return modelMapper.map(prescription, PrescriptionDTO.class);
    }

    @Override
    public List<PrescriptionDTO> getPatientPrescriptions(String patientId) {
        JwtAuthenticationToken authentication = (JwtAuthenticationToken) SecurityContextHolder.getContext().getAuthentication();
        String userId = authentication.getToken().getClaimAsString("sub");
        List<String> roles = authentication.getToken().getClaimAsStringList("roles");

        if (!userId.equals(patientId)) {
            boolean hasAccess = roles.stream()
                    .anyMatch(role -> role.equals("ROLE_DOCTOR") || role.equals("ROLE_ADMIN"));
            if (!hasAccess) {
                throw new UnauthorizedAccessException("You don't have permission to access these records");
            }
        }

        return prescriptionRepository.findByPatientId(patientId).stream()
                .map(p -> modelMapper.map(p, PrescriptionDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public String orderMedicines(String prescriptionId) {
        JwtAuthenticationToken authentication = (JwtAuthenticationToken) SecurityContextHolder.getContext().getAuthentication();
        String userId = authentication.getToken().getClaimAsString("sub");

        Prescription prescription = prescriptionRepository.findById(prescriptionId)
                .orElseThrow(() -> new ResourceNotFoundException("Prescription not found"));


        for (PrescriptionItem item : prescription.getItems()) {
            Medicine medicine = item.getMedicine();
            if (medicine.getStock() <= 0) {
                throw new ResourceNotFoundException("Medicine " + medicine.getName() + " is out of stock");
            }
            medicine.setStock(medicine.getStock() - 1);
            medicineRepository.save(medicine);
        }

        prescription.setStatus("ORDERED");
        prescriptionRepository.save(prescription);

        return "Medicines ordered successfully for prescription ID: " + prescriptionId;
    }

    @Override
    public List<MedicineDTO> getAllMedicines() {
        return medicineRepository.findAll().stream()
                .map(m -> modelMapper.map(m, MedicineDTO.class))
                .collect(Collectors.toList());
    }

    private void checkPrescriptionAccess(Prescription prescription) {
        JwtAuthenticationToken authentication = (JwtAuthenticationToken) SecurityContextHolder.getContext().getAuthentication();
        String userId = authentication.getToken().getClaimAsString("sub");
        List<String> roles = authentication.getToken().getClaimAsStringList("roles");

        if (!userId.equals(prescription.getPatientId()) && !userId.equals(prescription.getDoctorId())) {
            if (roles == null || !roles.contains("ROLE_ADMIN")) {
                throw new UnauthorizedAccessException("You don't have permission to access this prescription");
            }
        }
    }

    @Override
    @Transactional
    public MedicineDTO addMedicine(MedicineDTO medicineDTO) {
        Medicine medicine = modelMapper.map(medicineDTO, Medicine.class);

        // You can add validation if you want here, for example:
        if (medicine.getStock() < 0) {
            medicine.setStock(0);
        }

        Medicine savedMedicine = medicineRepository.save(medicine);
        return modelMapper.map(savedMedicine, MedicineDTO.class);
    }

}