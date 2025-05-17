package com.virtual.dermacare_service.repository;

import com.virtual.dermacare_service.model.Medicine;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MedicineRepository extends MongoRepository<Medicine, Long> {

    List<Medicine> findByNameContainingIgnoreCase(String name);

    List<Medicine> findByStockGreaterThan(int minStock);

    List<Medicine> findByManufacturer(String manufacturer);

    List<Medicine> findByPriceBetween(double minPrice, double maxPrice);
}