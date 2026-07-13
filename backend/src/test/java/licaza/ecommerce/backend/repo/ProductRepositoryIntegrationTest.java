package licaza.ecommerce.backend.repo;

import static org.junit.jupiter.api.Assertions.*;

import java.math.BigDecimal;
import licaza.ecommerce.backend.domain.Product;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.test.context.ActiveProfiles;

@DataJpaTest
@ActiveProfiles("test") // Force the usage of application-test.properties
class ProductRepositoryIntegrationTest {

  @Autowired private ProductRepository productRepository;

  @BeforeEach
  void setUp() {
    // Add data to H2 database
    Product product1 = new Product();
    product1.setName("Database Testing Mouse");
    product1.setSku("SKU-REPO-TEST-01");
    product1.setCategory("Accessories");
    product1.setPrice(new BigDecimal("35.00"));
    product1.setStock(15);
    product1.setWeightKg(0.2);
    productRepository.save(product1);

    Product product2 = new Product();
    product2.setName("Wireless Keyboard");
    product2.setSku("SKU-REPO-KEY-02");
    product2.setCategory("Accessories");
    product2.setPrice(new BigDecimal("75.00"));
    product2.setStock(10);
    product2.setWeightKg(0.5);
    productRepository.save(product2);
  }

  @Test
  void findCatalogWithUniversalSearch_BySku_ReturnsFilteredProductFromH2() {
    // Config standard pagination
    Pageable pageable = PageRequest.of(0, 10, Sort.by(Sort.Direction.ASC, "price"));

    // Run JPQL query
    Page<Product> resultPage =
        productRepository.findCatalogWithUniversalSearch("REPO-TEST", pageable);

    // Validate filter by SKU
    assertNotNull(resultPage);
    assertEquals(1, resultPage.getTotalElements());

    Product foundProduct = resultPage.getContent().get(0);
    assertEquals("SKU-REPO-TEST-01", foundProduct.getSku());
    assertEquals("Database Testing Mouse", foundProduct.getName());
  }

  @Test
  void findCatalogWithUniversalSearch_ByCategory_ReturnsAllProductsInOrder() {
    // Config standard pagination
    Pageable pageable = PageRequest.of(0, 10, Sort.by(Sort.Direction.ASC, "price"));

    // Filter by category
    Page<Product> resultPage =
        productRepository.findCatalogWithUniversalSearch("Accessories", pageable);

    // Verify we got 2 elements, ascending by price
    assertNotNull(resultPage);
    assertEquals(2, resultPage.getTotalElements());
    assertEquals("Database Testing Mouse", resultPage.getContent().get(0).getName());
    assertEquals("Wireless Keyboard", resultPage.getContent().get(1).getName());
  }
}
