package licaza.ecommerce.backend.service;

import java.util.List;
import java.util.Optional;
import licaza.ecommerce.backend.domain.Product;

public interface ProductService {
  List<Product> getAllProducts();

  Product createProduct(Product product);

  Optional<Product> updateProduct(Long id, Product productDetails);

  boolean deleteProduct(Long id);
}
