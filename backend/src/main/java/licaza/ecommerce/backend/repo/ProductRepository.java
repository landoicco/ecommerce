package licaza.ecommerce.backend.repo;

import java.util.List;
import licaza.ecommerce.backend.domain.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
  List<String> findSkuBySkuIn(List<String> skus);
}
