package licaza.ecommerce.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;

public record ProductRequestDTO(
    @NotBlank(message = "Product name cannot be empty")
        @Size(max = 100, message = "Name cannot have more than 100 characters")
        String name,
    @NotBlank(message = "SKU is mandatory") String sku,
    String description,
    @NotBlank(message = "Category is mandatory") String category,
    @NotNull(message = "Price is mandatory") @Positive(message = "Price must be greater than zero")
        BigDecimal price,
    @NotNull(message = "Stock is mandatory") Integer stock,
    @Positive(message = "Weight is mandatory") Double weightKg) {}
