package backend.controller;

import backend.dto.common.ApiResponse;
import backend.dto.order.OrderCreateRequest;
import backend.dto.order.OrderResponseDto;
import backend.entity.enums.OrderStatus;
import backend.security.JwtUtil;
import backend.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;
    private final JwtUtil jwtUtil;

    @PostMapping("/checkout")
    public ResponseEntity<ApiResponse<OrderResponseDto>> checkout(
            @RequestHeader("Authorization") String token,
            @Valid @RequestBody OrderCreateRequest request
    ) {
        UUID userId = jwtUtil.extractUserId(token.replace("Bearer ", ""));
        OrderResponseDto order = orderService.createOrder(userId, request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(order, "Pedido realizado con éxito"));
    }

    @GetMapping("/my-orders")
    public ResponseEntity<ApiResponse<Page<OrderResponseDto>>> getMyOrders(
            @RequestHeader("Authorization") String token,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        UUID userId = jwtUtil.extractUserId(token.replace("Bearer ", ""));
        Pageable pageable = PageRequest.of(page, size);
        Page<OrderResponseDto> orders = orderService.getUserOrders(userId, pageable);
        return ResponseEntity.ok(ApiResponse.success(orders, "Historial de pedidos"));
    }

    @GetMapping("/{orderId}")
    public ResponseEntity<ApiResponse<OrderResponseDto>> getOrderById(
            @RequestHeader("Authorization") String token,
            @PathVariable UUID orderId
    ) {
        UUID userId = jwtUtil.extractUserId(token.replace("Bearer ", ""));
        String role = jwtUtil.extractRole(token.replace("Bearer ", ""));

        // Si es admin puede ver cualquier orden sin validar pertenencia
        UUID queryUserId = "ADMIN".equalsIgnoreCase(role) ? null : userId;
        OrderResponseDto order = orderService.getOrderById(queryUserId, orderId);
        return ResponseEntity.ok(ApiResponse.success(order, "Detalle del pedido"));
    }

    @GetMapping("/number/{orderNumber}")
    public ResponseEntity<ApiResponse<OrderResponseDto>> getOrderByNumber(@PathVariable String orderNumber) {
        OrderResponseDto order = orderService.getOrderByNumber(orderNumber);
        return ResponseEntity.ok(ApiResponse.success(order, "Detalle del pedido"));
    }

    @GetMapping("/admin/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Page<OrderResponseDto>>> getAllOrders(
            @RequestParam(required = false) OrderStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        Page<OrderResponseDto> orders = orderService.getAllOrders(status, pageable);
        return ResponseEntity.ok(ApiResponse.success(orders, "Listado general de pedidos"));
    }

    @PatchMapping("/admin/{orderId}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<OrderResponseDto>> updateStatus(
            @PathVariable UUID orderId,
            @RequestParam OrderStatus status
    ) {
        OrderResponseDto order = orderService.updateOrderStatus(orderId, status);
        return ResponseEntity.ok(ApiResponse.success(order, "Estado del pedido actualizado"));
    }
}
