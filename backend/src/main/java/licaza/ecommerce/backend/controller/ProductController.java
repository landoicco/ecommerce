package licaza.ecommerce.backend.controller;

import java.util.List;
import licaza.ecommerce.backend.domain.Product;
import licaza.ecommerce.backend.repo.ProductRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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

  @PostMapping
  public ResponseEntity<Product> createProduct(@RequestBody Product product) {
    // Force a null ID to insert, no modify any existing entry
    product.setId(null);

    Product savedProduct = productRepository.save(product);

    // Respond with a 201 and the new item
    return ResponseEntity.status(HttpStatus.CREATED).body(savedProduct);
  }

  @PutMapping("/edit/{id}")
  public ResponseEntity<Product> updateProduct(
      @PathVariable Long id, @RequestBody Product productDetails) {
    // Search product in DB
    return productRepository
        .findById(id)
        .map(
            existingProduct -> {
              // Update fields with new data
              existingProduct.setName(productDetails.getName());
              existingProduct.setSku(productDetails.getSku());
              existingProduct.setDescription(productDetails.getDescription());
              existingProduct.setCategory(productDetails.getCategory());
              existingProduct.setPrice(productDetails.getPrice());
              existingProduct.setStock(productDetails.getStock());
              existingProduct.setWeightKg(productDetails.getWeightKg());

              // Save changes on DB
              Product updatedProduct = productRepository.save(existingProduct);
              return ResponseEntity.ok(updatedProduct); // Return 200 OK
            })
        .orElse(ResponseEntity.notFound().build()); // Return 404 if ID not found
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
