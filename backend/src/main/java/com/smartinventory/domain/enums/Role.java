package com.smartinventory.domain.enums;

public enum Role {
    ADMIN,  // Full access - can manage users, products, categories, suppliers, orders, reports
    STAFF   // Limited access - can view products, manage inventory, create/update orders
    // CUSTOMER - Optional for future extension
}
