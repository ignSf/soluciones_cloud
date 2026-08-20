package backend.dto.cart;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CartResponseDto {
    private UUID id;
    private UUID userId;
    private String sessionToken;
    @Builder.Default
    private List<CartItemResponseDto> items = new ArrayList<>();
    private Integer totalItems;
    private BigDecimal subtotal;
}
