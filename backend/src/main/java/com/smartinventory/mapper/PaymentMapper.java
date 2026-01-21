package com.smartinventory.mapper;

import com.smartinventory.domain.dto.PaymentDTO;
import com.smartinventory.domain.entity.Payment;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface PaymentMapper {
    PaymentMapper INSTANCE = Mappers.getMapper(PaymentMapper.class);

    @Mapping(target = "orderId", source = "order.id")
    PaymentDTO toDTO(Payment payment);

    @Mapping(target = "order", ignore = true)
    Payment toEntity(PaymentDTO paymentDTO);
}
