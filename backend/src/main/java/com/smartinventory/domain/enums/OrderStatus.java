package com.smartinventory.domain.enums;

public enum OrderStatus {
    PENDING,    // Order created, awaiting payment
    PAID,       // Payment received
    SHIPPED,    // Order shipped to customer
    COMPLETED,  // Order completed and delivered
    CANCELLED   // Order cancelled
}
