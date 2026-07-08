package licaza.ecommerce.backend.controller;

import java.util.List;
import licaza.ecommerce.backend.domain.Product;
import licaza.ecommerce.backend.repo.ProductRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(originPatterns = "http://localhost:[*]") // To support dev and "prod" ports (5173/8080)
public class ProductController {

  private final ProductRepository productRepository;

  public ProductController(ProductRepository productRepository) {
    this.productRepository = productRepository;
  }

  @GetMapping
  public ResponseEntity<List<Product>> getAllProducts() {
    List<Product> products = productRepository.findAll();
    return ResponseEntity.ok(products);
  }

  @DeleteMapping("/delete/{id}")
  public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
    // Verify that product exists in database
    if (!productRepository.existsById(id)) {
      return ResponseEntity.notFound().build();
    }

    productRepository.deleteById(id);
    return ResponseEntity.noContent().build();
  }
}
