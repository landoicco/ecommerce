package licaza.ecommerce.backend.service;

import java.util.List;
import java.util.Optional;
import licaza.ecommerce.backend.dto.ProductRequestDTO;
import licaza.ecommerce.backend.dto.ProductResponseDTO;

public interface ProductService {
  List<ProductResponseDTO> getAllProducts();

  ProductResponseDTO createProduct(ProductRequestDTO requestDTO);

  Optional<ProductResponseDTO> updateProduct(Long id, ProductRequestDTO requestDTO);

  boolean deleteProduct(Long id);
}
