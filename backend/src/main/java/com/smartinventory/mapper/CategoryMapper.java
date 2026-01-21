package com.smartinventory.mapper;

import com.smartinventory.domain.dto.CategoryDTO;
import com.smartinventory.domain.entity.Category;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface CategoryMapper {
    CategoryMapper INSTANCE = Mappers.getMapper(CategoryMapper.class);

    CategoryDTO toDTO(Category category);

    @Mapping(target = "products", ignore = true)
    Category toEntity(CategoryDTO categoryDTO);
}
