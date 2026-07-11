package licaza.ecommerce.backend.dto;

import com.opencsv.bean.CsvBindByName;
import java.math.BigDecimal;

public class CSVProductRow {

  @CsvBindByName(column = "name")
  private String name;

  @CsvBindByName(column = "sku")
  private String sku;

  @CsvBindByName(column = "description")
  private String description;

  @CsvBindByName(column = "category")
  private String category;

  @CsvBindByName(column = "price")
  private BigDecimal price;

  @CsvBindByName(column = "stock")
  private Integer stock;

  @CsvBindByName(column = "weight_kg")
  private Double weightKg;

  public CSVProductRow() {}

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public String getSku() {
    return sku;
  }

  public void setSku(String sku) {
    this.sku = sku;
  }

  public String getDescription() {
    return description;
  }

  public void setDescription(String description) {
    this.description = description;
  }

  public String getCategory() {
    return category;
  }

  public void setCategory(String category) {
    this.category = category;
  }

  public BigDecimal getPrice() {
    return price;
  }

  public void setPrice(BigDecimal price) {
    this.price = price;
  }

  public Integer getStock() {
    return stock;
  }

  public void setStock(Integer stock) {
    this.stock = stock;
  }

  public Double getWeightKg() {
    return weightKg;
  }

  public void setWeightKg(Double weightKg) {
    this.weightKg = weightKg;
  }
}
