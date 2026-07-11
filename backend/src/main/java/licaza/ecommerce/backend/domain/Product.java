package licaza.ecommerce.backend.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "products")
@Getter
@Setter
@NoArgsConstructor
public class Product {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  private String name;

  private String sku;

  private String description;

  private String category;

  private BigDecimal price;

  private Integer stock;

  @Column(name = "weight_kg")
  private Double weightKg;

  public Product(
      String name,
      String sku,
      String description,
      String category,
      BigDecimal price,
      int stock,
      double weightKg) {
    this.name = name;
    this.sku = sku;
    this.description = description;
    this.category = category;
    this.price = price;
    this.stock = stock;
    this.weightKg = weightKg;
  }
}
