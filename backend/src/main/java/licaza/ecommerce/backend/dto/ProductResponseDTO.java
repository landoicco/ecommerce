package licaza.ecommerce.backend.dto;

import java.math.BigDecimal;

public record ProductResponseDTO(
    Long id,
    String name,
    String sku,
    String description,
    String category,
    BigDecimal price,
    Integer stock,
    Double weightKg) {}
