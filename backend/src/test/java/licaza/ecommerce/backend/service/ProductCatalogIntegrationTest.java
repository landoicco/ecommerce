package licaza.ecommerce.backend.service;

import static org.junit.jupiter.api.Assertions.*;

import java.math.BigDecimal;
import licaza.ecommerce.backend.TestcontainersConfiguration;
import licaza.ecommerce.backend.domain.Product;
import licaza.ecommerce.backend.dto.ProductQueryDTO;
import licaza.ecommerce.backend.dto.ProductResponseDTO;
import licaza.ecommerce.backend.repo.ProductRepository;
import licaza.ecommerce.backend.service.impl.ProductDatabaseService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.NullAndEmptySource;
import org.junit.jupiter.params.provider.ValueSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;
import org.springframework.context.annotation.Import;
import org.springframework.data.domain.Page;
import org.springframework.test.context.ActiveProfiles;

// The service decides what reaches the query, so the catalog is tested through it against a real
// PostgreSQL: the mocked unit tests cannot catch SQL that only this database rejects.
@DataJpaTest
@Import({TestcontainersConfiguration.class, ProductDatabaseService.class})
@ActiveProfiles("test")
class ProductCatalogIntegrationTest {

  @Autowired private ProductRepository productRepository;

  @Autowired private ProductService productService;

  @BeforeEach
  void setUp() {
    Product mouse = new Product();
    mouse.setName("Catalog Mouse");
    mouse.setSku("SKU-CATALOG-01");
    mouse.setCategory("Accessories");
    mouse.setPrice(new BigDecimal("35.00"));
    mouse.setStock(15);
    productRepository.save(mouse);

    Product monitor = new Product();
    monitor.setName("Catalog Monitor");
    monitor.setSku("SKU-CATALOG-02");
    monitor.setCategory("Displays");
    monitor.setPrice(new BigDecimal("250.00"));
    monitor.setStock(5);
    productRepository.save(monitor);
  }

  @ParameterizedTest
  @NullAndEmptySource
  @ValueSource(strings = {"   "})
  void getCatalog_WithoutSearchTerm_ReturnsAllProducts(String search) {
    ProductQueryDTO query = new ProductQueryDTO(search, 0, 12, "price", "desc");

    Page<ProductResponseDTO> catalog = productService.getCatalog(query);

    assertEquals(2, catalog.getTotalElements());
    assertEquals("Catalog Monitor", catalog.getContent().get(0).name());
  }
}
