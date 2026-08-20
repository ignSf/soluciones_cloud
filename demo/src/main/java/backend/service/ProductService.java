package backend.service;

import backend.dto.product.ProductRequestDto;
import backend.dto.product.ProductResponseDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

public interface ProductService {
    Page<ProductResponseDto> getProducts(String query, UUID categoryId, UUID brandId, Pageable pageable);
    ProductResponseDto getProductBySlug(String slug);
    ProductResponseDto getProductById(UUID id);
    ProductResponseDto createProduct(ProductRequestDto request);
    ProductResponseDto updateProduct(UUID id, ProductRequestDto request);
    void deleteProduct(UUID id);
}
