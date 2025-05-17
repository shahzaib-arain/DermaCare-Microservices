package com.virtual.dermacare_service.impl;
import com.virtual.dermacare_service.dto.MedicineDTO;
import com.virtual.dermacare_service.dto.PrescriptionDTO;
import com.virtual.dermacare_service.exception.ResourceNotFoundException;
import com.virtual.dermacare_service.exception.UnauthorizedAccessException;
import com.virtual.dermacare_service.feignclient.UserServiceClient;
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
import com.virtual.dermacare_service.dto.UserResponseDTO;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PharmacyServiceImpl implements PharmacyService {

    private final PrescriptionRepository prescriptionRepository;
    private final MedicineRepository medicineRepository;
    private final UserServiceClient userServiceClient;
    private final ModelMapper modelMapper;

    @Override
    @Transactional
    public PrescriptionDTO createPrescription(PrescriptionDTO prescriptionDTO) {
        // Verify current user is a doctor
        String username = ((JwtAuthenticationToken) SecurityContextHolder.getContext().getAuthentication())
                .getToken().getClaimAsString("sub");
        UserResponseDTO currentUser = userServiceClient.validateUser(username, "");

        if (!currentUser.getRole().equals("DOCTOR")) {
            throw new UnauthorizedAccessException("Only doctors can create prescriptions");
        }

        Prescription prescription = modelMapper.map(prescriptionDTO, Prescription.class);
        prescription.setDoctorId(Long.valueOf(currentUser.getId()));

        // Set prescription items with proper medicine references
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
    public PrescriptionDTO getPrescription(Long id) {
        Prescription prescription = prescriptionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Prescription not found"));

        // Check access
        checkPrescriptionAccess(prescription);

        return modelMapper.map(prescription, PrescriptionDTO.class);
    }

    @Override
    public List<PrescriptionDTO> getPatientPrescriptions(Long patientId) {
        // Verify current user has access to these records
        String username = ((JwtAuthenticationToken) SecurityContextHolder.getContext().getAuthentication())
                .getToken().getClaimAsString("sub");
        UserResponseDTO currentUser = userServiceClient.validateUser(username, "");

        if (!currentUser.getId().equals(patientId) && !currentUser.getRole().equals("DOCTOR")
                && !currentUser.getRole().equals("ADMIN")) {
            throw new UnauthorizedAccessException("You don't have permission to access these records");
        }

        return prescriptionRepository.findByPatientId(patientId).stream()
                .map(p -> modelMapper.map(p, PrescriptionDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public String orderMedicines(Long prescriptionId) {
        // Verify current user is the patient who owns the prescription
        String username = ((JwtAuthenticationToken) SecurityContextHolder.getContext().getAuthentication())
                .getToken().getClaimAsString("sub");
        UserResponseDTO currentUser = userServiceClient.validateUser(username, "");

        Prescription prescription = prescriptionRepository.findById(prescriptionId)
                .orElseThrow(() -> new ResourceNotFoundException("Prescription not found"));

        if (!currentUser.getId().equals(prescription.getPatientId())) {
            throw new UnauthorizedAccessException("You can only order medicines from your own prescriptions");
        }

        // Check medicine availability and update inventory
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

        // In a real application, this would trigger a notification to the pharmacy
        return "Medicines ordered successfully for prescription ID: " + prescriptionId;
    }

    @Override
    public List<MedicineDTO> getAllMedicines() {
        return medicineRepository.findAll().stream()
                .map(m -> modelMapper.map(m, MedicineDTO.class))
                .collect(Collectors.toList());
    }

    private void checkPrescriptionAccess(Prescription prescription) {
        String username = ((JwtAuthenticationToken) SecurityContextHolder.getContext().getAuthentication())
                .getToken().getClaimAsString("sub");
        UserResponseDTO currentUser = userServiceClient.validateUser(username, "");

        if (!currentUser.getId().equals(prescription.getPatientId())
                && !currentUser.getId().equals(prescription.getDoctorId())
                && !currentUser.getRole().equals("ADMIN")) {
            throw new UnauthorizedAccessException("You don't have permission to access this prescription");
        }
    }
}