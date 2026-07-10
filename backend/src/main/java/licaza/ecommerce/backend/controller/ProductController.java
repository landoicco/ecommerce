package licaza.ecommerce.backend.controller;

import java.util.List;
import licaza.ecommerce.backend.domain.Product;
import licaza.ecommerce.backend.service.ProductService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(originPatterns = "http://localhost:[*]")
public class ProductController {

  private final ProductService productService;

  // We use the service interface, not the repository
  public ProductController(ProductService productService) {
    this.productService = productService;
  }

  @GetMapping
  public ResponseEntity<List<Product>> getAllProducts() {
    return ResponseEntity.ok(productService.getAllProducts());
  }

  @PostMapping
  public ResponseEntity<Product> createProduct(@RequestBody Product product) {
    Product savedProduct = productService.createProduct(product);
    return ResponseEntity.status(HttpStatus.CREATED).body(savedProduct);
  }

  @PutMapping("/edit/{id}")
  public ResponseEntity<Product> updateProduct(
      @PathVariable Long id, @RequestBody Product productDetails) {
    return productService
        .updateProduct(id, productDetails)
        .map(ResponseEntity::ok)
        .orElse(ResponseEntity.notFound().build());
  }

  @DeleteMapping("/delete/{id}")
  public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
    boolean deleted = productService.deleteProduct(id);
    if (deleted) {
      return ResponseEntity.noContent().build();
    }
    return ResponseEntity.notFound().build();
  }
}
