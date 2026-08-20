package backend.dto.product;

import backend.dto.brand.BrandDto;
import backend.dto.category.CategoryDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductResponseDto {
    private UUID id;
    private BrandDto brand;
    @Builder.Default
    private List<CategoryDto> categories = new ArrayList<>();
    private String name;
    private String slug;
    private String shortDescription;
    private String description;
    private String sku;
    private BigDecimal basePrice;
    private BigDecimal discountPrice;
    private Integer stockQuantity;
    private BigDecimal weightKg;
    private Boolean isFeatured;
    private Boolean isActive;
    private Double averageRating;
    @Builder.Default
    private List<ProductVariantDto> variants = new ArrayList<>();
    @Builder.Default
    private List<ProductImageDto> images = new ArrayList<>();
    private OffsetDateTime createdAt;
}
