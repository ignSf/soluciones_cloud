package backend.service.impl;

import backend.dto.order.OrderCreateRequest;
import backend.dto.order.OrderItemDto;
import backend.dto.order.OrderResponseDto;
import backend.entity.*;
import backend.entity.enums.OrderStatus;
import backend.entity.enums.PaymentStatus;
import backend.exception.BadRequestException;
import backend.exception.ResourceNotFoundException;
import backend.exception.UnauthorizedException;
import backend.repository.*;
import backend.service.CouponService;
import backend.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.OffsetDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final PaymentRepository paymentRepository;
    private final ShoppingCartRepository cartRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final ProductVariantRepository variantRepository;
    private final CouponRepository couponRepository;
    private final CouponService couponService;

    @Override
    @Transactional
    public OrderResponseDto createOrder(UUID userId, OrderCreateRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));

        ShoppingCart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new BadRequestException("El usuario no tiene un carrito activo"));

        if (cart.getItems() == null || cart.getItems().isEmpty()) {
            throw new BadRequestException("El carrito de compras está vacío");
        }

        BigDecimal subtotal = BigDecimal.ZERO;
        List<OrderItem> orderItemsToSave = new ArrayList<>();

        // Validar stock y armar los OrderItems
        for (CartItem cartItem : cart.getItems()) {
            Product product = cartItem.getProduct();
            ProductVariant variant = cartItem.getVariant();

            int requestedQty = cartItem.getQuantity();

            if (variant != null) {
                if (variant.getStockQuantity() < requestedQty) {
                    throw new BadRequestException("Stock insuficiente para la variante: " + variant.getVariantName() +
                            " (Disponible: " + variant.getStockQuantity() + ")");
                }
                variant.setStockQuantity(variant.getStockQuantity() - requestedQty);
                variantRepository.save(variant);
            } else {
                if (product.getStockQuantity() < requestedQty) {
                    throw new BadRequestException("Stock insuficiente para el producto: " + product.getName() +
                            " (Disponible: " + product.getStockQuantity() + ")");
                }
                product.setStockQuantity(product.getStockQuantity() - requestedQty);
                productRepository.save(product);
            }

            BigDecimal unitPrice = (product.getDiscountPrice() != null) ? product.getDiscountPrice() : product.getBasePrice();
            if (variant != null && variant.getPriceModifier() != null) {
                unitPrice = unitPrice.add(variant.getPriceModifier());
            }

            BigDecimal lineTotal = unitPrice.multiply(BigDecimal.valueOf(requestedQty));
            subtotal = subtotal.add(lineTotal);

            OrderItem orderItem = OrderItem.builder()
                    .product(product)
                    .variant(variant)
                    .productName(product.getName())
                    .variantName(variant != null ? variant.getVariantName() : null)
                    .sku(variant != null ? variant.getSku() : product.getSku())
                    .unitPrice(unitPrice)
                    .quantity(requestedQty)
                    .totalPrice(lineTotal)
                    .build();

            orderItemsToSave.add(orderItem);
        }

        // Aplicar cupón de descuento si fue suministrado
        Coupon coupon = null;
        BigDecimal discountAmount = BigDecimal.ZERO;
        if (request.getCouponCode() != null && !request.getCouponCode().trim().isEmpty()) {
            coupon = couponService.getValidCouponEntity(request.getCouponCode().trim(), subtotal);
            if (coupon.getDiscountType() == backend.entity.enums.DiscountType.percentage) {
                discountAmount = subtotal.multiply(coupon.getDiscountValue()).divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
                if (coupon.getMaxDiscountAmount() != null && discountAmount.compareTo(coupon.getMaxDiscountAmount()) > 0) {
                    discountAmount = coupon.getMaxDiscountAmount();
                }
            } else {
                discountAmount = coupon.getDiscountValue();
            }

            if (discountAmount.compareTo(subtotal) > 0) {
                discountAmount = subtotal;
            }

            coupon.setUsedCount(coupon.getUsedCount() + 1);
            couponRepository.save(coupon);
        }

        BigDecimal shippingAmount = BigDecimal.ZERO; // Podría calcularse según zona/método
        BigDecimal taxAmount = BigDecimal.ZERO;
        BigDecimal totalAmount = subtotal.subtract(discountAmount).add(shippingAmount).add(taxAmount);

        String orderNumber = "ORD-" + System.currentTimeMillis();

        Map<String, Object> billingAddr = request.getBillingAddress() != null
                ? request.getBillingAddress()
                : request.getShippingAddress();

        Order order = Order.builder()
                .orderNumber(orderNumber)
                .user(user)
                .coupon(coupon)
                .status(OrderStatus.processing)
                .subtotalAmount(subtotal)
                .discountAmount(discountAmount)
                .shippingAmount(shippingAmount)
                .taxAmount(taxAmount)
                .totalAmount(totalAmount)
                .shippingAddress(request.getShippingAddress())
                .billingAddress(billingAddr)
                .shippingMethod(request.getShippingMethod() != null ? request.getShippingMethod() : "Standard Delivery")
                .customerNotes(request.getCustomerNotes())
                .build();

        Order savedOrder = orderRepository.save(order);

        for (OrderItem oi : orderItemsToSave) {
            oi.setOrder(savedOrder);
            orderItemRepository.save(oi);
        }
        savedOrder.setItems(orderItemsToSave);

        // Registrar pago simulado / pasarela
        Payment payment = Payment.builder()
                .order(savedOrder)
                .paymentMethod(request.getPaymentMethod())
                .paymentStatus(PaymentStatus.completed)
                .transactionId("TXN-" + UUID.randomUUID().toString().substring(0, 12).toUpperCase())
                .amount(totalAmount)
                .currency("USD")
                .paidAt(OffsetDateTime.now())
                .gatewayResponse(Map.of("status", "approved", "processed_at", OffsetDateTime.now().toString()))
                .build();
        paymentRepository.save(payment);
        savedOrder.setPayments(List.of(payment));

        // Vaciar carrito
        cart.getItems().clear();
        cartRepository.save(cart);

        return mapToOrderDto(savedOrder);
    }

    @Override
    @Transactional(readOnly = true)
    public OrderResponseDto getOrderById(UUID userId, UUID orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Pedido no encontrado"));

        if (userId != null && !order.getUser().getId().equals(userId)) {
            throw new UnauthorizedException("No tienes permiso para ver este pedido");
        }

        return mapToOrderDto(order);
    }

    @Override
    @Transactional(readOnly = true)
    public OrderResponseDto getOrderByNumber(String orderNumber) {
        Order order = orderRepository.findByOrderNumber(orderNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Pedido no encontrado con número: " + orderNumber));
        return mapToOrderDto(order);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<OrderResponseDto> getUserOrders(UUID userId, Pageable pageable) {
        return orderRepository.findByUserIdOrderByCreatedAtDesc(userId, pageable)
                .map(this::mapToOrderDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<OrderResponseDto> getAllOrders(OrderStatus status, Pageable pageable) {
        if (status != null) {
            return orderRepository.findByStatusOrderByCreatedAtDesc(status, pageable)
                    .map(this::mapToOrderDto);
        }
        return orderRepository.findAll(pageable).map(this::mapToOrderDto);
    }

    @Override
    @Transactional
    public OrderResponseDto updateOrderStatus(UUID orderId, OrderStatus status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Pedido no encontrado con id: " + orderId));
        order.setStatus(status);
        return mapToOrderDto(orderRepository.save(order));
    }

    private OrderResponseDto mapToOrderDto(Order order) {
        Payment latestPayment = (order.getPayments() != null && !order.getPayments().isEmpty())
                ? order.getPayments().get(order.getPayments().size() - 1)
                : null;

        List<OrderItemDto> itemDtos = (order.getItems() != null)
                ? order.getItems().stream()
                .map(i -> OrderItemDto.builder()
                        .id(i.getId())
                        .productId(i.getProduct() != null ? i.getProduct().getId() : null)
                        .variantId(i.getVariant() != null ? i.getVariant().getId() : null)
                        .productName(i.getProductName())
                        .variantName(i.getVariantName())
                        .sku(i.getSku())
                        .unitPrice(i.getUnitPrice())
                        .quantity(i.getQuantity())
                        .totalPrice(i.getTotalPrice())
                        .build())
                .collect(Collectors.toList())
                : Collections.emptyList();

        return OrderResponseDto.builder()
                .id(order.getId())
                .orderNumber(order.getOrderNumber())
                .userId(order.getUser() != null ? order.getUser().getId() : null)
                .status(order.getStatus())
                .subtotalAmount(order.getSubtotalAmount())
                .discountAmount(order.getDiscountAmount())
                .shippingAmount(order.getShippingAmount())
                .taxAmount(order.getTaxAmount())
                .totalAmount(order.getTotalAmount())
                .shippingAddress(order.getShippingAddress())
                .billingAddress(order.getBillingAddress())
                .shippingMethod(order.getShippingMethod())
                .trackingNumber(order.getTrackingNumber())
                .paymentMethod(latestPayment != null ? latestPayment.getPaymentMethod() : null)
                .paymentStatus(latestPayment != null ? latestPayment.getPaymentStatus() : null)
                .items(itemDtos)
                .createdAt(order.getCreatedAt())
                .build();
    }
}
