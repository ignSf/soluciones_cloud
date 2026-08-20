package backend.service.impl;

import backend.dto.brand.BrandDto;
import backend.dto.category.CategoryDto;
import backend.dto.product.*;
import backend.entity.Brand;
import backend.entity.Category;
import backend.entity.Product;
import backend.exception.ResourceNotFoundException;
import backend.repository.BrandRepository;
import backend.repository.CategoryRepository;
import backend.repository.ProductRepository;
import backend.repository.ProductReviewRepository;
import backend.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.HashSet;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final BrandRepository brandRepository;
    private final CategoryRepository categoryRepository;
    private final ProductReviewRepository productReviewRepository;

    @Override
    @Transactional(readOnly = true)
    public Page<ProductResponseDto> getProducts(String query, UUID categoryId, UUID brandId, Pageable pageable) {
        Page<Product> productsPage;

        if (StringUtils.hasText(query)) {
            productsPage = productRepository.searchProducts(query, pageable);
        } else if (categoryId != null) {
            productsPage = productRepository.findByCategoryId(categoryId, pageable);
        } else if (brandId != null) {
            productsPage = productRepository.findByBrandId(brandId, pageable);
        } else {
            productsPage = productRepository.findByIsActiveTrue(pageable);
        }

        return productsPage.map(this::mapToDto);
    }

    @Override
    @Transactional(readOnly = true)
    public ProductResponseDto getProductBySlug(String slug) {
        Product product = productRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Producto no encontrado con slug: " + slug));
        return mapToDto(product);
    }

    @Override
    @Transactional(readOnly = true)
    public ProductResponseDto getProductById(UUID id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Producto no encontrado con ID: " + id));
        return mapToDto(product);
    }

    @Override
    @Transactional
    public ProductResponseDto createProduct(ProductRequestDto request) {
        Brand brand = null;
        if (request.getBrandId() != null) {
            brand = brandRepository.findById(request.getBrandId())
                    .orElseThrow(() -> new ResourceNotFoundException("Marca no encontrada con ID: " + request.getBrandId()));
        }

        Set<Category> categories = new HashSet<>();
        if (request.getCategoryIds() != null && !request.getCategoryIds().isEmpty()) {
            categories = new HashSet<>(categoryRepository.findAllById(request.getCategoryIds()));
        }

        String slug = generateSlug(request.getName());

        Product product = Product.builder()
                .brand(brand)
                .categories(categories)
                .name(request.getName())
                .slug(slug)
                .shortDescription(request.getShortDescription())
                .description(request.getDescription())
                .sku(request.getSku())
                .basePrice(request.getBasePrice())
                .discountPrice(request.getDiscountPrice())
                .costPrice(request.getCostPrice())
                .stockQuantity(request.getStockQuantity())
                .weightKg(request.getWeightKg())
                .isFeatured(request.getIsFeatured() != null ? request.getIsFeatured() : false)
                .isActive(request.getIsActive() != null ? request.getIsActive() : true)
                .build();

        return mapToDto(productRepository.save(product));
    }

    @Override
    @Transactional
    public ProductResponseDto updateProduct(UUID id, ProductRequestDto request) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Producto no encontrado"));

        if (request.getBrandId() != null) {
            Brand brand = brandRepository.findById(request.getBrandId())
                    .orElseThrow(() -> new ResourceNotFoundException("Marca no encontrada"));
            product.setBrand(brand);
        }

        if (request.getCategoryIds() != null) {
            Set<Category> categories = new HashSet<>(categoryRepository.findAllById(request.getCategoryIds()));
            product.setCategories(categories);
        }

        product.setName(request.getName());
        product.setShortDescription(request.getShortDescription());
        product.setDescription(request.getDescription());
        if (request.getSku() != null) product.setSku(request.getSku());
        product.setBasePrice(request.getBasePrice());
        product.setDiscountPrice(request.getDiscountPrice());
        product.setCostPrice(request.getCostPrice());
        product.setStockQuantity(request.getStockQuantity());
        if (request.getWeightKg() != null) product.setWeightKg(request.getWeightKg());
        if (request.getIsFeatured() != null) product.setIsFeatured(request.getIsFeatured());
        if (request.getIsActive() != null) product.setIsActive(request.getIsActive());

        return mapToDto(productRepository.save(product));
    }

    @Override
    @Transactional
    public void deleteProduct(UUID id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Producto no encontrado"));
        product.setIsActive(false);
        productRepository.save(product);
    }

    private String generateSlug(String name) {
        return name.toLowerCase()
                .replaceAll("[^a-z0-9\\s-]", "")
                .replaceAll("\\s+", "-")
                + "-" + UUID.randomUUID().toString().substring(0, 8);
    }

    private ProductResponseDto mapToDto(Product product) {
        BrandDto brandDto = null;
        if (product.getBrand() != null) {
            brandDto = BrandDto.builder()
                    .id(product.getBrand().getId())
                    .name(product.getBrand().getName())
                    .slug(product.getBrand().getSlug())
                    .logoUrl(product.getBrand().getLogoUrl())
                    .build();
        }

        Double avgRating = productReviewRepository.getAverageRatingByProductId(product.getId());

        return ProductResponseDto.builder()
                .id(product.getId())
                .brand(brandDto)
                .categories(product.getCategories().stream()
                        .map(c -> CategoryDto.builder()
                                .id(c.getId())
                                .name(c.getName())
                                .slug(c.getSlug())
                                .build())
                        .collect(Collectors.toList()))
                .name(product.getName())
                .slug(product.getSlug())
                .shortDescription(product.getShortDescription())
                .description(product.getDescription())
                .sku(product.getSku())
                .basePrice(product.getBasePrice())
                .discountPrice(product.getDiscountPrice())
                .stockQuantity(product.getStockQuantity())
                .weightKg(product.getWeightKg())
                .isFeatured(product.getIsFeatured())
                .isActive(product.getIsActive())
                .averageRating(avgRating != null ? Math.round(avgRating * 10.0) / 10.0 : 0.0)
                .variants(product.getVariants().stream()
                        .filter(v -> Boolean.TRUE.equals(v.getIsActive()))
                        .map(v -> ProductVariantDto.builder()
                                .id(v.getId())
                                .sku(v.getSku())
                                .variantName(v.getVariantName())
                                .priceModifier(v.getPriceModifier())
                                .stockQuantity(v.getStockQuantity())
                                .attributes(v.getAttributes())
                                .isActive(v.getIsActive())
                                .build())
                        .collect(Collectors.toList()))
                .images(product.getImages().stream()
                        .map(img -> ProductImageDto.builder()
                                .id(img.getId())
                                .variantId(img.getVariant() != null ? img.getVariant().getId() : null)
                                .imageUrl(img.getImageUrl())
                                .altText(img.getAltText())
                                .isPrimary(img.getIsPrimary())
                                .displayOrder(img.getDisplayOrder())
                                .build())
                        .collect(Collectors.toList()))
                .createdAt(product.getCreatedAt())
                .build();
    }
}
