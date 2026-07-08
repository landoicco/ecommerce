package licaza.ecommerce.backend.repo;

import java.util.Optional;
import licaza.ecommerce.backend.domain.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

  Optional<Product> findByName(String name);

  Optional<Product> findBySku(String sku);
}
