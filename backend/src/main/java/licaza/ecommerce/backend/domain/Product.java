package licaza.ecommerce.backend.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "products")
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED) // Requerido por JPA
public class Product {

  @Id @GeneratedValue private Long id;

  private String name;

  private String sku;

  private String description;

  private String category;

  private float price;

  private int stock;

  @Column(name = "weight_kg")
  private float weightKg;

  public Product(
      String name,
      String sku,
      String description,
      String category,
      float price,
      int stock,
      float weightKg) {
    this.name = name;
    this.sku = sku;
    this.description = description;
    this.category = category;
    this.price = price;
    this.stock = stock;
    this.weightKg = weightKg;
  }
}
