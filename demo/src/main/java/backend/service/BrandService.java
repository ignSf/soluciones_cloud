package backend.service;

import backend.dto.brand.BrandDto;

import java.util.List;
import java.util.UUID;

public interface BrandService {
    List<BrandDto> getAllBrands();
    BrandDto getBrandBySlug(String slug);
    BrandDto createBrand(BrandDto dto);
    void deleteBrand(UUID id);
}
