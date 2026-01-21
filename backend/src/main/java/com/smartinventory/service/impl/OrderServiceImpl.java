package com.smartinventory.service.impl;

import com.smartinventory.domain.dto.OrderDTO;
import com.smartinventory.domain.dto.OrderItemDTO;
import com.smartinventory.domain.entity.Order;
import com.smartinventory.domain.entity.OrderItem;
import com.smartinventory.domain.entity.Product;
import com.smartinventory.domain.entity.User;
import com.smartinventory.domain.enums.OrderStatus;
import com.smartinventory.exception.ResourceNotFoundException;
import com.smartinventory.mapper.OrderMapper;
import com.smartinventory.repository.OrderRepository;
import com.smartinventory.repository.ProductRepository;
import com.smartinventory.repository.UserRepository;
import com.smartinventory.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final OrderMapper orderMapper;

    @Override
    @Transactional
    public OrderDTO createOrder(OrderDTO orderDTO) {
        // Validate user exists
        User user = userRepository.findById(orderDTO.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + orderDTO.getUserId()));
        
        // Create order
        Order order = new Order();
        order.setUser(user);
        order.setStatus(orderDTO.getStatus() != null ? orderDTO.getStatus() : OrderStatus.PENDING);
        
        // Process order items and validate stock
        BigDecimal totalAmount = BigDecimal.ZERO;
        List<OrderItem> orderItems = new ArrayList<>();
        
        if (orderDTO.getOrderItems() != null && !orderDTO.getOrderItems().isEmpty()) {
            for (OrderItemDTO itemDTO : orderDTO.getOrderItems()) {
                // Validate product exists
                Product product = productRepository.findById(itemDTO.getProductId())
                        .orElseThrow(() -> new ResourceNotFoundException(
                                "Product not found with id: " + itemDTO.getProductId()));
                
                // Validate stock availability
                if (product.getQuantity() < itemDTO.getQuantity()) {
                    throw new IllegalStateException(
                            "Insufficient stock for product: " + product.getName() + 
                            ". Available: " + product.getQuantity() + ", Required: " + itemDTO.getQuantity());
                }
                
                // Create order item
                OrderItem orderItem = new OrderItem();
                orderItem.setOrder(order);
                orderItem.setProduct(product);
                orderItem.setQuantity(itemDTO.getQuantity());
                orderItem.setUnitPrice(product.getPrice());
                orderItem.setSubtotal(product.getPrice().multiply(BigDecimal.valueOf(itemDTO.getQuantity())));
                
                orderItems.add(orderItem);
                totalAmount = totalAmount.add(orderItem.getSubtotal());
                
                // Reduce stock (critical business logic)
                product.setQuantity(product.getQuantity() - itemDTO.getQuantity());
                productRepository.save(product);
            }
        }
        
        order.setOrderItems(orderItems);
        order.setTotalAmount(totalAmount);
        
        // Save order (order items will be saved via cascade)
        Order savedOrder = orderRepository.save(order);
        return orderMapper.toDTO(savedOrder);
    }

    @Override
    @Transactional
    public OrderDTO updateOrder(Long id, OrderDTO orderDTO) {
        Order existingOrder = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + id));
        
        // Update status
        if (orderDTO.getStatus() != null) {
            existingOrder.setStatus(orderDTO.getStatus());
        }
        
        // Note: Order items should not be modified after creation
        // If modification is needed, it should be a separate complex operation
        
        Order updatedOrder = orderRepository.save(existingOrder);
        return orderMapper.toDTO(updatedOrder);
    }

    @Override
    @Transactional(readOnly = true)
    public OrderDTO getOrderById(Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + id));
        return orderMapper.toDTO(order);
    }

    @Override
    @Transactional(readOnly = true)
    public List<OrderDTO> getAllOrders() {
        return orderRepository.findAll().stream()
                .map(orderMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<OrderDTO> getOrdersByUserId(Long userId) {
        return orderRepository.findByUserId(userId).stream()
                .map(orderMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public void deleteOrder(Long id) {
        if (!orderRepository.existsById(id)) {
            throw new ResourceNotFoundException("Order not found with id: " + id);
        }
        orderRepository.deleteById(id);
    }
}
