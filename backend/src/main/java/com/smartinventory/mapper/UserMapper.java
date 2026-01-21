package com.smartinventory.mapper;

import com.smartinventory.domain.dto.UserDTO;
import com.smartinventory.domain.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface UserMapper {
    UserMapper INSTANCE = Mappers.getMapper(UserMapper.class);

    @Mapping(target = "password", ignore = true) // Never expose password in DTO responses
    UserDTO toDTO(User user);

    @Mapping(target = "password", ignore = true) // Password is handled separately in service
    @Mapping(target = "orders", ignore = true)
    User toEntity(UserDTO userDTO);
}
