package backend.dto.order;

import backend.entity.enums.OrderStatus;
import backend.entity.enums.PaymentMethod;
import backend.entity.enums.PaymentStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderResponseDto {
    private UUID id;
    private String orderNumber;
    private UUID userId;
    private OrderStatus status;
    private BigDecimal subtotalAmount;
    private BigDecimal discountAmount;
    private BigDecimal shippingAmount;
    private BigDecimal taxAmount;
    private BigDecimal totalAmount;
    private Map<String, Object> shippingAddress;
    private Map<String, Object> billingAddress;
    private String shippingMethod;
    private String trackingNumber;
    private PaymentMethod paymentMethod;
    private PaymentStatus paymentStatus;
    @Builder.Default
    private List<OrderItemDto> items = new ArrayList<>();
    private OffsetDateTime createdAt;
}
