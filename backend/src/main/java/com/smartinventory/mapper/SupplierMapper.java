package com.smartinventory.mapper;

import com.smartinventory.domain.dto.SupplierDTO;
import com.smartinventory.domain.entity.Supplier;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface SupplierMapper {
    SupplierMapper INSTANCE = Mappers.getMapper(SupplierMapper.class);

    SupplierDTO toDTO(Supplier supplier);

    @Mapping(target = "products", ignore = true)
    Supplier toEntity(SupplierDTO supplierDTO);
}
