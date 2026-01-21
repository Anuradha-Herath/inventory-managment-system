package com.smartinventory.service;

import com.smartinventory.domain.dto.SupplierDTO;

import java.util.List;

public interface SupplierService {
    SupplierDTO createSupplier(SupplierDTO supplierDTO);
    SupplierDTO updateSupplier(Long id, SupplierDTO supplierDTO);
    SupplierDTO getSupplierById(Long id);
    List<SupplierDTO> getAllSuppliers();
    List<SupplierDTO> getActiveSuppliers();
    void deleteSupplier(Long id);
}
