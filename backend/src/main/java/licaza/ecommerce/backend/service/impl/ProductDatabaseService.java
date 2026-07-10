package licaza.ecommerce.backend.service.impl;

import java.util.List;
import java.util.Optional;
import licaza.ecommerce.backend.domain.Product;
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
  public List<Product> getAllProducts() {
    return productRepository.findAll();
  }

  @Override
  public Product createProduct(Product product) {
    product.setId(null);
    return productRepository.save(product);
  }

  @Override
  public Optional<Product> updateProduct(Long id, Product productDetails) {
    return productRepository
        .findById(id)
        .map(
            existingProduct -> {
              existingProduct.setName(productDetails.getName());
              existingProduct.setSku(productDetails.getSku());
              existingProduct.setDescription(productDetails.getDescription());
              existingProduct.setCategory(productDetails.getCategory());
              existingProduct.setPrice(productDetails.getPrice());
              existingProduct.setStock(productDetails.getStock());
              existingProduct.setWeightKg(productDetails.getWeightKg());
              return productRepository.save(existingProduct);
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
}
