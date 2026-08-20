package backend.dto.product;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductRequestDto {

    private UUID brandId;

    private List<UUID> categoryIds;

    @NotBlank(message = "El nombre del producto es obligatorio")
    private String name;

    private String shortDescription;

    private String description;

    private String sku;

    @NotNull(message = "El precio base es obligatorio")
    @DecimalMin(value = "0.0", inclusive = true, message = "El precio no puede ser negativo")
    private BigDecimal basePrice;

    private BigDecimal discountPrice;

    private BigDecimal costPrice;

    @NotNull(message = "El stock es obligatorio")
    @Min(value = 0, message = "El stock no puede ser negativo")
    private Integer stockQuantity = 0;

    private BigDecimal weightKg;

    private Boolean isFeatured = false;

    private Boolean isActive = true;
}
