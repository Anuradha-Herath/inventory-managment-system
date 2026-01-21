package com.smartinventory.mapper;

import com.smartinventory.domain.dto.UserDTO;
import com.smartinventory.domain.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface UserMapper {
    UserMapper INSTANCE = Mappers.getMapper(UserMapper.class);

    UserDTO toDTO(User user);

    @Mapping(target = "password", ignore = true)
    @Mapping(target = "orders", ignore = true)
    User toEntity(UserDTO userDTO);
}
