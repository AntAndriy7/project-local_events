package com.local_events.services;

import com.local_events.dto.CategoryDTO;
import com.local_events.entity.Category;
import com.local_events.mapper.CategoryMapper;
import com.local_events.repository.CategoryRepository;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;

import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final CategoryMapper mapper = CategoryMapper.INSTANCE;

    public List<CategoryDTO> getAllCategories() {
        return categoryRepository.findAll()
                .stream()
                .map(mapper::toDTO)
                .toList();
    }

    public CategoryDTO getCategoryById(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Category not found"));

        return mapper.toDTO(category);
    }

    public List<CategoryDTO> getCategoriesByIds(Set<Long> ids) {
        if (ids == null || ids.isEmpty()) {
            return List.of();
        }

        return categoryRepository.findByIdIn(ids)
                .stream()
                .map(mapper::toDTO)
                .toList();
    }

    public CategoryDTO createCategory(CategoryDTO dto) {
        Category category = new Category();
        category.setName(dto.getName());

        Category saved = categoryRepository.save(category);
        return mapper.toDTO(saved);
    }

    public void deleteCategory(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found with id: " + id));

        categoryRepository.delete(category);
    }
}
