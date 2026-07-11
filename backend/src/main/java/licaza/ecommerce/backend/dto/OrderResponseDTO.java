package licaza.ecommerce.backend.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record OrderResponseDTO(
    Long orderId,
    Long productId,
    String productName,
    Integer quantity,
    BigDecimal totalAmount,
    String status,
    String message,
    LocalDateTime createdAt) {}
