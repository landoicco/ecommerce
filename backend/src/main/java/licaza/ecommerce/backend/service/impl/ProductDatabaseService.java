package licaza.ecommerce.backend.service.impl;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import licaza.ecommerce.backend.domain.Product;
import licaza.ecommerce.backend.dto.ProductRequestDTO;
import licaza.ecommerce.backend.dto.ProductResponseDTO;
import licaza.ecommerce.backend.repo.ProductRepository;
import licaza.ecommerce.backend.service.ProductService;
import org.springframework.stereotype.Service;

@Service
public class ProductDatabaseService implements ProductService {

  private final ProductRepository productRepository;

  public ProductDatabaseService(ProductRepository productRepository) {
    this.productRepository = productRepository;
  }

  @Override
  public List<ProductResponseDTO> getAllProducts() {
    return productRepository.findAll().stream()
        .map(this::convertToResponseDTO)
        .collect(Collectors.toList());
  }

  @Override
  public ProductResponseDTO createProduct(ProductRequestDTO requestDTO) {
    Product product = new Product();
    product.setId(null);
    mapRequestToEntity(requestDTO, product);

    Product savedProduct = productRepository.save(product);
    return convertToResponseDTO(savedProduct);
  }

  @Override
  public Optional<ProductResponseDTO> updateProduct(Long id, ProductRequestDTO requestDTO) {
    return productRepository
        .findById(id)
        .map(
            existingProduct -> {
              mapRequestToEntity(requestDTO, existingProduct);
              Product updatedProduct = productRepository.save(existingProduct);
              return convertToResponseDTO(updatedProduct);
            });
  }

  @Override
  public boolean deleteProduct(Long id) {
    if (!productRepository.existsById(id)) {
      return false;
    }
    productRepository.deleteById(id);
    return true;
  }

  // Utility methods (Mappers)
  private void mapRequestToEntity(ProductRequestDTO dto, Product entity) {
    entity.setName(dto.name());
    entity.setSku(dto.sku());
    entity.setDescription(dto.description());
    entity.setCategory(dto.category());
    entity.setPrice(dto.price());
    entity.setStock(dto.stock());
    entity.setWeightKg(dto.weightKg());
  }

  private ProductResponseDTO convertToResponseDTO(Product entity) {
    return new ProductResponseDTO(
        entity.getId(),
        entity.getName(),
        entity.getSku(),
        entity.getDescription(),
        entity.getCategory(),
        entity.getPrice(),
        entity.getStock(),
        entity.getWeightKg());
  }
}
