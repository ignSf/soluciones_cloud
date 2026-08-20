package backend.service;

import backend.dto.order.OrderCreateRequest;
import backend.dto.order.OrderResponseDto;
import backend.entity.enums.OrderStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

public interface OrderService {
    OrderResponseDto createOrder(UUID userId, OrderCreateRequest request);
    OrderResponseDto getOrderById(UUID userId, UUID orderId);
    OrderResponseDto getOrderByNumber(String orderNumber);
    Page<OrderResponseDto> getUserOrders(UUID userId, Pageable pageable);
    Page<OrderResponseDto> getAllOrders(OrderStatus status, Pageable pageable);
    OrderResponseDto updateOrderStatus(UUID orderId, OrderStatus status);
}
