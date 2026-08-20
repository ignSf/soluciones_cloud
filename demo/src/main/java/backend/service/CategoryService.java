package backend.service;

import backend.dto.category.CategoryDto;

import java.util.List;
import java.util.UUID;

public interface CategoryService {
    List<CategoryDto> getAllCategories();
    List<CategoryDto> getCategoryTree();
    CategoryDto getCategoryBySlug(String slug);
    CategoryDto createCategory(CategoryDto dto);
    void deleteCategory(UUID id);
}
