package licaza.ecommerce.backend.controller;

import jakarta.validation.Valid;
import java.util.List;
import licaza.ecommerce.backend.dto.*;
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
  public ResponseEntity<List<ProductResponseDTO>> getAllProducts() {
    return ResponseEntity.ok(productService.getAllProducts());
  }

  @PostMapping
  public ResponseEntity<ProductResponseDTO> createProduct(
      @Valid @RequestBody ProductRequestDTO productDTO) {
    ProductResponseDTO savedProduct = productService.createProduct(productDTO);
    return ResponseEntity.status(HttpStatus.CREATED).body(savedProduct);
  }

  @PutMapping("/edit/{id}")
  public ResponseEntity<ProductResponseDTO> updateProduct(
      @PathVariable Long id, @Valid @RequestBody ProductRequestDTO productDTO) {
    return productService
        .updateProduct(id, productDTO)
        .map(ResponseEntity::ok)
        .orElse(ResponseEntity.notFound().build());
  }

  @DeleteMapping("/delete/{id}")
  public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
    if (productService.deleteProduct(id)) {
      return ResponseEntity.noContent().build();
    }
    return ResponseEntity.notFound().build();
  }

  @PostMapping("/purchase")
  public ResponseEntity<OrderResponseDTO> purchaseProduct(
      @Valid @RequestBody PurchaseRequestDTO purchaseDTO) {
    OrderResponseDTO response = productService.purchaseProduct(purchaseDTO);
    return ResponseEntity.ok(response);
  }
}
