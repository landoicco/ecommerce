package licaza.ecommerce.backend.repo;

import java.util.List;
import licaza.ecommerce.backend.domain.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
  List<String> findSkuBySkuIn(List<String> skus);

  @Query(
      "SELECT p FROM Product p WHERE "
          + "(:name IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', :name, '%'))) AND "
          + "(:category IS NULL OR LOWER(p.category) = LOWER(:category)) AND "
          + "(:sku IS NULL OR LOWER(p.sku) LIKE LOWER(CONCAT('%', :sku, '%')))")
  Page<Product> findCatalogWithFilters(
      @Param("name") String name,
      @Param("category") String category,
      @Param("sku") String sku,
      Pageable pageable);
}
