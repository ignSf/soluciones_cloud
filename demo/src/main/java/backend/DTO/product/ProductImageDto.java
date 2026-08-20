package backend.dto.product;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductImageDto {
    private UUID id;
    private UUID variantId;
    private String imageUrl;
    private String altText;
    private Boolean isPrimary;
    private Integer displayOrder;
}
