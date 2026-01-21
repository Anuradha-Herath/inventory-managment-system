package com.smartinventory.mapper;

import com.smartinventory.domain.dto.OrderDTO;
import com.smartinventory.domain.entity.Order;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring", uses = {OrderItemMapper.class, PaymentMapper.class})
public interface OrderMapper {
    OrderMapper INSTANCE = Mappers.getMapper(OrderMapper.class);

    @Mapping(target = "userId", source = "user.id")
    @Mapping(target = "userName", expression = "java(order.getUser().getFirstName() + \" \" + order.getUser().getLastName())")
    OrderDTO toDTO(Order order);

    @Mapping(target = "user", ignore = true)
    Order toEntity(OrderDTO orderDTO);
}
