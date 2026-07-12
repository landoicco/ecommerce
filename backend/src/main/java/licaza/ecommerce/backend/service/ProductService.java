package licaza.ecommerce.backend.service;

import java.util.List;
import java.util.Optional;
import licaza.ecommerce.backend.dto.*;
import org.springframework.data.domain.Page;

public interface ProductService {
  List<ProductResponseDTO> getAllProducts();

  ProductResponseDTO createProduct(ProductRequestDTO requestDTO);

  List<ProductResponseDTO> createProductsBatch(List<ProductRequestDTO> requestDTOs);

  Optional<ProductResponseDTO> updateProduct(Long id, ProductRequestDTO requestDTO);

  boolean deleteProduct(Long id);

  OrderResponseDTO purchaseProduct(PurchaseRequestDTO purchaseDTO);

  Page<ProductResponseDTO> getCatalog(ProductQueryDTO queryDTO);
}
