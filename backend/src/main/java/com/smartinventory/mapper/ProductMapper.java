package com.smartinventory.mapper;

import com.smartinventory.domain.dto.ProductDTO;
import com.smartinventory.domain.entity.Product;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface ProductMapper {
    ProductMapper INSTANCE = Mappers.getMapper(ProductMapper.class);

    @Mapping(target = "categoryId", source = "category.id")
    @Mapping(target = "categoryName", source = "category.name")
    ProductDTO toDTO(Product product);

    @Mapping(target = "category", ignore = true)
    @Mapping(target = "supplier", ignore = true)
    @Mapping(target = "lowStockThreshold", ignore = true)
    @Mapping(target = "orderItems", ignore = true)
    Product toEntity(ProductDTO productDTO);
}
