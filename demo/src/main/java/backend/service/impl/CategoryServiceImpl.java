package backend.service.impl;

import backend.dto.category.CategoryDto;
import backend.entity.Category;
import backend.exception.ResourceNotFoundException;
import backend.repository.CategoryRepository;
import backend.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;

    @Override
    @Transactional(readOnly = true)
    public List<CategoryDto> getAllCategories() {
        return categoryRepository.findByIsActiveTrue().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<CategoryDto> getCategoryTree() {
        return categoryRepository.findByParentIsNullAndIsActiveTrue().stream()
                .map(this::mapToTreeDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public CategoryDto getCategoryBySlug(String slug) {
        Category category = categoryRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Categoría no encontrada con slug: " + slug));
        return mapToTreeDto(category);
    }

    @Override
    @Transactional
    public CategoryDto createCategory(CategoryDto dto) {
        Category parent = null;
        if (dto.getParentId() != null) {
            parent = categoryRepository.findById(dto.getParentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Categoría padre no encontrada"));
        }

        Category category = Category.builder()
                .name(dto.getName())
                .slug(dto.getSlug())
                .description(dto.getDescription())
                .imageUrl(dto.getImageUrl())
                .displayOrder(dto.getDisplayOrder() != null ? dto.getDisplayOrder() : 0)
                .isActive(dto.getIsActive() != null ? dto.getIsActive() : true)
                .parent(parent)
                .build();

        return mapToDto(categoryRepository.save(category));
    }

    @Override
    @Transactional
    public void deleteCategory(UUID id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Categoría no encontrada con id: " + id));
        category.setIsActive(false);
        categoryRepository.save(category);
    }

    private CategoryDto mapToDto(Category cat) {
        return CategoryDto.builder()
                .id(cat.getId())
                .parentId(cat.getParent() != null ? cat.getParent().getId() : null)
                .name(cat.getName())
                .slug(cat.getSlug())
                .description(cat.getDescription())
                .imageUrl(cat.getImageUrl())
                .displayOrder(cat.getDisplayOrder())
                .isActive(cat.getIsActive())
                .build();
    }

    private CategoryDto mapToTreeDto(Category cat) {
        CategoryDto dto = mapToDto(cat);
        if (cat.getSubCategories() != null && !cat.getSubCategories().isEmpty()) {
            dto.setSubCategories(
                    cat.getSubCategories().stream()
                            .filter(sub -> Boolean.TRUE.equals(sub.getIsActive()))
                            .map(this::mapToTreeDto)
                            .collect(Collectors.toList())
            );
        }
        return dto;
    }
}
