package backend.dto.order;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderItemDto {
    private UUID id;
    private UUID productId;
    private UUID variantId;
    private String productName;
    private String variantName;
    private String sku;
    private BigDecimal unitPrice;
    private Integer quantity;
    private BigDecimal totalPrice;
}
